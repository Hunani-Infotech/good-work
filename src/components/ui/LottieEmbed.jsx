import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

function resolveLottiePath(src) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return src.startsWith('/') ? src : `/${src}`;
}

export default function LottieEmbed({
  src,
  className = 'brand-lottie',
  isIx2Target,
  loop = false,
  autoplay = true,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const path = resolveLottiePath(src);
    if (!container || !path) return;

    const anim = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop,
      autoplay: isIx2Target ? false : autoplay,
      path,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    });

    return () => {
      anim.destroy();
    };
  }, [src, isIx2Target, loop, autoplay]);

  return (
    <div
      ref={containerRef}
      className={className}
      data-animation-type="lottie"
      aria-hidden="true"
    />
  );
}
