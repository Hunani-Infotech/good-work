/* Hero entrance + scroll orchestration */
window.RNScroll = (function () {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var scrollRoot = null;
    var hasGsap = typeof gsap !== 'undefined';
    var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';

    function getScrollTop() {
        var lenis = typeof RNLenis !== 'undefined' ? RNLenis.get() : null;
        if (lenis) return lenis.scroll;
        return window.scrollY || document.documentElement.scrollTop || 0;
    }

    function onScroll() {
        var scrollTop = getScrollTop();
        if (scrollTop > 80) document.body.classList.add('rn-scrolled');
        var bgSpeed = (typeof RNMotion !== 'undefined' && RNMotion.PARALLAX_MAP) ? RNMotion.PARALLAX_MAP.bg : 0.3;
        document.body.style.setProperty('--rn-scroll-y', scrollTop * bgSpeed * 0.4 + 'px');
    }

    function initLenis() {
        scrollRoot = document.getElementById('rn-scroll');
        if (typeof RNLenis === 'undefined') {
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
            return;
        }
        var lenis = RNLenis.init(onScroll);
        if (lenis && hasST) RNLenis.proxyScrollTrigger();
        if (!lenis) {
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }
    }

    function initMotion() {
        scrollRoot = document.getElementById('rn-scroll');
        if (!scrollRoot || reducedMotion) return null;
        var motion = typeof RNMotion !== 'undefined' ? RNMotion.init() : null;
        if (motion && typeof RNCinematic !== 'undefined') {
            RNCinematic.init(scrollRoot, motion);
        }
        return motion;
    }

    function forceShowAll() {
        if (document.body.classList.contains('rn-cinematic-active')) return;
        document.body.classList.add('rn-ready', 'rn-scroll-active');
        var loaderScreen = document.querySelector('.jsx-750118319');
        var mainPanel = document.querySelector('.jsx-1903133491');
        if (loaderScreen) loaderScreen.classList.add('rn-loader-done');
        if (mainPanel) mainPanel.classList.add('rn-panel-revealed');
        document.querySelectorAll('[style*="opacity:0"]').forEach(function (el) {
            el.classList.add('rn-fade-in');
        });
        document.querySelectorAll('.jsx-765710943').forEach(function (el) {
            el.classList.add('rn-logo-revealed');
        });
        if (hasGsap) {
            gsap.set('[data-rn-reveal]:not([data-rn-scrub]), .rn-work-card:not([data-rn-scrub]), .rn-split-word:not([data-rn-scrub])', {
                clearProps: 'opacity,transform,visibility,clipPath'
            });
        }
    }

    function runEntrance() {
        document.body.classList.add('rn-scroll-active');

        var loaderBar = document.querySelector('.jsx-2555322975');
        var loaderScreen = document.querySelector('.jsx-750118319');
        var mainPanel = document.querySelector('.jsx-1903133491');
        var logoMask = document.querySelector('.jsx-765710943[style*="clip-path"]');
        var hiddenEls = document.querySelectorAll('[style*="opacity:0"][style*="translateY"]');

        if (hasGsap && !reducedMotion) {
            if (loaderBar) gsap.to(loaderBar, { height: '100%', duration: 1.4, ease: 'power2.inOut' });
            hiddenEls.forEach(function (el, i) {
                gsap.to(el, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 + i * 0.12, ease: 'power3.out' });
            });
            if (logoMask) {
                gsap.to(logoMask, { clipPath: 'inset(0 0 0 0)', duration: 1, delay: 0.3, ease: 'power3.inOut' });
            }
            var tl = gsap.timeline({ delay: 1.1 });
            tl.to(loaderScreen, { clipPath: 'inset(0 0 0 100%)', duration: 0.8, ease: 'power4.inOut' }, 0);
            tl.to(mainPanel, { clipPath: 'inset(0 0 0 0%)', duration: 0.9, ease: 'power4.inOut' }, 0.1);
            tl.call(function () {
                document.body.classList.add('rn-ready');
                if (hasST) ScrollTrigger.refresh();
            });
        } else {
            if (loaderBar) {
                loaderBar.style.transition = 'height 1.4s ease';
                requestAnimationFrame(function () { loaderBar.style.height = '100%'; });
            }
            hiddenEls.forEach(function (el, i) {
                setTimeout(function () { el.classList.add('rn-fade-in'); }, 200 + i * 100);
            });
            if (logoMask) setTimeout(function () { logoMask.classList.add('rn-logo-revealed'); }, 300);
            setTimeout(function () {
                if (loaderScreen) loaderScreen.classList.add('rn-loader-done');
                if (mainPanel) mainPanel.classList.add('rn-panel-revealed');
                document.body.classList.add('rn-ready');
            }, 1100);
        }
    }

    function tick(time) {
        var lenis = typeof RNLenis !== 'undefined' ? RNLenis.get() : null;
        if (lenis && !RNLenis.tickerBound) lenis.raf(time * 1000);
    }

    return {
        initLenis: initLenis,
        initMotion: initMotion,
        runEntrance: runEntrance,
        forceShowAll: forceShowAll,
        getScrollTop: getScrollTop,
        onScroll: onScroll,
        tick: tick
    };
})();
