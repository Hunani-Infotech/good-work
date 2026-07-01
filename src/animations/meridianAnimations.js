/**
 * Meridian CV — Dennis Snellenberg portfolio scroll motion.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createScrollPageController } from './scrollPageBoot.js';
import {
  destroyMeridianHeroMarquee,
  initMeridianHeroMarquee,
  remeasureMeridianHeroMarquee,
} from './meridianMarquee.js';
import {
  destroyMeridianFooterCurve,
  initMeridianFooterCurve,
} from './meridianFooterCurve.js';
import {
  revealStaggerLines,
  revealStaggerWords,
} from './meridianTextReveal.js';
import { getLenis, refreshScrollTriggers, syncScrollLayout } from './scrollRuntime.js';
import {
  GEROZ_EASE,
  GEROZ_EASE_IO,
  GEROZ_SCROLL_TOGGLE,
  refreshAfterImagesLoad,
  revealEyebrowPill,
  scrubParallax,
  setReducedState,
  splitCharsIntoMasks,
  splitLinesIntoMasks,
  splitWordsIntoMasks,
  wrapLineMask,
} from './gerozTextHelpers.js';

const page = createScrollPageController();
let anchorCleanup = null;
let layoutSyncHandler = null;
let magneticCleanups = [];
let menuObserverCleanup = null;

const SCROLL_OFFSET = -72;
const SCROLL_EASE = (t) => Math.min(1, 1.001 - (2 ** (-10 * t)));

function meridianScroll(trigger, start = 'top 88%', { once = true } = {}) {
  return {
    trigger,
    start,
    toggleActions: GEROZ_SCROLL_TOGGLE,
    invalidateOnRefresh: true,
    once,
  };
}

function meridianScrub(trigger, start, end, scrub = 1) {
  return {
    trigger,
    start,
    end,
    scrub: typeof scrub === 'number' ? scrub : true,
    invalidateOnRefresh: true,
    fastScrollEnd: true,
  };
}

export function scrollMeridianToHash(href) {
  if (!href?.startsWith('#')) return;
  const target = document.querySelector(href);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.start();
    lenis.scrollTo(target, {
      offset: SCROLL_OFFSET,
      duration: 1.35,
      easing: SCROLL_EASE,
      lock: false,
      onComplete: () => refreshScrollTriggers(),
    });
    return;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initMeridianSmoothAnchors() {
  if (anchorCleanup) anchorCleanup();

  const links = document.querySelectorAll('.meridian-cv-main a[href^="#"]');
  const onClick = (event) => {
    const href = event.currentTarget.getAttribute('href');
    if (!href || href === '#') return;
    if (!document.querySelector(href)) return;

    event.preventDefault();
    scrollMeridianToHash(href);
  };

  links.forEach((link) => link.addEventListener('click', onClick));
  anchorCleanup = () => links.forEach((link) => link.removeEventListener('click', onClick));
}

function initMeridianHeader(prefersReduced) {
  const header = document.querySelector('.meridian-header');
  const credit = header?.querySelector('.meridian-header__credit');
  const menuBtn = document.querySelector('.meridian-menu-btn');
  const hero = document.querySelector('.meridian-hero');

  if (prefersReduced) {
    setReducedState([credit, menuBtn]);
    return;
  }

  if (credit && hero) {
    gsap.fromTo(credit, { opacity: 0.92 }, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: meridianScrub(hero, 'top top', 'bottom top', 0.6),
    });
  }

  if (menuBtn) {
    gsap.fromTo(menuBtn, { opacity: 0, y: -12 }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: GEROZ_EASE,
      delay: 0.25,
    });
  }
}

function initMeridianMenu(prefersReduced) {
  if (menuObserverCleanup) {
    menuObserverCleanup();
    menuObserverCleanup = null;
  }

  const menuRoot = document.querySelector('.meridian-menu__root');
  if (!menuRoot || prefersReduced) return;

  let menuTl = null;

  const resetMenuMotion = () => {
    menuTl?.kill();
    menuTl = null;

    const backdrop = menuRoot.querySelector('.meridian-menu__backdrop');
    const panel = menuRoot.querySelector('.meridian-menu__panel');
    const links = menuRoot.querySelectorAll('.meridian-menu__link');

    if (backdrop) gsap.set(backdrop, { clearProps: 'opacity' });
    if (panel) gsap.set(panel, { clearProps: 'transform' });
    if (links.length) gsap.set(links, { clearProps: 'transform,opacity' });
  };

  const animateOpen = () => {
    const links = menuRoot.querySelectorAll('.meridian-menu__link');
    menuTl?.kill();
    menuTl = gsap.timeline({ defaults: { ease: GEROZ_EASE } });

    if (links.length) {
      gsap.set(links, { opacity: 0, y: 28, force3D: true });
      menuTl.to(links, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.07,
        ease: GEROZ_EASE,
        clearProps: 'transform,opacity',
      }, 0.15);
    }
  };

  const observer = new MutationObserver(() => {
    if (menuRoot.classList.contains('is-open')) {
      animateOpen();
    } else {
      resetMenuMotion();
    }
  });

  observer.observe(menuRoot, { attributes: true, attributeFilter: ['class'] });
  menuObserverCleanup = () => {
    observer.disconnect();
    resetMenuMotion();
  };
}

function initMeridianHero(prefersReduced) {
  const hero = document.querySelector('.meridian-hero');
  if (!hero) return;

  const portraitHalo = hero.querySelector('.meridian-hero__portrait-halo');
  const portraitRing = hero.querySelector('.meridian-hero__portrait-ring');
  const portraitShell = hero.querySelector('.meridian-hero__portrait-shell');
  const portraitImg = hero.querySelector('.meridian-hero__portrait');
  const marquee = hero.querySelector('.meridian-hero__marquee-track');
  const role = hero.querySelector('.meridian-hero__role');
  const roleArrow = hero.querySelector('.meridian-hero__role-arrow');
  const roleLines = hero.querySelectorAll('.meridian-hero__role-copy span');
  const spotlight = hero.querySelector('.meridian-hero__spotlight');
  const grain = hero.querySelector('.meridian-hero__grain');
  const scrollCue = hero.querySelector('.meridian-hero__scroll-cue');

  if (prefersReduced) {
    setReducedState([role, scrollCue, ...roleLines]);
    return;
  }

  if (marquee) {
    initMeridianHeroMarquee(marquee);
    gsap.fromTo(marquee.parentElement, { opacity: 0 }, {
      opacity: 1,
      duration: 1.2,
      ease: GEROZ_EASE,
      delay: 0.35,
    });

    const marqueeItems = hero.querySelectorAll('.meridian-hero__marquee-item');
    marqueeItems.forEach((item, index) => {
      if (index > 0) return;
      const chars = splitCharsIntoMasks(item);
      gsap.set(chars, { y: '120%', opacity: 0 });
      gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.012,
        ease: GEROZ_EASE_IO,
        delay: 0.45,
      });
    });
  }

  const haloTargets = [portraitHalo, portraitRing].filter(Boolean);
  if (portraitShell) {
    gsap.timeline({ delay: 0.08 })
      .fromTo(portraitShell, { clipPath: 'inset(100% 0 0 0)' }, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.35,
        ease: GEROZ_EASE_IO,
      })
      .fromTo(portraitShell, { y: 28, scale: 1.03 }, {
        y: 0,
        scale: 1,
        duration: 1.4,
        ease: GEROZ_EASE_IO,
      }, 0.1);
  }

  const heroScrubTargets = [
    ...haloTargets,
    portraitImg,
    spotlight,
    grain,
    role,
  ].filter(Boolean);

  if (heroScrubTargets.length) {
    const heroScrub = gsap.timeline({
      scrollTrigger: meridianScrub(hero, 'top top', 'bottom top', 1),
    });

    if (haloTargets.length) {
      heroScrub.to(haloTargets, { y: -8, ease: 'none', duration: 1, force3D: true }, 0);
    }
    if (portraitImg) {
      heroScrub.to(portraitImg, { y: -14, ease: 'none', duration: 1, force3D: true }, 0);
    }
    if (spotlight) {
      heroScrub.to(spotlight, { scale: 1.08, opacity: 0.85, ease: 'none', duration: 1 }, 0);
    }
    if (grain) {
      heroScrub.to(grain, { backgroundPosition: '40px 60px', ease: 'none', duration: 1 }, 0);
    }
    if (role) {
      heroScrub.fromTo(role, { y: 0 }, { y: -18, ease: 'none', duration: 1, force3D: true }, 0);
    }
  }

  if (haloTargets.length) {
    gsap.fromTo(haloTargets, { opacity: 0, scale: 0.94 }, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: GEROZ_EASE_IO,
      delay: 0.05,
      stagger: 0.08,
    });
  }

  if (role) {
    gsap.fromTo(role, { opacity: 0, y: 16 }, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: GEROZ_EASE,
      delay: 0.25,
    });
  }

  if (roleArrow) {
    gsap.fromTo(roleArrow, { rotation: -28, opacity: 0 }, {
      rotation: 0,
      opacity: 0.7,
      duration: 1,
      ease: GEROZ_EASE_IO,
      delay: 0.4,
    });
  }

  roleLines.forEach((line, index) => {
    const inner = wrapLineMask(line);
    gsap.fromTo(inner, { y: '110%' }, {
      y: 0,
      duration: 0.95,
      ease: GEROZ_EASE_IO,
      delay: 0.32 + index * 0.1,
    });
  });

  const mobileName = hero.querySelector('.meridian-hero__mobile-name');
  const mobileArrow = hero.querySelector('.meridian-hero__mobile-arrow');
  const globe = hero.querySelector('.meridian-hero__globe');
  const isMobileHero = window.matchMedia('(max-width: 767px)').matches;

  if (scrollCue) {
    if (isMobileHero) {
      gsap.fromTo(scrollCue, { opacity: 0 }, {
        opacity: 0.85,
        duration: 0.85,
        ease: GEROZ_EASE,
        delay: 0.62,
      });
    } else {
      gsap.fromTo(scrollCue, { opacity: 0, y: 8 }, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: GEROZ_EASE,
        delay: 0.55,
      });
    }
  }

  if (isMobileHero && mobileName) {
    gsap.fromTo(mobileName, { opacity: 0 }, {
      opacity: 1,
      duration: 1,
      ease: GEROZ_EASE_IO,
      delay: 0.38,
    });
  }

  if (isMobileHero && mobileArrow) {
    gsap.fromTo(mobileArrow, { opacity: 0, x: -6, y: -6 }, {
      opacity: 0.72,
      x: 0,
      y: 0,
      duration: 0.85,
      ease: GEROZ_EASE,
      delay: 0.52,
    });
  }

  if (isMobileHero && globe) {
    gsap.fromTo(globe, { opacity: 0, scale: 0.92 }, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: GEROZ_EASE,
      delay: 0.48,
    });
  }
}

function initMeridianManifesto(prefersReduced) {
  const section = document.querySelector('.meridian-manifesto');
  if (!section) return;

  const inner = section.querySelector('.meridian-manifesto__inner');
  const grid = section.querySelector('.meridian-manifesto__grid');
  const heading = section.querySelector('.meridian-manifesto__heading');
  const body = section.querySelector('.meridian-manifesto__body');
  const isCompactManifesto = window.matchMedia('(max-width: 1023px)').matches;

  if (prefersReduced) {
    setReducedState([heading, body, inner, grid]);
    return;
  }

  if (grid) {
    gsap.fromTo(grid, { opacity: 0.82 }, {
      opacity: 1,
      ease: 'none',
      force3D: true,
      scrollTrigger: meridianScrub(section, 'top 95%', 'top 55%', 1),
    });
  }

  if (heading) {
    const lines = splitLinesIntoMasks(heading, 3);
    if (lines.length > 1) {
      revealStaggerLines(lines, heading, {
        start: isCompactManifesto ? 'top 90%' : 'top 86%',
        stagger: isCompactManifesto ? 0.1 : 0.14,
        duration: isCompactManifesto ? 0.95 : 1.08,
        y: '115%',
      });
    } else {
      const innerLine = wrapLineMask(heading);
      gsap.fromTo(innerLine, { y: '115%' }, {
        y: 0,
        duration: 1.05,
        ease: GEROZ_EASE_IO,
        scrollTrigger: meridianScroll(heading, 'top 86%'),
      });
    }
  }

  if (body) {
    if (isCompactManifesto) {
      gsap.fromTo(body, { opacity: 0, y: 18 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: GEROZ_EASE_IO,
        scrollTrigger: meridianScroll(section, 'top 86%'),
      });
    } else {
      const words = splitWordsIntoMasks(body);
      revealStaggerWords(words, body, {
        start: 'top 88%',
        stagger: 0.022,
        duration: 0.85,
        y: '112%',
      });
    }
  }
}

function initMeridianAbout(prefersReduced) {
  const section = document.querySelector('.meridian-about');
  if (!section) return;

  const photo = section.querySelector('.meridian-about__photo');
  const seal = section.querySelector('.meridian-about__seal');
  const heading = section.querySelector('.meridian-about__heading');
  const paragraphs = section.querySelectorAll('.meridian-about__paragraph');
  const isCompactAbout = window.matchMedia('(max-width: 1023px)').matches;

  if (prefersReduced) {
    setReducedState([photo, seal, heading, ...paragraphs]);
    return;
  }

  if (photo) {
    gsap.fromTo(
      photo,
      { y: '-12%', force3D: true },
      {
        y: '8%',
        ease: 'none',
        force3D: true,
        scrollTrigger: meridianScrub(section, 'top bottom', 'bottom top', 1.1),
      },
    );
  }

  if (seal) {
    gsap.fromTo(seal, { opacity: 0, scale: 0.88, rotate: -12 }, {
      opacity: 1,
      scale: 1,
      rotate: 0,
      duration: 1,
      ease: GEROZ_EASE_IO,
      scrollTrigger: meridianScroll(seal, 'top 90%'),
    });
  }

  if (heading) {
    if (isCompactAbout) {
      gsap.fromTo(heading, { opacity: 0, y: 18 }, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: GEROZ_EASE,
        scrollTrigger: meridianScroll(heading, 'top 88%'),
      });
    } else {
      const lines = splitLinesIntoMasks(heading, 4);
      if (lines.length > 1) {
        revealStaggerLines(lines, heading, {
          start: 'top 88%',
          stagger: 0.1,
          duration: 0.95,
          y: '110%',
        });
      } else {
        const inner = wrapLineMask(heading);
        gsap.fromTo(inner, { y: '110%' }, {
          y: 0,
          duration: 0.95,
          ease: GEROZ_EASE,
          scrollTrigger: meridianScroll(heading, 'top 88%'),
        });
      }
    }
  }

  paragraphs.forEach((para, index) => {
    if (isCompactAbout) {
      gsap.fromTo(para, { opacity: 0, y: 16 }, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: GEROZ_EASE,
        scrollTrigger: meridianScroll(para, 'top 92%'),
      });
      return;
    }

    const inner = wrapLineMask(para);
    gsap.fromTo(inner, { y: '110%' }, {
      y: 0,
      duration: 0.95,
      ease: GEROZ_EASE,
      delay: index * 0.04,
      scrollTrigger: meridianScroll(para, 'top 92%'),
    });
  });
}

function initMeridianCapabilities(prefersReduced) {
  const section = document.querySelector('.meridian-capabilities');
  if (!section) return;

  const eyebrow = section.querySelector('.meridian-capabilities__eyebrow');
  const grid = section.querySelector('.meridian-capabilities__grid');
  const cards = section.querySelectorAll('.meridian-capabilities__card');
  const cta = section.querySelector('.meridian-capabilities__cta');

  if (prefersReduced) {
    setReducedState([eyebrow, ...cards, cta]);
    return;
  }

  if (eyebrow) {
    revealEyebrowPill(eyebrow, section, prefersReduced, {
      start: 'top 90%',
      variant: 'slide',
    });
  }

  if (grid && cards.length) {
    gsap.set(cards, { opacity: 0, y: 36, force3D: true });

    const gridTl = gsap.timeline({
      scrollTrigger: meridianScroll(grid, 'top 84%'),
    });

    cards.forEach((card, index) => {
      const indexEl = card.querySelector('.meridian-capabilities__index');
      const textEl = card.querySelector('.meridian-capabilities__text');
      const inner = textEl ? wrapLineMask(textEl) : null;
      const offset = index * 0.08;

      gridTl.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: GEROZ_EASE,
      }, offset);

      if (indexEl) {
        gsap.set(indexEl, { opacity: 0, y: 8 });
        gridTl.to(indexEl, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: GEROZ_EASE,
        }, offset + 0.08);
      }

      if (inner) {
        gsap.set(inner, { y: '108%' });
        gridTl.to(inner, {
          y: 0,
          duration: 0.82,
          ease: GEROZ_EASE_IO,
        }, offset + 0.12);
      }
    });

    if (window.innerWidth >= 720) {
      cards.forEach((card, i) => {
        const isTopRow = i < 4;
        gsap.fromTo(card, 
          { x: isTopRow ? 150 : -150 },
          {
            x: isTopRow ? -150 : 150,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        );
      });
    }
  }

  if (cta) {
    const ctaMotion = cta.querySelector('[data-magnetic-inner]') || cta;
    gsap.set(cta, { clearProps: 'clipPath' });
    gsap.fromTo(ctaMotion, { opacity: 0, y: 16 }, {
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: GEROZ_EASE_IO,
      scrollTrigger: meridianScroll(cta, 'top 92%'),
    });
  }
}

function initMeridianContactReveal(prefersReduced) {
  const section = document.querySelector('#contact');
  if (!section) return;

  const headingWrap = section.querySelector('.meridian-contact__heading-wrap');
  const headingLineEls = section.querySelectorAll('.meridian-contact__heading-line');
  const avatar = section.querySelector('.meridian-contact__avatar');
  const arrow = section.querySelector('.meridian-contact__heading-arrow');
  const pills = section.querySelectorAll('.meridian-contact__pill');
  const footerBlocks = section.querySelectorAll('.meridian-footer__meta > div');
  const footerLabels = section.querySelectorAll('.meridian-footer__label');
  const footerValues = section.querySelectorAll('.meridian-footer__value');
  const isCompactContact = window.matchMedia('(max-width: 767px)').matches;

  if (prefersReduced) {
    setReducedState([avatar, arrow, headingWrap, ...pills, ...footerBlocks]);
    return;
  }

  const revealTargets = [avatar, ...footerBlocks].filter(Boolean);
  gsap.set(revealTargets, { opacity: 0, y: 24 });

  if (pills.length) {
    gsap.set(pills, { opacity: 0, y: 24, clearProps: 'clipPath' });
  }

  if (headingWrap) {
    scrubParallax(headingWrap, section, {
      y: 12,
      start: 'top bottom',
      end: 'center center',
      scrub: 0.8,
    });
  }

  const tl = gsap.timeline({
    scrollTrigger: meridianScroll(section, 'top 78%'),
    defaults: { ease: GEROZ_EASE_IO },
  });

  if (avatar) {
    tl.fromTo(avatar, { scale: 0.82, opacity: 0 }, {
      scale: 1,
      opacity: 1,
      duration: 0.85,
    }, 0);
  }

  if (arrow) {
    tl.fromTo(arrow, { rotation: 18, opacity: 0, y: 24 }, {
      rotation: 0,
      opacity: 0.85,
      y: 0,
      duration: 0.75,
    }, 0.05);
  }

  if (isCompactContact) {
    headingLineEls.forEach((lineEl, index) => {
      tl.fromTo(lineEl, { opacity: 0, y: 18 }, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: GEROZ_EASE,
      }, 0.1 + index * 0.1);
    });
  } else {
    headingLineEls.forEach((lineEl, index) => {
      const textTarget = lineEl.querySelector('span') || lineEl;
      const lines = splitLinesIntoMasks(textTarget, 6);
      if (lines.length > 1) {
        gsap.set(lines, { y: '115%' });
        tl.to(lines, {
          y: 0,
          duration: 0.95,
          stagger: 0.08,
          ease: GEROZ_EASE_IO,
        }, 0.1 + index * 0.12);
      } else {
        const inner = wrapLineMask(textTarget);
        gsap.set(inner, { y: '108%' });
        tl.to(inner, { y: 0, duration: 1, ease: GEROZ_EASE_IO }, 0.12 + index * 0.1);
      }
    });
  }

  footerLabels.forEach((label, index) => {
    const chars = splitCharsIntoMasks(label);
    gsap.set(chars, { y: '110%', opacity: 0 });
    tl.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.65,
      stagger: 0.012,
      ease: GEROZ_EASE,
    }, 0.42 + index * 0.06);
  });

  footerValues.forEach((value, index) => {
    const inner = wrapLineMask(value);
    gsap.set(inner, { y: '108%' });
    tl.to(inner, {
      y: 0,
      duration: 0.85,
      ease: GEROZ_EASE_IO,
    }, 0.48 + index * 0.07);
  });

  if (pills.length) {
    tl.to(pills, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      stagger: 0.08,
      ease: GEROZ_EASE,
    }, 0.35);
  }

  if (footerBlocks.length) {
    tl.to(footerBlocks, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.07,
      ease: GEROZ_EASE,
    }, 0.52);
  }
}

function bindMeridianMagnetic(element) {
  const strength = Number(element.dataset.magneticStrength) || 0.35;
  const labelStrength = Number(element.dataset.magneticLabelStrength) || 0.12;
  const wobble = element.hasAttribute('data-magnetic-wobble');
  const returnEase = wobble ? 'elastic.out(1, 0.55)' : 'power3.out';
  const returnDuration = wobble ? 0.7 : 0.3;
  const moveDuration = wobble ? 0.5 : 0.3;
  const shell = element.querySelector('[data-magnetic-inner]') || element;
  const label = element.querySelector('[data-magnetic-text]');

  gsap.set(shell, { x: 0, y: 0, force3D: true });
  if (label) gsap.set(label, { x: 0, y: 0, force3D: true });

  const onMove = (event) => {
    const rect = element.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;

    gsap.to(shell, {
      x: relX * strength,
      y: relY * strength,
      duration: moveDuration,
      ease: 'power2.out',
    });

    if (label) {
      gsap.to(label, {
        x: relX * labelStrength,
        y: relY * labelStrength,
        duration: moveDuration,
        ease: 'power2.out',
      });
    }
  };

  const onLeave = () => {
    gsap.to(shell, {
      x: 0,
      y: 0,
      duration: returnDuration,
      ease: returnEase,
    });

    if (label) {
      gsap.to(label, {
        x: 0,
        y: 0,
        duration: returnDuration,
        ease: returnEase,
      });
    }
  };

  element.addEventListener('mousemove', onMove);
  element.addEventListener('mouseleave', onLeave);

  return () => {
    element.removeEventListener('mousemove', onMove);
    element.removeEventListener('mouseleave', onLeave);
    gsap.set(shell, { clearProps: 'transform' });
    if (label) gsap.set(label, { clearProps: 'transform' });
  };
}

function initMeridianMagnetic(prefersReduced) {
  magneticCleanups.forEach((cleanup) => cleanup());
  magneticCleanups = [];

  if (prefersReduced || !window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('.meridian-magnetic').forEach((element) => {
    magneticCleanups.push(bindMeridianMagnetic(element));
  });
}

function initMeridianScrollAnimations(prefersReduced) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ overwrite: 'auto' });
  ScrollTrigger.config({ limitCallbacks: true });

  document.querySelectorAll(
    '.meridian-magnetic, .meridian-contact__pill, .meridian-capabilities__cta, .meridian-contact__cta',
  ).forEach((el) => {
    gsap.set(el, { clearProps: 'clipPath' });
  });

  initMeridianSmoothAnchors();
  initMeridianHeader(prefersReduced);
  initMeridianMenu(prefersReduced);
  initMeridianHero(prefersReduced);
  initMeridianManifesto(prefersReduced);
  initMeridianAbout(prefersReduced);
  initMeridianCapabilities(prefersReduced);
  initMeridianContactReveal(prefersReduced);
  initMeridianFooterCurve({ prefersReduced });
  initMeridianMagnetic(prefersReduced);

  const syncLayout = () => {
    syncScrollLayout();
    remeasureMeridianHeroMarquee();
  };

  syncLayout();
  refreshScrollTriggers();
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      syncLayout();
      refreshScrollTriggers();
    });
  }

  refreshAfterImagesLoad(
    ['.meridian-hero__portrait', '.meridian-contact__avatar'],
    () => {
      syncLayout();
      refreshScrollTriggers();
    },
  );

  layoutSyncHandler = syncLayout;
  window.addEventListener('load', layoutSyncHandler, { once: true });
}

export function destroyMeridianAnimations() {
  destroyMeridianHeroMarquee();
  destroyMeridianFooterCurve();

  if (menuObserverCleanup) {
    menuObserverCleanup();
    menuObserverCleanup = null;
  }

  if (magneticCleanups.length) {
    magneticCleanups.forEach((cleanup) => cleanup());
    magneticCleanups = [];
  }

  if (anchorCleanup) {
    anchorCleanup();
    anchorCleanup = null;
  }

  if (layoutSyncHandler) {
    window.removeEventListener('load', layoutSyncHandler);
    layoutSyncHandler = null;
  }

  page.destroy({ keepSiteReady: true });
}

export function initMeridianAnimations() {
  return page.boot({
    onReady: initMeridianScrollAnimations,
    lenisOptions: {
      lerp: 0.1,
      duration: 1.15,
      wheelMultiplier: 1.05,
    },
  });
}
