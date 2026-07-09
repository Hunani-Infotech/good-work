import gsap from 'gsap';

/** Infinite hero marquee — constant leftward drift. */
const MARQUEE_SPEED = 75;
const MARQUEE_DIRECTION = -1;
const MARQUEE_COPIES = 2;
const VIEWPORT_FILL_RATIO = 2;

function wrapMarqueePosition(position, loopWidth) {
  if (!loopWidth) return position;

  let next = position;
  while (next <= -loopWidth) next += loopWidth;
  while (next > 0) next -= loopWidth;
  return next;
}

function removeMarqueeClones(track) {
  track.querySelectorAll('[data-marquee-clone]').forEach((node) => node.remove());
}

function getMarqueeTemplates(track) {
  return [...track.querySelectorAll(':scope > .meridian-hero__marquee-item:not([data-marquee-clone])')];
}

function getMarqueeLoopWidth(track) {
  const first = getMarqueeTemplates(track)[0];
  if (!first) return 0;
  return first.offsetWidth;
}

function ensureMarqueeFill(track) {
  const viewport = track.parentElement;
  if (!viewport) return;

  removeMarqueeClones(track);

  const templates = getMarqueeTemplates(track);
  if (!templates.length) return;

  const minTrackWidth = viewport.offsetWidth * VIEWPORT_FILL_RATIO + getMarqueeLoopWidth(track);
  let guard = 0;

  while (track.scrollWidth < minTrackWidth && guard < 32) {
    templates.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.dataset.marqueeClone = '1';
      track.appendChild(clone);
    });
    guard += 1;
  }
}

let activeMarquee = null;

export { MARQUEE_COPIES };

export function initMeridianHeroMarquee(track) {
  destroyMeridianHeroMarquee();

  const state = {
    position: 0,
    loopWidth: 0,
  };

  const measure = () => {
    ensureMarqueeFill(track);
    state.loopWidth = getMarqueeLoopWidth(track);
    state.position = wrapMarqueePosition(state.position, state.loopWidth);
    gsap.set(track, { x: state.position, force3D: true });
  };

  const tick = (_time, deltaTime) => {
    const dt = Math.min(deltaTime / 1000, 0.05);

    state.position += MARQUEE_DIRECTION * MARQUEE_SPEED * dt;
    state.position = wrapMarqueePosition(state.position, state.loopWidth);
    gsap.set(track, { x: state.position, force3D: true });
  };

  gsap.set(track, { x: 0, force3D: true });
  requestAnimationFrame(measure);
  gsap.ticker.add(tick);

  const onResize = () => measure();
  window.addEventListener('resize', onResize);

  const cleanup = () => {
    gsap.ticker.remove(tick);
    window.removeEventListener('resize', onResize);
    gsap.killTweensOf(track);
    gsap.set(track, { clearProps: 'transform' });
    removeMarqueeClones(track);
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
