/**
 * Meridian — scroll-scrub and staged text reveal helpers.
 */
import gsap from 'gsap';
import { GEROZ_EASE, GEROZ_EASE_IO, GEROZ_SCROLL_TOGGLE } from './gerozTextHelpers.js';

export function scrubRevealLines(lines, trigger, {
  start = 'top 82%',
  end = 'top 38%',
  scrub = 1,
  fromY = '115%',
} = {}) {
  if (!lines?.length || !trigger) return null;

  gsap.set(lines, { y: fromY, opacity: 1, force3D: true });
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub: typeof scrub === 'number' ? scrub : true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
    },
  });

  const step = 1 / lines.length;
  lines.forEach((line, index) => {
    tl.to(line, { y: 0, ease: 'none', duration: step, force3D: true }, index * step);
  });

  return tl;
}

export function scrubRevealWords(words, trigger, {
  start = 'top 85%',
  end = 'top 45%',
  scrub = 0.85,
  fromY = '110%',
} = {}) {
  if (!words?.length || !trigger) return null;

  gsap.set(words, { y: fromY, opacity: 1 });
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub: typeof scrub === 'number' ? scrub : true,
      invalidateOnRefresh: true,
    },
  });

  const step = 1 / words.length;
  words.forEach((word, index) => {
    tl.to(word, { y: 0, ease: 'none', duration: step }, index * step);
  });

  return tl;
}

export function revealStaggerLines(lines, trigger, {
  start = 'top 88%',
  stagger = 0.12,
  duration = 1,
  y = '108%',
  toggleActions = GEROZ_SCROLL_TOGGLE,
  once = true,
} = {}) {
  if (!lines?.length) return null;

  gsap.set(lines, { y, opacity: 1, force3D: true });
  return gsap.to(lines, {
    y: 0,
    duration,
    stagger,
    ease: GEROZ_EASE_IO,
    force3D: true,
    scrollTrigger: {
      trigger: trigger || lines[0]?.parentElement,
      start,
      toggleActions,
      invalidateOnRefresh: true,
      once,
    },
  });
}

export function revealStaggerWords(words, trigger, {
  start = 'top 88%',
  stagger = 0.025,
  duration = 0.85,
  y = '110%',
  toggleActions = GEROZ_SCROLL_TOGGLE,
  once = true,
} = {}) {
  if (!words?.length) return null;

  gsap.set(words, { y, opacity: 1, force3D: true });
  return gsap.to(words, {
    y: 0,
    duration,
    stagger,
    ease: GEROZ_EASE,
    force3D: true,
    scrollTrigger: {
      trigger: trigger || words[0]?.parentElement,
      start,
      toggleActions,
      invalidateOnRefresh: true,
      once,
    },
  });
}

export function revealStaggerChars(chars, trigger, {
  start = 'top 90%',
  stagger = 0.018,
  duration = 0.75,
  y = '120%',
  rotationX = -38,
  toggleActions = GEROZ_SCROLL_TOGGLE,
  once = true,
} = {}) {
  if (!chars?.length) return null;

  gsap.set(chars, {
    y,
    rotationX,
    transformOrigin: '50% 100%',
    opacity: 0,
    force3D: true,
  });

  return gsap.to(chars, {
    y: 0,
    rotationX: 0,
    opacity: 1,
    duration,
    stagger,
    ease: GEROZ_EASE_IO,
    force3D: true,
    scrollTrigger: {
      trigger: trigger || chars[0]?.parentElement,
      start,
      toggleActions,
      invalidateOnRefresh: true,
      once,
    },
  });
}

export function drawLineScale(el, trigger, {
  start = 'top 92%',
  duration = 1.05,
  toggleActions = GEROZ_SCROLL_TOGGLE,
  once = true,
} = {}) {
  if (!el) return null;

  gsap.set(el, { scaleX: 0, transformOrigin: 'left center', force3D: true });
  return gsap.to(el, {
    scaleX: 1,
    duration,
    ease: GEROZ_EASE_IO,
    force3D: true,
    scrollTrigger: {
      trigger: trigger || el,
      start,
      toggleActions,
      invalidateOnRefresh: true,
      once,
    },
  });
}

export function scrubFadeBlur(el, trigger, {
  start = 'top bottom',
  end = 'bottom top',
  scrub = 1,
  blur = 6,
} = {}) {
  if (!el || !trigger) return null;

  return gsap.fromTo(
    el,
    { opacity: 0.72, filter: `blur(${blur}px)` },
    {
      opacity: 1,
      filter: 'blur(0px)',
      ease: 'none',
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub: typeof scrub === 'number' ? scrub : true,
        invalidateOnRefresh: true,
      },
    },
  );
}
