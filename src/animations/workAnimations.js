/**
 * Good Work work page — GSAP + ScrollTrigger + Lenis
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import {
  initLenis,
  destroyLenis,
  getLenis,
  resetDocumentScrollState,
  refreshScrollTriggers,
  syncScrollLayout,
  getScrollOffset,
} from './scrollRuntime.js';
import { initNavLinkHovers } from './navAnimations.js';
import { destroySiteLoader, initSiteLoader } from './loaderAnimations.js';

let resizeHandler = null;
let runId = 0;
let navScrollTimer = null;
let navCleanup = null;

export function destroyWorkAnimations() {
  runId += 1;
  if (navScrollTimer) {
    window.clearTimeout(navScrollTimer);
    navScrollTimer = null;
  }
  if (navCleanup) {
    navCleanup();
    navCleanup = null;
  }
  destroySiteLoader();
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
  ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
  destroyLenis();
  resetDocumentScrollState({ keepSiteReady: true });
  var headline = document.querySelector('.text-headline-work');
  if (headline && headline.dataset.gsapSplit) {
    delete headline.dataset.gsapSplit;
  }
}

export function initWorkAnimations() {
  'use strict';

  destroyWorkAnimations();
  const id = runId;

  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create('osmo', '0.625, 0.05, 0, 1');
  gsap.defaults({ overwrite: 'auto', ease: 'osmo', duration: 0.6 });

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scrubSoft = prefersReduced ? false : 0.8;

  var navScrolling = false;

  if (!prefersReduced) {
    initLenis();
  }

  function getProjectScrollTop(target) {
    var lenis = getLenis();
    var offset = getScrollOffset();
    if (lenis) {
      return target.getBoundingClientRect().top + lenis.scroll + offset;
    }
    return target.getBoundingClientRect().top + window.scrollY + offset;
  }

  function getScrollDuration(distance) {
    if (prefersReduced) return 0.01;
    return Math.min(3.4, Math.max(1.5, distance / 850));
  }

  function setActiveNavLink(links, id) {
    links.forEach(function (l) { l.classList.remove('is-active', 'w--current'); });
    links.forEach(function (l) {
      var href = l.getAttribute('href');
      if (href === '#' + id) {
        l.classList.add('is-active', 'w--current');
      }
    });

    var activeMobile = document.querySelector('.work-mobile-nav__link.is-active');
    if (activeMobile && typeof activeMobile.scrollIntoView === 'function') {
      activeMobile.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }

  function scrollToProject(target) {
    if (!target) return;

    syncScrollLayout();

    var lenis = getLenis();
    var offset = getScrollOffset();
    var current = lenis ? lenis.scroll : window.scrollY;
    var distance = Math.abs(getProjectScrollTop(target) - current);
    var duration = getScrollDuration(distance);

    navScrolling = true;
    clearTimeout(navScrollTimer);

    function onScrollComplete() {
      ScrollTrigger.update();
      navScrollTimer = window.setTimeout(function () {
        navScrolling = false;
      }, 400);
    }

    if (lenis) {
      lenis.scrollTo(target, {
        offset: offset,
        duration: duration,
        lock: true,
        easing: function (t) {
          return 1 - Math.pow(1 - t, 4);
        },
        onComplete: onScrollComplete,
      });
      return;
    }

    window.scrollTo({
      top: getProjectScrollTop(target),
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
    window.setTimeout(onScrollComplete, duration * 1000);
  }

  function initProjectNav() {
    var links = document.querySelectorAll('.link-wrapper-project');
    var projects = document.querySelectorAll('.main-project-wrapper[id]');
    if (!links.length || !projects.length) return;

    function onNavClick(e) {
      var link = e.target.closest('.link-wrapper-project');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;

      var id = href.slice(1);
      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      e.stopPropagation();

      setActiveNavLink(links, id);

      if (history.pushState) {
        history.pushState(null, '', '#' + id);
      }

      scrollToProject(target);
    }

    function onHashChange() {
      if (!location.hash) return;
      var target = document.querySelector(location.hash);
      if (!target) return;
      setActiveNavLink(links, location.hash.slice(1));
      scrollToProject(target);
    }

    document.addEventListener('click', onNavClick);
    window.addEventListener('hashchange', onHashChange);

    projects.forEach(function (project) {
      ScrollTrigger.create({
        trigger: project,
        start: 'top 62%',
        end: 'bottom 38%',
        onEnter: function () {
          if (navScrolling) return;
          setActiveNavLink(links, project.id);
        },
        onEnterBack: function () {
          if (navScrolling) return;
          setActiveNavLink(links, project.id);
        },
      });
    });

    navCleanup = function () {
      document.removeEventListener('click', onNavClick);
      window.removeEventListener('hashchange', onHashChange);
    };

    if (location.hash) {
      var initial = document.querySelector(location.hash);
      if (initial) {
        setActiveNavLink(links, location.hash.slice(1));
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            scrollToProject(initial);
          });
        });
      }
    }
  }

  function splitHeadline(el) {
    if (!el || el.dataset.gsapSplit) return;
    el.dataset.gsapSplit = '1';

    var prefix = el.querySelector('.text-span-6');
    var fullText = el.textContent.replace(/\s+/g, ' ').trim();
    var rest = prefix ? fullText.replace(prefix.textContent, '').trim() : fullText;
    var out = [];

    if (prefix) {
      out.push('<div class="gsap_split_line gsap_split_line1">' + prefix.outerHTML + '</div>');
    }

    if (rest) {
      var words = rest.split(' ').map(function (word, i) {
        return '<div class="gsap_split_word gsap_split_word' + (i + 1) + '" aria-hidden="true">' + word + '</div>';
      }).join('');
      out.push('<div class="gsap_split_line gsap_split_line2">' + words + '</div>');
    }

    el.innerHTML = out.join('');
  }

  function initLoader() {
    return initSiteLoader({
      prefersReduced,
      isStale: function () { return id !== runId; },
    });
  }

  function initHeadlineIntro() {
    var headline = document.querySelector('.text-headline-work');
    var folder = document.querySelector('.folder-work');
    if (!headline) return;

    splitHeadline(headline);

    var lines = headline.querySelectorAll('.gsap_split_line');
    var words = headline.querySelectorAll('.gsap_split_word');
    var prefix = headline.querySelector('.text-span-6');

    gsap.set([lines, words, folder], { visibility: 'visible' });
    gsap.set(lines, { y: 12, opacity: 0 });
    gsap.set(words, { opacity: 0 });
    if (prefix) gsap.set(prefix, { opacity: 0 });
    if (folder) gsap.set(folder, { y: 30, opacity: 0, rotation: -8 });

    if (prefersReduced) {
      gsap.set([lines, words, folder, prefix], { clearProps: 'all', opacity: 1, y: 0 });
      return;
    }

    var tl = gsap.timeline({ delay: 0.15 });
    if (prefix) {
      tl.to(prefix, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);
    }
    tl.to(lines, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, 0.1);
    tl.to(words, { opacity: 1, duration: 0.45, stagger: 0.03, ease: 'power2.out' }, 0.25);
    if (folder) {
      tl.to(folder, { y: 0, opacity: 1, rotation: 0, duration: 0.8, ease: 'power3.out' }, 0.35);
    }
  }

  function initMediaReveals() {
    var targets = document.querySelectorAll('.img-project, .video-cont-p2');
    if (!targets.length) return;

    targets.forEach(function (el, i) {
      gsap.set(el, {
        visibility: 'visible',
        clipPath: 'inset(100% 0 0 0)',
        opacity: el.classList.contains('hide') ? 0 : 1
      });

      if (prefersReduced) {
        gsap.set(el, { clipPath: 'inset(0% 0 0 0)' });
        return;
      }

      gsap.to(el, {
        clipPath: 'inset(0% 0 0 0)',
        ease: 'power3.out',
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end: 'top 55%',
          toggleActions: 'play none none none',
          once: true
        }
      });
    });
  }

  function initProjectCards() {
    document.querySelectorAll('.main-project-wrapper').forEach(function (card) {
      var content = card.querySelector('.cont-project-content');
      if (!content || prefersReduced) return;

      gsap.fromTo(content,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          duration: 0.9,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    });
  }

  function initCtaFooter() {
    var ctaWrap = document.querySelector('.main-cta-wrapper');
    var contentWrap = document.querySelector('.content-cta-wrapper');
    var footer = document.querySelector('.section.footer');
    if (!ctaWrap) return;

    var isMobileFooter = window.matchMedia('(max-width: 991px)').matches;
    var footerStartY = isMobileFooter ? '-6vw' : '-19.72vw';
    var nameFooterStartY = isMobileFooter ? 16 : 40;

    gsap.set(['.heading-cta', '.body-copy-cta', '.email-cta'], { visibility: 'visible' });

    if (prefersReduced) return;

    var tlIntro = gsap.timeline({
      scrollTrigger: {
        trigger: ctaWrap,
        start: 'top bottom',
        end: 'center center',
        scrub: scrubSoft,
        invalidateOnRefresh: true
      }
    });

    tlIntro.fromTo('.heading-cta.main', { y: 70, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0);
    tlIntro.fromTo('.body-copy-cta', { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.08);
    tlIntro.fromTo('.cta-button-wrapper .heading-cta:not(.main)', { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.14);

    if (contentWrap) {
      gsap.fromTo(contentWrap,
        { y: '6vh', opacity: 0.4 },
        {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: contentWrap,
            start: 'top 90%',
            end: 'top 45%',
            scrub: scrubSoft
          }
        }
      );
    }

    if (footer) {
      gsap.set(footer, { visibility: 'visible', y: footerStartY });
      gsap.set('.name-footer', { visibility: 'visible' });
      gsap.fromTo(footer,
        { y: footerStartY },
        {
          y: '0vw', ease: 'none',
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
        { y: nameFooterStartY, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.08, ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: isMobileFooter ? 'top 92%' : 'top 95%',
            end: isMobileFooter ? 'top 62%' : 'top 70%',
            scrub: scrubSoft,
            invalidateOnRefresh: true
          }
        }
      );
    }
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

  function initMainCtaHover() {
    var btn = document.querySelector('.cta-button-wrapper');
    if (!btn) return;
    var bar = btn.querySelector('.hover-main-cta');
    var email = btn.querySelector('.email-cta');
    var tooltip = btn.querySelector('.cta-copy-tooltip');
    if (!bar || !email) return;

    gsap.set(bar, { height: '0%' });
    gsap.set(email, { opacity: 0 });

    var hoverTl = gsap.timeline({ paused: true });
    hoverTl.to(bar, { height: '100%', duration: 0.6 }, 0).to(email, { opacity: 1, duration: 0.35 }, 0.1);

    btn.addEventListener('mouseenter', function () { hoverTl.play(); });
    btn.addEventListener('mouseleave', function () { hoverTl.reverse(); });
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      navigator.clipboard.writeText('hello@goodwork.asia');
    });
  }

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

  function initLazyVideos() {
    var videos = document.querySelectorAll('video.lazy-video');
    if (!videos.length || !('IntersectionObserver' in window)) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var video = entry.target;
        var dataSrc = video.querySelector('data-src');
        if (dataSrc) {
          var source = document.createElement('source');
          source.src = dataSrc.getAttribute('src');
          source.type = 'video/mp4';
          video.appendChild(source);
          video.load();
        }
        video.classList.remove('lazy-video');
        obs.unobserve(video);
      });
    }, { rootMargin: '200px' });

    videos.forEach(function (v) { obs.observe(v); });
  }

  function initScrollAnimations() {
    initHeadlineIntro();
    initMediaReveals();
    initProjectCards();
    initProjectNav();
    initCtaFooter();
    ScrollTrigger.refresh();
  }

  document.documentElement.classList.add('w-mod-ix3');

  resizeHandler = function () {
    refreshScrollTriggers();
  };
  window.addEventListener('resize', resizeHandler);

  return initLoader().then(function () {
    if (id !== runId) return;
    initNavTheme();
    initNavLinkHovers();
    initCtaHovers();
    initMainCtaHover();
    initLazyVideos();
    initScrollAnimations();
    refreshScrollTriggers();
  });
}
