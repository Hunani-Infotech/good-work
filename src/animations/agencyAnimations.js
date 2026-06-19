import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { initLenis, destroyLenis, resetDocumentScrollState } from './scrollRuntime.js';
import { destroySiteLoader, initSiteLoader } from './loaderAnimations.js';

let agencyRunId = 0;
let agencyLiquidTl = null;
let agencyLiquidHoverCleanup = null;

function resetLiquidFilter() {
  var turbEl = document.getElementById('gw-turb');
  var dispEl = document.getElementById('gw-disp');
  var headline = document.querySelector('.agency-hero__headline');

  if (agencyLiquidTl) {
    agencyLiquidTl.kill();
    agencyLiquidTl = null;
  }

  if (agencyLiquidHoverCleanup) {
    agencyLiquidHoverCleanup();
    agencyLiquidHoverCleanup = null;
  }

  gsap.killTweensOf('#gw-turb, #gw-disp, .agency-hero__headline');

  if (turbEl) {
    turbEl.setAttribute('baseFrequency', '0.08 0.04');
    turbEl.setAttribute('seed', '5');
  }
  if (dispEl) dispEl.setAttribute('scale', '24');
  if (headline) gsap.set(headline, { clearProps: 'filter' });
}

function createLiquidController(headline) {
  var turbEl = document.getElementById('gw-turb');
  var dispEl = document.getElementById('gw-disp');
  if (!headline || !turbEl || !dispEl) return null;

  var state = { freqX: 0.08, freqY: 0.04, scale: 24 };

  function applyLiquidState() {
    turbEl.setAttribute('baseFrequency', state.freqX + ' ' + state.freqY);
    dispEl.setAttribute('scale', String(state.scale));
  }

  function setFilter(active) {
    if (active) gsap.set(headline, { filter: 'url(#gw-liquid)' });
    else gsap.set(headline, { clearProps: 'filter' });
  }

  return { state: state, applyLiquidState: applyLiquidState, setFilter: setFilter, turbEl: turbEl, dispEl: dispEl };
}

export function destroyAgencyAnimations() {
  agencyRunId += 1;
  resetLiquidFilter();
  destroySiteLoader();
  gsap.killTweensOf('*');
  ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
  destroyLenis();
  resetDocumentScrollState({ keepSiteReady: true });
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
  destroyAgencyAnimations();
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

  /* ── Liquid text on hero headline ── */
  function initLiquidText(headline) {
    if (!headline || prefersReduced) return;
    var liquid = createLiquidController(headline);
    if (!liquid) return;

    resetLiquidFilter();

    liquid.state.freqX = 0.08;
    liquid.state.freqY = 0.04;
    liquid.state.scale = 24;
    liquid.applyLiquidState();
    liquid.setFilter(true);

    agencyLiquidTl = gsap.timeline({ delay: 0.28 });
    agencyLiquidTl.to(liquid.state, {
      freqX: 0.002,
      freqY: 0.001,
      scale: 0,
      duration: 1.8,
      ease: 'power3.out',
      onUpdate: liquid.applyLiquidState,
      onComplete: function () {
        if (id !== agencyRunId) return;
        liquid.applyLiquidState();
        liquid.setFilter(false);
      },
    });
  }

  function initLiquidHover(headline) {
    if (!headline || prefersReduced) return;
    var liquid = createLiquidController(headline);
    if (!liquid) return;

    var hoverTl = null;
    var ambientTl = null;

    function killHoverTweens() {
      if (hoverTl) {
        hoverTl.kill();
        hoverTl = null;
      }
      if (ambientTl) {
        ambientTl.kill();
        ambientTl = null;
      }
    }

    function startLiquidHover() {
      if (id !== agencyRunId) return;
      killHoverTweens();
      if (agencyLiquidTl) {
        agencyLiquidTl.kill();
        agencyLiquidTl = null;
      }

      liquid.state.freqX = 0.08;
      liquid.state.freqY = 0.04;
      liquid.state.scale = 24;
      liquid.applyLiquidState();
      liquid.setFilter(true);

      hoverTl = gsap.timeline();
      hoverTl.to(liquid.state, {
        freqX: 0.003,
        freqY: 0.0015,
        scale: 6,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: liquid.applyLiquidState,
        onComplete: function () {
          if (id !== agencyRunId) return;
          ambientTl = gsap.timeline({ repeat: -1, yoyo: true });
          ambientTl.to(liquid.state, {
            scale: 8,
            duration: 2.4,
            ease: 'sine.inOut',
            onUpdate: liquid.applyLiquidState,
          });
          ambientTl.to(liquid.state, {
            freqX: 0.005,
            freqY: 0.0025,
            duration: 3.1,
            ease: 'sine.inOut',
            onUpdate: liquid.applyLiquidState,
          }, 0);
        },
      });
    }

    function stopLiquidHover() {
      if (id !== agencyRunId) return;
      killHoverTweens();

      hoverTl = gsap.to(liquid.state, {
        freqX: 0.002,
        freqY: 0.001,
        scale: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onUpdate: liquid.applyLiquidState,
        onComplete: function () {
          if (id !== agencyRunId) return;
          liquid.setFilter(false);
        },
      });
    }

    headline.addEventListener('mouseenter', startLiquidHover);
    headline.addEventListener('mouseleave', stopLiquidHover);

    agencyLiquidHoverCleanup = function () {
      headline.removeEventListener('mouseenter', startLiquidHover);
      headline.removeEventListener('mouseleave', stopLiquidHover);
      killHoverTweens();
    };
  }

  /* ── Hero entrance ── */
  function initAgencyHero() {
    var hero = document.querySelector('.agency-hero');
    if (!hero) return;

    var orbs = hero.querySelectorAll('.agency-hero__orb');
    var tag = hero.querySelector('.agency-tag');
    var headline = hero.querySelector('.agency-hero__headline');
    var sub = hero.querySelector('.agency-hero__sub');
    var ctas = hero.querySelectorAll('.agency-hero__ctas > *');
    var stats = hero.querySelector('.agency-hero__stats');
    var cards = hero.querySelectorAll('.mockup-card');

    if (prefersReduced) {
      gsap.set([tag, sub, stats, ...ctas, ...orbs, ...cards], { opacity: 1, y: 0, scale: 1 });
      gsap.set(headline, { opacity: 1 });
      return;
    }

    var words = splitWords(headline);

    gsap.set(orbs, { opacity: 0, scale: 0.7 });
    gsap.set(words, { opacity: 0, y: 22, rotateX: -15, transformOrigin: '50% 100%' });
    gsap.set(tag, { opacity: 0, y: 18 });
    gsap.set(sub, { opacity: 0, y: 22 });
    gsap.set(ctas, { opacity: 0, y: 16 });
    gsap.set(stats, { opacity: 0, y: 10 });
    gsap.set(cards, { opacity: 0, y: 55, scale: 0.88 });

    initLiquidText(headline);
    initLiquidHover(headline);

    var tl = gsap.timeline({ delay: 0.1, defaults: { ease: 'osmo' } });

    orbs.forEach(function (orb, i) {
      tl.to(orb, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' }, i * 0.18);
    });

    tl.to(tag, { opacity: 1, y: 0, duration: 0.55 }, 0.25);

    if (words.length) {
      tl.to(words, {
        opacity: 1, y: 0, rotateX: 0, duration: 0.65,
        stagger: { each: 0.038, from: 'start' },
        ease: 'power3.out',
      }, 0.38);
    }

    tl.to(sub, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.55);
    tl.to(ctas, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, 0.65);
    tl.to(stats, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.75);

    cards.forEach(function (card, i) {
      tl.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.3)' }, 0.42 + i * 0.12);
    });

    tl.eventCallback('onComplete', function () {
      if (id !== agencyRunId) return;
      cards.forEach(function (card, i) {
        gsap.to(card, {
          y: -12 + i * 6,
          duration: 2.8 + i * 0.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.35,
        });
      });

      orbs.forEach(function (orb, i) {
        gsap.to(orb, {
          x: (i % 2 === 0 ? 1 : -1) * (20 + i * 8),
          y: (i % 2 === 0 ? -1 : 1) * (15 + i * 5),
          duration: 6 + i * 1.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.5,
        });
      });
    });

    /* Hero parallax */
    var content = hero.querySelector('.agency-hero__content');
    var visual = hero.querySelector('.agency-hero__visual');
    gsap.to(content, {
      y: '-12vh',
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
    if (visual) {
      gsap.to(visual, {
        y: '-8vh',
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

    var headline = section.querySelector('.agency-cta__headline');
    var sub = section.querySelector('.agency-cta__sub');
    var btn = section.querySelector('.agency-cta .agency-btn-primary');

    if (headline) {
      var words = splitWords(headline);
      if (words.length) {
        gsap.fromTo(words,
          { opacity: 0, y: 28, rotateX: -20, transformOrigin: '50% 100%' },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.65,
            stagger: { each: 0.045 }, ease: 'power3.out',
            scrollTrigger: { trigger: headline, start: 'top 85%', toggleActions: 'play none none reverse' } }
        );
      }
    }

    if (sub) {
      gsap.fromTo(sub,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sub, start: 'top 88%', toggleActions: 'play none none reverse' } }
      );
    }

    if (btn) {
      gsap.fromTo(btn,
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: btn, start: 'top 88%', toggleActions: 'play none none reverse' } }
      );
    }
  }

  /* ── Boot ── */
  return initSiteLoader({
    prefersReduced,
    isStale: function () { return id !== agencyRunId; },
  }).then(function () {
    if (id !== agencyRunId) return;
    initNav();
    initAgencyHero();
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
}
