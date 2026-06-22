import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { initLenis, destroyLenis, resetDocumentScrollState } from './scrollRuntime.js';
import { isLoaderSessionComplete, isLoaderSessionPending, revealSiteContent, whenSiteLoaderReady } from './loaderAnimations.js';

let agencyRunId = 0;
let agencyHeadlineHoverCleanup = null;
let agencyBootPromise = null;

function resetHeadlineHover() {
  var headline = document.querySelector('.agency-hero__headline');

  if (agencyHeadlineHoverCleanup) {
    agencyHeadlineHoverCleanup();
    agencyHeadlineHoverCleanup = null;
  }

  gsap.killTweensOf('.agency-hero__headline .ag-w');

  if (headline) {
    headline.classList.remove('is-hover');
    var ovalPath = headline.querySelector('.agency-hero__oval-path');
    if (ovalPath) {
      gsap.killTweensOf(ovalPath);
      gsap.set(ovalPath, { strokeDashoffset: ovalPath.getTotalLength() });
    }
  }
}

function resetAgencyRuntime() {
  agencyRunId += 1;
  resetHeadlineHover();
  gsap.killTweensOf('*');
  ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
  destroyLenis();
  resetDocumentScrollState({ keepSiteReady: isLoaderSessionComplete() });
}

export function destroyAgencyAnimations() {
  if (isLoaderSessionPending()) {
    return;
  }

  agencyBootPromise = null;
  resetAgencyRuntime();
}

/* ── Word splitter ── */
function splitWords(el) {
  if (!el) return [];
  if (el.dataset.agSplit) return Array.from(el.querySelectorAll('.ag-w'));
  el.dataset.agSplit = '1';
  el.setAttribute('aria-label', el.textContent);
  var html = el.innerHTML.split(/<br\s*\/?>/gi).map(function (chunk, ci, arr) {
    var text = chunk.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!text) return ci < arr.length - 1 ? '<br>' : '';
    var words = text.split(' ').map(function (w) {
      return '<span class="ag-w" aria-hidden="true">' + w + '</span>';
    }).join(' ');
    return ci < arr.length - 1 ? words + '<br>' : words;
  }).join('');
  el.innerHTML = html;
  return Array.from(el.querySelectorAll('.ag-w'));
}

export function initAgencyAnimations() {
  if (agencyBootPromise) {
    return agencyBootPromise;
  }

  resetAgencyRuntime();
  var id = agencyRunId;

  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create('osmo', '0.625, 0.05, 0, 1');
  gsap.defaults({ overwrite: 'auto' });

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    initLenis();
  }

  /* ── Nav scroll state ── */
  function initNav() {
    var nav = document.querySelector('.agency-nav');
    if (!nav) return;

    function updateNavState() {
      var scrollY = window.scrollY || window.pageYOffset;
      nav.classList.toggle('is-scrolled', scrollY > 60);
    }

    updateNavState();
    ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: updateNavState,
    });
    window.addEventListener('resize', updateNavState);
  }

  /* ── Hero headline hover — oval outline on hover only ── */
  function initHeadlineHover(headline) {
    if (!headline || prefersReduced) return;

    var ovalPath = headline.querySelector('.agency-hero__oval-path');
    if (!ovalPath) return;

    var hoverTl = null;
    var ovalLen = ovalPath.getTotalLength();

    gsap.set(ovalPath, { strokeDasharray: ovalLen, strokeDashoffset: ovalLen });

    function killHoverTl() {
      if (hoverTl) {
        hoverTl.kill();
        hoverTl = null;
      }
    }

    function onEnter() {
      if (id !== agencyRunId) return;
      killHoverTl();
      headline.classList.add('is-hover');

      hoverTl = gsap.to(ovalPath, {
        strokeDashoffset: 0,
        duration: 0.65,
        ease: 'power2.out',
      });
    }

    function onLeave() {
      if (id !== agencyRunId) return;
      killHoverTl();
      headline.classList.remove('is-hover');

      hoverTl = gsap.to(ovalPath, {
        strokeDashoffset: ovalLen,
        duration: 0.45,
        ease: 'power2.in',
      });
    }

    headline.addEventListener('mouseenter', onEnter);
    headline.addEventListener('mouseleave', onLeave);

    agencyHeadlineHoverCleanup = function () {
      headline.removeEventListener('mouseenter', onEnter);
      headline.removeEventListener('mouseleave', onLeave);
      headline.classList.remove('is-hover');
      killHoverTl();
      gsap.set(ovalPath, { strokeDashoffset: ovalLen });
    };
  }

  /* ── Hero entrance ── */
  function prepareAgencyHero() {
    var hero = document.querySelector('.agency-hero');
    if (!hero) return null;

    var lines = hero.querySelectorAll('.agency-hero__line');
    var sub = hero.querySelector('.agency-hero__sub');
    var ctas = hero.querySelectorAll('.agency-hero__ctas > *');
    var stats = hero.querySelector('.agency-hero__stats');
    var panels = hero.querySelectorAll('.agency-collage__panel-body');
    var headline = hero.querySelector('.agency-hero__headline');
    var ovalPath = hero.querySelector('.agency-hero__oval-path');

    if (prefersReduced) {
      gsap.set([...lines, sub, stats, ...ctas, ...panels], { opacity: 1, y: 0, scale: 1 });
      if (ovalPath) gsap.set(ovalPath, { strokeDashoffset: ovalPath.getTotalLength() });
      return null;
    }

    gsap.set(lines, { opacity: 0, y: 32 });
    gsap.set(sub, { opacity: 0, y: 20 });
    gsap.set(ctas, { opacity: 0, y: 14 });
    gsap.set(stats, { opacity: 0, y: 10 });
    gsap.set(panels, { opacity: 0, y: 48, scale: 0.94 });

    if (ovalPath) {
      var ovalLen = ovalPath.getTotalLength();
      gsap.set(ovalPath, { strokeDasharray: ovalLen, strokeDashoffset: ovalLen });
    }

    initHeadlineHover(headline);

    return { hero, lines, sub, ctas, stats, panels, collageWrap: hero.querySelector('.agency-hero__collage-wrap') };
  }

  function playAgencyHeroEntrance(prepared) {
    if (!prepared) return;

    var lines = prepared.lines;
    var sub = prepared.sub;
    var ctas = prepared.ctas;
    var stats = prepared.stats;
    var panels = prepared.panels;

    var tl = gsap.timeline({ delay: 0.12, defaults: { ease: 'osmo' } });

    tl.to(lines, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.14,
      ease: 'power3.out',
    }, 0.1);

    tl.to(sub, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.48);
    tl.to(ctas, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09, ease: 'power2.out' }, 0.58);
    tl.to(stats, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.68);

    panels.forEach(function (panel, i) {
      tl.to(panel, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
      }, 0.42 + i * 0.1);
    });

    tl.eventCallback('onComplete', function () {
      if (id !== agencyRunId) return;

      ScrollTrigger.refresh();

      panels.forEach(function (panel, i) {
        gsap.to(panel, {
          y: -6 + i * 2,
          duration: 3.2 + i * 0.35,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.28,
        });
      });
    });

    var hero = prepared.hero;
    var copy = hero.querySelector('.agency-hero__copy');
    var collageWrap = prepared.collageWrap;

    if (copy) {
      gsap.to(copy, {
        y: '-8vh',
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      });
    }
    if (collageWrap) {
      gsap.to(collageWrap, {
        y: '-4vh',
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      });
    }
  }

  /* ── How It Works ── */
  function initHowItWorks() {
    var section = document.querySelector('.agency-how');
    if (!section) return;

    var headline = section.querySelector('.agency-section__headline');
    var tag = section.querySelector('.agency-tag');
    var paths = section.querySelectorAll('.agency-how__path');
    var nodes = section.querySelectorAll('.agency-how__node');
    var stepDots = section.querySelectorAll('.agency-how__step-dot');
    var steps = section.querySelectorAll('.agency-how__step');

    if (tag) {
      gsap.set(tag, { opacity: 0, y: 18 });
      gsap.to(tag, {
        opacity: 1, y: 0, duration: 0.55, ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    if (headline) {
      var words = splitWords(headline);
      if (words.length) {
        gsap.set(words, { opacity: 0, y: 26, rotateX: -18, transformOrigin: '50% 100%' });
        gsap.to(words, {
          opacity: 1, y: 0, rotateX: 0, duration: 0.65,
          stagger: { each: 0.045 },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }
    }

    if (prefersReduced) {
      gsap.set(steps, { opacity: 1, x: 0 });
      return;
    }

    steps.forEach(function (step) {
      var isLeft = step.classList.contains('agency-how__step--left');
      gsap.set(step, { opacity: 0, x: isLeft ? -38 : 38 });
      gsap.to(step, {
        opacity: 1,
        x: 0,
        duration: 0.75,
        ease: 'osmo',
        scrollTrigger: {
          trigger: step,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    });

    if (!paths.length) return;

    paths.forEach(function (pathEl) {
      var length = pathEl.getTotalLength();
      if (!length || length < 10) return;

      gsap.set(pathEl, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(pathEl, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1.5,
        },
      });
    });

    gsap.set(nodes, { scale: 0, transformOrigin: '50% 50%' });
    gsap.set(stepDots, { scale: 0, transformOrigin: '50% 50%' });

    section.querySelectorAll('.agency-how__svg').forEach(function (svg) {
      var svgNodes = svg.querySelectorAll('.agency-how__node');
      svgNodes.forEach(function (node, i) {
        var step = steps[i];
        if (!step) return;
        gsap.to(node, {
          scale: 1,
          duration: 0.45,
          ease: 'back.out(2.2)',
          scrollTrigger: {
            trigger: step,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        });
      });
    });

    stepDots.forEach(function (dot, i) {
      var step = steps[i];
      if (!step) return;
      gsap.to(dot, {
        scale: 1,
        duration: 0.45,
        ease: 'back.out(2.2)',
        scrollTrigger: {
          trigger: step,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  /* ── Template Showcase ── */
  function initTemplates() {
    var section = document.querySelector('.agency-templates');
    if (!section) return;

    var picker = section.querySelector('.template-picker-wrap');

    if (picker && !prefersReduced) {
      gsap.fromTo(picker,
        { opacity: 0, y: 64, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, ease: 'none',
          scrollTrigger: {
            trigger: picker,
            start: 'top 92%',
            end: 'top 52%',
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        }
      );
    } else if (picker) {
      gsap.set(picker, { opacity: 1, y: 0, scale: 1 });
    }
  }

  /* ── Features ── */
  function initFeatures() {
    var section = document.querySelector('.agency-features');
    if (!section) return;

    var tag = section.querySelector('.agency-tag');
    var headline = section.querySelector('.agency-section__headline');
    var cards = section.querySelectorAll('.feature-card');

    if (tag) {
      gsap.fromTo(tag,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
          scrollTrigger: { trigger: tag, start: 'top 88%', toggleActions: 'play none none reverse' } }
      );
    }

    if (headline) {
      var words = splitWords(headline);
      if (words.length) {
        gsap.fromTo(words,
          { opacity: 0, y: 28, rotateX: -20, transformOrigin: '50% 100%' },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.6,
            stagger: { each: 0.04 }, ease: 'power3.out',
            scrollTrigger: { trigger: headline, start: 'top 85%', toggleActions: 'play none none reverse' } }
        );
      }
    }

    if (cards.length && !prefersReduced) {
      gsap.fromTo(cards,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: cards[0], start: 'top 85%', toggleActions: 'play none none reverse' } }
      );

      cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          card.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
          card.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
          card.classList.add('is-glowing');
        });
        card.addEventListener('mouseleave', function () {
          card.classList.remove('is-glowing');
        });
      });
    } else if (cards.length) {
      gsap.set(cards, { opacity: 1, y: 0 });
    }
  }

  /* ── CTA section ── */
  function initAgencyCta() {
    var section = document.querySelector('.agency-cta');
    if (!section) return;

    var eyebrow = section.querySelector('.agency-cta__eyebrow');
    var headlineLine = section.querySelector('.agency-cta__headline-line');
    var accent = section.querySelector('.agency-cta__accent');
    var sub = section.querySelector('.agency-cta__sub');
    var btn = section.querySelector('.agency-cta .agency-btn-primary');
    var note = section.querySelector('.agency-cta__note');

    if (headlineLine && accent && section.classList.contains('agency-cta--editorial')) {
      var headline = section.querySelector('.agency-cta__headline');
      headline.addEventListener('mouseenter', function () {
        headline.classList.add('is-hover');
      });
      headline.addEventListener('mouseleave', function () {
        headline.classList.remove('is-hover');
      });
    }

    if (eyebrow) {
      gsap.fromTo(eyebrow,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: eyebrow, start: 'top 88%', toggleActions: 'play none none reverse' } }
      );
    }

    if (headlineLine) {
      gsap.fromTo(headlineLine,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.62, ease: 'power3.out',
          scrollTrigger: { trigger: headlineLine, start: 'top 85%', toggleActions: 'play none none reverse' } }
      );
    }

    if (accent) {
      gsap.fromTo(accent,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.62, delay: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: accent, start: 'top 85%', toggleActions: 'play none none reverse' } }
      );
    }

    if (sub) {
      gsap.fromTo(sub,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out',
          scrollTrigger: { trigger: sub, start: 'top 88%', toggleActions: 'play none none reverse' } }
      );
    }

    if (btn) {
      gsap.fromTo(btn,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: btn, start: 'top 90%', toggleActions: 'play none none reverse' } }
      );
    }

    if (note) {
      gsap.fromTo(note,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: 'power2.out',
          scrollTrigger: { trigger: note, start: 'top 92%', toggleActions: 'play none none reverse' } }
      );
    }
  }

  /* ── Boot ── */
  agencyBootPromise = whenSiteLoaderReady({
    prefersReduced,
    isStale: function () { return id !== agencyRunId; },
  }).then(function () {
    if (id !== agencyRunId) return;

    var heroPrepared = prepareAgencyHero();
    revealSiteContent();
    playAgencyHeroEntrance(heroPrepared);

    initNav();
    initHowItWorks();
    initTemplates();
    initFeatures();
    initAgencyCta();

    ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (id === agencyRunId) ScrollTrigger.refresh();
      });
    }
  });

  return agencyBootPromise;
}
