/* Motion tokens + utilities */
window.RNMotion = (function () {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var root = document.documentElement;

    var PARALLAX_MAP = { bg: 0.3, content: 1, fg: 1.15 };

    function num(token, fallback) {
        var v = parseFloat(getComputedStyle(root).getPropertyValue(token));
        return isNaN(v) ? fallback : v;
    }

    function px(token, fallback) {
        var raw = getComputedStyle(root).getPropertyValue(token).trim();
        if (!raw) return (fallback || 0) + 'px';
        if (raw.indexOf('em') !== -1 || raw.indexOf('px') !== -1 || raw.indexOf('vh') !== -1) return raw;
        return raw + 'px';
    }

    function ease(name) {
        var map = {
            cinematic: 'power4.out',
            scrub: 'none',
            hover: 'power3.out',
            enter: 'power3.out',
            exit: 'power2.in'
        };
        return map[name] || 'power3.out';
    }

    function scrubAmount(tight) {
        return tight ? num('--scrub-tight', 0.35) : num('--scrub-base', 0.55);
    }

    function init() {
        document.body.classList.add('rn-motion-active');
        return {
            reduced: reduced,
            num: num,
            px: px,
            ease: ease,
            scrubAmount: scrubAmount,
            PARALLAX_MAP: PARALLAX_MAP
        };
    }

    return {
        reduced: reduced,
        PARALLAX_MAP: PARALLAX_MAP,
        init: init,
        num: num,
        px: px,
        ease: ease,
        scrubAmount: scrubAmount
    };
})();
