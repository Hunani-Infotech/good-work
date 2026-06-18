import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import gsap from 'gsap';

function resolveLottiePath(src) {
  if (!src) return '/documents/juan-name-mouse.json';
  if (src.startsWith('http')) return src;
  return src.startsWith('/') ? src : `/${src}`;
}

const FRAME_EASE = 'power3.inOut';
const DURATION = { compress: 1.45, expand: 1.3 };

export default function HeroNameLottie({ src, ariaLabel = 'Name' }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const tweenRef = useRef(null);
  const compressedRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const anim = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: resolveLottiePath(src),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    });

    animRef.current = anim;

    const onReady = () => {
      anim.goToAndStop(0, true);
    };

    anim.addEventListener('DOMLoaded', onReady);

    return () => {
      anim.removeEventListener('DOMLoaded', onReady);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (tweenRef.current) tweenRef.current.kill();
      anim.destroy();
      animRef.current = null;
    };
  }, [src]);

  function animateToFrame(targetFrame, expanding) {
    const anim = animRef.current;
    if (!anim || !anim.totalFrames) return;

    const frame = Math.max(0, Math.min(targetFrame, anim.totalFrames - 1));
    if (tweenRef.current) tweenRef.current.kill();

    const state = { value: anim.currentFrame };
    tweenRef.current = gsap.to(state, {
      value: frame,
      duration: expanding ? DURATION.expand : DURATION.compress,
      ease: FRAME_EASE,
      overwrite: true,
      onUpdate: () => {
        anim.goToAndStop(state.value, true);
      },
    });
  }

  function setCompressed(compressed) {
    const anim = animRef.current;
    if (!anim || compressedRef.current === compressed) return;

    compressedRef.current = compressed;
    animateToFrame(compressed ? anim.totalFrames - 1 : 0, !compressed);
  }

  function handleMouseMove(event) {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;

      const container = containerRef.current;
      const anim = animRef.current;
      if (!container || !anim) return;

      const rect = container.getBoundingClientRect();
      if (!rect.width) return;

      const x = (event.clientX - rect.left) / rect.width;
      const overName = x <= 0.38 || x >= 0.62;
      setCompressed(overName);
    });
  }

  function handleMouseLeave() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setCompressed(false);
  }

  return (
    <div
      ref={containerRef}
      className="name-mouse-lottie"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label={ariaLabel}
    />
  );
}
