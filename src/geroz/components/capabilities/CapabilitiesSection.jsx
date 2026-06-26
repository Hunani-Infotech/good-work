import { useGerozContent } from '../../../hooks/geroz/useGerozContent.js';
import GerozEyebrow from '../../../components/geroz/GerozEyebrow.jsx';

export default function CapabilitiesSection() {
  const { capabilities } = useGerozContent();

  return (
    <section
      id="capabilities"
      className="pt-[clamp(3.5rem,7vw,6.5rem)] pb-[clamp(5rem,8vw,8.125rem)]"
    >
      <div className="geroz-container">
        <div className="text-center">
          <GerozEyebrow className="mx-auto">{capabilities.eyebrow}</GerozEyebrow>
          <h2 className="mt-[clamp(1.25rem,3vw,2rem)] font-serif text-[clamp(2rem,4vw,3rem)] leading-tight text-stone-900">
            {capabilities.title}
          </h2>
          {capabilities.description ? (
            <p className="mx-auto mt-[clamp(1.25rem,3vw,2rem)] max-w-[42rem] px-3 leading-loose text-stone-600 sm:px-0">
              {capabilities.description}
            </p>
          ) : null}
        </div>

        <div className="mx-auto mt-[clamp(2.5rem,5vw,4rem)] flex w-full max-w-[60rem] flex-col gap-[clamp(3rem,6vw,5rem)]">
          {capabilities.items.map((item) => (
            <article
              key={item.id}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-[clamp(1.25rem,3vw,3.5rem)]"
            >
              <span className="shrink-0 font-serif text-[clamp(2.25rem,4vw,3.75rem)] leading-none text-stone-900">
                {item.number}
              </span>
              <p className="m-0 min-w-0 pt-1 font-sans text-[clamp(1rem,1.6vw,1.25rem)] leading-loose text-stone-800">
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
