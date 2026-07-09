import { useEffect, useRef } from 'react';
import { getCursorVariantConfig } from '../../data/cursorVariants.js';
import { GerozEntisArrowGraphic } from './GerozEntisArrowGraphic.jsx';

const HOVER_SELECTORS = [
  'a',
  'button',
  '[role="button"]',
  'label',
  '.folder-wrapper',
  '.nav-link',
  '.hero-cta-btn',
  '.cv-share-btn',
  '.cv-phone-frame',
  '.cta-button-wrapper',
  '.template-card',
  '.agency-btn-primary',
  '.agency-btn-ghost',
  '.template-picker-wrap',
  '.template-picker__cta',
  '.template-picker__dot',
  '.template-picker__hero.is-neighbor-hero',
  '.scroll-link',
  '.icon',
  '.sect-tag',
  '.theme-btn',
  '.geroz-theme-btn',
  '.swiper-button-next',
  '.swiper-button-prev',
  '.offcanvas-toggler',
  '.btn-style-2',
  '.not-found-page__template-card',
  '.not-found-page__btn-primary',
  '.not-found-page__btn-ghost',
  '.circle',
  '.circle-icon',
  '.geroz-cv-header__share',
  '.geroz-share-btn',
  '.signle-case-item .icon',
  '.gz-capabilities__item',
  '.geroz-palette__swatch',
  '.geroz-cv-header__nav-link',
  '.geroz-cv-header__drawer-link',
  '.vcv-card',
  '.vcv-card button',
  '.gz-back-to-top',
  '.gz-hero__scroll-cta',
  '.meridian-header__nav-link',
  '.meridian-menu-btn',
  '.meridian-share-btn',
  '.meridian-menu__link',
  '.meridian-capabilities__cta',
  '.meridian-contact__cta',
  '.meridian-contact__pill',
  '.meridian-palette__swatch',
  '.admin-actions a',
  '.admin-actions button',
  '.admin-field input',
  '.admin-field textarea',
  '.shooote-nav__social-link',
  '.isak-cta__circle',
  '.isak-cta__circle-core',
  '.isak-cta__circle-shell',
  '.isak-cta__circle-hit',
  '.shooote-site-footer__social-link',
  '.shooote-mobile-nav__social a',
  '.wpo-site-header a',
  '.wpo-site-header button',
].join(', ');

const ISAK_CONNECT_SELECTORS = '.isak-cta__circle, .isak-cta__circle-shell, .isak-cta__circle-core, .isak-cta__circle-hit';

function matchesIsakConnectHover(target) {
  return Boolean(target?.closest?.(ISAK_CONNECT_SELECTORS));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getMagneticPoint(x, y, radius) {
  const nodes = document.querySelectorAll(HOVER_SELECTORS);
  let best = null;
  let bestDist = radius;

  nodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (!rect.width && !rect.height) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(x - cx, y - cy);
    if (dist < bestDist) {
      bestDist = dist;
      best = { x: cx, y: cy };
    }
  });

  return best;
}

function setPos(el, x, y, rotateDeg) {
  if (!el) return;
  if (rotateDeg != null) {
    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotateDeg}deg)`;
  } else {
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
}

export default function CustomCursor({ variant = 'default' }) {
  const rootRef = useRef(null);
  const accentRef = useRef(null);
  const followerRef = useRef(null);
  const beamRef = useRef(null);
  const arrowRef = useRef(null);
  const isIsak = variant === 'isak';

  useEffect(() => {
    const config = getCursorVariantConfig(variant);
    const type = config.type ?? 'classic';
    const styleVariant = config.variantKey ?? variant;
    const accent = accentRef.current;
    const follower = followerRef.current;
    const beam = beamRef.current;
    const arrow = arrowRef.current;

    if (!rootRef.current) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    if (!isIsak) {
      document.body.dataset.cursorVariant = styleVariant;
      document.body.dataset.cursorType = type;
    }

    let mouseX = -200;
    let mouseY = -200;
    let followerX = -200;
    let followerY = -200;
    let beamX = -200;
    let beamY = -200;
    let arrowX = -200;
    let arrowY = -200;
    let prevX = -200;
    let prevY = -200;
    let angle = -45;
    let raf;

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (type === 'arrow') {
        if (config.pointerStyle === 'classic') {
          setPos(arrow, mouseX, mouseY);
        } else {
          const dx = mouseX - prevX;
          const dy = mouseY - prevY;
          if (Math.hypot(dx, dy) > 0.75) {
            angle = Math.atan2(dy, dx) * (180 / Math.PI);
          }
          arrowX = lerp(arrowX, mouseX, config.arrowLerp ?? 0.3);
          arrowY = lerp(arrowY, mouseY, config.arrowLerp ?? 0.3);
          setPos(arrow, arrowX, arrowY, angle);
        }
      } else if (type === 'classic') {
        setPos(accent, mouseX, mouseY);
      } else if (type === 'spotlight') {
        setPos(accent, mouseX, mouseY);
      } else if (type === 'magnetic') {
        setPos(accent, mouseX, mouseY);
      }

      prevX = mouseX;
      prevY = mouseY;
    }

    function tick() {
      let targetX = mouseX;
      let targetY = mouseY;

      if (type === 'magnetic') {
        const magnetic = getMagneticPoint(mouseX, mouseY, config.magneticRadius ?? 80);
        if (magnetic) {
          targetX = lerp(mouseX, magnetic.x, config.magneticPull ?? 0.4);
          targetY = lerp(mouseY, magnetic.y, config.magneticPull ?? 0.4);
          follower?.classList.add('is-magnetic');
        } else {
          follower?.classList.remove('is-magnetic');
        }
      }

      const lerpSpeed = config.followerLerp ?? config.ringLerp ?? 0.1;

      if (type === 'classic' || type === 'magnetic') {
        followerX = lerp(followerX, targetX, lerpSpeed);
        followerY = lerp(followerY, targetY, lerpSpeed);
        setPos(follower, followerX, followerY);
      }

      if (type === 'glass') {
        followerX = lerp(followerX, mouseX, lerpSpeed);
        followerY = lerp(followerY, mouseY, lerpSpeed);
        setPos(follower, followerX, followerY);
      }

      if (type === 'morph') {
        followerX = lerp(followerX, mouseX, lerpSpeed);
        followerY = lerp(followerY, mouseY, lerpSpeed);
        setPos(follower, followerX, followerY);
      }

      if (type === 'spotlight' && beam) {
        beamX = lerp(beamX, mouseX, config.spotlightLerp ?? 0.04);
        beamY = lerp(beamY, mouseY, config.spotlightLerp ?? 0.04);
        setPos(beam, beamX, beamY);
      }

      raf = requestAnimationFrame(tick);
    }

    function matchesHover(target) {
      return target && target.closest(HOVER_SELECTORS);
    }

    function onHoverIn(target) {
      rootRef.current?.classList.add('is-hovering');
      if (isIsak && matchesIsakConnectHover(target)) {
        rootRef.current?.classList.add('is-hovering-isak-connect');
      }
      if (config.hideDotOnHover) accent?.classList.add('is-hidden');
    }

    function onHoverOut() {
      rootRef.current?.classList.remove('is-hovering');
      rootRef.current?.classList.remove('is-hovering-isak-connect');
      accent?.classList.remove('is-hidden');
    }

    function syncIsakConnectHover(target) {
      if (!isIsak || !rootRef.current) return;
      rootRef.current.classList.toggle(
        'is-hovering-isak-connect',
        Boolean(target && matchesIsakConnectHover(target)),
      );
    }

    function onMouseOver(e) {
      if (!matchesHover(e.target)) return;
      onHoverIn(e.target);
    }

    function onMouseOut(e) {
      if (!matchesHover(e.target)) return;
      if (!matchesHover(e.relatedTarget)) {
        onHoverOut();
        return;
      }
      syncIsakConnectHover(e.relatedTarget);
    }

    function onPointerDown() {
      rootRef.current?.classList.add('is-clicking');
    }

    function onPointerUp() {
      rootRef.current?.classList.remove('is-clicking');
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      if (!isIsak) {
        delete document.body.dataset.cursorVariant;
        delete document.body.dataset.cursorType;
      }
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(raf);
    };
  }, [variant, isIsak]);

  const cursorConfig = getCursorVariantConfig(variant);
  const type = cursorConfig.type ?? 'classic';
  const styleVariant = cursorConfig.variantKey ?? variant;

  return (
    <div
      ref={rootRef}
      className={`custom-cursor custom-cursor--${type} custom-cursor--${styleVariant}`}
      aria-hidden="true"
    >
      {type === 'classic' && (
        <>
          <div ref={accentRef} className="cursor-classic-dot" />
          <div ref={followerRef} className="cursor-classic-ring" />
        </>
      )}

      {type === 'magnetic' && (
        <>
          <div ref={accentRef} className={`cursor-magnetic-core cursor-magnetic-core--${styleVariant}`} />
          <div ref={followerRef} className={`cursor-magnetic-frame cursor-magnetic-frame--${styleVariant}`} />
        </>
      )}

      {type === 'glass' && (
        <div ref={followerRef} className={`cursor-glass-orb cursor-glass-orb--${styleVariant}`} />
      )}

      {type === 'spotlight' && (
        <>
          <div ref={beamRef} className={`cursor-spotlight-beam cursor-spotlight-beam--${styleVariant}`} />
          <div ref={accentRef} className={`cursor-spotlight-pin cursor-spotlight-pin--${styleVariant}`} />
        </>
      )}

      {type === 'morph' && (
        <div ref={followerRef} className={`cursor-morph-blob cursor-morph-blob--${styleVariant}`} />
      )}

      {type === 'arrow' && (
        <div ref={arrowRef} className={`cursor-arrow cursor-arrow--${variant}`}>
          {variant === 'meridian' && (
            <svg
              className="cursor-pointer-svg"
              viewBox="0 0 20 24"
              width="20"
              height="24"
              aria-hidden="true"
            >
              <path
                d="M1.25 1.25V16.75L4.65 13.35L7.35 20.25L10.15 19.05L7.45 12.15L13.25 12.15L1.25 1.25Z"
                fill="currentColor"
                stroke="#ffffff"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {variant === 'geroz' && (
            <GerozEntisArrowGraphic className="cursor-pointer-svg" />
          )}
        </div>
      )}
    </div>
  );
}
