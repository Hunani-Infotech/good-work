/**
 * Shared premium curtain reveal — premium-curtain-reveal.html
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { syncScrollLayout } from './scrollRuntime.js';

gsap.registerPlugin(ScrollTrigger);

const CURVE_START = 170;
const CURVE_END = 80;
const CURVE_RIM = 80;

const activeByKey = new Map();

function drawCurve(path, depth) {
  path.setAttribute(
    'd',
    `M0,0 H1440 V${CURVE_RIM} C1100,${depth} 340,${depth} 0,${CURVE_RIM} Z`,
  );
}

export function initCurtainReveal({
  key,
  section,
  curtain,
  path,
  prefersReduced = false,
}) {
  if (!key || !section || !curtain || !path) return false;

  destroyCurtainReveal(key);

  drawCurve(path, CURVE_START);

  if (prefersReduced) {
    gsap.set(curtain, { yPercent: -100 });
    drawCurve(path, CURVE_END);
    return true;
  }

  gsap.set(curtain, { yPercent: 0, force3D: true });

  const state = { depth: CURVE_START };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onLeave: () => {
        gsap.set(curtain, { yPercent: -100 });
      },
    },
  });

  tl.to(
    state,
    { depth: CURVE_END, onUpdate: () => drawCurve(path, state.depth), ease: 'none' },
    0,
  ).to(curtain, { yPercent: -100, ease: 'none' }, 0);

  const cleanup = () => {
    tl.scrollTrigger?.kill();
    tl.kill();
    gsap.set(curtain, { clearProps: 'transform' });
    drawCurve(path, CURVE_START);
  };

  activeByKey.set(key, cleanup);
  syncScrollLayout();
  return true;
}

export function destroyCurtainReveal(key) {
  const cleanup = activeByKey.get(key);
  if (!cleanup) return;
  cleanup();
  activeByKey.delete(key);
}

export function destroyAllCurtainReveals() {
  activeByKey.forEach((cleanup) => cleanup());
  activeByKey.clear();
}
