import { useEffect, useRef } from 'react';
import { useContent } from '../../../hooks/geroz/useContent.js';
import LuxuryBackdrop from './LuxuryBackdrop.jsx';
import SocialLinks from '../../../components/shared/SocialLinks.jsx';
import GoodWorkFooterBrand from '../../../components/shared/GoodWorkFooterBrand.jsx';

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

  let low = 28;
  let high = 88;
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
    <div ref={bandRef} className="gz-footer__name-band w-full max-w-full">
      <div className="mb-[clamp(0.75rem,1.5vw,1rem)] flex items-center justify-center gap-[clamp(0.75rem,2vw,1.25rem)]">
        <span
          className="gz-footer__accent-line h-px flex-1 max-w-[5.5rem] bg-[linear-gradient(90deg,transparent,var(--color-lawyer))]"
          aria-hidden="true"
        />
        <span
          className="gz-footer__accent-dot block size-[0.35rem] shrink-0 rounded-full bg-lawyer shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-lawyer)_18%,transparent)]"
          aria-hidden="true"
        />
        <span
          className="gz-footer__accent-line h-px flex-1 max-w-[5.5rem] bg-[linear-gradient(270deg,transparent,var(--color-lawyer))]"
          aria-hidden="true"
        />
      </div>

      <h2
        ref={textRef}
        className="gz-footer__name m-0 block w-full max-w-full whitespace-nowrap text-center font-serif leading-none tracking-[-0.05em] text-white"
      >
        {text}
      </h2>
    </div>
  );
}

export default function CvFooter() {
  const { footer, social } = useContent();

  return (
    <footer className="gz-footer relative overflow-hidden bg-black text-stone-300">
      <div
        className="gz-footer__bg pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.14]"
        style={{ backgroundImage: 'var(--geroz-img-footer-bg)' }}
        aria-hidden="true"
      />
      <div
        className="gz-footer__gradient pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,#1e1e1e_94%,transparent),#161616_98%)]"
        aria-hidden="true"
      />
      <LuxuryBackdrop
        variant="dark"
        washClass="gz-footer__backdrop-wash"
        noiseClass="gz-footer__backdrop-noise"
      />

      <div className="geroz-container-wide relative z-[1]">
        <div className="flex flex-col items-center px-4 py-[clamp(2rem,3.5vw,2.75rem)] text-center sm:px-6 lg:px-8">
          <GoodWorkFooterBrand
            surface="dark"
            copyrightName={footer.copyrightName}
            className="gz-footer__brand"
            logoClassName="gz-footer__logo"
          />

          <SocialLinks
            links={social}
            className="gz-footer__social mt-5 flex items-center justify-center gap-3"
            linkClassName="gz-footer__social-link"
            iconSize={16}
          />

          {footer.displayName ? (
            <div className="mt-[clamp(1.5rem,2.5vw,2rem)] w-full max-w-full border-t border-[color-mix(in_srgb,var(--color-lawyer)_20%,#2a2a2a)] pt-[clamp(1.25rem,2vw,1.75rem)]">
              <FooterDisplayName text={footer.displayName} />
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
