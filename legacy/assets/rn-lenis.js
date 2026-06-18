/* Inertia-based smooth scroll + ScrollTrigger proxy */
window.RNLenis = (function () {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var instance = null;
    var tickerBound = false;

    var CONFIG = {
        lerp: 0.062,
        wheelMultiplier: 0.82,
        touchMultiplier: 1.35,
        smoothWheel: true,
        smoothTouch: false,
        syncTouch: false,
        syncTouchLerp: 0.075,
        touchInertiaMultiplier: 18,
        infinite: false
    };

    function init(onScroll) {
        if (reduced || typeof Lenis === 'undefined') return null;
        try {
            instance = new Lenis(CONFIG);
            if (onScroll) instance.on('scroll', onScroll);
            return instance;
        } catch (e) {
            return null;
        }
    }

    function proxyScrollTrigger() {
        if (!instance || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.scrollerProxy(document.documentElement, {
            scrollTop: function (value) {
                if (arguments.length) instance.scrollTo(value, { immediate: true });
                return instance.scroll;
            },
            getBoundingClientRect: function () {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            }
        });
        instance.on('scroll', ScrollTrigger.update);
        ScrollTrigger.addEventListener('refresh', function () { instance.resize(); });

        if (!tickerBound) {
            gsap.ticker.add(function (time) { instance.raf(time * 1000); });
            gsap.ticker.lagSmoothing(0);
            tickerBound = true;
        }
    }

    function get() { return instance; }

    return { init: init, proxyScrollTrigger: proxyScrollTrigger, get: get, CONFIG: CONFIG, get tickerBound() { return tickerBound; } };
})();
