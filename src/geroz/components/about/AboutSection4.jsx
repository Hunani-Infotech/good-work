import { useGerozContent } from '../../../hooks/geroz/useGerozContent.js';
import GerozEyebrow from '../../../components/geroz/GerozEyebrow.jsx';
import GerozLuxuryBackdrop from '../../../components/geroz/GerozLuxuryBackdrop.jsx';

function AboutDecorativeArrow() {
  return (
    <div
      className="pointer-events-none relative w-full max-w-[10.5rem] text-lawyer xl:max-w-[12rem]"
      aria-hidden="true"
    >
      <svg
        className="block h-auto w-full"
        viewBox="0 0 241 116"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="arrow-path"
          d="M2.40711 115.742C6.50746 36.6323 90.1951 -41.7371 112.306 36.697C126.105 85.6461 56.5141 32.8646 105.438 8.61389C144.577 -10.7866 206.595 20.1372 232.711 38.0243L207.256 41.9069C216.708 42.7768 236.174 43.9054 238.429 41.4607C240.683 39.0159 225.657 25.7998 217.862 19.4972"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.58"
        />
      </svg>
    </div>
  );
}

function NarrativeParagraph({ children, lead = false }) {
  if (!children) return null;

  return (
    <p
      className={
        lead
          ? 'm-0 font-serif text-[clamp(1.125rem,1.65vw,1.4375rem)] leading-[1.55] tracking-[-0.015em] text-stone-900'
          : 'm-0 font-sans text-[clamp(1rem,1.3vw,1.125rem)] leading-[1.85] text-stone-600'
      }
    >
      {children}
    </p>
  );
}

export default function AboutSection4() {
  const { about } = useGerozContent();

  return (
    <section id="about" className="relative overflow-hidden bg-white">
      <GerozLuxuryBackdrop variant="white" />

      <div className="geroz-container-wide relative z-[1] py-[clamp(5.5rem,10vw,9rem)]">
        <div className="mx-auto w-full max-w-[72rem]">
          {about.eyebrow ? (
            <div className="mb-[clamp(1.5rem,3vw,2.25rem)]">
              <GerozEyebrow>{about.eyebrow}</GerozEyebrow>
            </div>
          ) : null}

          <div className="grid grid-cols-1 items-start gap-[clamp(2.5rem,5vw,3.5rem)] lg:grid-cols-12 lg:gap-x-[clamp(2rem,4.5vw,4rem)]">
            <header className="lg:col-span-5">
              <div className="flex items-center gap-3.5">
                <span
                  className="block h-px w-[clamp(2.5rem,6vw,4.5rem)] bg-[linear-gradient(90deg,var(--color-lawyer),color-mix(in_srgb,var(--color-lawyer)_20%,transparent))]"
                  aria-hidden="true"
                />
                <span
                  className="block size-[0.35rem] shrink-0 rounded-full bg-lawyer shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-lawyer)_16%,transparent)]"
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-[clamp(1rem,1.8vw,1.35rem)] mb-0 max-w-[28rem] font-serif text-[clamp(2rem,4vw,3.125rem)] leading-[1.1] tracking-[-0.03em] text-stone-900">
                {about.heading}
              </h2>
            </header>

            <div className="relative lg:col-span-6 lg:col-start-7">
              <div
                className="pointer-events-none absolute -left-[clamp(5rem,10vw,8.25rem)] top-0 z-[1] hidden w-[10.5rem] lg:block xl:-left-[clamp(5.5rem,11vw,9rem)] xl:w-[12rem]"
                aria-hidden="true"
              >
                <AboutDecorativeArrow />
              </div>

              <div className="relative z-[2] flex max-w-[36rem] flex-col gap-[clamp(1.25rem,2.2vw,1.65rem)]">
                <NarrativeParagraph lead>{about.body}</NarrativeParagraph>
                <NarrativeParagraph>{about.extraParagraph}</NarrativeParagraph>
                <NarrativeParagraph>{about.thirdParagraph}</NarrativeParagraph>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
