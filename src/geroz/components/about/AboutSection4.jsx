import { useGerozContent } from '../../../hooks/geroz/useGerozContent.js';
import GerozEyebrow from '../../../components/geroz/GerozEyebrow.jsx';
import GerozLuxuryBackdrop from '../../../components/geroz/GerozLuxuryBackdrop.jsx';
import GerozScrollTextReveal from '../../../components/geroz/GerozScrollTextReveal.jsx';

function AboutDecorativeArrow() {
  return (
    <div
      className="gz-about__arrow pointer-events-none relative w-full max-w-[8rem] text-lawyer xl:max-w-[9.5rem]"
      aria-hidden="true"
    >
      <svg
        className="block h-auto w-full"
        viewBox="0 0 241 116"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="gz-about__arrow-path arrow-path"
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

function NarrativeParagraph({ text, lead = false }) {
  if (!text) return null;

  return (
    <GerozScrollTextReveal
      as="p"
      text={text}
      className={`gz-about__para gz-about__text-reveal ${
        lead ? 'gz-about__para--lead gz-about__text-reveal--lead' : 'gz-about__para--body gz-about__text-reveal--body'
      } ${
        lead
          ? 'm-0 font-serif text-[clamp(1.125rem,1.65vw,1.4375rem)] leading-[1.55] tracking-[-0.015em]'
          : 'm-0 font-sans text-[clamp(1rem,1.3vw,1.125rem)] leading-[1.85]'
      }`}
    />
  );
}

export default function AboutSection4() {
  const { about } = useGerozContent();

  return (
    <section id="about" className="gz-about relative overflow-hidden">
      {about.backgroundImage ? (
        <>
          <div
            className="gz-about__photo-bg pointer-events-none absolute inset-x-0 top-0 h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${about.backgroundImage})` }}
            aria-hidden="true"
          />
          <div
            className="gz-about__scrim pointer-events-none absolute inset-0 bg-[linear-gradient(128deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.9)_42%,color-mix(in_srgb,#fff_88%,var(--color-lawyer))_100%)]"
            aria-hidden="true"
          />
        </>
      ) : null}

      <GerozLuxuryBackdrop
        variant="white"
        washClass="gz-about__backdrop-wash"
        noiseClass="gz-about__backdrop-noise"
      />

      <div className="geroz-container-wide relative z-[1] pt-[clamp(2.5rem,5vw,4rem)] pb-[clamp(4rem,7vw,6rem)]">
        <div className="mx-auto w-full max-w-[72rem]">
          {about.eyebrow ? (
            <div className="gz-about__eyebrow mb-[clamp(1.5rem,3vw,2.25rem)]">
              <GerozEyebrow>{about.eyebrow}</GerozEyebrow>
            </div>
          ) : null}

          <div className="grid grid-cols-1 items-start gap-[clamp(2.5rem,5vw,3.5rem)] lg:grid-cols-12 lg:gap-x-[clamp(1.5rem,3vw,2.5rem)]">
            <header className="gz-about__header-col lg:col-span-5">
              <div className="flex items-center gap-3.5">
                <span
                  className="gz-about__accent-line block h-px w-[clamp(2.5rem,6vw,4.5rem)] bg-[linear-gradient(90deg,var(--color-lawyer),color-mix(in_srgb,var(--color-lawyer)_20%,transparent))]"
                  aria-hidden="true"
                />
                <span
                  className="gz-about__accent-dot block size-[0.35rem] shrink-0 rounded-full bg-lawyer shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-lawyer)_16%,transparent)]"
                  aria-hidden="true"
                />
              </div>

              <h2 className="gz-about__heading mt-[clamp(1rem,1.8vw,1.35rem)] mb-0 max-w-[28rem] font-serif text-[clamp(2rem,4vw,3.125rem)] leading-[1.1] tracking-[-0.03em] text-stone-900">
                {about.heading}
              </h2>
            </header>

            <div className="hidden lg:col-span-2 lg:col-start-6 lg:flex lg:items-start lg:justify-end lg:pt-[0.35rem] lg:pr-1">
              <AboutDecorativeArrow />
            </div>

            <div className="gz-about__body-col lg:col-span-5 lg:col-start-8">
              <div className="flex max-w-[36rem] flex-col gap-[clamp(1.25rem,2.2vw,1.65rem)]">
                <NarrativeParagraph lead text={about.body} />
                <NarrativeParagraph text={about.extraParagraph} />
                <NarrativeParagraph text={about.thirdParagraph} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
