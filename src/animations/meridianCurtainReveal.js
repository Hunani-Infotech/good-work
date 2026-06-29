import { destroyCurtainReveal, initCurtainReveal } from './curtainReveal.js';

const KEY = 'meridian';

export function initMeridianCurtainReveal({ prefersReduced = false } = {}) {
  return initCurtainReveal({
    key: KEY,
    section: document.querySelector('.meridian-contact__reveal'),
    curtain: document.querySelector('.meridian-contact__curtain'),
    path: document.querySelector('#meridian-contact-curve'),
    prefersReduced,
  });
}

export function destroyMeridianCurtainReveal() {
  destroyCurtainReveal(KEY);
}
