import { Link } from 'react-router-dom';
import { GEROZ_TEMPLATE_IMAGES } from '../../data/geroz/constants.js';

export default function GerozCta({
  title = 'WORKED MORE THAN 50 GLOBAL BRANDS',
  contactLink = '#cta',
  contactLabel = 'Contact',
  shapeImage = GEROZ_TEMPLATE_IMAGES.ctaShape,
}) {
  return (
    <section className="relative overflow-hidden bg-stone-900 py-16 lg:py-20">
      <img
        src={shapeImage}
        alt=""
        width={1320}
        height={363}
        className="pointer-events-none absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2 opacity-20"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
          <h2 className="max-w-2xl text-3xl font-bold uppercase leading-tight text-stone-100 md:text-4xl lg:text-5xl">
            {title}
          </h2>

          <div className="flex items-center gap-8">
            <svg
              className="hidden h-24 w-24 text-stone-600 lg:block"
              viewBox="0 0 146 147"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M13.2675 151.978C-14.9941 96.7215 11.0094 10.7142 56.7816 55.219C85.3472 82.9936 17.441 74.5293 41.1041 38.8724C60.0347 10.347 114.229 6.96293 138.959 8.83675L123.22 21.4655C129.971 18.3438 143.616 11.4648 144.185 8.92165C144.755 6.37851 129.378 3.31736 121.619 2.10438"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>

            <Link
              to={contactLink}
              className="group relative flex h-32 w-32 items-center justify-center"
              aria-label={contactLabel}
            >
              <span
                className="absolute inset-0 animate-spin rounded-full border border-dashed border-amber-500/40 [animation-duration:12s]"
                aria-hidden="true"
              />
              <span className="absolute inset-2 rounded-full border border-stone-700" aria-hidden="true" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-stone-950 transition-transform group-hover:scale-110">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <svg className="h-full w-full" viewBox="0 0 128 128">
                  <defs>
                    <path id="geroz-cta-circle" d="M64,16 a48,48 0 1,1 0,96 a48,48 0 1,1 0,-96" fill="none" />
                  </defs>
                  <text className="fill-amber-500/60 text-[10px] uppercase tracking-[0.35em]">
                    <textPath href="#geroz-cta-circle" startOffset="0">
                      {`.${contactLabel} `.repeat(8)}
                    </textPath>
                  </text>
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
