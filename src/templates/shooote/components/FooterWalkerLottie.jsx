import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const ANSA_FOOTER_SRC = '/documents/ansa-footer.json';

/**
 * Shooote footer rail with ANSA Lottie (original colors/motion) over a dashed pulsing rule.
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

    const animation = lottie.loadAnimation({
      container: mount,
      renderer: 'svg',
      loop: !prefersReduced,
      autoplay: false,
      path: src,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMax meet',
        progressiveLoad: true,
        hideOnTransparent: true,
      },
    });

    animRef.current = animation;

    const onReady = () => {
      if (prefersReduced) {
        const mid = Math.floor((animation.totalFrames || 0) / 2);
        animation.goToAndStop(mid, true);
      }
    };

    animation.addEventListener('DOMLoaded', onReady);

    let observer;
    if (!prefersReduced && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!animRef.current) return;
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            animRef.current.play();
          } else {
            animRef.current.pause();
          }
        },
        { threshold: [0, 0.2, 0.5], rootMargin: '0px 0px -8% 0px' },
      );
      observer.observe(stage);
    } else if (!prefersReduced) {
      animation.play();
    }

    return () => {
      observer?.disconnect();
      animation.removeEventListener('DOMLoaded', onReady);
      animation.destroy();
      animRef.current = null;
    };
  }, [src]);

  return (
    <div
      className={`footer-walker${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <div ref={stageRef} className="footer-walker__stage">
        <div ref={lottieRef} className="footer-walker__lottie" />
        <span className="footer-walker__fade footer-walker__fade--start" />
        <span className="footer-walker__fade footer-walker__fade--end" />
      </div>
      <div className="footer-walker__rail" />
    </div>
  );
}
