import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    /* Only run on devices that support hover */
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let mouseX = -200;
    let mouseY = -200;
    let ringX = -200;
    let ringY = -200;
    let raf;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }

    function tick() {
      ringX = lerp(ringX, mouseX, 0.10);
      ringY = lerp(ringY, mouseY, 0.10);
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(tick);
    }

    function onHoverIn() {
      ring.classList.add('is-hovering');
    }

    function onHoverOut() {
      ring.classList.remove('is-hovering');
    }

    const hoverSelectors = 'a, button, [role="button"], label, .folder-wrapper, .nav-link, .hero-cta-btn, .cta-button-wrapper, .template-card, .agency-btn-primary, .agency-btn-ghost';

    function attachHovers() {
      document.querySelectorAll(hoverSelectors).forEach((el) => {
        el.addEventListener('mouseenter', onHoverIn);
        el.addEventListener('mouseleave', onHoverOut);
      });
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    attachHovers();

    /* Re-attach on DOM mutations (SPA navigation renders new elements) */
    const observer = new MutationObserver(attachHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
