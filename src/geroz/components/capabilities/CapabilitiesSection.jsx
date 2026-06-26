import { useGerozContent } from '../../../hooks/geroz/useGerozContent.js';
import GerozEyebrow from '../../../components/geroz/GerozEyebrow.jsx';
import GerozLuxuryBackdrop from '../../../components/geroz/GerozLuxuryBackdrop.jsx';

function SectionTitleAccent({ children }) {
  return (
    <div className="flex flex-col items-center text-center">
      <GerozEyebrow className="mx-auto">{children}</GerozEyebrow>

      <div className="mt-[clamp(1.5rem,3vw,2.25rem)] flex w-full max-w-[48rem] items-center justify-center gap-[clamp(1rem,3vw,2rem)]">
        <span
          className="h-px flex-1 max-w-[5.5rem] bg-[linear-gradient(90deg,transparent,var(--color-lawyer))]"
          aria-hidden="true"
        />
        <span
          className="block size-[0.35rem] shrink-0 rounded-full bg-lawyer"
          aria-hidden="true"
        />
        <span
          className="h-px flex-1 max-w-[5.5rem] bg-[linear-gradient(270deg,transparent,var(--color-lawyer))]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function CapabilitiesSection() {
  const { capabilities } = useGerozContent();

  return (
    <section id="capabilities" className="relative overflow-hidden bg-[#fafaf9]">
      <GerozLuxuryBackdrop variant="cream" />

      <div className="geroz-container-wide relative z-[1] px-4 py-[clamp(4rem,7vw,6rem)] sm:px-6 lg:px-11">
        <div className="mx-auto max-w-[52rem]">
          <SectionTitleAccent>{capabilities.eyebrow}</SectionTitleAccent>

          <h2 className="mt-[clamp(1rem,2.2vw,1.75rem)] text-center font-serif text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.08] tracking-[-0.03em] text-stone-900">
            {capabilities.title}
          </h2>

          {capabilities.description ? (
            <p className="mx-auto mt-[clamp(1.25rem,2.5vw,2rem)] max-w-[40rem] text-center font-serif text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.6] tracking-[-0.01em] text-stone-600">
              {capabilities.description}
            </p>
          ) : null}
        </div>

        <div className="mx-auto mt-[clamp(2.25rem,4.5vw,3.5rem)] flex w-full max-w-[56rem] flex-col">
          {capabilities.items.map((item, index) => (
            <article
              key={item.id}
              className={`grid grid-cols-[clamp(3.5rem,8vw,5rem)_minmax(0,1fr)] items-start gap-[clamp(1.25rem,3vw,2.5rem)] py-[clamp(1.5rem,3vw,2.25rem)] ${
                index < capabilities.items.length - 1
                  ? 'border-b border-[color-mix(in_srgb,var(--color-lawyer)_18%,#e7e5e4)]'
                  : ''
              }`}
            >
              <span className="font-serif text-[clamp(2.5rem,5vw,3.75rem)] leading-none tracking-[-0.04em] text-lawyer">
                {item.number}
              </span>
              <p className="m-0 min-w-0 pt-[0.35rem] font-sans text-[clamp(1.0625rem,1.55vw,1.25rem)] leading-[1.85] text-stone-800">
                {item.title}
                {item.titleBreak ? ` ${item.titleBreak}` : ''}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
