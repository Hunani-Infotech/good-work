/**
 * Meridian — staged text reveal helpers.
 */
import gsap from 'gsap';
import { GEROZ_EASE, GEROZ_EASE_IO, GEROZ_SCROLL_TOGGLE } from './gerozTextHelpers.js';

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
