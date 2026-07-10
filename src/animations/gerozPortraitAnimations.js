/**
 * Luxury portrait frame animations for the Geroz CV template.
 * Shared by hero (load timeline) and expertise (scroll reveal).
 */
import gsap from 'gsap';
import { GEROZ_EASE, GEROZ_EASE_IO, scrubParallax } from './gerozTextHelpers.js';

const EMPTY_LUXURY_LAYERS = {
  corners: [],
  halo: null,
  ring: null,
  mats: [],
  fade: null,
};

export function getPortraitLuxuryLayers(root) {
  if (!root) return { ...EMPTY_LUXURY_LAYERS };

  return {
    corners: root.querySelectorAll('.gz-portrait__corner'),
    halo: root.querySelector('.gz-portrait__halo'),
    ring: root.querySelector('.gz-portrait__ring'),
    mats: root.querySelectorAll('.gz-portrait__mat'),
    fade: root.querySelector('.gz-portrait__fade'),
  };
}

export function collectPortraitTargets(portrait, frame, img, luxury) {
  return [
    portrait,
    frame,
    img,
    ...luxury.corners,
    luxury.halo,
    luxury.ring,
    ...luxury.mats,
    luxury.fade,
  ].filter(Boolean);
}

export function resetPortraitLuxuryLayers({ corners, halo, ring, mats, fade, frame }) {
  corners?.forEach?.((corner) => {
    gsap.set(corner, { opacity: 1, scale: 1, rotation: 0, clearProps: 'transform' });
  });
  if (halo) gsap.set(halo, { opacity: 1, scale: 1, clearProps: 'transform' });
  if (ring) gsap.set(ring, { opacity: 1, scale: 1, clearProps: 'transform' });
  mats?.forEach?.((mat) => {
    gsap.set(mat, { opacity: 1, rotation: 0, clearProps: 'transform' });
  });
  if (fade) gsap.set(fade, { opacity: 1 });
  if (frame) gsap.set(frame, { clipPath: 'inset(0% 0 0 0)', scale: 1, opacity: 1, y: 0 });
}

export function primePortraitLuxuryLayers({ corners, halo, ring, mats, fade }) {
  corners?.forEach?.((corner, index) => {
    gsap.set(corner, {
      opacity: 0,
      scale: 0.72,
      rotation: index % 2 === 0 ? 10 : -10,
    });
  });
  if (halo) gsap.set(halo, { opacity: 0, scale: 0.92 });
  if (ring) gsap.set(ring, { opacity: 0, scale: 0.97 });
  mats?.forEach?.((mat, index) => {
    gsap.set(mat, {
      opacity: 0,
      rotation: index === 0 ? 8 : -5,
    });
  });
  if (fade) gsap.set(fade, { opacity: 0 });
}

export function playPortraitLuxuryLayers(tl, layers, at = 0.28) {
  const { corners, halo, ring, mats, fade } = layers;

  if (halo) {
    tl.to(halo, { opacity: 1, scale: 1, duration: 1.15, ease: GEROZ_EASE_IO }, at - 0.04);
  }

  mats?.forEach?.((mat, index) => {
    tl.to(mat, {
      opacity: mat.classList.contains('gz-portrait__mat--outer') ? 0.52 : 0.68,
      rotation: index === 0 ? 4 : -2,
      duration: 1.05,
      ease: GEROZ_EASE,
    }, at + index * 0.04);
  });

  corners?.forEach?.((corner, index) => {
    tl.to(corner, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.9,
      ease: GEROZ_EASE,
    }, at + index * 0.05);
  });

  if (ring) {
    tl.to(ring, { opacity: 1, scale: 1, duration: 1, ease: GEROZ_EASE_IO }, at + 0.08);
  }

  if (fade) {
    tl.to(fade, { opacity: 1, duration: 0.85, ease: GEROZ_EASE }, at + 0.18);
  }
}

export function primeHeroPortraitEntrance(portraitWrap, luxury, frame, img) {
  if (portraitWrap) gsap.set(portraitWrap, { opacity: 0, x: 36 });
  primePortraitLuxuryLayers(luxury);
  if (frame) gsap.set(frame, { opacity: 0, y: 24, clipPath: 'inset(0 100% 0 0)' });
  if (img) gsap.set(img, { scale: 1.07 });
}

export function playHeroPortraitEntrance(tl, portraitWrap, luxury, frame, img) {
  if (portraitWrap) {
    tl.to(portraitWrap, { opacity: 1, x: 0, duration: 1.1, ease: GEROZ_EASE_IO }, 0.22);
  }
  playPortraitLuxuryLayers(tl, luxury, 0.28);
  if (frame) {
    tl.to(frame, {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.3,
      ease: GEROZ_EASE_IO,
    }, 0.34);
  }
  if (img) {
    tl.to(img, { scale: 1, duration: 1.45, ease: GEROZ_EASE_IO }, 0.4);
  }
}

export function initExpertisePortraitReveal(portrait, luxury, scrollTrigger) {
  if (!portrait) return;

  gsap.fromTo(portrait, { opacity: 0, x: -40 }, {
    opacity: 1,
    x: 0,
    duration: 1.15,
    ease: GEROZ_EASE_IO,
    scrollTrigger,
  });

  primePortraitLuxuryLayers(luxury);
  const luxuryTl = gsap.timeline({ scrollTrigger });
  playPortraitLuxuryLayers(luxuryTl, luxury, 0);
}

export function revealPortraitFrameOnScroll(frame, scrollTrigger) {
  if (!frame) return;

  gsap.fromTo(frame, { clipPath: 'inset(0 100% 0 0)' }, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 1.25,
    ease: GEROZ_EASE_IO,
    scrollTrigger,
  });
}

export function initPortraitImgParallax(img, trigger) {
  if (!img) return;
  scrubParallax(img, trigger, { y: 16, scrub: 1 });
}
