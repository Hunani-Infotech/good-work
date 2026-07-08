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

    const hoverSelectors = 'a, button, [role="button"], label, .folder-wrapper, .nav-link, .hero-cta-btn, .cv-share-btn, .cv-phone-frame, .cta-button-wrapper, .template-card, .agency-btn-primary, .agency-btn-ghost, .template-picker-wrap, .template-picker__cta, .template-picker__dot, .template-picker__hero.is-neighbor-hero, .scroll-link, .icon, .sect-tag, .theme-btn, .geroz-theme-btn, .swiper-button-next, .swiper-button-prev, .offcanvas-toggler, .btn-style-2, .not-found-page__template-card, .not-found-page__btn-primary, .not-found-page__btn-ghost, .circle, .circle-icon, .geroz-cv-header__share, .geroz-share-btn, .signle-case-item .icon, .gz-capabilities__item, .geroz-palette__swatch, .geroz-cv-header__nav-link, .geroz-cv-header__drawer-link, .vcv-card, .vcv-card button, .gz-back-to-top, .gz-hero__scroll-cta, .meridian-header__nav-link, .meridian-menu-btn, .meridian-share-btn, .meridian-menu__link, .meridian-capabilities__cta, .meridian-contact__cta, .meridian-contact__pill, .meridian-palette__swatch';

    function matchesHover(target) {
      return target && target.closest(hoverSelectors);
    }

    function onMouseOver(e) {
      if (matchesHover(e.target)) onHoverIn();
    }

    function onMouseOut(e) {
      if (!matchesHover(e.target)) return;
      if (!matchesHover(e.relatedTarget)) onHoverOut();
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
