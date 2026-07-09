import { useEffect } from 'react';

const HOVER_SELECTORS = 'a, button, [role="button"], label, input, textarea, .shooote-nav__social-link, .shooote-site-footer__social-link, .vcv-card, .vcv-card button';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function ShoooteCursor() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    const cursor = document.querySelector('.cursor');
    const cursorInner = document.querySelector('.cursor2');
    if (!cursor || !cursorInner) return undefined;

    let mouseX = 0;
    let mouseY = 0;
    let innerX = 0;
    let innerY = 0;
    let raf;

    function matchesHover(target) {
      return target && target.closest(HOVER_SELECTORS);
    }

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
    }

    function tick() {
      innerX = lerp(innerX, mouseX, 0.22);
      innerY = lerp(innerY, mouseY, 0.22);
      cursorInner.style.left = `${innerX}px`;
      cursorInner.style.top = `${innerY}px`;
      raf = requestAnimationFrame(tick);
    }

    function onDown() {
      cursor.classList.add('click');
      cursorInner.classList.add('cursorinnerhover');
    }

    function onUp() {
      cursor.classList.remove('click');
      cursorInner.classList.remove('cursorinnerhover');
    }

    function onMouseOver(e) {
      if (matchesHover(e.target)) cursor.classList.add('hover');
    }

    function onMouseOut(e) {
      if (!matchesHover(e.target)) return;
      if (!matchesHover(e.relatedTarget)) cursor.classList.remove('hover');
    }

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor" />
      <div className="cursor2" />
    </>
  );
}
