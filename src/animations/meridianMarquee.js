import gsap from 'gsap';
import { getLenis } from './scrollRuntime.js';

/** Direction-controlled infinite hero marquee. */
const MARQUEE_SPEED = 60;
const MARQUEE_COPIES = 2;

function wrapMarqueePosition(position, halfWidth) {
  if (!halfWidth) return position;

  let next = position;
  if (next <= -halfWidth) next += halfWidth;
  if (next >= 0) next -= halfWidth;
  return next;
}

let activeMarquee = null;

export { MARQUEE_COPIES };

export function initMeridianHeroMarquee(track) {
  destroyMeridianHeroMarquee();

  const lenis = getLenis();
  const state = {
    position: 0,
    halfWidth: 0,
    direction: -1,
    lastScroll: lenis?.scroll ?? window.scrollY,
  };

  const measure = () => {
    state.halfWidth = track.scrollWidth / MARQUEE_COPIES;
    state.position = wrapMarqueePosition(state.position, state.halfWidth);
    gsap.set(track, { x: state.position, force3D: true });
  };

  const onScroll = () => {
    const current = lenis?.scroll ?? window.scrollY;

    if (current > state.lastScroll) {
      state.direction = -1;
    } else if (current < state.lastScroll) {
      state.direction = 1;
    }

    state.lastScroll = current;
  };

  const tick = (_time, deltaTime) => {
    const dt = Math.min(deltaTime / 1000, 0.05);

    state.position += state.direction * MARQUEE_SPEED * dt;
    state.position = wrapMarqueePosition(state.position, state.halfWidth);
    gsap.set(track, { x: state.position, force3D: true });
  };

  gsap.set(track, { x: 0, force3D: true });
  requestAnimationFrame(measure);
  gsap.ticker.add(tick);

  if (lenis) {
    lenis.on('scroll', onScroll);
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const onResize = () => measure();
  window.addEventListener('resize', onResize);

  const cleanup = () => {
    gsap.ticker.remove(tick);
    if (lenis) lenis.off('scroll', onScroll);
    else window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    gsap.killTweensOf(track);
    gsap.set(track, { clearProps: 'transform' });
  };

  activeMarquee = { track, state, measure, cleanup };
  return cleanup;
}

export function remeasureMeridianHeroMarquee() {
  activeMarquee?.measure();
}

export function destroyMeridianHeroMarquee() {
  if (!activeMarquee) return;
  activeMarquee.cleanup();
  activeMarquee = null;
}
