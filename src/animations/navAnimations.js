import gsap from 'gsap';

function splitNavLinkChars(link) {
  if (link.dataset.navSplit) return link.querySelectorAll('.nav-link-char');
  if (link.querySelector('.nav-link-text')) {
    link.dataset.navSplit = '1';
    return link.querySelectorAll('.nav-link-char');
  }

  var text = link.textContent.trim();
  if (!text) return [];

  link.innerHTML =
    '<span class="nav-link-text" aria-hidden="false">' +
    text.split('').map(function (char) {
      if (char === ' ') {
        return '<span class="nav-link-char-space">&nbsp;</span>';
      }
      return (
        '<span class="nav-link-char-wrap">' +
        '<span class="nav-link-char">' + char + '</span>' +
        '</span>'
      );
    }).join('') +
    '</span>';

  link.dataset.navSplit = '1';
  return link.querySelectorAll('.nav-link-char');
}

export function initNavLinkHovers() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var links = document.querySelectorAll('.nav-social-link, .nav-link, .nav-link-mobile');
  if (!links.length) return;

  links.forEach(function (link) {
    if (link.dataset.navHoverInit) return;

    var chars = splitNavLinkChars(link);
    if (!chars.length) return;

    link.dataset.navHoverInit = '1';
    gsap.set(chars, { yPercent: 0, opacity: 1 });

    link.addEventListener('mouseenter', function () {
      gsap.fromTo(
        chars,
        { yPercent: 115, opacity: 0.35 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.028,
          ease: 'power3.out',
          overwrite: true,
        }
      );
    });

    link.addEventListener('mouseleave', function () {
      gsap.to(chars, {
        yPercent: -115,
        opacity: 0.35,
        duration: 0.38,
        stagger: { each: 0.02, from: 'end' },
        ease: 'power2.in',
        overwrite: true,
        onComplete: function () {
          gsap.set(chars, { yPercent: 115, opacity: 0.35 });
          gsap.to(chars, {
            yPercent: 0,
            opacity: 1,
            duration: 0.42,
            stagger: 0.022,
            ease: 'power2.out',
            overwrite: true,
          });
        },
      });
    });
  });
}
