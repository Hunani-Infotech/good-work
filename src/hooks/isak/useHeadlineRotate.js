import { useEffect } from 'react';

export function useHeadlineRotate() {
  useEffect(() => {
    const animationDelay = 2500;
    const revealDuration = 600;
    const revealAnimationDelay = 1500;

    const headlines = document.querySelectorAll('.animationtext');
    if (!headlines.length) return;

    const timers = [];
    const wrappers = [];

    const animateWidth = (el, target, duration, done) => {
      const start = performance.now();
      const from = el.getBoundingClientRect().width;
      const step = (t) => {
        const p = Math.min(1, (t - start) / duration);
        const ease = 1 - Math.pow(1 - p, 3);
        el.style.width = from + (target - from) * ease + 'px';
        if (p < 1) requestAnimationFrame(step);
        else done?.();
      };
      requestAnimationFrame(step);
    };

    const switchWord = (oldWord, newWord) => {
      oldWord.classList.remove('is-visible');
      oldWord.classList.add('is-hidden');
      newWord.classList.remove('is-hidden');
      newWord.classList.add('is-visible');
    };

    const takeNext = (word) => {
      if (word.nextElementSibling) return word.nextElementSibling;
      return word.parentElement.firstElementChild;
    };

    const hideWord = (word) => {
      const next = takeNext(word);
      const headline = word.closest('.animationtext');
      if (!headline) return;
      if (headline.classList.contains('clip')) {
        const wrapper = word.closest('.cd-words-wrapper');
        if (!wrapper) return;
        animateWidth(wrapper, 2, revealDuration, () => {
          switchWord(word, next);
          showWord(next);
        });
      } else {
        switchWord(word, next);
        timers.push(setTimeout(() => hideWord(next), animationDelay));
      }
    };

    const showWord = (word) => {
      const headline = word.closest('.animationtext');
      if (!headline) return;
      if (headline.classList.contains('clip')) {
        const wrapper = word.closest('.cd-words-wrapper');
        if (!wrapper) return;
        const newWidth = word.getBoundingClientRect().width + 10;
        animateWidth(wrapper, newWidth, revealDuration, () => {
          timers.push(setTimeout(() => hideWord(word), revealAnimationDelay));
        });
      }
    };

    headlines.forEach((headline) => {
      if (headline.classList.contains('clip')) {
        const wrapper = headline.querySelector('.cd-words-wrapper');
        if (wrapper) {
          const newWidth = wrapper.getBoundingClientRect().width + 10;
          wrappers.push({ el: wrapper, initialWidth: wrapper.style.width });
          wrapper.style.width = newWidth + 'px';
        }
      } else {
        const words = headline.querySelectorAll('.cd-words-wrapper .item-text');
        let width = 0;
        words.forEach((w) => {
          const rect = w.getBoundingClientRect();
          if (rect.width > width) width = rect.width;
        });
        const wrap = headline.querySelector('.cd-words-wrapper');
        if (wrap) {
          wrappers.push({ el: wrap, initialWidth: wrap.style.width });
          wrap.style.width = width + 'px';
        }
      }
      const first = headline.querySelector('.is-visible');
      if (first) timers.push(setTimeout(() => hideWord(first), animationDelay));
    });

    return () => {
      timers.forEach(clearTimeout);
      wrappers.forEach(({ el, initialWidth }) => {
        el.style.width = initialWidth;
      });
    };
  }, []);
}
