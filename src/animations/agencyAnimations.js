import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { initLenis, destroyLenis, resetDocumentScrollState } from './scrollRuntime.js';

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
  gsap.killTweensOf('*');
  ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
  destroyLenis();
  resetDocumentScrollState();
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

  document.documentElement.classList.add('site-ready');

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
    ScrollTrigger.create({
      start: 'top -60',
      onUpdate: function (self) {
        nav.classList.toggle('is-scrolled', self.scroll() > 60);
      },
    });
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
    var path = section.querySelector('.agency-how__path');
    var nodes = section.querySelectorAll('.agency-how__node');
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

    if (!path) return;
    var length = path.getTotalLength();
    if (!length || length < 10) return;

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(nodes, { scale: 0, transformOrigin: '50% 50%' });

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5,
      },
    });

    nodes.forEach(function (node, i) {
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
  }

  /* ── Template Showcase ── */
  function initTemplates() {
    var section = document.querySelector('.agency-templates');
    if (!section) return;

    var header = section.querySelector('.agency-section__header');
    var tag = section.querySelector('.agency-tag');
    var headline = section.querySelector('.agency-section__headline');
    var cards = section.querySelectorAll('.template-card');
    var scrollToggle = 'play reverse play reverse';

    if (tag) {
      gsap.fromTo(tag,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out',
          scrollTrigger: { trigger: header || tag, start: 'top 82%', toggleActions: scrollToggle } }
      );
    }

    if (headline) {
      var words = splitWords(headline);
      if (words.length) {
        gsap.fromTo(words,
          { opacity: 0, y: 28, rotateX: -20, transformOrigin: '50% 100%' },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.65,
            stagger: { each: 0.04 }, ease: 'power3.out',
            scrollTrigger: { trigger: header || headline, start: 'top 80%', toggleActions: scrollToggle } }
        );
      }
    }

    if (cards.length && !prefersReduced) {
      cards.forEach(function (card) {
        var preview = card.querySelector('.template-card__preview');
        var footer = card.querySelector('.template-card__footer');
        var action = card.querySelector('.template-card__action');
        var avatar = card.querySelector('.template-card__preview-avatar');
        var lines = card.querySelectorAll('.template-card__preview-line');
        var pill = card.querySelector('.template-card__preview-pill');
        var actionOpacity = action && action.tagName === 'A' ? 1 : 0.45;

        card.style.transformStyle = 'preserve-3d';
        card.style.perspective = '800px';

        gsap.fromTo(card,
          { opacity: 0, y: 72, rotateX: 16, scale: 0.9 },
          {
            opacity: 1, y: 0, rotateX: 0, scale: 1, ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 94%',
              end: 'top 48%',
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          }
        );

        if (preview) {
          gsap.fromTo(preview,
            { scale: 0.94 },
            {
              scale: 1, ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 46%',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        if (avatar) {
          gsap.fromTo(avatar,
            { scale: 0.5, opacity: 0 },
            {
              scale: 1, opacity: 1, ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                end: 'top 44%',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        lines.forEach(function (line, li) {
          gsap.fromTo(line,
            { scaleX: 0, opacity: 0.35 },
            {
              scaleX: 1, opacity: 1, ease: 'none', transformOrigin: 'left center',
              scrollTrigger: {
                trigger: card,
                start: 'top ' + (86 - li * 2) + '%',
                end: 'top ' + (42 - li * 2) + '%',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        if (pill) {
          gsap.fromTo(pill,
            { scaleX: 0, opacity: 0 },
            {
              scaleX: 1, opacity: 1, ease: 'none', transformOrigin: 'left center',
              scrollTrigger: {
                trigger: card,
                start: 'top 82%',
                end: 'top 40%',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        if (footer) {
          gsap.fromTo(footer,
            { opacity: 0, y: 18 },
            {
              opacity: 1, y: 0, ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top 86%',
                end: 'top 44%',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        if (action) {
          gsap.fromTo(action,
            { opacity: 0, y: 12 },
            {
              opacity: actionOpacity, y: 0, ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top 84%',
                end: 'top 42%',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        var qx = gsap.quickTo(card, 'rotateY', { duration: 0.4, ease: 'power2.out' });
        var qy = gsap.quickTo(card, 'rotateX', { duration: 0.4, ease: 'power2.out' });

        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          qx((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2) * 8);
          qy(-((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 5);
          card.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
          card.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
          card.classList.add('is-glowing');
        });

        card.addEventListener('mouseenter', function () {
          if (preview) gsap.to(preview, { scale: 1.04, duration: 0.5, ease: 'power2.out' });
          if (footer) gsap.to(footer, { y: -3, duration: 0.4, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', function () {
          qx(0); qy(0);
          card.classList.remove('is-glowing');
          if (preview) gsap.to(preview, { scale: 1, duration: 0.6, ease: 'power2.inOut' });
          if (footer) gsap.to(footer, { y: 0, duration: 0.5, ease: 'power2.inOut' });
        });
      });
    } else if (cards.length) {
      gsap.set(cards, { opacity: 1, y: 0, rotateX: 0, scale: 1 });
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
}
