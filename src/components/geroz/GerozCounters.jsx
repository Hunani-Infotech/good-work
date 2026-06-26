import { useEffect, useRef, useState } from 'react';
import { GEROZ_TEMPLATE_IMAGES } from '../../data/geroz/constants.js';

const DEFAULT_COUNTERS = [
  { id: 1, value: 456, suffix: '+', label: 'Project Handover' },
  { id: 2, value: 280, suffix: 'k+', label: 'Happy Customers' },
  { id: 3, value: 88, suffix: '+', label: 'Award Winner' },
];

function easeOutCubic(progress) {
  return 1 - (1 - progress) ** 3;
}

function CounterItem({ value, suffix, label, duration = 2000 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimated) return;
        setHasAnimated(true);

        const startTime = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = easeOutCubic(progress);
          setDisplay(Math.round(value * eased));

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            setDisplay(value);
          }
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [duration, hasAnimated, value]);

  return (
    <div ref={ref} className="text-center lg:text-left">
      <p className="text-5xl font-semibold tracking-tight text-stone-100 md:text-6xl">
        {display}
        <span className="text-amber-500">{suffix}</span>
      </p>
      <p className="mt-3 text-sm uppercase tracking-widest text-stone-400">{label}</p>
    </div>
  );
}

export default function GerozCounters({
  counters = DEFAULT_COUNTERS,
  backgroundImage = GEROZ_TEMPLATE_IMAGES.counterBg,
}) {
  return (
    <section className="relative overflow-hidden bg-stone-900 py-20 lg:py-24">
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-stone-900/80" aria-hidden />
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid gap-12 border-stone-800 md:grid-cols-3 md:gap-8 md:divide-x md:divide-stone-800">
          {counters.map((counter) => (
            <div key={counter.id} className="md:px-8 first:md:pl-0 last:md:pr-0">
              <CounterItem
                value={counter.value}
                suffix={counter.suffix}
                label={counter.label}
                duration={counter.duration}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
