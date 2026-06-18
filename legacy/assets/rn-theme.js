/* Full-page theme presets + switcher */
window.RNTheme = (function () {
    var STORAGE_KEY = 'rn-theme-id';

    var THEMES = {
        ledger: {
            id: 'ledger',
            label: 'Ledger',
            accent: '#B87333',
            accentHover: '#D4924A',
            accentRgb: '184, 115, 51',
            accentSecondary: '#3D7A7A',
            accentSecondarySoft: '#5A9E9E',
            accentSecondaryRgb: '61, 122, 122',
            bg: '#08090C',
            bgElevated: '#101218',
            surfaceRaised: '#161920',
            surfaceOverlay: 'rgba(8, 9, 12, 0.78)',
            textPrimary: '#EDEAE4',
            textSecondary: 'rgba(237, 234, 228, 0.58)',
            textTertiary: 'rgba(237, 234, 228, 0.38)',
            textPhilosophy: 'rgba(237, 234, 228, 0.88)',
            textAccent: '#D4B896',
            selection: '#acacac'
        },
        midnight: {
            id: 'midnight',
            label: 'Midnight',
            accent: '#4A7CFF',
            accentHover: '#6B96FF',
            accentRgb: '74, 124, 255',
            accentSecondary: '#8B9CB3',
            accentSecondarySoft: '#A8B8CC',
            accentSecondaryRgb: '139, 156, 179',
            bg: '#06080F',
            bgElevated: '#0C1018',
            surfaceRaised: '#121820',
            surfaceOverlay: 'rgba(6, 8, 15, 0.82)',
            textPrimary: '#E8ECF4',
            textSecondary: 'rgba(232, 236, 244, 0.58)',
            textTertiary: 'rgba(232, 236, 244, 0.38)',
            textPhilosophy: 'rgba(232, 236, 244, 0.88)',
            textAccent: '#B8C8E8',
            selection: '#8B9CB3'
        },
        signal: {
            id: 'signal',
            label: 'Signal',
            accent: '#E03E3E',
            accentHover: '#FF5C5C',
            accentRgb: '224, 62, 62',
            accentSecondary: '#F0A500',
            accentSecondarySoft: '#FFC247',
            accentSecondaryRgb: '240, 165, 0',
            bg: '#0A0908',
            bgElevated: '#141210',
            surfaceRaised: '#1C1A17',
            surfaceOverlay: 'rgba(10, 9, 8, 0.82)',
            textPrimary: '#F2EDE8',
            textSecondary: 'rgba(242, 237, 232, 0.58)',
            textTertiary: 'rgba(242, 237, 232, 0.38)',
            textPhilosophy: 'rgba(242, 237, 232, 0.88)',
            textAccent: '#F5C4A0',
            selection: '#F0A500'
        },
        verdant: {
            id: 'verdant',
            label: 'Verdant',
            accent: '#2D8B6F',
            accentHover: '#3AAF8C',
            accentRgb: '45, 139, 111',
            accentSecondary: '#C9A227',
            accentSecondarySoft: '#E0C060',
            accentSecondaryRgb: '201, 162, 39',
            bg: '#070B09',
            bgElevated: '#0E1411',
            surfaceRaised: '#151C18',
            surfaceOverlay: 'rgba(7, 11, 9, 0.82)',
            textPrimary: '#E6F0EB',
            textSecondary: 'rgba(230, 240, 235, 0.58)',
            textTertiary: 'rgba(230, 240, 235, 0.38)',
            textPhilosophy: 'rgba(230, 240, 235, 0.88)',
            textAccent: '#D4E8C8',
            selection: '#3AAF8C'
        }
    };

    function hexToRgb(hex) {
        var h = hex.replace('#', '');
        if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
        var n = parseInt(h, 16);
        return ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255);
    }

    function borderAccent(rgb) {
        return 'rgba(' + rgb + ', 0.32)';
    }

    function applyTheme(id) {
        var theme = THEMES[id] || THEMES.ledger;
        var root = document.documentElement;
        var rgb = theme.accentRgb || hexToRgb(theme.accent);

        root.dataset.theme = theme.id;
        root.style.setProperty('--rn-accent', theme.accent);
        root.style.setProperty('--rn-accent-hover', theme.accentHover);
        root.style.setProperty('--rn-accent-rgb', rgb);
        root.style.setProperty('--rn-accent-secondary', theme.accentSecondary);
        root.style.setProperty('--rn-accent-secondary-soft', theme.accentSecondarySoft);
        root.style.setProperty('--rn-accent-secondary-rgb', theme.accentSecondaryRgb);
        root.style.setProperty('--rn-bg', theme.bg);
        root.style.setProperty('--rn-bg-elevated', theme.bgElevated);
        root.style.setProperty('--rn-surface-raised', theme.surfaceRaised);
        root.style.setProperty('--rn-surface-overlay', theme.surfaceOverlay);
        root.style.setProperty('--rn-border-accent', borderAccent(rgb));
        root.style.setProperty('--rn-text-primary', theme.textPrimary);
        root.style.setProperty('--rn-text-secondary', theme.textSecondary);
        root.style.setProperty('--rn-text-tertiary', theme.textTertiary);
        root.style.setProperty('--rn-text-philosophy', theme.textPhilosophy);
        root.style.setProperty('--rn-text-accent', theme.textAccent);
        root.style.setProperty('--rn-gradient-progress', 'linear-gradient(90deg, ' + theme.accent + ', ' + theme.accentSecondarySoft + ')');
        root.style.setProperty('--rn-selection', theme.selection);
        root.style.setProperty('--accent', theme.accent);

        document.querySelectorAll('.rn-theme-swatch').forEach(function (btn) {
            var active = btn.getAttribute('data-theme-id') === theme.id;
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        var label = document.querySelector('.rn-theme-label');
        if (label) label.textContent = theme.label;

        patchHeroSvg(theme.accent);
        try { localStorage.setItem(STORAGE_KEY, theme.id); } catch (e) { /* ignore */ }

        document.dispatchEvent(new CustomEvent('rn-theme-change', { detail: theme }));
        return theme;
    }

    function patchHeroSvg(accent) {
        document.querySelectorAll('.jsx-4227867736').forEach(function (path) {
            path.setAttribute('fill', accent);
            path.setAttribute('stroke', accent);
        });
    }

    function buildSwitcher() {
        if (document.getElementById('rn-theme-switcher')) return;

        function makeSwatches(onPick) {
            var swatches = document.createElement('div');
            swatches.className = 'rn-theme-swatches';
            Object.keys(THEMES).forEach(function (key) {
                var t = THEMES[key];
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'rn-theme-swatch';
                btn.setAttribute('data-theme-id', t.id);
                btn.setAttribute('data-cursor', 'button');
                btn.setAttribute('data-cursor-label', t.label + ' theme');
                btn.setAttribute('aria-label', t.label + ' theme');
                btn.setAttribute('aria-pressed', 'false');
                btn.style.setProperty('--swatch-color', t.accent);
                btn.style.setProperty('--swatch-secondary', t.accentSecondary);
                btn.addEventListener('click', function () { onPick(t.id); });
                swatches.appendChild(btn);
            });
            return swatches;
        }

        var nav = document.querySelector('.jsx-2226019884');
        if (nav) {
            var navWrap = document.createElement('div');
            navWrap.id = 'rn-theme-switcher';
            navWrap.className = 'rn-theme-switcher rn-theme-switcher--nav';
            navWrap.setAttribute('role', 'group');
            navWrap.setAttribute('aria-label', 'Color theme');
            var label = document.createElement('span');
            label.className = 'rn-theme-label';
            label.textContent = (THEMES[document.documentElement.dataset.theme] || THEMES.ledger).label;
            navWrap.appendChild(label);
            navWrap.appendChild(makeSwatches(applyTheme));
            nav.appendChild(navWrap);
        }

        var float = document.createElement('div');
        float.id = 'rn-theme-float';
        float.className = 'rn-theme-float';
        float.setAttribute('role', 'group');
        float.setAttribute('aria-label', 'Color theme');
        float.appendChild(makeSwatches(applyTheme));
        document.body.appendChild(float);

        document.querySelectorAll('.rn-theme-swatch').forEach(function (btn) {
            var active = btn.getAttribute('data-theme-id') === document.documentElement.dataset.theme;
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', buildSwitcher);
        } else {
            buildSwitcher();
        }
    }

    function getAccent() {
        return getComputedStyle(document.documentElement).getPropertyValue('--rn-accent').trim() || '#B87333';
    }

    function getBg() {
        return getComputedStyle(document.documentElement).getPropertyValue('--rn-bg').trim() || '#08090C';
    }

    return {
        THEMES: THEMES,
        init: init,
        applyTheme: applyTheme,
        getAccent: getAccent,
        getBg: getBg
    };
})();

(function () {
    var saved = null;
    try { saved = localStorage.getItem('rn-theme-id'); } catch (e) { /* ignore */ }
    if (typeof RNTheme !== 'undefined') {
        RNTheme.applyTheme(saved && RNTheme.THEMES[saved] ? saved : 'ledger');
    }
})();
