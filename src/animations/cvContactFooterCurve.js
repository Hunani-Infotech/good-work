/**
 * CV contact footer curve — scrub timeline for curve collapse + divider/CTA reveal.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setReducedState } from './gerozTextHelpers.js';
import { syncScrollLayout } from './scrollRuntime.js';

gsap.registerPlugin(ScrollTrigger);

const CURVE_HEIGHT_RATIO = 0.2;
const CTA_LINE_AT = 0.55;
const CTA_LINE_DURATION = 0.18;
const CTA_SLIDE_AT = 0.64;
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

export function initCvContactFooterCurve({
  prefersReduced = false,
  blurSectionsSelector = '',
  headerSelector = '',
} = {}) {
  destroyCvContactFooterCurve();

  const root = document.querySelector('#contact');
  const curveWrap = root?.querySelector('.meridian-contact__curve-wrap');
  const dividerLine = root?.querySelector('.meridian-contact__line');
  const cta = root?.querySelector('.meridian-contact__cta');
  const panel = root?.querySelector('.meridian-contact__panel');
  const header = headerSelector ? document.querySelector(headerSelector) : null;
  const isCompactCta = window.matchMedia('(max-width: 767px)').matches;
  const pageSections = blurSectionsSelector
    ? [...document.querySelectorAll(blurSectionsSelector)]
    : [];

  if (!root || !panel || !curveWrap) return false;

  const animatedEls = [curveWrap, dividerLine, cta, header, ...pageSections].filter(Boolean);

  if (prefersReduced) {
    gsap.set(curveWrap, { height: 0 });
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
  gsap.set(curveWrap, { height: maxH });

  if (dividerLine) {
    gsap.set(dividerLine, { scaleX: 0, transformOrigin: 'left center', force3D: true });
  }

  if (cta) {
    if (isCompactCta) {
      setCompactCta(cta, { opacity: 0, scale: 0.88 });
    } else {
      setDesktopCta(cta, { x: getCtaTravel(cta), opacity: 0, scale: 0.88 });
    }
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  tl.fromTo(
    curveWrap,
    { height: () => getCurveHeightPx() },
    { height: 0, ease: 'none' },
    0,
  );

  pageSections.forEach((section) => {
    tl.fromTo(
      section,
      { opacity: 1, filter: 'blur(0px)' },
      { opacity: 0.42, filter: 'blur(3px)', ease: 'none' },
      0,
    );
  });

  if (header) {
    tl.fromTo(header, { opacity: 1 }, { opacity: 0.72, ease: 'none' }, 0);
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
        { x: () => getCtaTravel(cta), opacity: 0, scale: 0.88 },
        { x: 0, opacity: 1, scale: 1, ease: 'none', duration: CTA_SLIDE_DURATION },
        CTA_SLIDE_AT,
      );
    }
  }

  cleanup = () => {
    tl.scrollTrigger?.kill();
    tl.kill();
    gsap.set(curveWrap, { clearProps: 'height' });
    animatedEls.forEach((el) => {
      gsap.set(el, { clearProps: 'transform,opacity,filter,left,right' });
    });

    panel?.querySelectorAll(
      '.meridian-contact__content, .meridian-contact__inner, .meridian-contact__heading-wrap, .meridian-contact__heading, .meridian-contact__heading-arrow, .meridian-footer, .meridian-footer__meta > div',
    )?.forEach((el) => {
      gsap.set(el, { clearProps: 'transform,opacity,filter,clipPath' });
    });

    document.querySelectorAll('.meridian-contact__cta').forEach((el) => {
      gsap.set(el, { clearProps: 'clipPath' });
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
