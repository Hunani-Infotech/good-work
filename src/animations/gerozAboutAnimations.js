import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { syncScrollLayout } from './scrollRuntime.js';

gsap.registerPlugin(ScrollTrigger);

const ABOUT_BODY_SCROLL = {
  start: 'top 82%',
  end: 'top 18%',
};

const WORD_REVEAL_DURATION = 0.042;
const WORD_REVEAL_GAP = 0.016;
const PARA_REVEAL_GAP = 0.1;

let aboutCtx = null;
let aboutTimeline = null;

function getAboutSection(root = document) {
  return root.querySelector('.gz-about');
}

export function destroyGerozAboutAnimations() {
  aboutCtx?.revert();
  aboutCtx = null;
  aboutTimeline = null;

  document.querySelectorAll('[data-geroz-about-init]').forEach((el) => {
    delete el.dataset.gerozAboutInit;
  });
}

export function revealAllGerozAboutText(root = document) {
  const section = getAboutSection(root);
  if (!section) return;

  section.querySelectorAll('.geroz-scroll-text-reveal__word .geroz-scroll-text-reveal__ink').forEach((el) => {
    gsap.set(el, { clipPath: 'inset(0 0% 0 0)', clearProps: 'clipPath' });
  });
}

function syncAboutTimelineProgress(tl) {
  if (!tl?.scrollTrigger) return;
  tl.progress(tl.scrollTrigger.progress);
}

export function refreshGerozAboutAnimations(root = document) {
  if (!getAboutSection(root)) return;
  syncScrollLayout();
  if (aboutTimeline) {
    syncAboutTimelineProgress(aboutTimeline);
  }
}

export function initGerozAboutAnimations(root = document, prefersReduced = false) {
  const section = getAboutSection(root);
  if (!section || section.dataset.gerozAboutInit) return;

  section.dataset.gerozAboutInit = '1';
  aboutCtx?.revert();

  aboutCtx = gsap.context(() => {
    const blocks = section.querySelectorAll('.geroz-scroll-text-reveal');
    if (!blocks.length) return;

    if (prefersReduced) {
      revealAllGerozAboutText(root);
      return;
    }

    const stage = section.querySelector('.gz-about__body-col') || section;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: ABOUT_BODY_SCROLL.start,
        end: ABOUT_BODY_SCROLL.end,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    let at = 0;

    blocks.forEach((block, blockIndex) => {
      const wordInks = block.querySelectorAll('.geroz-scroll-text-reveal__word .geroz-scroll-text-reveal__ink');
      if (!wordInks.length) return;

      gsap.set(wordInks, { clipPath: 'inset(0 100% 0 0)' });

      wordInks.forEach((ink) => {
        tl.to(ink, {
          clipPath: 'inset(0 0% 0 0)',
          duration: WORD_REVEAL_DURATION,
        }, at);
        at += WORD_REVEAL_DURATION + WORD_REVEAL_GAP;
      });

      if (blockIndex < blocks.length - 1) {
        at += PARA_REVEAL_GAP;
      }
    });

    aboutTimeline = tl;
    syncAboutTimelineProgress(tl);
  }, section);
}
