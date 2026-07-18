import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getCursorVariantConfig } from '../../data/cursorVariants.js';
import { EntisArrowGraphic } from './EntisArrowGraphic.jsx';

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
  '.meridian-contact__email',
  '.meridian-contact__pill',
  '.meridian-palette__swatch',
  '.admin-actions a',
  '.admin-actions button',
  '.admin-field input',
  '.admin-field textarea',
  '.meridian-hero__portrait',
  '.shooote-connect__cta',
  '.shooote-shutter-btn',
  '.shooote-connect__email',
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

function setPos(el, x, y, rotateDeg, stretch = 1) {
  if (!el) return;
  let transform = `translate3d(${x}px, ${y}px, 0)`;
  if (rotateDeg != null) transform += ` rotate(${rotateDeg}deg)`;
  if (stretch !== 1) transform += ` scaleY(${stretch}) scaleX(${1 / Math.max(0.5, Math.sqrt(stretch))})`;
  el.style.transform = transform;
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

    document.body.dataset.cursorVariant = styleVariant;
    document.body.dataset.cursorType = type;

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

    let prevTarget = null;

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (variant === 'meridian') {
        const target = e.target;
        if (target && target !== prevTarget) {
          prevTarget = target;
          const isDark = target.closest('.meridian-contact, .meridian-footer, [data-theme="dark"], .bg-dark');
          if (isDark) {
            rootRef.current?.classList.add('is-over-dark-bg');
          } else {
            rootRef.current?.classList.remove('is-over-dark-bg');
          }
        }
      }

      if (type === 'arrow') {
        if (config.pointerStyle === 'classic') {
          setPos(arrow, mouseX, mouseY);
        } else {
          const dx = mouseX - prevX;
          const dy = mouseY - prevY;
          if (Math.hypot(dx, dy) > 0.75) {
            angle = Math.atan2(dy, dx) * (180 / Math.PI) - 90;
          }
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

      if (type === 'arrow' && config.pointerStyle !== 'classic' && arrow) {
        arrowX = lerp(arrowX, mouseX, config.arrowLerp ?? 0.3);
        arrowY = lerp(arrowY, mouseY, config.arrowLerp ?? 0.3);

        if (variant === 'meridian') {
          setPos(arrow, arrowX, arrowY);
        } else {
          setPos(arrow, arrowX, arrowY, angle);
        }
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
      if (variant === 'meridian' && target.closest('.meridian-hero__portrait')) {
        rootRef.current?.classList.add('is-hovering-meridian-portrait');
      }
      if (config.hideDotOnHover) accent?.classList.add('is-hidden');
    }

    function onHoverOut() {
      rootRef.current?.classList.remove('is-hovering');
      rootRef.current?.classList.remove('is-hovering-isak-connect');
      rootRef.current?.classList.remove('is-hovering-meridian-portrait');
      accent?.classList.remove('is-hidden');
    }

    function syncIsakConnectHover(target) {
      if (!isIsak || !rootRef.current) return;
      rootRef.current.classList.toggle(
        'is-hovering-isak-connect',
        Boolean(target && matchesIsakConnectHover(target)),
      );
    }

    function syncMeridianPortraitHover(target) {
      if (variant !== 'meridian' || !rootRef.current) return;
      rootRef.current.classList.toggle(
        'is-hovering-meridian-portrait',
        Boolean(target && target.closest('.meridian-hero__portrait')),
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
      syncMeridianPortraitHover(e.relatedTarget);
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
      delete document.body.dataset.cursorVariant;
      delete document.body.dataset.cursorType;
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

  /* Portal to body so the cursor stacks above SiteLoader on every template reload. */
  return createPortal(
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
              className="cursor-pointer-svg meridian-pointer"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 128 128"
              width="24"
              height="24"
            >
              <defs>
                <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="3"
                    floodColor="var(--meridian-cursor-shadow, #ffffff)"
                    floodOpacity="0.9"
                  />
                </filter>
              </defs>
              <path
                filter="url(#shadow)"
                style={{ fill: 'var(--meridian-cursor-fill, #000000)', transition: 'fill 0.25s ease' }}
                d="M29 14 C24 14 22 18 22 23 L22 102 C22 109 30 112 35 107 L55 86 C57 84 60 83 63 83 L94 86 C103 87 108 77 101 71 L38 18 C35 15 32 14 29 14 Z"
              />
            </svg>
          )}
          {variant === 'geroz' && (
            <EntisArrowGraphic className="cursor-pointer-svg" />
          )}
        </div>
      )}
    </div>,
    document.body,
  );
}
