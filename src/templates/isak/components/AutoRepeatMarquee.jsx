import { useEffect, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';

export default function AutoRepeatMarquee({
  children,
  speed = 50,
  pauseOnHover = true,
  gap = 40,
  direction = 'left',
  className,
  repeat,
}) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [repeatCount, setRepeatCount] = useState(repeat || 1);

  const childrenCount = Array.isArray(children) ? children.length : 1;

  useEffect(() => {
    if (!repeat) {
      const updateRepeatCount = () => {
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const contentWidth = contentRef.current?.scrollWidth || 0;

        if (containerWidth && contentWidth) {
          const neededRepeat = Math.ceil(containerWidth / contentWidth) + 1;
          setRepeatCount(neededRepeat);
        }
      };

      updateRepeatCount();
      const resizeObserver = new ResizeObserver(updateRepeatCount);
      if (containerRef.current) resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }
    setRepeatCount(repeat);
  }, [childrenCount, repeat]);

  return (
    <div ref={containerRef} className={className}>
      <Marquee
        speed={speed}
        pauseOnHover={pauseOnHover}
        gradient={false}
        direction={direction}
      >
        {Array.from({ length: repeatCount }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? contentRef : null}
            style={{ display: 'flex', gap }}
          >
            {children}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
