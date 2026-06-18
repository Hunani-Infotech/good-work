/* Patches hero / loader branding for Nova Chen */
window.RNBrand = (function () {
    function patchHeroName() {
        var hero = document.querySelector('.jsx-692277681.root');
        if (!hero) return;

        var mid = hero.querySelector('span.jsx-692277681');
        if (mid) mid.textContent = 'OVA CHE';

        hero.querySelectorAll('span').forEach(function (span) {
            if (span.childNodes.length === 1 && span.textContent === 'R') {
                span.textContent = 'N';
            }
        });
    }

    function patchLoaderCopy() {
        var tagline = document.querySelector('.jsx-3409496563');
        if (tagline) {
            tagline.textContent = 'Clarity where money meets movement — designed to feel inevitable.';
        }

        var subtitleRow = document.querySelector('.jsx-4247984893 .top > div:nth-child(2)');
        if (subtitleRow && !subtitleRow.querySelector('.rn-role-line')) {
            var role = document.createElement('div');
            role.className = 'rn-role-line';
            role.textContent = 'Product designer — fintech & mobility';
            subtitleRow.appendChild(role);
        }
    }

    function patchNav() {
        var about = document.querySelector('a.jsx-2273992906 .label');
        if (about) about.textContent = 'Work';
        var aboutLink = document.querySelector('a.jsx-2273992906');
        if (aboutLink) aboutLink.setAttribute('data-cursor-label', 'Work');
    }

    function apply() {
        patchHeroName();
        patchLoaderCopy();
        patchNav();
    }

    return { apply: apply };
})();
