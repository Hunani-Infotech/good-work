import { useGerozContent } from '../../../hooks/geroz/useGerozContent.js';
import GerozDecorShapes from '../../../components/geroz/GerozDecorShapes.jsx';
import GerozEyebrow from '../../../components/geroz/GerozEyebrow.jsx';
import GerozThemeButton from '../../../components/geroz/GerozThemeButton.jsx';

const EXPERTISE_AMBIENT_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")";

function ExpertiseAuthor({ name, role, className = '' }) {
  if (!name && !role) return null;

  return (
    <footer className={`shrink-0 ${className}`.trim()}>
      <div className="flex items-start gap-4">
        <span
          className="mt-2 block h-10 w-px shrink-0 bg-[linear-gradient(180deg,var(--color-lawyer),color-mix(in_srgb,var(--color-lawyer)_25%,transparent))]"
          aria-hidden="true"
        />
        <div className="min-w-0">
          {name ? (
            <p className="m-0 font-sans text-[1.1875rem] font-bold leading-tight tracking-[-0.01em] text-stone-900">
              {name}
            </p>
          ) : null}
          {role ? (
            <p className="mt-2 m-0 font-sans text-[0.6875rem] font-semibold uppercase leading-relaxed tracking-[0.18em] text-lawyer">
              {role}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function ExpertisePortrait({ video, expert }) {
  const imageSrc = video?.poster?.trim() || expert?.image || '';

  if (!imageSrc) {
    return (
      <div
        className="h-[clamp(16rem,34vw,34rem)] w-full bg-stone-200"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,28rem)] p-[clamp(0.5rem,1vw,0.85rem)] lg:mx-0">
      <span
        className="pointer-events-none absolute top-0 right-0 z-0 h-[58%] w-[40%] translate-x-2 -translate-y-2 border border-[color-mix(in_srgb,var(--color-lawyer)_45%,transparent)]"
        aria-hidden="true"
      />
      <div className="relative z-[1] overflow-hidden bg-white shadow-[0_1.5rem_3rem_-1.25rem_rgba(28,25,23,0.18),0_0_0_1px_color-mix(in_srgb,var(--color-lawyer)_22%,#e7e5e4)]">
        <img
          className="block h-[clamp(16rem,34vw,34rem)] w-full object-cover object-top contrast-[1.02] saturate-[0.94]"
          src={imageSrc}
          alt={expert?.authorName ?? ''}
          width="670"
          height="955"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default function VideoSection({ imgUrl }) {
  const { expertise, expert, video } = useGerozContent();

  return (
    <section id="expertise" className="relative overflow-hidden">
      <div className="relative bg-[#f8f5f0] pt-[clamp(5.5rem,10vw,9rem)] pb-[clamp(4rem,8vw,7rem)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_8%_42%,color-mix(in_srgb,var(--color-lawyer)_9%,transparent),transparent_68%),radial-gradient(ellipse_45%_40%_at_92%_58%,color-mix(in_srgb,var(--color-lawyer)_7%,transparent),transparent_72%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{ backgroundImage: EXPERTISE_AMBIENT_BG }}
          aria-hidden="true"
        />

        <div className="geroz-container-wide relative z-[1]">
          <div className="mb-10 lg:hidden">
            <GerozDecorShapes />
          </div>

          <div className="grid w-full grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-x-[clamp(1.5rem,4vw,3.5rem)]">
            <div className="relative hidden min-h-[clamp(16rem,34vw,34rem)] lg:col-span-1 lg:block">
              <GerozDecorShapes className="h-full min-h-0" />
            </div>

            <div className="flex items-end lg:col-span-5 xl:col-span-5">
              <ExpertisePortrait video={video} expert={expert} />
            </div>

            <div className="flex min-h-[clamp(16rem,34vw,34rem)] flex-col pb-[clamp(1.5rem,3vw,2.5rem)] lg:col-span-6 xl:col-span-6">
              {expertise.tag ? (
                <div className="shrink-0">
                  <GerozEyebrow>{expertise.tag}</GerozEyebrow>
                </div>
              ) : null}

              <div className="mt-[clamp(1.25rem,2.5vw,1.75rem)] flex min-h-0 flex-1 flex-col">
                {expertise.statement ? (
                  <p className="m-0 max-w-[38rem] font-serif text-[clamp(1.125rem,1.65vw,1.5rem)] leading-[1.48] tracking-[-0.02em] text-stone-900">
                    {expertise.statement}
                  </p>
                ) : null}

                {expertise.ctaLabel && expertise.ctaHref ? (
                  <GerozThemeButton
                    href={expertise.ctaHref}
                    className="mt-[clamp(1.5rem,2.8vw,2rem)] self-start"
                  >
                    {expertise.ctaLabel}
                  </GerozThemeButton>
                ) : null}

                <ExpertiseAuthor
                  name={expert.authorName}
                  role={expert.authorRole}
                  className="mt-auto pt-[clamp(2rem,4vw,3.25rem)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className="geroz-video-band m-0 h-[clamp(16rem,40vw,760px)] w-full bg-cover bg-center bg-no-repeat max-lg:min-h-56 max-lg:bg-scroll"
          style={{
            backgroundImage: `url(${imgUrl})`,
            backgroundAttachment: 'fixed',
          }}
          role="img"
          aria-label="Featured background"
        />
      </div>
    </section>
  );
}
