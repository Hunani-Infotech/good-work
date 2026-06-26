import { GEROZ_TEMPLATE_IMAGES } from '../../data/geroz/constants.js';

function QuoteIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className="h-12 w-12 text-amber-500" aria-hidden>
      <path d="M14 10c-4 0-7 3-7 7v11h11V17H14c0-2 1-3 3-3V10zm20 0c-4 0-7 3-7 7v11h11V17H34c0-2 1-3 3-3V10z" />
    </svg>
  );
}

export default function GerozExpert({
  title = 'EXPERT LAWYER',
  years = 12,
  experienceLabel = 'YEARS OF EXPERIENCE IN LAWFIRM SERVICES',
  image = GEROZ_TEMPLATE_IMAGES.expert,
  quote = 'Although we are maritime lawyers we are proud to help the injured throughout the nation including workers who were working in foreign waters.',
  authorName = 'William Jekson',
  authorRole = 'Digital Marketer',
  signature = 'William John',
}) {
  return (
    <section className="overflow-hidden bg-stone-900 py-20 lg:py-28">
      <h2
        className="pointer-events-none mb-12 select-none text-center text-5xl font-bold uppercase tracking-[0.15em] text-stone-800 md:text-7xl lg:text-8xl"
        aria-hidden
      >
        {title}
      </h2>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="text-stone-100">
              <p className="text-6xl font-semibold leading-none md:text-7xl">
                {years}
                <sup className="ml-1 text-2xl text-amber-500">+</sup>
              </p>
              <p className="mt-4 text-xs uppercase leading-relaxed tracking-widest text-stone-400">
                {experienceLabel}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={image}
                alt=""
                width={670}
                height={955}
                className="mx-auto w-full max-w-md object-cover lg:max-w-none"
              />
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <QuoteIcon />
            <blockquote className="mt-6 text-base leading-relaxed text-stone-400 md:text-lg">
              {quote}
            </blockquote>
            <footer className="mt-8 flex items-end justify-between gap-4 border-t border-stone-800 pt-6">
              <div>
                <p className="text-lg font-semibold text-stone-100">{authorName}</p>
                <p className="text-sm text-stone-400">{authorRole}</p>
              </div>
              <p className="font-serif text-2xl italic text-amber-500">{signature}</p>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
