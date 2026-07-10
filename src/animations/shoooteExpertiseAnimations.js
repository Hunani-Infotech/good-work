import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { syncScrollLayout } from './scrollRuntime.js';

gsap.registerPlugin(ScrollTrigger);

const CLIP_HIDDEN = 'inset(0 100% 0 0)';
const CLIP_VISIBLE = 'inset(0 0% 0 0)';

const EXPERTISE_SCROLL = {
  start: 'top 82%',
  end: 'top 18%',
};

const WORD_REVEAL = {
  duration: 0.09,
  stagger: 0.03,
};

let expertiseCtx = null;
let expertiseTimeline = null;

function getExpertiseSection(root = document) {
  return root.querySelector('.wpo-expertise-section');
}

function getWordInkElements(section) {
  return section.querySelectorAll('.shooote-scroll-text-reveal__word .shooote-scroll-text-reveal__ink');
}

export function destroyShoooteExpertiseAnimations() {
  expertiseCtx?.revert();
  expertiseCtx = null;
  expertiseTimeline = null;

  document.querySelectorAll('[data-shooote-expertise-init]').forEach((el) => {
    delete el.dataset.shoooteExpertiseInit;
  });
}

export function revealAllShoooteExpertiseElements(root = document) {
  const section = getExpertiseSection(root);
  if (!section) return;

  getWordInkElements(section).forEach((el) => {
    gsap.set(el, { clipPath: CLIP_VISIBLE, clearProps: 'clipPath' });
  });

  section.querySelectorAll('.shooote-expertise-editorial__video-frame').forEach((el) => {
    gsap.set(el, { scaleY: 1, clearProps: 'transform' });
  });

  const actions = section.querySelector('.shooote-expertise-editorial__actions');
  if (actions) {
    gsap.set(actions, { opacity: 1, clearProps: 'opacity' });
  }
}

function syncExpertiseTimelineProgress(tl) {
  if (!tl?.scrollTrigger) return;
  tl.progress(tl.scrollTrigger.progress);
}

export function refreshShoooteExpertiseAnimations(root = document) {
  if (!getExpertiseSection(root)) return;
  syncScrollLayout();
  if (expertiseTimeline) {
    syncExpertiseTimelineProgress(expertiseTimeline);
  }
}

export function initShoooteExpertiseAnimations(root = document, prefersReduced = false) {
  const section = getExpertiseSection(root);
  if (!section || section.dataset.shoooteExpertiseInit) return;

  section.dataset.shoooteExpertiseInit = '1';
  expertiseCtx?.revert();

  expertiseCtx = gsap.context(() => {
    if (prefersReduced) {
      revealAllShoooteExpertiseElements(root);
      return;
    }

    const stage = section.querySelector('.shooote-expertise-editorial__stage') || section;
    const videoFrame = section.querySelector('.shooote-expertise-editorial__video-frame');
    const wordInkEls = getWordInkElements(section);
    const actions = section.querySelector('.shooote-expertise-editorial__actions');

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: EXPERTISE_SCROLL.start,
        end: EXPERTISE_SCROLL.end,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    let at = 0;

    if (videoFrame) {
      gsap.set(videoFrame, {
        scaleY: 0,
        transformOrigin: '50% 0%',
        force3D: true,
      });
      tl.to(videoFrame, {
        scaleY: 1,
        duration: 0.42,
        force3D: true,
      }, at);
      at += 0.3;
    }

    if (wordInkEls.length) {
      gsap.set(wordInkEls, { clipPath: CLIP_HIDDEN });
      tl.to(wordInkEls, {
        clipPath: CLIP_VISIBLE,
        duration: WORD_REVEAL.duration,
        stagger: WORD_REVEAL.stagger,
      }, at);

      const wordSpan = WORD_REVEAL.duration + Math.max(0, wordInkEls.length - 1) * WORD_REVEAL.stagger;
      at += wordSpan * 0.72;
    }

    if (actions) {
      gsap.set(actions, { opacity: 0 });
      tl.to(actions, {
        opacity: 1,
        duration: 0.24,
      }, at);
    }

    expertiseTimeline = tl;
    syncExpertiseTimelineProgress(tl);
  }, section);
}
