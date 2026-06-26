import { useEffect, useRef, useState } from 'react';
import { useGerozContent } from '../../hooks/geroz/useGerozContent.js';

function getFitWidth(band) {
  if (!band) return 0;
  const styles = window.getComputedStyle(band);
  const padding =
    parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  return Math.max(0, band.clientWidth - padding);
}

function fitDisplayNameToWidth(band, heading) {
  if (!band || !heading) return;

  const available = getFitWidth(band);
  if (available <= 0) return;

  let low = 48;
  let high = 280;
  let best = low;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    heading.style.fontSize = `${mid}px`;

    if (heading.scrollWidth <= available) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  heading.style.fontSize = `${best}px`;
}

function FooterDisplayName({ text }) {
  const bandRef = useRef(null);
  const textRef = useRef(null);
  const hasRevealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const band = bandRef.current;
    if (!band || hasRevealedRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRevealedRef.current) return;
        hasRevealedRef.current = true;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: '0px' },
    );

    observer.observe(band);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const band = bandRef.current;
    const heading = textRef.current;
    if (!band || !heading) return undefined;

    const runFit = () => {
      window.requestAnimationFrame(() => fitDisplayNameToWidth(band, heading));
    };

    runFit();

    const resizeObserver = new ResizeObserver(runFit);
    resizeObserver.observe(band);

    window.addEventListener('resize', runFit);
    document.fonts?.ready?.then(runFit);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', runFit);
    };
  }, [text]);

  return (
    <div
      ref={bandRef}
      className="w-full max-w-full px-[clamp(2.5rem,6vw,5rem)] pt-16 pb-0 sm:pt-20"
    >
      <h2
        ref={textRef}
        className={`m-0 block w-full max-w-full whitespace-nowrap text-center font-serif leading-none tracking-[-0.05em] text-white transition-[opacity,transform] duration-700 will-change-[opacity,transform] ${
          revealed ? 'scale-100 opacity-100' : 'scale-[0.88] opacity-0'
        }`}
      >
        {text}
      </h2>
    </div>
  );
}

export default function GerozCvFooter() {
  const { footer } = useGerozContent();

  return (
    <footer className="relative overflow-hidden bg-lawyer-dark text-stone-300">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: 'var(--geroz-img-footer-bg)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[rgba(51,51,51,0.96)]"
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-6 px-4 pt-12 pb-6 sm:px-6 lg:px-8">
        <img
          src={footer.logoSrc}
          alt="GoodWork"
          width="151"
          height="37"
          className="block h-[clamp(1.75rem,5vw,2.25rem)] w-auto"
        />

        {footer.email ? (
          <a
            href={footer.emailHref}
            className="font-sans text-base font-medium text-white transition-colors hover:text-lawyer sm:text-lg"
          >
            {footer.email}
          </a>
        ) : null}
      </div>

      {footer.displayName ? <FooterDisplayName text={footer.displayName} /> : null}

      <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <p className="m-0 text-center font-sans text-sm text-white/80">
          Powered by GoodWork — © {new Date().getFullYear()} {footer.copyrightName}
        </p>
      </div>
    </footer>
  );
}
