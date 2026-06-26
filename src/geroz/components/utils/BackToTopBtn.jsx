import { useEffect, useRef, useState } from 'react';
import { getLenis, subscribeScroll } from '../../../animations/scrollRuntime.js';

export default function BackToTopBtn() {
  const scrollPathRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scrollPath = scrollPathRef.current;
    if (!scrollPath) return undefined;

    const pathLength = scrollPath.getTotalLength();
    scrollPath.style.transition = 'none';
    scrollPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    scrollPath.style.strokeDashoffset = String(pathLength);
    scrollPath.getBoundingClientRect();
    scrollPath.style.transition = 'stroke-dashoffset 10ms linear';

    const updateScroll = (scrollTop) => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? scrollTop / height : 0;
      scrollPath.style.strokeDashoffset = String(pathLength - progress * pathLength);
      setVisible(scrollTop > 1000);
    };

    updateScroll(window.scrollY);
    return subscribeScroll(updateScroll);
  }, []);

  const scrollTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.7 });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={scrollTop}
      className={`gz-back-to-top fixed right-7 bottom-[110px] z-[999] flex size-[50px] items-center justify-center rounded-full border-0 bg-transparent p-0 text-lawyer shadow-none outline-none transition-[opacity,transform,background-color,bottom,top,right,color] duration-300 ease-out [-webkit-tap-highlight-color:transparent] hover:bg-black/5 max-lg:right-[max(16px,env(safe-area-inset-right))] max-lg:bottom-[max(110px,calc(96px+env(safe-area-inset-bottom)))] max-lg:size-10 ${
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <svg
        className="pointer-events-none absolute inset-0 size-full -rotate-90"
        viewBox="-1 -1 102 102"
        aria-hidden="true"
      >
        <path
          ref={scrollPathRef}
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>
      <svg
        className="relative size-[18px] text-lawyer"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
