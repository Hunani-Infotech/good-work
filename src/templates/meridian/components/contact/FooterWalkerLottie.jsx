import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const ANSA_FOOTER_SRC = '/documents/ansa-footer.json';

let ansaDataPromise = null;

function prefetchAnsaData(src) {
  if (!ansaDataPromise) {
    ansaDataPromise = fetch(src)
      .then((res) => res.json())
      .catch(() => null);
  }
  return ansaDataPromise;
}

/**
 * Meridian footer ANSA walker — canvas renderer for smoother scroll coexistence.
 */
export default function FooterWalkerLottie({
  className = '',
  src = ANSA_FOOTER_SRC,
}) {
  const stageRef = useRef(null);
  const lottieRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const mount = lottieRef.current;
    if (!stage || !mount) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let destroyed = false;
    let playTimer = 0;
    let observer;
    let building = null;
    let warmed = false;

    const idleHandle = window.requestIdleCallback
      ? window.requestIdleCallback(() => { prefetchAnsaData(src); }, { timeout: 1200 })
      : window.setTimeout(() => { prefetchAnsaData(src); }, 300);

    const clearPlayTimer = () => {
      if (playTimer) {
        window.clearTimeout(playTimer);
        playTimer = 0;
      }
    };

    const buildAnimation = () => {
      if (destroyed || animRef.current) return Promise.resolve(animRef.current);
      if (building) return building;

      building = prefetchAnsaData(src).then((data) => {
        if (destroyed) return null;

        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const animation = lottie.loadAnimation({
          container: mount,
          // Canvas paints cheaper than a large SVG tree during Lenis coasting.
          renderer: 'canvas',
          loop: !prefersReduced,
          autoplay: false,
          ...(data ? { animationData: data } : { path: src }),
          rendererSettings: {
            clearCanvas: true,
            preserveAspectRatio: 'xMidYMax meet',
            dpr,
          },
        });

        animation.setSubframe(false);
        animRef.current = animation;

        return new Promise((resolve) => {
          animation.addEventListener('DOMLoaded', () => {
            if (prefersReduced) {
              const mid = Math.floor((animation.totalFrames || 0) / 2);
              animation.goToAndStop(mid, true);
            } else {
              animation.goToAndStop(0, true);
            }
            warmed = true;
            resolve(animation);
          });
        });
      });

      return building;
    };

    const playSettled = () => {
      clearPlayTimer();
      playTimer = window.setTimeout(async () => {
        playTimer = 0;
        if (destroyed || prefersReduced) return;
        const animation = await buildAnimation();
        if (destroyed || !animation) return;
        requestAnimationFrame(() => {
          if (!destroyed && animRef.current) animRef.current.play();
        });
      }, 320);
    };

    const pauseAnim = () => {
      clearPlayTimer();
      animRef.current?.pause();
    };

    const warmWhenContactNear = () => {
      const contact = document.querySelector('#contact');
      if (!contact || typeof IntersectionObserver === 'undefined') {
        buildAnimation();
        return undefined;
      }

      const warmObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !warmed) {
            buildAnimation();
            warmObserver.disconnect();
          }
        },
        { rootMargin: '20% 0px', threshold: 0.01 },
      );
      warmObserver.observe(contact);
      return warmObserver;
    };

    const warmObserver = prefersReduced ? null : warmWhenContactNear();

    if (prefersReduced) {
      buildAnimation();
      return () => {
        destroyed = true;
        clearPlayTimer();
        if (window.cancelIdleCallback) window.cancelIdleCallback(idleHandle);
        else window.clearTimeout(idleHandle);
        warmObserver?.disconnect();
        animRef.current?.destroy();
        animRef.current = null;
      };
    }

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            pauseAnim();
            return;
          }
          if (entry.intersectionRatio >= 0.45) playSettled();
          else pauseAnim();
        },
        { threshold: [0, 0.25, 0.45, 0.7], rootMargin: '0px 0px -14% 0px' },
      );
      observer.observe(stage);
    } else {
      playSettled();
    }

    return () => {
      destroyed = true;
      clearPlayTimer();
      observer?.disconnect();
      warmObserver?.disconnect();
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleHandle);
      else window.clearTimeout(idleHandle);
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, [src]);

  return (
    <div
      className={`meridian-footer-walker${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <div ref={stageRef} className="meridian-footer-walker__stage">
        <div ref={lottieRef} className="meridian-footer-walker__lottie" />
        <span className="meridian-footer-walker__fade meridian-footer-walker__fade--start" />
        <span className="meridian-footer-walker__fade meridian-footer-walker__fade--end" />
      </div>
      <div className="meridian-footer-walker__rail" />
    </div>
  );
}
