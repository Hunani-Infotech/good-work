import { useGerozContent } from '../../../hooks/geroz/useGerozContent.js';
import HeroAnimatedName from './HeroAnimatedName.jsx';

const HERO_AMBIENT_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")";

export default function HeroSection4() {
  const { hero } = useGerozContent();
  const firstNameChars = hero.firstName?.length || 1;
  const lastNameChars = hero.lastName?.length || firstNameChars;

  return (
    <section
      id="top"
      className="gz-hero relative box-border flex min-h-svh flex-col overflow-hidden pt-[var(--geroz-header-height)] pb-[clamp(2rem,4vw,3.5rem)] max-lg:min-h-0 max-lg:pb-[clamp(2rem,5vw,3.5rem)]"
    >
      <div
        className="gz-hero__bg pointer-events-none absolute inset-0 opacity-35"
        style={{ backgroundImage: HERO_AMBIENT_BG }}
        aria-hidden="true"
      />

      <div className="relative z-[1] mx-auto flex w-full max-w-[1920px] min-h-[calc(100svh-var(--geroz-header-height))] flex-col px-4 sm:px-6 lg:px-12 max-lg:min-h-0">
        <div className="relative z-[1] flex flex-1 flex-col justify-center px-[clamp(1.25rem,5vw,4.5rem)] max-lg:min-h-0 max-lg:justify-start max-lg:pt-[clamp(2rem,6vw,4rem)] min-h-[calc(100svh-var(--geroz-header-height)-clamp(2rem,4vw,3.5rem))] max-lg:min-h-0">
          <div className="mx-auto grid w-full max-w-[88rem] grid-cols-[minmax(0,1fr)_minmax(14rem,28rem)] items-center gap-x-[clamp(2rem,6vw,5.5rem)] max-xl:grid-cols-[minmax(0,1fr)_minmax(12rem,22rem)] max-xl:gap-x-[clamp(1.5rem,4vw,3rem)] max-lg:flex max-lg:max-w-full max-lg:flex-col max-lg:items-center max-lg:text-center">
            <div
              className="gz-hero__copy col-start-1 row-start-1 py-[clamp(1rem,3vw,2.5rem)] max-lg:w-full max-lg:py-0"
              style={{
                '--gz-name-chars-first': firstNameChars,
                '--gz-name-chars-last': lastNameChars,
              }}
            >
              <HeroAnimatedName
                as="h1"
                text={hero.firstName}
                className="gz-hero__firstname m-0 font-serif leading-[0.92] tracking-[-0.055em] text-stone-900 max-lg:text-center"
              />

              <div
                className="mt-[clamp(1.25rem,3.5vw,2.5rem)] mb-[clamp(0.35rem,1vw,0.65rem)] flex items-center gap-3.5 pl-[clamp(2rem,7vw,5.5rem)] max-lg:my-[clamp(0.75rem,2vw,1.25rem)] max-lg:justify-center max-lg:pl-0"
                aria-hidden="true"
              >
                <span className="gz-hero__accent-line block h-px w-[clamp(3.5rem,10vw,7rem)] bg-[linear-gradient(90deg,var(--color-lawyer),color-mix(in_srgb,var(--color-lawyer)_25%,transparent))]" />
                <span className="gz-hero__accent-dot block size-[0.4rem] shrink-0 rounded-full bg-lawyer shadow-[0_0_0_5px_color-mix(in_srgb,var(--color-lawyer)_18%,transparent)]" />
              </div>

              <div className="flex flex-col items-start gap-0 max-lg:items-center">
                {hero.lastName ? (
                  <HeroAnimatedName
                    text={hero.lastName}
                    className="gz-hero__lastname font-serif leading-[0.92] tracking-[-0.055em] text-stone-900 pl-[clamp(1.25rem,4.5vw,3.5rem)] max-lg:pl-0 max-lg:text-center"
                  />
                ) : null}
                {hero.subtitle ? (
                  <div className="mt-[clamp(1.25rem,3vw,2rem)] flex items-center gap-[clamp(0.75rem,2vw,1.25rem)] pl-[clamp(2.5rem,8vw,6.5rem)] max-lg:mt-[clamp(1rem,2.5vw,1.5rem)] max-lg:justify-center max-lg:pl-0">
                    <span
                      className="gz-hero__subtitle-rule block h-px w-[clamp(2rem,4vw,3rem)] shrink-0 bg-lawyer"
                      aria-hidden="true"
                    />
                    <p className="gz-hero__subtitle m-0 max-w-[min(100%,22rem)] font-sans text-[clamp(0.6875rem,1.1vw,0.8125rem)] font-semibold uppercase leading-[1.65] tracking-[0.2em] text-stone-500 max-lg:max-w-[28rem] max-lg:text-center">
                      {hero.subtitle}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="gz-hero__portrait relative z-[2] col-start-2 row-start-1 w-full max-w-[clamp(16rem,26vw,26rem)] justify-self-end self-center p-[clamp(0.65rem,1.2vw,1rem)] max-xl:max-w-[clamp(14rem,24vw,22rem)] max-lg:order-3 max-lg:mx-auto max-lg:mt-10 max-lg:max-w-[20rem] max-md:max-w-[18rem]">
              <span
                className="gz-hero__portrait-corner pointer-events-none absolute top-0 right-0 z-0 h-[62%] w-[42%] translate-x-[0.65rem] -translate-y-[0.65rem] border border-[color-mix(in_srgb,var(--color-lawyer)_50%,transparent)]"
                aria-hidden="true"
              />
              <div className="gz-hero__portrait-frame relative z-[1] overflow-hidden bg-white leading-none shadow-[0_1.75rem_3.5rem_-1.25rem_rgba(28,25,23,0.22),0_0_0_1px_color-mix(in_srgb,var(--color-lawyer)_28%,#e7e5e4)]">
                <img
                  src={hero.profilePhoto}
                  alt={hero.portraitAlt}
                  width="734"
                  height="991"
                  className="gz-hero__portrait-img block h-auto max-h-[clamp(20rem,42vw,36rem)] w-full object-cover object-top contrast-[1.03] saturate-[0.92]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
