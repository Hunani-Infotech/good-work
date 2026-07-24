import DecorShapes from '../DecorShapes.jsx';
import ExpertiseAuthor from '../ExpertiseAuthor.jsx';
import Eyebrow from '../Eyebrow.jsx';
import LuxuryBackdrop from '../LuxuryBackdrop.jsx';
import PortraitFrame from '../PortraitFrame.jsx';
import ThemeButton from '../ThemeButton.jsx';
import { useContent } from '../../../../hooks/geroz/useContent.js';

export default function VideoSection() {
  const { expertise, expert, video } = useContent();
  const videoSrc = video?.src?.trim() || '';
  const portraitSrc = video?.poster?.trim() || expert?.image || '';

  return (
    <section
      id="expertise"
      className="gz-expertise relative overflow-hidden"
      style={{ backgroundColor: 'var(--brand-soft-bg, #fff6cc)' }}
    >
      <div className="gz-expertise__panel relative pt-[clamp(4rem,7vw,6rem)] pb-[clamp(2rem,3.5vw,3rem)]">
        <LuxuryBackdrop
          variant="cream"
          washClass="gz-expertise__backdrop-wash"
          noiseClass="gz-expertise__backdrop-noise"
        />

        <div className="geroz-container-wide relative z-[1]">
          <div className="grid w-full grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-x-[clamp(1.5rem,4vw,3.5rem)]">
            <div className="relative hidden min-h-[clamp(16rem,34vw,34rem)] lg:col-span-1 lg:block">
              <DecorShapes className="h-full min-h-0" />
            </div>

            <div className="flex items-end lg:col-span-5 xl:col-span-5">
              <PortraitFrame
                src={portraitSrc}
                alt={expert?.authorName ?? ''}
                videoSrc={videoSrc}
                poster={portraitSrc}
                className="lg:mx-0"
              />
            </div>

            <div className="flex min-h-[clamp(16rem,34vw,34rem)] w-full min-w-0 flex-col pb-[clamp(1.5rem,3vw,2.5rem)] lg:col-span-6 xl:col-span-6">
              {expertise.tag ? (
                <div className="gz-expertise__eyebrow shrink-0">
                  <Eyebrow>{expertise.tag}</Eyebrow>
                </div>
              ) : null}

              <div className="gz-expertise__copy mt-[clamp(1.25rem,2.5vw,1.75rem)] flex min-h-0 w-full min-w-0 flex-1 flex-col">
                {expertise.statement ? (
                  <p className="gz-expertise__statement m-0 w-full max-w-none font-serif text-[clamp(1.125rem,1.65vw,1.5rem)] leading-[1.48] tracking-[-0.02em] text-stone-900 lg:max-w-[38rem]">
                    {expertise.statement}
                  </p>
                ) : null}

                {expertise.ctaLabel && expertise.ctaHref ? (
                  <ThemeButton
                    href={expertise.ctaHref}
                    variant="light"
                    className="gz-expertise__cta mt-[clamp(1.5rem,2.8vw,2rem)] self-start"
                  >
                    {expertise.ctaLabel}
                  </ThemeButton>
                ) : null}

                <ExpertiseAuthor
                  name={expert.authorName}
                  role={expert.authorRole}
                  className="mt-auto pt-[clamp(1.5rem,3vw,2.25rem)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
