import { GEROZ_TEMPLATE_IMAGES } from '../../data/geroz/constants.js';
import GerozSectionLabel from './GerozSectionLabel.jsx';

const defaultContent = {
  eyebrow: 'Attorney at Law',
  firstName: 'Lawyer',
  lastName: 'John Smith',
  title: 'Corporate & Criminal Attorney',
  statement:
    'We believe that understanding and solving clients\' issues is the key to success. Now it\'s your time to overcome challenges.',
  portrait: GEROZ_TEMPLATE_IMAGES.hero,
  portraitAlt: 'Lawyer John Smith',
  ctaHref: '#cta',
  ctaText: '.Contact.Contact.Contact.Contact.Contact',
};

function CircleText({ text }) {
  const chars = text.split('');
  const step = 360 / chars.length;

  return chars.map((char, index) => (
    <span
      key={`${char}-${index}`}
      className="absolute left-1/2 top-0 origin-[center_5.5rem] text-[11px] font-semibold uppercase tracking-widest text-stone-100"
      style={{ transform: `translateX(-50%) rotate(${index * step}deg)` }}
      aria-hidden="true"
    >
      {char}
    </span>
  ));
}

export default function GerozHero({ content = {} }) {
  const {
    eyebrow = defaultContent.eyebrow,
    firstName = defaultContent.firstName,
    lastName = defaultContent.lastName,
    title = defaultContent.title,
    statement = defaultContent.statement,
    portrait = defaultContent.portrait,
    portraitAlt = defaultContent.portraitAlt,
    ctaHref = defaultContent.ctaHref,
    ctaText = defaultContent.ctaText,
  } = content;

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-stone-950 font-sans text-stone-100"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid min-h-[calc(100vh-6rem)] items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="relative z-10 flex flex-col justify-center gap-8">
            {eyebrow ? <GerozSectionLabel content={{ label: eyebrow }} /> : null}

            <div className="space-y-2">
              <h1 className="font-serif text-5xl leading-[0.95] tracking-tight text-stone-100 sm:text-6xl lg:text-7xl xl:text-8xl">
                <span className="block">{firstName}</span>
                <span className="block text-amber-500">{lastName}</span>
              </h1>
              {title ? (
                <p className="text-lg text-stone-400 sm:text-xl">{title}</p>
              ) : null}
            </div>

            {statement ? (
              <p className="max-w-lg text-base leading-relaxed text-stone-400 sm:text-lg">
                {statement}
              </p>
            ) : null}

            <a
              href={ctaHref}
              className="group relative mt-2 inline-flex size-36 items-center justify-center self-start rounded-full border border-amber-500/30 bg-stone-900 transition-colors hover:border-amber-500 hover:bg-stone-800"
              aria-label="Go to contact section"
            >
              <span className="relative size-[8.75rem] rounded-full">
                <CircleText text={ctaText} />
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-amber-500 text-stone-950 transition-transform group-hover:scale-105">
                  <svg
                    className="size-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </span>
            </a>
          </div>

          <div className="relative flex h-[28rem] items-stretch sm:h-[32rem] lg:h-[calc(100vh-8rem)] lg:min-h-[36rem]">
            <div className="relative w-full overflow-hidden rounded-3xl border border-amber-500/30 bg-stone-900">
              <img
                src={portrait}
                alt={portraitAlt}
                className="size-full object-cover object-top"
                width={734}
                height={991}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
