import { GEROZ_TEMPLATE_IMAGES } from '../../data/geroz/constants.js';

const DEFAULT_CASES = [
  {
    id: 1,
    number: '01',
    image: GEROZ_TEMPLATE_IMAGES.cases[0],
    category: 'FAMILY LAW',
    title: 'She alone aids beloved',
    titleBreak: 'nonprofits in need.',
    href: '#',
  },
  {
    id: 2,
    number: '02',
    image: GEROZ_TEMPLATE_IMAGES.cases[1],
    category: 'CRIMINAL LAW',
    title: 'She fiercely defends dreams',
    titleBreak: 'across every border.',
    href: '#',
  },
  {
    id: 3,
    number: '03',
    image: GEROZ_TEMPLATE_IMAGES.cases[2],
    category: 'FAMILY LAW',
    title: 'She protects every spark',
    titleBreak: 'of original thought.',
    href: '#',
  },
  {
    id: 4,
    number: '04',
    image: GEROZ_TEMPLATE_IMAGES.cases[3],
    category: 'HEALTHCARE LAW',
    title: 'She secures every space',
    titleBreak: 'clients call their own.',
    href: '#',
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GerozCases({
  eyebrow = 'My Case',
  title = 'My Recent Case',
  description = 'Owing to advancements in product and other designer technologies, chatbots have increased in greater popularity in the past few years.',
  cases = DEFAULT_CASES,
}) {
  return (
    <section className="bg-stone-950 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <header className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden />
            <span className="text-xs uppercase tracking-[0.2em] text-amber-500">{eyebrow}</span>
          </div>
          <h2 className="text-3xl font-semibold text-stone-100 md:text-4xl lg:text-5xl">{title}</h2>
          {description && (
            <p className="mt-4 text-sm leading-relaxed text-stone-400 md:text-base">{description}</p>
          )}
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {cases.map((caseItem) => (
            <article
              key={caseItem.id}
              className="group flex flex-col gap-5 rounded-2xl border border-stone-800 bg-stone-900 p-6 transition-colors hover:border-amber-500/30 sm:flex-row sm:items-center"
            >
              <span className="text-4xl font-light text-stone-700">{caseItem.number}</span>

              <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-40">
                <img
                  src={caseItem.image}
                  alt={caseItem.category}
                  width={434}
                  height={149}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-widest text-amber-500">{caseItem.category}</p>
                <h3 className="mt-2 text-lg font-medium leading-snug text-stone-100">
                  <a href={caseItem.href} className="transition-colors hover:text-amber-500">
                    {caseItem.title}
                    <br />
                    {caseItem.titleBreak}
                  </a>
                </h3>
              </div>

              <a
                href={caseItem.href}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-stone-700 text-stone-400 transition-colors group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-stone-950"
                aria-label={`View case ${caseItem.number}`}
              >
                <ArrowIcon />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
