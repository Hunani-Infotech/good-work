/**
 * Good Work scroll animations (GSAP + ScrollTrigger + Lenis)
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import {
  initLenis,
  destroyLenis,
  resetDocumentScrollState,
  refreshScrollTriggers,
} from './scrollRuntime.js';
import { initNavLinkHovers } from './navAnimations.js';

let resizeHandler = null;
let runId = 0;
let loaderTimeline = null;
let ctaFollowTicker = null;
let heroFxCleanup = null;

function stopHeroFx() {
  if (heroFxCleanup) {
    heroFxCleanup();
    heroFxCleanup = null;
  }
}

function stopCtaFollow() {
  if (ctaFollowTicker) {
    gsap.ticker.remove(ctaFollowTicker);
    ctaFollowTicker = null;
  }
}

export function destroyHomeAnimations() {
  runId += 1;
  stopCtaFollow();
  stopHeroFx();
  if (loaderTimeline) {
    loaderTimeline.kill();
    loaderTimeline = null;
  }
  var loader = document.querySelector('.container-loader');
  if (loader) {
    gsap.killTweensOf([
      loader,
      loader.querySelector('.orange-intro'),
      loader.querySelector('.grow-line'),
      loader.querySelector('.loader-intro'),
    ]);
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
  ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
  destroyLenis();
  resetDocumentScrollState({ keepSiteReady: true });
  var tooltip = document.querySelector('.cta-copy-tooltip');
  if (tooltip) {
    tooltip.classList.remove('is-visible');
    if (tooltip.parentNode === document.body) {
      tooltip.remove();
    }
  }
}

export function initHomeAnimations() {
  'use strict';

  destroyHomeAnimations();
  const id = runId;

  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create('osmo', '0.625, 0.05, 0, 1');
  gsap.defaults({ overwrite: 'auto', ease: 'osmo', duration: 0.6 });

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scrub = prefersReduced ? false : 1;
  var scrubSoft = prefersReduced ? false : 0.8;

  /* ── Lenis + ScrollTrigger sync ── */
  if (!prefersReduced) {
    initLenis();
  }

  /* ── Loader intro ── */
  function initLoader() {
    document.documentElement.classList.remove('site-ready');

    var loader = document.querySelector('.container-loader');
    if (!loader || prefersReduced) {
      if (loader) loader.style.display = 'none';
      document.documentElement.classList.add('site-ready');
      return Promise.resolve();
    }

    var overlay = loader.querySelector('.orange-intro');
    var line = loader.querySelector('.grow-line');
    var intro = loader.querySelector('.loader-intro');

    if (loaderTimeline) {
      loaderTimeline.kill();
      loaderTimeline = null;
    }

    gsap.killTweensOf([loader, overlay, line, intro]);
    gsap.set(loader, { display: 'flex', opacity: 1 });
    if (intro) gsap.set(intro, { opacity: 1, y: 0 });
    if (overlay) gsap.set(overlay, { opacity: 1 });
    if (!line) {
      document.documentElement.classList.add('site-ready');
      return Promise.resolve();
    }
    gsap.set(line, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      width: '2%',
      height: '1%',
      transformOrigin: '50% 50%'
    });

    return new Promise(function (resolve) {
      loaderTimeline = gsap.timeline({
        defaults: { ease: 'osmo' },
        onComplete: function () {
          if (id !== runId) {
            resolve();
            return;
          }
          loaderTimeline = null;
          gsap.set(loader, { display: 'none' });
          document.documentElement.classList.add('site-ready');
          resolve();
        }
      });

      loaderTimeline
        .to({}, { duration: 0.4 })
        .to(line, { width: '220vmax', height: '220vmax', duration: 1.1, ease: 'power3.inOut' }, 0.2)
        .to(intro, { opacity: 0, y: -12, duration: 0.35 }, 0.55)
        .to(overlay, { opacity: 0, duration: 0.45 }, 0.95)
        .to(loader, { opacity: 0, duration: 0.3 }, 1.15);
    });
  }

  /* ── Hero parallax exit + GoodWork entrance ── */
  function initHeroFx(hero) {
    if (!hero || prefersReduced) return;

    var heroFx = hero.querySelector('.hero-fx');

    var scrollPause = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      onUpdate: function (self) {
        hero.classList.toggle('hero-is-scrolling', self.progress > 0.02);
      },
      onLeave: function () {
        hero.classList.add('hero-is-scrolling');
        if (heroFx) heroFx.style.visibility = 'hidden';
      },
      onEnterBack: function () {
        hero.classList.remove('hero-is-scrolling');
        if (heroFx) heroFx.style.visibility = 'visible';
      },
    });

    heroFxCleanup = function () {
      scrollPause.kill();
      hero.classList.remove('hero-is-scrolling');
      if (heroFx) heroFx.style.visibility = '';
    };
  }

  function initHero() {
    var hero = document.querySelector('.wrapper-hero');
    var imgWrap = document.querySelector('.img-hero-wrapper');
    var content = document.querySelector('.conter-content-hero');
    var cont50 = document.querySelector('.wrapper-cont-50');
    if (!hero) return;

    gsap.set('.img-hero-wrapper', { visibility: 'visible' });

    if (hero.classList.contains('hero-goodwork')) {
      var logo = hero.querySelector('.hero-brand-logo, .hero-brand-lottie');
      var role = hero.querySelector('.hero-role');
      var heading = hero.querySelector('.hero-heading');
      var statement = hero.querySelector('.hero-statement');
      var scrollCue = hero.querySelector('.hero-scroll-cue');
      var orbs = hero.querySelectorAll('.hero-fx-orb');
      var sweep = hero.querySelector('.hero-fx-sweep');
      var profilePhoto = hero.querySelector('.hero-profile-photo');
      var ctaBtn = hero.querySelector('.hero-cta-btn');
      var headingWords = [];
      var statementWords = [];

      [logo, role, heading, statement, scrollCue, profilePhoto, ctaBtn, ...orbs, sweep].filter(Boolean).forEach(function (el) {
        gsap.set(el, { visibility: 'visible' });
      });

      if (heading) {
        headingWords = splitIntoGsapWords(heading, 'hero_split_word');
      }
      if (statement) {
        statementWords = splitIntoGsapWords(statement, 'hero_stmt_word');
      }

      if (prefersReduced) {
        if (logo) gsap.set(logo, { opacity: 1, y: 0, scale: 1 });
        if (role) gsap.set(role, { opacity: 1, y: 0, clipPath: 'none' });
        if (headingWords.length) gsap.set(headingWords, { opacity: 1, y: 0, rotateX: 0 });
        else if (heading) gsap.set(heading, { opacity: 1, y: 0 });
        if (statementWords.length) gsap.set(statementWords, { opacity: 1, y: 0, rotateX: 0 });
        else if (statement) gsap.set(statement, { opacity: 1, y: 0 });
        if (scrollCue) gsap.set(scrollCue, { opacity: 0.6 });
        orbs.forEach(function (orb) { gsap.set(orb, { opacity: 0.55, scale: 1 }); });
        if (sweep) gsap.set(sweep, { opacity: 0 });
        if (profilePhoto) gsap.set(profilePhoto, { opacity: 1, scale: 1, y: 0 });
        if (ctaBtn) gsap.set(ctaBtn, { opacity: 1, y: 0 });
      } else {
        if (imgWrap) gsap.set(imgWrap, { scale: 1.06 });
        orbs.forEach(function (orb, i) {
          gsap.set(orb, { opacity: 0, scale: 0.85 + i * 0.05 });
        });
        if (sweep) gsap.set(sweep, { opacity: 0 });
        if (profilePhoto) gsap.set(profilePhoto, { opacity: 0, scale: 0.72, y: 20 });
        if (logo) gsap.set(logo, { opacity: 0, y: 32, scale: 0.88, rotation: -8 });
        if (role) gsap.set(role, { opacity: 1, y: 12, clipPath: 'inset(0 100% 0 0)' });
        if (headingWords.length) {
          gsap.set(headingWords, { opacity: 0, y: '110%', rotateX: -40, transformOrigin: '50% 100%' });
        } else if (heading) {
          gsap.set(heading, { opacity: 0, y: 40 });
        }
        if (statementWords.length) {
          gsap.set(statementWords, { opacity: 0, y: '80%', rotateX: -20, transformOrigin: '50% 100%' });
        } else if (statement) {
          gsap.set(statement, { opacity: 0, y: 28 });
        }
        if (ctaBtn) gsap.set(ctaBtn, { opacity: 0, y: 18 });
        if (scrollCue) gsap.set(scrollCue, { opacity: 0, y: 10 });

        var enterTl = gsap.timeline({
          delay: 0.15,
          defaults: { ease: 'osmo' },
          onComplete: function () {
            initHeroFx(hero);
          },
        });

        if (imgWrap) {
          enterTl.to(imgWrap, {
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
          }, 0);
        }

        orbs.forEach(function (orb, i) {
          enterTl.to(orb, {
            opacity: 0.65 - i * 0.08,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
          }, 0.05 + i * 0.06);
        });

        if (sweep) {
          enterTl.fromTo(sweep,
            { opacity: 0, x: '-20%' },
            { opacity: 0.45, x: '20%', duration: 0.9, ease: 'power2.inOut' },
            0.35
          );
          enterTl.to(sweep, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.75);
        }

        if (profilePhoto) {
          enterTl.to(profilePhoto, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.72,
            ease: 'back.out(1.5)',
          }, 0.0);
        }

        if (logo) {
          enterTl.to(logo, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.9,
            ease: 'back.out(1.6)',
          }, 0.08);
        }

        if (role) {
          enterTl.to(role, {
            clipPath: 'inset(0 0% 0 0)',
            y: 0,
            duration: 0.75,
            ease: 'power3.inOut',
          }, 0.28);
        }

        if (headingWords.length) {
          enterTl.to(headingWords, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.75,
            stagger: { each: 0.04, from: 'start' },
            ease: 'power3.out',
          }, 0.22);
        } else if (heading) {
          enterTl.to(heading, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
          }, 0.22);
        }

        if (statementWords.length) {
          enterTl.to(statementWords, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.52,
            stagger: { each: 0.022, from: 'start' },
            ease: 'power3.out',
          }, 0.42);
        } else if (statement) {
          enterTl.to(statement, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
          }, 0.42);
        }

        if (ctaBtn) {
          enterTl.to(ctaBtn, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
          }, 0.56);
        }

        if (scrollCue) {
          enterTl.to(scrollCue, {
            opacity: 0.75,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
          }, 0.68);
        }
      }
    }

    var heroFx = hero.querySelector('.hero-fx');

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      },
    });

    if (imgWrap) {
      tl.fromTo(imgWrap,
        { y: '0%', scale: 1, opacity: 1 },
        { y: '28%', scale: 1.04, opacity: 0.55, ease: 'none' },
        0
      );
    }
    if (heroFx) {
      tl.fromTo(heroFx, { opacity: 1 }, { opacity: 0, ease: 'none' }, 0);
    }
    if (content) {
      tl.fromTo(content,
        { y: 0, opacity: 1, scale: 1 },
        { y: '-14vh', opacity: 0.2, scale: 0.94, ease: 'none' },
        0
      );
    }

    if (cont50) {
      gsap.fromTo(cont50,
        { y: 0 },
        {
          y: '-8vh',
          ease: 'none',
          scrollTrigger: {
            trigger: cont50,
            start: 'top 85%',
            end: 'top 45%',
            scrub: scrubSoft,
            invalidateOnRefresh: true
          }
        }
      );
    }
  }

  /* ── Click scroll text color fill ── */
  function initClickScroll() {
    var section = document.querySelector('.click-scroll-height');
    if (!section) return;

    var text = section.querySelector('.click-scroll-text');
    if (!text) return;

    /* ── Text: word-by-word color fill (scrubbed) ── */
    initWordColorFillScroll(text, section, {
      wordClassPrefix: 'cs_word',
      start: 'top 85%',
      end: 'bottom top',
      overlap: 0.22,
    });
  }

  function initServiceHeadline() {
    var headline = document.querySelector('.service-headline');
    if (!headline) return;

    gsap.set(headline, { visibility: 'visible' });
    initWordColorFillScroll(headline, headline.closest('.service-headline-wrapper') || headline, {
      start: 'top 85%',
      end: '+=1400',
      overlap: 0.22,
    });
  }

  function initServiceVideos() {
    document.querySelectorAll('.video-cont-p2.home').forEach(function (container) {
      var video = container.querySelector('video');
      if (!video) return;

      ScrollTrigger.create({
        trigger: container,
        start: 'top 90%',
        end: 'bottom 10%',
        onEnter: function () {
          video.play().catch(function () { /* autoplay policy */ });
        },
        onLeave: function () {
          video.pause();
        },
        onEnterBack: function () {
          video.play().catch(function () { /* autoplay policy */ });
        },
        onLeaveBack: function () {
          video.pause();
        },
      });
    });
  }

  /* ── Services: headline + image strip ── */
  function initServices() {
    initServiceHeadline();
    initServiceVideos();

    document.querySelectorAll('.service-wrapper').forEach(function (wrapper) {
      var title = wrapper.querySelector('.service-h2');
      var copy = wrapper.querySelector('.body-copy');
      var strip = wrapper.querySelector('.cont-imgs-service');
      var track = wrapper.querySelector('.cont-imgs-service-track');
      var masks = wrapper.querySelectorAll('.mask-img-service');
      var tilts = wrapper.querySelectorAll('.mask-img-service .mask-img-service-tilt');

      if (title) {
        gsap.set(title, { visibility: 'visible' });
        gsap.fromTo(title,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: title,
              start: 'top 88%',
              end: 'top 55%',
              scrub: scrubSoft,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      var textBlock = wrapper.querySelector('.cont-text-service');
      if (textBlock) {
        gsap.set(textBlock, { visibility: 'visible' });
        gsap.fromTo(textBlock,
          { y: 0 },
          {
            y: '1.5vw',
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: scrubSoft,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      if (copy) {
        gsap.set(copy, { visibility: 'visible' });
        gsap.fromTo(copy,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 70%',
              end: 'top 40%',
              scrub: scrubSoft,
            },
          }
        );
      }

      if (strip && tilts.length) {
        masks.forEach(function (mask) {
          gsap.set(mask, { visibility: 'visible' });
        });

        var cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: strip,
            start: 'top bottom',
            end: 'top 12%',
            scrub: scrubSoft,
            invalidateOnRefresh: true,
          },
        });

        if (track && track.scrollWidth > strip.clientWidth) {
          var travel = Math.max(0, track.scrollWidth - strip.clientWidth);
          cardTl.fromTo(track, { x: 0 }, { x: -travel, ease: 'none' }, 0);
        }

        var tiltFrom = { rotateX: 110, y: '8vw', scale: 1.1 };
        var tiltTo = { rotateX: 0, y: 0, scale: 1 };
        var tiltCount = tilts.length;
        var stagger = tiltCount > 1 ? 0.65 / (tiltCount - 1) : 0;

        tilts.forEach(function (tilt, i) {
          gsap.set(tilt, Object.assign({ transformOrigin: '50% 100%', force3D: true }, tiltFrom));
          cardTl.fromTo(
            tilt,
            tiltFrom,
            Object.assign({ ease: 'none', duration: 0.4 }, tiltTo),
            i * stagger
          );
        });
      }
    });
  }

  /* ── Work CTA — scroll-scrubbed split text + folder ── */
  function initWorkCta() {
    var section = document.querySelector('.work-cta-wrapper');
    if (!section) return;

    var letterW = section.querySelector('.work-letter-w');
    var letterRk = section.querySelector('.work-letter-rk');
    var words = section.querySelectorAll('.work-word');
    var content = section.querySelector('.work-cta-content-wrapper');
    var front = section.querySelector('.front-folder');
    var projects = section.querySelector('.projects-folder');
    var back = section.querySelector('.back-folder');

    gsap.set([letterW, letterRk, content, front, projects, back], { visibility: 'visible' });

    gsap.set(letterW, { x: '6vw', opacity: 0.28, scale: 0.9, rotateX: 18 });
    gsap.set(letterRk, { x: '-6vw', opacity: 0.28, scale: 0.9, rotateX: 18 });
    gsap.set(words, { y: '115%', opacity: 0, rotateX: -55 });
    gsap.set(content, { y: '5vw', xPercent: -50 });
    if (front) gsap.set(front, { rotateX: -32, transformOrigin: '50% 100%' });
    if (projects) gsap.set(projects, { y: '2.2vw', opacity: 0.45 });
    if (back) gsap.set(back, { y: '0.75vw', opacity: 0.7 });

    /* Live: work-cta-content-wrapper scrubs 5vw → -5vw (ST 3803–4258) */
    if (content) {
      gsap.fromTo(content,
        { xPercent: -50, y: '5vw' },
        {
          xPercent: -50,
          y: '-5vw',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            end: 'bottom 35%',
            scrub: scrubSoft,
            invalidateOnRefresh: true
          }
        }
      );
    }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: scrubSoft,
        invalidateOnRefresh: true,
      },
    });

    /* Letters start compressed toward O slot, then settle in the gap */
    tl.to(letterW, {
      x: '0vw',
      opacity: 1,
      scale: 1,
      rotateX: 0,
      ease: 'none'
    }, 0);

    tl.to(letterRk, {
      x: '0vw',
      opacity: 1,
      scale: 1,
      rotateX: 0,
      ease: 'none'
    }, 0);

    /* Copy lines reveal word-by-word (scrubbed, not one-shot fade) */
    words.forEach(function (word, i) {
      tl.to(word, {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        ease: 'none'
      }, 0.08 + i * 0.035);
    });

    /* Folder layer scrubs in place — keep baseline locked with W / rk */
    if (front) {
      tl.to(front, { rotateX: -6, ease: 'none' }, 0.1);
    }
    if (projects) {
      tl.to(projects, { y: 0, opacity: 1, ease: 'none' }, 0.14);
    }
    if (back) {
      tl.to(back, { y: 0, opacity: 1, ease: 'none' }, 0.08);
    }

    /* Exit phase — letters drift slightly apart, copy lifts away */
    tl.to(letterW, { x: '-2.5vw', opacity: 0.72, ease: 'none' }, 0.62);
    tl.to(letterRk, { x: '2.5vw', opacity: 0.72, ease: 'none' }, 0.62);
    words.forEach(function (word, i) {
      tl.to(word, { y: '-80%', opacity: 0, rotateX: 24, ease: 'none' }, 0.66 + i * 0.02);
    });

    /* Folder hover micro-interaction */
    var folder = section.querySelector('.folder-wrapper');
    if (folder && front) {
      folder.addEventListener('mouseenter', function () {
        gsap.to(front, { rotateX: 2, duration: 0.55, ease: 'osmo', overwrite: true });
        gsap.to(projects, { y: '-0.5vw', duration: 0.55, ease: 'osmo', overwrite: true });
      });
      folder.addEventListener('mouseleave', function () {
        gsap.to(front, { rotateX: -6, duration: 0.55, ease: 'osmo', overwrite: true });
        gsap.to(projects, { y: 0, duration: 0.55, ease: 'osmo', overwrite: true });
      });
    }
  }

  /* ── Benefits pinned narrative (matches live gsap_split_word flow) ── */
  function splitIntoGsapWords(el, classPrefix) {
    if (!el) return [];
    if (el.dataset.gsapSplit) {
      return Array.from(el.querySelectorAll('.gsap_split_word'));
    }

    el.dataset.gsapSplit = '1';
    var prefix = classPrefix || 'gsap_split_word';
    var chunks = el.innerHTML.split(/<br\s*\/?>/gi);

    el.innerHTML = chunks.map(function (chunk, chunkIndex) {
      var text = chunk.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (!text) return chunkIndex < chunks.length - 1 ? '<br>' : '';

      var wordIndex = 0;
      var wordHtml = text.split(' ').map(function (word) {
        wordIndex += 1;
        return '<span class="gsap_split_word ' + prefix + wordIndex + '">' + word + '</span>';
      }).join('');

      return chunkIndex < chunks.length - 1 ? wordHtml + '<br>' : wordHtml;
    }).join('');

    return Array.from(el.querySelectorAll('.gsap_split_word'));
  }

  /* Peach accent → #96908c grey — continuous scroll-linked color wave */
  function initWordColorFillScroll(el, trigger, options) {
    options = options || {};
    if (!el || !trigger) return;

    var words = splitIntoGsapWords(el, options.wordClassPrefix);
    if (!words.length) return;

    var fillColor = '#96908c';
    var accentColor = getComputedStyle(words[0]).color;
    var overlap = options.overlap != null ? options.overlap : 0.22;
    var span = 1 - overlap;
    var step = words.length > 1 ? span / (words.length - 1) : 1;

    if (prefersReduced) {
      gsap.set(words, { color: fillColor, opacity: 1 });
      return;
    }

    gsap.set(words, { color: accentColor, opacity: 1, willChange: 'color' });

    function applyProgress(progress) {
      words.forEach(function (word, i) {
        var local = (progress - i * step) / overlap;
        if (local <= 0) {
          word.style.color = accentColor;
        } else if (local >= 1) {
          word.style.color = fillColor;
        } else {
          word.style.color = gsap.utils.interpolate(accentColor, fillColor, local);
        }
      });
    }

    ScrollTrigger.create({
      trigger: trigger,
      start: options.start || 'top 85%',
      end: options.end || 'bottom top',
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        applyProgress(self.progress);
      },
      onRefresh: function (self) {
        applyProgress(self.progress);
      },
    });

    applyProgress(0);
  }

  function collectStep2Words(step2Root) {
    var words = [];

    ['.h2-benefit-1', '.h2-benefit-2'].forEach(function (sel) {
      var el = step2Root.querySelector(sel);
      if (el) words = words.concat(splitIntoGsapWords(el));
    });

    step2Root.querySelectorAll('.he-bulltet').forEach(function (el) {
      words = words.concat(splitIntoGsapWords(el));
    });

    return words;
  }

  function initBenefits() {
    var benefitsRoot = document.querySelector('.benefits-main-wrapper');
    var spacer1 = document.querySelector('.benefits-height-1step');
    var spacer2 = document.querySelector('.benefits-height-2step');
    var step1 = document.querySelector('.main-cont-step1');
    var step2 = document.querySelector('.main-cont-step2');
    if (!benefitsRoot || !step1 || !step2 || !spacer1 || !spacer2) return;

    var wrap1 = step1.querySelector('.text-wrapper-align-benefit:not(._2)');
    var wrap2 = step1.querySelector('.text-wrapper-align-benefit._2');
    var h1 = step1.querySelector('.h2-headline-step1-1');
    var h2 = step1.querySelector('.h2-headline-step1-2');
    var h3 = step1.querySelector('.h2-headline-step1-3');
    var line1 = step1.querySelector('.line.step1');
    var sil = step1.querySelector('.about-silhouette-img');
    var dark = document.querySelector('.about-dark-img');
    var light = document.querySelector('.about-light-img');
    var bgOverlay = document.querySelector('.benefits-bg-overlay');
    var line2 = step2.querySelector('.line-step2');
    var cta = step2.querySelector('.cont-cta-benefitc');
    var icons = step2.querySelectorAll('.check-icon');
    var lines = step2.querySelectorAll('.line-benefit');

    var step1Words1 = splitIntoGsapWords(h1);
    var step1Words2 = splitIntoGsapWords(h2);
    var taglineWords = splitIntoGsapWords(h3);
    var step2Words = collectStep2Words(step2);

    var scrubHead = prefersReduced ? false : 0.76;
    var scrubStep = prefersReduced ? false : 0.8;

    [step1, step2, h1, h2, h3, sil, dark, light, bgOverlay].forEach(function (el) {
      if (el) gsap.set(el, { visibility: 'visible' });
    });

    gsap.set(light, { opacity: 0, y: 0 });
    if (bgOverlay) gsap.set(bgOverlay, { opacity: 0 });
    gsap.set(wrap1, { x: '18%' });
    gsap.set(wrap2, { x: '-33%' });
    gsap.set(step1Words1, { opacity: 0 });
    gsap.set(step1Words2, { opacity: 0 });
    gsap.set(taglineWords, { opacity: 0 });
    gsap.set(step2Words, { opacity: 0 });
    gsap.set(sil, { opacity: 0, scale: 1.04 });
    gsap.set(line1, { width: '0%' });
    gsap.set(line2, { width: '0%' });
    gsap.set(lines, { width: '0%' });
    gsap.set(icons, { opacity: 0 });

    if (prefersReduced) {
      gsap.set(light, { opacity: 1 });
      if (bgOverlay) gsap.set(bgOverlay, { opacity: 0.62 });
      gsap.set([].concat(step1Words1, step1Words2, taglineWords, step2Words), { opacity: 1 });
      gsap.set([line1, line2].concat(Array.from(lines)), { width: '100%' });
      gsap.set(icons, { opacity: 1 });
      gsap.set(cta, { opacity: 1, y: 0 });
      if (wrap1) gsap.set(wrap1, { x: '-22%' });
      if (wrap2) gsap.set(wrap2, { x: '0%' });
      if (sil) gsap.set(sil, { opacity: 1, scale: 1 });
      return;
    }

    /* TL 1 — Good design / takes time (live: benefits-main-wrapper scrub 0.76) */
    var tlHead = gsap.timeline({
      scrollTrigger: {
        trigger: benefitsRoot,
        start: 'top bottom',
        end: 'bottom top',
        scrub: scrubHead,
        invalidateOnRefresh: true
      }
    });

    if (wrap1) {
      tlHead.fromTo(wrap1, { x: '18%' }, { x: '-22%', ease: 'none' }, 0);
    }
    step1Words1.forEach(function (word, i) {
      tlHead.to(word, { opacity: 1, ease: 'none' }, 0.04 + i * 0.07);
    });
    if (wrap2) {
      tlHead.fromTo(wrap2, { x: '-33%' }, { x: '0%', ease: 'none' }, 0.12);
    }
    step1Words2.forEach(function (word, i) {
      tlHead.to(word, { opacity: 1, ease: 'none' }, 0.16 + i * 0.07);
    });
    if (sil) tlHead.to(sil, { opacity: 1, scale: 1, ease: 'none' }, 0.35);
    if (line1) tlHead.to(line1, { width: '100%', ease: 'none' }, 0.48);

    /* TL 2 — tagline + bg crossfade (live: benefits-height-1step, scrub 0.76) */
    var tlTag = gsap.timeline({
      scrollTrigger: {
        trigger: spacer1,
        start: 'top bottom',
        end: 'bottom top',
        scrub: scrubHead,
        invalidateOnRefresh: true
      }
    });

    var tagCursor = 0;
    taglineWords.forEach(function (word) {
      tlTag.to(word, { opacity: 1, ease: 'none' }, tagCursor);
      tagCursor += 0.11;
    });

    if (dark) tlTag.to(dark, { opacity: 0, ease: 'none' }, 0);
    if (light) tlTag.to(light, { opacity: 1, ease: 'none' }, 0);
    if (bgOverlay) tlTag.to(bgOverlay, { opacity: 0.62, ease: 'none' }, 0);

    tlTag.to(step1Words1, { opacity: 0, ease: 'none', stagger: 0.02 }, 0.55);
    tlTag.to(step1Words2, { opacity: 0, ease: 'none', stagger: 0.02 }, 0.55);
    if (sil) tlTag.to(sil, { opacity: 0, ease: 'none' }, 0.65);

    /* TL 3 — step 2 word reveal while sticky image holds (live: benefits-height-2step, scrub 0.8) */
    var tlStep2 = gsap.timeline({
      scrollTrigger: {
        trigger: spacer2,
        start: 'top bottom',
        end: 'bottom top',
        scrub: scrubStep,
        invalidateOnRefresh: true
      }
    });

    if (step2Words.length) {
      tlStep2.to(step2Words, {
        opacity: 1,
        stagger: 0.007,
        ease: 'none'
      }, 0);
    }

    if (line2) tlStep2.to(line2, { width: '100%', ease: 'none' }, 0.12);
    if (icons.length) tlStep2.to(icons, { opacity: 1, stagger: 0.035, ease: 'none' }, 0.2);
    if (lines.length) tlStep2.to(lines, { width: '100%', stagger: 0.025, ease: 'none' }, 0.22);
    if (cta) {
      gsap.fromTo(cta,
        { opacity: 0, y: -5 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out',
          scrollTrigger: { trigger: cta, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    }
    if (light) tlStep2.to(light, { y: '10vw', ease: 'none' }, 0.92);
  }

  /* ── Main CTA + footer (live: 3× main-cta-wrapper + content-cta-wrapper) ── */
  function initCtaFooter() {
    var ctaWrap = document.querySelector('.main-cta-wrapper');
    var contentWrap = document.querySelector('.content-cta-wrapper');
    var footer = document.querySelector('.section.footer');
    if (!ctaWrap) return;

    gsap.set(['.heading-cta', '.body-copy-cta'], { visibility: 'visible' });
    gsap.set('.cta-button-wrapper .email-cta', { opacity: 0, visibility: 'visible' });
    gsap.set('.cta-button-wrapper .hover-main-cta', { height: '0%' });
    if (footer) gsap.set(footer, { y: '-20vw' });

    /* Phase 1 — CTA section enters (7287–8198) */
    var tlIntro = gsap.timeline({
      scrollTrigger: {
        trigger: ctaWrap,
        start: 'top bottom',
        end: 'center center',
        scrub: scrubSoft,
        invalidateOnRefresh: true
      }
    });

    tlIntro.fromTo('.heading-cta.main',
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, ease: 'none' },
      0
    );
    tlIntro.fromTo('.body-copy-cta',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, ease: 'none' },
      0.08
    );
    tlIntro.fromTo('.cta-button-wrapper .heading-cta:not(.main)',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, ease: 'none' },
      0.14
    );

    /* Phase 2 — content lockup (7343–7889) */
    if (contentWrap) {
      gsap.fromTo(contentWrap,
        { y: '6vh', opacity: 0.4 },
        {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: contentWrap,
            start: 'top 90%',
            end: 'top 45%',
            scrub: scrubSoft,
            invalidateOnRefresh: true
          }
        }
      );
    }

    /* Phase 3 — footer parallax reveal (7949–8906, footer -19.7vw → 0) */
    if (footer) {
      gsap.set(['.name-footer', footer], { visibility: 'visible' });
      gsap.fromTo(footer,
        { y: '-19.72vw' },
        {
          y: '0vw',
          ease: 'none',
          scrollTrigger: {
            trigger: ctaWrap,
            start: 'center center',
            end: 'bottom top',
            scrub: scrubSoft,
            invalidateOnRefresh: true
          }
        }
      );
      gsap.fromTo('.name-footer',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: 'top 95%',
            end: 'top 70%',
            scrub: scrubSoft
          }
        }
      );
    }
  }

  /* ── Nav theme (from inline script, kept here for order) ── */
  function initNavTheme() {
    var sections = document.querySelectorAll('[data-nav]');
    var navEls = document.querySelectorAll('.nav-brand-name, .nav-link-mobile, .nav-link, .nav-social-link');
    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var theme = entry.target.getAttribute('data-nav');
        navEls.forEach(function (el) {
          el.classList.toggle('is-peach', theme === 'peach');
        });
      });
    }, { rootMargin: '-50px 0px -90% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  function initCtaHovers() {
    document.querySelectorAll('.main-cont-button').forEach(function (link) {
      var first = link.querySelector('.icon-wrapper-cta-first');
      var last = link.querySelector('.icon-wrapper-cta');
      if (!first || !last) return;

      link.addEventListener('mouseenter', function () {
        gsap.to(first, { width: '2.8rem', rotation: 0, opacity: 1, duration: 0.8, ease: 'elastic.out(0.5, 0.3)', overwrite: true });
        gsap.to(last, { width: '0rem', rotation: -90, opacity: 0, duration: 0.2, ease: 'power2.out', overwrite: true });
      });
      link.addEventListener('mouseleave', function () {
        gsap.to(first, { width: '0rem', rotation: -90, opacity: 0, duration: 0.3, ease: 'power2.inOut', overwrite: true });
        gsap.to(last, { width: '2.8rem', rotation: 0, opacity: 1, duration: 0.8, ease: 'elastic.out(0.6, 0.3)', overwrite: true });
      });
    });
  }

  function initCuriousButton() {
    var btn = document.querySelector('.cont-click');
    var hint = document.querySelector('.click-hover-huh');
    if (!btn || !hint) return;

    hint.textContent = 'Who is a little curious?';

    btn.addEventListener('mouseenter', function () {
      hint.textContent = 'Who is a little curious?';
      gsap.fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.3, overwrite: true });
    });
    btn.addEventListener('mouseleave', function () {
      gsap.to(hint, { opacity: 0, duration: 0.3, overwrite: true });
    });
    btn.addEventListener('click', function () {
      hint.textContent = 'Another click!';
      if (typeof SplitText !== 'undefined') {
        var split = new SplitText(hint, { type: 'chars' });
        gsap.from(split.chars, { opacity: 0, stagger: 0.05, duration: 0.05, ease: 'power2.out', overwrite: 'auto' });
      } else {
        gsap.fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      }
    });
  }

  function initMainCtaHover() {
    var btn = document.querySelector('.cta-button-wrapper');
    var bar = btn && btn.querySelector('.hover-main-cta');
    var email = btn && btn.querySelector('.email-cta');
    var tooltip = (btn && btn.querySelector('.cta-copy-tooltip')) ||
      document.querySelector('.cta-copy-tooltip');
    if (!btn || !bar || !email || !tooltip) return;

    /* Fixed tooltip must live on <body> — parent scroll transforms break position:fixed */
    if (tooltip.parentNode !== document.body) {
      document.body.appendChild(tooltip);
    }
    gsap.set(tooltip, { clearProps: 'transform,x,y,left,top' });
    tooltip.style.transform = 'translate(-50%, -50%)';

    var emailText = email.textContent || '';
    var mouse = { x: 0, y: 0 };
    var tipPos = { x: 0, y: 0 };
    var hovering = false;

    var hoverTl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power2.out', overwrite: 'auto' }
    });

    hoverTl
      .to(bar, { height: '100%', duration: 0.6 }, 0)
      .to(email, { opacity: 1, duration: 0.35 }, 0.1);

    function setTooltipPosition(x, y) {
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }

    function startFollow() {
      if (ctaFollowTicker) return;
      ctaFollowTicker = function () {
        if (!hovering) return;
        var dt = 1 - Math.pow(1 - 0.22, gsap.ticker.deltaRatio());
        tipPos.x += (mouse.x - tipPos.x) * dt;
        tipPos.y += (mouse.y - tipPos.y) * dt;
        setTooltipPosition(tipPos.x, tipPos.y);
      };
      gsap.ticker.add(ctaFollowTicker);
    }

    function stopFollow() {
      stopCtaFollow();
    }

    btn.addEventListener('mouseenter', function (e) {
      hovering = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      tipPos.x = mouse.x;
      tipPos.y = mouse.y;
      setTooltipPosition(tipPos.x, tipPos.y);
      btn.classList.add('is-copy-hover');
      tooltip.classList.add('is-visible');
      tooltip.textContent = 'Copy my Email';
      startFollow();
      hoverTl.play();
    });

    btn.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    btn.addEventListener('mouseleave', function () {
      hovering = false;
      btn.classList.remove('is-copy-hover');
      tooltip.classList.remove('is-visible');
      stopFollow();
      hoverTl.reverse();
    });

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      navigator.clipboard.writeText(emailText);
      tooltip.textContent = 'Copied!';
      window.setTimeout(function () {
        if (hovering) tooltip.textContent = 'Copy my Email';
      }, 1400);
    });
  }

  /* initEmailCopy merged into initMainCtaHover */

  function prepBenefitsWords() {
    var step1 = document.querySelector('.main-cont-step1');
    var step2 = document.querySelector('.main-cont-step2');
    if (step1) {
      splitIntoGsapWords(step1.querySelector('.h2-headline-step1-1'));
      splitIntoGsapWords(step1.querySelector('.h2-headline-step1-2'));
      splitIntoGsapWords(step1.querySelector('.h2-headline-step1-3'));
    }
    if (step2) collectStep2Words(step2);
  }

  /* ── Work Preview section: cards reveal ── */
  function initWorkPreview() {
    var section = document.querySelector('.work-preview-section');
    if (!section) return;

    var tag = section.querySelector('.work-preview-tag');
    var headline = section.querySelector('.work-preview-headline');
    var cards = section.querySelectorAll('.work-preview-card');
    var cta = section.querySelector('.work-preview-cta');

    if (tag) gsap.set(tag, { visibility: 'visible' });
    if (headline) gsap.set(headline, { visibility: 'visible' });
    cards.forEach(function (c) { gsap.set(c, { visibility: 'visible' }); });
    if (cta) gsap.set(cta, { visibility: 'visible' });

    if (prefersReduced) {
      if (tag) gsap.set(tag, { opacity: 0.75 });
      if (headline) gsap.set(headline, { opacity: 1, y: 0 });
      cards.forEach(function (c) { gsap.set(c, { opacity: 1, y: 0 }); });
      if (cta) gsap.set(cta, { opacity: 1 });
      return;
    }

    if (tag) {
      gsap.fromTo(tag,
        { opacity: 0, y: 18 },
        { opacity: 0.75, y: 0, duration: 0.55, ease: 'power3.out',
          scrollTrigger: { trigger: tag, start: 'top 88%', toggleActions: 'play reverse play reverse' }
        }
      );
    }

    if (headline) {
      var headlineWords = splitIntoGsapWords(headline, 'wp_word');
      if (headlineWords.length) {
        gsap.set(headlineWords, { y: '100%', rotateX: -28, transformOrigin: '50% 100%', opacity: 1 });
        gsap.to(headlineWords, {
          y: 0,
          rotateX: 0,
          duration: 0.65,
          stagger: { each: 0.05, from: 'start' },
          ease: 'power3.out',
          scrollTrigger: { trigger: headline, start: 'top 85%', toggleActions: 'play reverse play reverse' },
        });
      } else {
        gsap.fromTo(headline,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
            scrollTrigger: { trigger: headline, start: 'top 85%', toggleActions: 'play reverse play reverse' }
          }
        );
      }
    }

    if (cards.length) {
      gsap.set(cards, { transformPerspective: 900 });
      cards.forEach(function (card) {
        gsap.fromTo(card,
          { opacity: 0, y: 60, rotateX: 20 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              end: 'top 40%',
              scrub: 0.8,
            },
          }
        );
      });
    }

    if (cta) {
      gsap.fromTo(cta,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
          scrollTrigger: { trigger: cta, start: 'top 90%', toggleActions: 'play reverse play reverse' }
        }
      );
    }
  }

  /* ── Narrative: masked line roll + tag clip-in + line draw ── */
  function initNarrativeRoll() {
    var section = document.querySelector('.narrative-section');
    if (!section) return;

    var tag = section.querySelector('.narrative-tag');
    var line = section.querySelector('.narrative-line');
    var paras = section.querySelectorAll('.narrative-para');

    if (tag) gsap.set(tag, { visibility: 'visible' });
    if (line) gsap.set(line, { visibility: 'visible' });
    paras.forEach(function (p) { gsap.set(p, { visibility: 'visible' }); });

    if (prefersReduced) {
      if (tag) gsap.set(tag, { opacity: 1, clipPath: 'inset(0 0% 0 0)' });
      if (line) gsap.set(line, { scaleX: 1 });
      paras.forEach(function (p) { gsap.set(p, { y: 0 }); });
      return;
    }

    /* Tag clips in from the left */
    if (tag) {
      gsap.set(tag, { clipPath: 'inset(0 100% 0 0)', opacity: 1 });
      gsap.to(tag, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.7,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top 84%',
          toggleActions: 'play none none none',
        },
      });
    }

    /* Divider line draws left → right */
    if (line) {
      gsap.set(line, { scaleX: 0 });
      gsap.to(line, {
        scaleX: 1,
        duration: 1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top 84%',
          toggleActions: 'play none none none',
        },
      });
    }

    /* Each paragraph: wrap in overflow:hidden mask, then roll up from y:110% */
    paras.forEach(function (para, i) {
      var mask = document.createElement('div');
      mask.className = 'narr-roll-mask';
      para.parentNode.insertBefore(mask, para);
      mask.appendChild(para);

      gsap.set(para, { y: '110%' });
      gsap.to(para, {
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        delay: i * 0.07,
        scrollTrigger: {
          trigger: mask,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  /* ── Expertise: staggered pill reveal ── */
  function initExpertise() {
    var section = document.querySelector('.expertise-section');
    if (!section) return;

    var headline = section.querySelector('.expertise-headline');
    var tag = section.querySelector('.expertise-tag');
    var categories = section.querySelectorAll('.expertise-category');

    if (tag) {
      gsap.set(tag, { visibility: 'visible' });
      if (prefersReduced) {
        gsap.set(tag, { opacity: 1 });
      } else {
        gsap.fromTo(tag,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
            scrollTrigger: { trigger: tag, start: 'top 88%', toggleActions: 'play none none none' }
          }
        );
      }
    }

    if (headline) {
      gsap.set(headline, { visibility: 'visible' });
      if (prefersReduced) {
        gsap.set(headline, { opacity: 1, y: 0 });
      } else {
        /* Word-level roll: each word rises up through overflow:hidden on the headline */
        var headlineWords = splitIntoGsapWords(headline, 'exp_word');
        if (headlineWords.length) {
          gsap.set(headlineWords, { y: '115%', rotateX: -22, transformOrigin: '50% 100%', opacity: 1 });
          gsap.to(headlineWords, {
            y: 0,
            rotateX: 0,
            duration: 0.75,
            stagger: { each: 0.07, from: 'start' },
            ease: 'back.out(1.35)',
            scrollTrigger: {
              trigger: headline,
              start: 'top 84%',
              toggleActions: 'play none none none',
            },
          });
        } else {
          gsap.fromTo(headline,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
              scrollTrigger: { trigger: headline, start: 'top 86%', toggleActions: 'play none none none' }
            }
          );
        }
      }
    }

    if (prefersReduced) {
      categories.forEach(function (cat) {
        gsap.set(cat, { visibility: 'visible' });
        gsap.set(cat.querySelectorAll('.expertise-pill'), { opacity: 1, y: 0, scale: 1 });
      });
      return;
    }

    categories.forEach(function (cat) {
      gsap.set(cat, { visibility: 'visible' });
      var pills = cat.querySelectorAll('.expertise-pill');
      gsap.fromTo(pills,
        { opacity: 0, y: 22, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: { each: 0.055, from: 'start' }, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: cat, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
  }

  function initScrollAnimations() {
    initHero();
    initClickScroll();
    initNarrativeRoll();
    initWorkPreview();
    initServices();
    initExpertise();
    initWorkCta();
    initBenefits();
    initCtaFooter();
    ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        ScrollTrigger.refresh();
      });
    }
  }

  document.documentElement.classList.add('w-mod-ix3');

  resizeHandler = function () {
    window.clearTimeout(resizeHandler._t);
    resizeHandler._t = window.setTimeout(refreshScrollTriggers, 150);
  };
  window.addEventListener('resize', resizeHandler);

  return initLoader().then(function () {
    if (id !== runId) return;
    prepBenefitsWords();
    initNavTheme();
    initNavLinkHovers();
    initMainCtaHover();
    initCtaHovers();
    initCuriousButton();
    initScrollAnimations();
    refreshScrollTriggers();
  });
}
