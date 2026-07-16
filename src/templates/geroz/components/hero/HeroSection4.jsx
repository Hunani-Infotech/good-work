import GerozPortraitFrame from '../GerozPortraitFrame.jsx';
import { useGerozContent } from '../../../../hooks/geroz/useGerozContent.js';
import HeroAnimatedName from './HeroAnimatedName.jsx';

export default function HeroSection4() {
  const { hero } = useGerozContent();
  const firstNameChars = hero.firstName?.length || 1;
  const lastNameChars = hero.lastName?.length || firstNameChars;

  return (
    <section
      id="top"
      className="gz-hero relative box-border flex min-h-svh flex-col overflow-hidden pt-[var(--geroz-header-height)] pb-[clamp(2rem,4vw,3.5rem)] max-lg:min-h-0 max-lg:pb-[clamp(2.5rem,8vw,4rem)]"
    >
      <div className="gz-hero__gradients pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

      <div className="relative z-[1] mx-auto flex w-full max-w-[1920px] min-h-[calc(100svh-var(--geroz-header-height))] flex-col px-4 sm:px-6 lg:px-12 max-lg:min-h-0">
        <div className="relative z-[1] flex flex-1 flex-col justify-center px-[clamp(1.25rem,5vw,4.5rem)] max-lg:min-h-0 max-lg:justify-start max-lg:px-5 max-lg:pt-[clamp(1.75rem,5vw,2.75rem)] min-h-[calc(100svh-var(--geroz-header-height)-clamp(2rem,4vw,3.5rem))] max-lg:min-h-0">
          <div className="gz-hero__layout mx-auto grid w-full max-w-[88rem] grid-cols-[minmax(0,1fr)_minmax(14rem,28rem)] items-center gap-x-[clamp(2rem,6vw,5.5rem)] max-xl:grid-cols-[minmax(0,1fr)_minmax(12rem,22rem)] max-xl:gap-x-[clamp(1.5rem,4vw,3rem)] max-lg:flex max-lg:max-w-full max-lg:flex-col max-lg:items-center max-lg:gap-[clamp(2.25rem,7vw,3.25rem)] max-lg:text-center">
            <div
              className="gz-hero__copy col-start-1 row-start-1 py-[clamp(1rem,3vw,2.5rem)] max-lg:w-full max-lg:max-w-[24rem] max-lg:mx-auto max-lg:py-0"
              style={{
                '--gz-name-chars-first': firstNameChars,
                '--gz-name-chars-last': lastNameChars,
              }}
            >
              <HeroAnimatedName
                as="h1"
                text={hero.firstName}
                className="gz-hero__firstname m-0 font-serif leading-[0.92] tracking-[-0.055em] max-lg:text-center"
              />

              <div
                className="gz-hero__accent-between mt-[clamp(1.25rem,3.5vw,2.5rem)] mb-[clamp(0.35rem,1vw,0.65rem)] flex items-center gap-3.5 pl-[clamp(2rem,7vw,5.5rem)] max-lg:my-[clamp(1rem,3.5vw,1.35rem)] max-lg:justify-center max-lg:gap-4 max-lg:pl-0"
                aria-hidden="true"
              >
                <span className="gz-hero__accent-line block h-px w-[clamp(3.5rem,10vw,7rem)] max-lg:w-[clamp(3.25rem,18vw,5.5rem)]" />
                <span className="gz-hero__accent-dot block size-[0.4rem] shrink-0 rounded-full max-lg:size-[0.3rem]" />
                <span className="gz-hero__accent-line gz-hero__accent-line--mirror hidden h-px max-lg:block max-lg:w-[clamp(3.25rem,18vw,5.5rem)]" />
              </div>

              <div className="gz-hero__lastname-block flex flex-col items-start gap-0 max-lg:w-full max-lg:items-center">
                {hero.lastName ? (
                  <HeroAnimatedName
                    text={hero.lastName}
                    className="gz-hero__lastname font-serif leading-[0.92] tracking-[-0.055em] pl-[clamp(1.25rem,4.5vw,3.5rem)] max-lg:pl-0 max-lg:text-center"
                  />
                ) : null}
                {hero.subtitle ? (
                  <div className="gz-hero__subtitle-block mt-[clamp(1.25rem,3vw,2rem)] flex items-center gap-[clamp(0.75rem,2vw,1.25rem)] pl-[clamp(2.5rem,8vw,6.5rem)] max-lg:mt-[clamp(1.35rem,4.5vw,1.75rem)] max-lg:w-full max-lg:justify-center max-lg:gap-3.5 max-lg:pl-0">
                    <span
                      className="gz-hero__subtitle-rule block h-px w-[clamp(2rem,4vw,3rem)] shrink-0 max-lg:w-[clamp(1.75rem,10vw,2.75rem)]"
                      aria-hidden="true"
                    />
                    <p className="gz-hero__subtitle m-0 max-w-[min(100%,22rem)] font-sans text-[clamp(0.6875rem,1.1vw,0.8125rem)] font-semibold uppercase leading-[1.65] tracking-[0.2em] max-lg:max-w-none max-lg:text-center max-lg:text-[clamp(0.625rem,2.8vw,0.75rem)] max-lg:leading-[1.5] max-lg:tracking-[0.22em]">
                      {hero.subtitle}
                    </p>
                    <span
                      className="gz-hero__subtitle-rule gz-hero__subtitle-rule--mirror hidden h-px shrink-0 max-lg:block max-lg:w-[clamp(1.75rem,10vw,2.75rem)]"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="gz-hero__portrait relative z-[2] col-start-2 row-start-1 w-full max-w-[clamp(16rem,26vw,26rem)] justify-self-end self-center max-xl:max-w-[clamp(14rem,24vw,22rem)] max-lg:order-3 max-lg:mx-auto max-lg:mt-0 max-lg:w-full max-lg:max-w-[min(20rem,88vw)]">
              <GerozPortraitFrame
                src={hero.profilePhoto}
                alt={hero.portraitAlt}
                width={734}
                height={991}
                loading="eager"
                size="hero"
                className="lg:mx-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
