import { useEffect, useState } from 'react';
import { getLenis, subscribeScroll } from '../../../animations/scrollRuntime.js';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return subscribeScroll((scrollTop) => setVisible(scrollTop > 1000));
  }, []);

  const scrollTop = (e) => {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.7 });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a
      href="#top"
      className={`back-to-top${visible ? ' is-visible' : ''}`}
      onClick={scrollTop}
      aria-label="Back to top"
    >
      <i className="ti-arrow-up" />
    </a>
  );
}
