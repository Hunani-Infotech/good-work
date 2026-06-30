/**
 * Meridian footer curve — Dennis Snellenberg rounded-div transition.
 *
 * Layer stack on #contact:
 *   z-index 20  .meridian-contact__curve-overlay  ← only animated layer
 *   z-index  1  .meridian-contact__panel / content  ← fixed underneath
 *
 * Pin #contact when it fills the viewport, scrub +100% while the white cap
 * collapses (height in px + ellipse squash). Footer content never moves.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setReducedState } from './gerozTextHelpers.js';
import { syncScrollLayout } from './scrollRuntime.js';

gsap.registerPlugin(ScrollTrigger);

const LERP_DOWN = 0.08;
const LERP_UP_CURVE = 0.52;
const CURVE_EASE_DOWN = gsap.parseEase('power2.inOut');
const STRETCH_PHASE = 0.2;
const CONTENT_REVEAL_START = 0.5;
const REVERSE_CURVE_LEAD = 0.42;

let cleanup = null;

/** Curve cap height in pixels — must be numeric (never multiply "10vh" strings). */
function getCurveHeightPx() {
  const ratio = window.matchMedia('(max-width: 720px)').matches ? 0.15 : 0.25;
  return window.innerHeight * ratio;
}

function getCtaMetrics(targets) {
  const rowWidth = targets.dividerRow?.offsetWidth || 0;
  const ctaWidth = targets.cta?.offsetWidth || 1;
  const travelX = -ctaWidth;
  const endCenterX = rowWidth - ctaWidth / 2;
  const startCenterX = endCenterX + travelX;
  const lineReachProgress = rowWidth > 0
    ? Math.min(1, Math.max(0, startCenterX / rowWidth))
    : 0;

  return { travelX, lineReachProgress };
}

function getDividerRevealProgress(scrollProgress) {
  const dividerDuration = 0.5;
  return gsap.utils.clamp(
    0,
    1,
    gsap.utils.mapRange(
      CONTENT_REVEAL_START,
      CONTENT_REVEAL_START + dividerDuration,
      0,
      1,
      scrollProgress,
      true,
    ),
  );
}

function applyDividerCtaMotion(targets, scrollProgress, metrics) {
  const { dividerLine, dividerRow, cta } = targets;
  if (!dividerLine || !dividerRow || !cta) return;

  const lineProgress = getDividerRevealProgress(scrollProgress);
  const { travelX, lineReachProgress } = metrics;

  gsap.set(dividerLine, {
    scaleX: lineProgress,
    transformOrigin: 'left center',
    force3D: true,
  });

  const ctaProgress = lineReachProgress >= 1
    ? lineProgress
    : gsap.utils.clamp(
        0,
        1,
        gsap.utils.mapRange(lineReachProgress, 1, 0, 1, lineProgress, true),
      );

  gsap.set(cta, {
    xPercent: -50,
    yPercent: -50,
    x: gsap.utils.interpolate(travelX, 0, ctaProgress),
    opacity: gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, 0.35, 0, 1, ctaProgress)),
    scale: gsap.utils.interpolate(0.88, 1, ctaProgress),
    transformOrigin: 'center center',
    force3D: true,
  });
}

function getCurveTargetProgress(raw, direction) {
  if (direction >= 0) {
    return CURVE_EASE_DOWN(raw);
  }
  const lead = (1 - raw) * REVERSE_CURVE_LEAD;
  return Math.max(0, raw - lead);
}

function getEllipseStretch(progress, direction) {
  if (direction >= 0) {
    if (progress > STRETCH_PHASE) {
      return { scaleX: 1, scaleY: 1 };
    }
    const p = progress / STRETCH_PHASE;
    return {
      scaleX: gsap.utils.interpolate(1, 0.96, p),
      scaleY: gsap.utils.interpolate(1, 1.085, p),
    };
  }

  const expanded = 1 - progress;
  if (expanded > STRETCH_PHASE) {
    return { scaleX: 1, scaleY: 1 };
  }
  const p = expanded / STRETCH_PHASE;
  return {
    scaleX: gsap.utils.interpolate(0.96, 1, p),
    scaleY: gsap.utils.interpolate(1.085, 1, p),
  };
}

function getCurveShadow(progress) {
  if (progress <= STRETCH_PHASE) {
    return progress / STRETCH_PHASE;
  }
  if (progress <= 0.55) {
    return gsap.utils.interpolate(1, 0, (progress - STRETCH_PHASE) / (0.55 - STRETCH_PHASE));
  }
  return 0;
}

function collectFooterTargets(root) {
  const panel = root?.querySelector('.meridian-contact__panel');
  const contentLayer = root?.querySelector('.meridian-contact__content');
  const curveWrap = root?.querySelector('.meridian-contact__curve-wrap');
  const curveEllipse = root?.querySelector('.meridian-contact__curve-ellipse');
  const headingWrap = root?.querySelector('.meridian-contact__heading-wrap');
  const dividerLine = root?.querySelector('.meridian-contact__line');
  const dividerRow = root?.querySelector('.meridian-contact__divider-row');
  const cta = root?.querySelector('.meridian-contact__cta');
  const ctaRing = root?.querySelector('.meridian-contact__cta-ring');
  const pageSections = document.querySelectorAll('.meridian-cv-main > section:not(#contact):not(#capabilities)');
  const header = document.querySelector('.meridian-header');
  const parallaxLayers = document.querySelectorAll(
    '.meridian-manifesto__inner, .meridian-about__inner, .meridian-capabilities__inner',
  );

  return {
    root,
    panel,
    contentLayer,
    curveWrap,
    curveEllipse,
    headingWrap,
    dividerLine,
    dividerRow,
    cta,
    ctaRing,
    pageSections: [...pageSections],
    header,
    parallaxLayers: [...parallaxLayers],
  };
}

function buildAmbientTimeline(targets) {
  const tl = gsap.timeline({ paused: true });

  targets.pageSections.forEach((section) => {
    tl.fromTo(
      section,
      { opacity: 1, filter: 'blur(0px)' },
      { opacity: 0.42, filter: 'blur(3px)', ease: 'power2.inOut' },
      0,
    );
  });

  if (targets.header) {
    tl.fromTo(
      targets.header,
      { opacity: 1 },
      { opacity: 0.72, ease: 'power2.inOut' },
      0,
    );
  }

  targets.parallaxLayers.forEach((layer, index) => {
    tl.fromTo(layer, { y: 0 }, { y: -(28 + index * 10), ease: 'none' }, 0);
  });

  return tl;
}

function setFixedFooterContent(targets) {
  const staticEls = [targets.contentLayer].filter(Boolean);

  staticEls.forEach((el) => {
    gsap.set(el, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: 'none',
      clearProps: 'transform',
      force3D: true,
    });
  });
}

function setCurveCssVars(root, heightPx) {
  if (!root) return;
  root.style.setProperty('--meridian-curve-max-height', `${heightPx}px`);
}

function createCurveDriver({
  trigger,
  curveWrap,
  curveEllipse,
  getHeightPx,
  ambientTl,
  targets,
}) {
  let ctaMetrics = getCtaMetrics(targets);
  
  const state = {
    targetProgress: 0,
    direction: 1,
    curveProgress: 0,
    ambientProgress: 0,
  };

  const applyCurve = () => {
    const { curveProgress, direction } = state;
    const maxHeight = getHeightPx();
    const height = maxHeight * (1 - curveProgress);

    gsap.set(curveWrap, {
      height,
      '--meridian-curve-shadow': getCurveShadow(curveProgress),
    });

    if (curveEllipse) {
      const stretch = getEllipseStretch(curveProgress, direction);

      gsap.set(curveEllipse, {
        xPercent: -50,
        yPercent: -86.666,
        scaleX: stretch.scaleX,
        scaleY: stretch.scaleY,
        y: gsap.utils.interpolate(0, -14, curveProgress),
        transformOrigin: '50% 100%',
        force3D: true,
      });
    }
  };

  const syncAmbient = () => {
    ambientTl.progress(state.targetProgress);
    applyDividerCtaMotion(targets, state.targetProgress, ctaMetrics);
  };

  const tick = () => {
    // Curve interpolation
    const curveLerp = state.direction >= 0 ? LERP_DOWN : LERP_UP_CURVE;
    const curveTarget = getCurveTargetProgress(state.targetProgress, state.direction);
    state.curveProgress += (curveTarget - state.curveProgress) * curveLerp;
    
    // Ambient interpolation (CTA sliding + bg blur) 
    // Uses LERP_DOWN symmetrically so it's smooth in both directions!
    state.ambientProgress += (state.targetProgress - state.ambientProgress) * LERP_DOWN;
    
    applyCurve();
    
    ambientTl.progress(state.ambientProgress);
    applyDividerCtaMotion(targets, state.ambientProgress, ctaMetrics);
  };

  const scrollTrigger = ScrollTrigger.create({
    trigger,
    start: 'top bottom',
    end: 'bottom bottom',
    invalidateOnRefresh: true,
    onUpdate(self) {
      state.targetProgress = self.progress;
      state.direction = self.direction;
      // The tick function now handles BOTH up and down scrolling smoothly!
    },
  });

  const syncToScroll = () => {
    ctaMetrics = getCtaMetrics(targets);
    setCurveCssVars(trigger, getHeightPx());
    const progress = scrollTrigger.progress;
    state.targetProgress = progress;
    state.direction = scrollTrigger.direction;
    state.curveProgress = getCurveTargetProgress(progress, state.direction);
    state.ambientProgress = progress;
    applyCurve();
    ambientTl.progress(state.ambientProgress);
    applyDividerCtaMotion(targets, state.ambientProgress, ctaMetrics);
  };

  syncToScroll();
  gsap.ticker.add(tick);

  return {
    scrollTrigger,
    tick,
    syncToScroll,
    getState: () => state,
  };
}

export function initMeridianFooterCurve({ prefersReduced = false } = {}) {
  destroyMeridianFooterCurve();

  const root = document.querySelector('#contact');
  const targets = collectFooterTargets(root);
  const { panel, curveWrap, curveEllipse } = targets;

  if (!root || !panel || !curveWrap) return false;

  const ambientEls = [
    targets.curveWrap,
    targets.curveEllipse,
    targets.header,
    targets.dividerLine,
    targets.cta,
    targets.ctaRing,
    ...targets.pageSections,
    ...targets.parallaxLayers,
  ].filter(Boolean);

  const getHeightPx = () => getCurveHeightPx();

  if (prefersReduced) {
    gsap.set(curveWrap, { height: 0, '--meridian-curve-shadow': 0 });
    setCurveCssVars(root, 0);
    setFixedFooterContent(targets);
    if (targets.dividerLine) gsap.set(targets.dividerLine, { scaleX: 1 });
    if (targets.cta) {
      gsap.set(targets.cta, {
        opacity: 1,
        x: 0,
        scale: 1,
        xPercent: -50,
        yPercent: -50,
      });
    }
    setReducedState(ambientEls);
    return true;
  }

  const curveHeightPx = getHeightPx();
  setCurveCssVars(root, curveHeightPx);
  gsap.set(curveWrap, { height: curveHeightPx, '--meridian-curve-shadow': 0 });

  if (targets.header) {
    gsap.set(targets.header, { opacity: 1, filter: 'none', clearProps: 'filter' });
  }

  if (curveEllipse) {
    gsap.set(curveEllipse, {
      xPercent: -50,
      yPercent: -86.666,
      scaleX: 1,
      scaleY: 1,
      y: 0,
      transformOrigin: '50% 100%',
      force3D: true,
    });
  }

  setFixedFooterContent(targets);

  if (targets.dividerLine) {
    gsap.set(targets.dividerLine, {
      scaleX: 0,
      transformOrigin: 'left center',
      force3D: true,
    });
  }

  if (targets.cta && targets.dividerRow) {
    const { travelX } = getCtaMetrics(targets);
    gsap.set(targets.cta, {
      xPercent: -50,
      yPercent: -50,
      x: travelX,
      opacity: 0,
      scale: 0.88,
      transformOrigin: 'center center',
      force3D: true,
    });
  }

  const ambientTl = buildAmbientTimeline(targets);
  const driver = createCurveDriver({
    trigger: root,
    curveWrap,
    curveEllipse,
    getHeightPx,
    ambientTl,
    targets,
  });

  const onRefresh = () => driver.syncToScroll();
  ScrollTrigger.addEventListener('refresh', onRefresh);

  cleanup = () => {
    ScrollTrigger.removeEventListener('refresh', onRefresh);
    gsap.ticker.remove(driver.tick);
    driver.scrollTrigger.kill();
    ambientTl.kill();
    gsap.set(curveWrap, { clearProps: 'height,--meridian-curve-shadow' });
    root.style.removeProperty('--meridian-curve-max-height');

    if (curveEllipse) {
      gsap.set(curveEllipse, { clearProps: 'transform' });
    }

    ambientEls.forEach((el) => {
      gsap.set(el, { clearProps: 'transform,opacity,filter' });
    });

    const contentEls = targets.panel?.querySelectorAll(
      '.meridian-contact__content, .meridian-contact__inner, .meridian-contact__heading-wrap, .meridian-contact__heading, .meridian-contact__heading-arrow, .meridian-contact__pill, .meridian-footer, .meridian-footer__meta > div, .meridian-footer__social-list a',
    );
    contentEls?.forEach((el) => {
      gsap.set(el, { clearProps: 'transform,opacity,filter,clipPath' });
    });

    document.querySelectorAll('.meridian-contact__pill, .meridian-capabilities__cta, .meridian-contact__cta').forEach((el) => {
      gsap.set(el, { clearProps: 'clipPath' });
    });
  };

  syncScrollLayout();
  return true;
}

export function destroyMeridianFooterCurve() {
  if (!cleanup) return;
  cleanup();
  cleanup = null;
}
