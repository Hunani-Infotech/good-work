import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { getLenis, initLenis, destroyLenis } from './scrollRuntime.js';

function getSplitText() {
  if (typeof window !== 'undefined' && window.SplitText) {
    return window.SplitText;
  }
  return null;
}

let pluginsRegistered = false;
let cleanups = [];
let triggers = [];
let splitInstances = [];

function ensurePlugins() {
  if (pluginsRegistered) return;
  const SplitText = getSplitText();
  if (SplitText) gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);
  else gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  pluginsRegistered = true;
}

export function initIsakAnimations() {
  ensurePlugins();
  initLenis({ lerp: 0.08 });

  cleanups = [];
  triggers = [];
  splitInstances = [];

  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([data-bs-toggle])');
  const onAnchorNavigate = (event) => {
    const anchor = event.currentTarget;
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { offset: -132, duration: 1.1 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  anchorLinks.forEach((anchor) => anchor.addEventListener('click', onAnchorNavigate));
  cleanups.push(() => anchorLinks.forEach((anchor) => anchor.removeEventListener('click', onAnchorNavigate)));

  const SplitText = getSplitText();
  const splitEls = document.querySelectorAll('.split-text');
  splitEls.forEach((el) => {
    const inner = el.querySelector('p, a');
    const target = inner ?? el;
    const hasClass = (c) => el.classList.contains(c);

    if (!SplitText) {
      gsap.set(target, { opacity: 1 });
      gsap.fromTo(
        target,
        { opacity: 0, filter: hasClass('effect-blur-fade') ? 'blur(10px)' : 'blur(0px)', y: hasClass('effect-blur-fade') ? 20 : 0 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: target,
            start: 'top 86%',
            toggleActions: 'play none none none',
          },
        },
      );
      return;
    }

    const split = new SplitText(target, {
      type: 'words,chars',
      linesClass: 'split-line',
    });
    splitInstances.push(split);
    let setItems = split.chars;
    gsap.set(target, { opacity: 1, perspective: 400 });

    const settings = {
      scrollTrigger: {
        trigger: target,
        start: 'top 86%',
        toggleActions: 'play none none none',
      },
      duration: 0.9,
      stagger: 0.02,
      ease: 'power3.out',
    };

    if (hasClass('effect-fade')) settings.opacity = 0;

    if (hasClass('split-lines-transform') || hasClass('split-lines-rotation-x')) {
      split.revert();
      const lineSplit = new SplitText(target, {
        type: 'lines',
        linesClass: 'split-line',
      });
      splitInstances.push(lineSplit);
      setItems = lineSplit.lines;
      settings.opacity = 0;
      settings.stagger = 0.5;
      if (hasClass('split-lines-rotation-x')) {
        settings.rotationX = -120;
        settings.transformOrigin = 'top center -50';
      } else {
        settings.yPercent = 100;
        settings.autoAlpha = 0;
      }
    }

    if (hasClass('effect-blur-fade')) {
      split.revert();
      const lineSplit = new SplitText(target, {
        type: 'lines',
        linesClass: 'split-line',
      });
      splitInstances.push(lineSplit);
      gsap.fromTo(
        lineSplit.lines,
        { opacity: 0, filter: 'blur(10px)', y: 20 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: target,
            start: 'top 86%',
            toggleActions: 'play none none none',
          },
        },
      );
    } else {
      gsap.from(setItems, settings);
    }
  });

  document.querySelectorAll('.scrolling-effect').forEach((el) => {
    const delay = parseFloat(el.dataset.delay || '0');
    const settings = {
      scrollTrigger: {
        trigger: el,
        scrub: 3,
        toggleActions: 'play none none none',
        start: '30px bottom',
        end: 'bottom bottom',
        once: true,
      },
      duration: 0.8,
      ease: 'power3.out',
      delay,
    };

    if (el.classList.contains('effectRight')) {
      settings.opacity = 0;
      settings.x = 80;
    }
    if (el.classList.contains('effectLeft')) {
      settings.opacity = 0;
      settings.x = -80;
    }
    if (el.classList.contains('effectBottom')) {
      settings.opacity = 0;
      settings.y = 100;
    }
    if (el.classList.contains('effectTop')) {
      settings.opacity = 0;
      settings.y = -80;
    }
    if (el.classList.contains('effectZoomIn')) {
      settings.opacity = 0;
      settings.scale = 0.4;
    }
    gsap.from(el, settings);
  });

  document.querySelectorAll('.effectFade').forEach((el) => {
    const fromVars = { autoAlpha: 0 };
    const toVars = {
      autoAlpha: 1,
      duration: 1,
      ease: 'power3.out',
    };
    let wrapper = null;
    let startPush = 'top 96%';
    const delay = el.dataset.delay ? parseFloat(el.dataset.delay) : 0;
    toVars.delay = delay;

    if (el.classList.contains('fadeUp') && !el.classList.contains('no-div')) {
      wrapper = document.createElement('div');
      wrapper.classList.add('overflow-hidden');
      el.parentNode?.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }
    if (el.classList.contains('no-div')) wrapper = null;

    if (el.classList.contains('fadeUp')) {
      fromVars.y = 50;
      toVars.y = 0;
    } else if (el.classList.contains('fadeDown')) {
      fromVars.y = -50;
      toVars.y = 0;
    } else if (el.classList.contains('fadeLeft')) {
      fromVars.x = -50;
      toVars.x = 0;
    } else if (el.classList.contains('fadeRight')) {
      fromVars.x = 50;
      toVars.x = 0;
    } else if (el.classList.contains('fadeRotateX')) {
      fromVars.rotationX = 45;
      fromVars.yPercent = 100;
      fromVars.transformOrigin = 'top center -50';
      toVars.rotationX = 0;
      toVars.yPercent = 0;
      toVars.transformOrigin = 'top center -50';
      if (wrapper) wrapper.style.perspective = '400px';
    } else if (el.classList.contains('fadeZoom')) {
      fromVars.scale = 0.8;
      toVars.scale = 1;
    }

    if (el.classList.contains('view-visible')) startPush = 'top 101%';

    gsap.set(el, fromVars);
    const tween = gsap.to(el, {
      ...toVars,
      scrollTrigger: {
        trigger: el,
        start: startPush,
        toggleActions: 'play none none none',
      },
    });

    if (ScrollTrigger.isInViewport(el, 0.05)) {
      tween.progress(1);
    }
  });

  if (document.querySelector('.scroll-down')) {
    gsap.set('.prg-line', { height: '0%' });
    gsap.to('.prg-line', {
      height: '100%',
      duration: 2,
      ease: 'none',
      scrollTrigger: {
        trigger: '.scroll-down',
        start: 'top 40%',
        end: 'bottom 30%',
        scrub: true,
      },
    });
    document.querySelectorAll('.timeline-item').forEach((item) => {
      const t = ScrollTrigger.create({
        trigger: item,
        start: 'top 30%',
        onEnter: () => item.classList.add('active'),
        onLeaveBack: () => item.classList.remove('active'),
      });
      triggers.push(t);
    });
  }

  if (document.querySelector('.scribble-wrap')) {
    const path = document.getElementById('scribblePath');
    const svg = document.querySelector('.scribble');
    if (path && svg) {
      const len = path.getTotalLength();
      svg.style.setProperty('--len', String(len));
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            svg.classList.add('is-drawn');
            io.disconnect();
          }
        },
        { threshold: 0.2 },
      );
      io.observe(svg);
      cleanups.push(() => io.disconnect());
    }
  }

  const counterEls = document.querySelectorAll('.counter');
  if (document.body.classList.contains('counter-scroll') && counterEls.length) {
    const started = new WeakSet();
    const animateNumbers = (root) => {
      root.querySelectorAll('.number').forEach((numEl) => {
        const to = parseFloat(numEl.dataset.to || '0');
        const speed = parseFloat(numEl.dataset.speed || '1000');
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: speed / 1000,
          ease: 'power1.out',
          onUpdate: () => {
            numEl.textContent = String(Math.round(obj.v));
          },
        });
      });
    };
    counterEls.forEach((el) => {
      const t = ScrollTrigger.create({
        trigger: el,
        start: 'top 95%',
        once: true,
        onEnter: () => {
          if (started.has(el)) return;
          started.add(el);
          animateNumbers(el);
        },
      });
      triggers.push(t);

      if (ScrollTrigger.isInViewport(el, 0.05)) {
        if (!started.has(el)) {
          started.add(el);
          animateNumbers(el);
        }
      }
    });
  }

  document.querySelectorAll('.text-rotate .text').forEach((circularText) => {
    const text = 'award winning agency - since 2022 -';
    const chars = text.split('');
    const degree = 360 / chars.length;
    circularText.innerHTML = '';
    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transform = `rotate(${i * degree}deg)`;
      circularText.appendChild(span);
    });
  });

  const introSpans = document.querySelectorAll('.intro-title span');
  const checkActive = () => {
    introSpans.forEach((el) => {
      if (el.classList.contains('active')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
        setTimeout(() => el.classList.add('active'), 300);
      }
    });
  };
  if (introSpans.length) {
    window.addEventListener('scroll', checkActive);
    checkActive();
    cleanups.push(() => window.removeEventListener('scroll', checkActive));
  }

  const scrollLinks = document.querySelectorAll('a.scroll-link');
  const onScrollLink = () => {
    scrollLinks.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const scrollPos = window.scrollY;
      const top = scrollPos + rect.top;
      const bottom = top + target.offsetHeight;
      if (scrollPos < bottom - 20 && scrollPos >= top - 20) a.classList.add('active');
      else a.classList.remove('active');
    });
  };
  if (scrollLinks.length) {
    document.addEventListener('scroll', onScrollLink);
    onScrollLink();
    cleanups.push(() => document.removeEventListener('scroll', onScrollLink));
  }

  const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);
  cleanups.push(() => clearTimeout(refreshTimer));
}

export function destroyIsakAnimations() {
  cleanups.forEach((fn) => fn());
  triggers.forEach((t) => t.kill());
  splitInstances.forEach((s) => s.revert());
  ScrollTrigger.getAll().forEach((t) => t.kill());
  destroyLenis();
  cleanups = [];
  triggers = [];
  splitInstances = [];
}
