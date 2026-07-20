/**
 * CV contact footer curve — scrub timeline for curve collapse + divider/CTA reveal.
 *
 * - Curve collapses via scaleY (compositor), never height.
 * - Immediate scrub finishes at the divider — before the footer —
 *   so Lenis deceleration at the page end has nothing left to catch up.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setReducedState } from './gerozTextHelpers.js';
import { syncScrollLayout } from './scrollRuntime.js';

gsap.registerPlugin(ScrollTrigger);

const CURVE_HEIGHT_RATIO = 0.2;
const CTA_LINE_AT = 0.52;
const CTA_LINE_DURATION = 0.18;
const CTA_SLIDE_AT = 0.6;
const CTA_SLIDE_DURATION = 0.24;

let cleanup = null;

function getCurveHeightPx() {
  return window.innerHeight * CURVE_HEIGHT_RATIO;
}

function getCtaTravel(cta) {
  return -(cta?.offsetWidth || 120);
}

function setDesktopCta(cta, { x, opacity, scale }) {
  gsap.set(cta, {
    xPercent: -50,
    yPercent: -50,
    x,
    opacity,
    scale,
    transformOrigin: 'center center',
    force3D: true,
  });
}

function setCompactCta(cta, { opacity, scale }) {
  gsap.set(cta, {
    left: '50%',
    right: 'auto',
    xPercent: -50,
    yPercent: -50,
    opacity,
    scale,
    transformOrigin: 'center center',
    force3D: true,
  });
}

function setCurveWrap(curveWrap, { scaleY, height }) {
  gsap.set(curveWrap, {
    height,
    xPercent: -50,
    scaleY,
    transformOrigin: '50% 0%',
    force3D: true,
  });
}

export function initCvContactFooterCurve({
  prefersReduced = false,
  blurSectionsSelector = '',
  headerSelector = '',
} = {}) {
  destroyCvContactFooterCurve();

  const root = document.querySelector('#contact');
  const curveOverlay = root?.querySelector('.meridian-contact__curve-overlay');
  const curveWrap = root?.querySelector('.meridian-contact__curve-wrap');
  const dividerLine = root?.querySelector('.meridian-contact__line');
  const dividerRow = root?.querySelector('.meridian-contact__divider-row');
  const cta = root?.querySelector('.meridian-contact__cta');
  const panel = root?.querySelector('.meridian-contact__panel');
  const footer = root?.querySelector('.meridian-footer');
  const header = headerSelector ? document.querySelector(headerSelector) : null;
  const isCompactCta = window.matchMedia('(max-width: 767px)').matches;
  const pageSections = blurSectionsSelector
    ? [...document.querySelectorAll(blurSectionsSelector)]
    : [];

  if (!root || !panel || !curveWrap) return false;

  const animatedEls = [curveWrap, dividerLine, cta, header, ...pageSections].filter(Boolean);

  if (prefersReduced) {
    setCurveWrap(curveWrap, { scaleY: 0, height: getCurveHeightPx() });
    if (curveOverlay) gsap.set(curveOverlay, { autoAlpha: 0 });
    if (dividerLine) gsap.set(dividerLine, { scaleX: 1 });
    if (cta) {
      if (isCompactCta) {
        setCompactCta(cta, { opacity: 1, scale: 1 });
      } else {
        setDesktopCta(cta, { x: 0, opacity: 1, scale: 1 });
      }
    }
    setReducedState(animatedEls);
    return true;
  }

  const maxH = getCurveHeightPx();
  const ctaTravel = cta ? getCtaTravel(cta) : -120;

  setCurveWrap(curveWrap, { scaleY: 1, height: maxH });
  if (curveOverlay) gsap.set(curveOverlay, { autoAlpha: 1 });

  if (dividerLine) {
    gsap.set(dividerLine, { scaleX: 0, transformOrigin: 'left center', force3D: true });
  }

  if (cta) {
    if (isCompactCta) {
      setCompactCta(cta, { opacity: 0, scale: 0.88 });
    } else {
      setDesktopCta(cta, { x: ctaTravel, opacity: 0, scale: 0.88 });
    }
  }

  // Mobile: contact block is often taller than the viewport, so divider
  // "bottom 70%" never arrives and the CTA stays mid-fade (reads gray).
  // Finish when the section top has moved well into view.
  const endTarget = isCompactCta ? root : dividerRow || footer || root;
  const end = isCompactCta
    ? 'top 45%'
    : dividerRow
      ? 'bottom 70%'
      : 'top bottom';
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top bottom',
      endTrigger: endTarget,
      end,
      scrub: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      onLeave: () => {
        if (curveOverlay) gsap.set(curveOverlay, { autoAlpha: 0 });
        curveWrap.style.willChange = 'auto';
        if (cta) cta.style.willChange = 'auto';
        if (dividerLine) dividerLine.style.willChange = 'auto';
      },
      onEnterBack: () => {
        if (curveOverlay) gsap.set(curveOverlay, { autoAlpha: 1 });
        curveWrap.style.willChange = 'transform';
        if (cta) cta.style.willChange = 'transform, opacity';
        if (dividerLine) dividerLine.style.willChange = 'transform';
      },
    },
  });

  tl.fromTo(
    curveWrap,
    { scaleY: 1 },
    { scaleY: 0, ease: 'none', force3D: true },
    0,
  );

  // Avoid scrubbing many large section opacities into the footer (hitch source).
  const fadeTweens = [];
  if (header) {
    fadeTweens.push(
      gsap.to(header, {
        opacity: 0.72,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top 92%',
          end: 'top 60%',
          scrub: true,
          fastScrollEnd: true,
        },
      }),
    );
  }
  if (pageSections.length) {
    fadeTweens.push(
      gsap.fromTo(
        pageSections,
        { opacity: 1 },
        {
          opacity: 0.42,
          duration: 0.45,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
            fastScrollEnd: true,
          },
        },
      ),
    );
  }

  if (dividerLine) {
    tl.fromTo(
      dividerLine,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', duration: CTA_LINE_DURATION },
      CTA_LINE_AT,
    );
  }

  if (cta) {
    if (isCompactCta) {
      tl.fromTo(
        cta,
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, ease: 'none', duration: CTA_SLIDE_DURATION },
        CTA_SLIDE_AT,
      );
    } else {
      tl.fromTo(
        cta,
        { x: ctaTravel, opacity: 0, scale: 0.88 },
        { x: 0, opacity: 1, scale: 1, ease: 'none', duration: CTA_SLIDE_DURATION },
        CTA_SLIDE_AT,
      );
    }
  }

  cleanup = () => {
    fadeTweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
    tl.scrollTrigger?.kill();
    tl.kill();
    gsap.set(curveWrap, { clearProps: 'height,transform,willChange' });
    if (curveOverlay) gsap.set(curveOverlay, { clearProps: 'opacity,visibility' });
    animatedEls.forEach((el) => {
      gsap.set(el, { clearProps: 'transform,opacity,filter,left,right,willChange' });
    });

    panel?.querySelectorAll(
      '.meridian-contact__content, .meridian-contact__inner, .meridian-contact__heading-wrap, .meridian-contact__heading, .meridian-contact__heading-arrow, .meridian-footer, .meridian-footer__aside',
    )?.forEach((el) => {
      gsap.set(el, { clearProps: 'transform,opacity,filter,clipPath' });
    });

    document.querySelectorAll('.meridian-contact__cta').forEach((el) => {
      gsap.set(el, { clearProps: 'clipPath,willChange' });
    });
  };

  syncScrollLayout();
  return true;
}

export function destroyCvContactFooterCurve() {
  if (!cleanup) return;
  cleanup();
  cleanup = null;
}

/** @deprecated Use initCvContactFooterCurve */
export function initMeridianFooterCurve(options = {}) {
  return initCvContactFooterCurve({
    ...options,
    blurSectionsSelector:
      options.blurSectionsSelector
      ?? '.meridian-cv-main > section:not(#contact):not(#capabilities)',
    headerSelector: options.headerSelector ?? '.meridian-header',
  });
}

/** @deprecated Use destroyCvContactFooterCurve */
export function destroyMeridianFooterCurve() {
  destroyCvContactFooterCurve();
}
