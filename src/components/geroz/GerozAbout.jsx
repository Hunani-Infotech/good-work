import GerozSectionLabel from './GerozSectionLabel.jsx';

const defaultContent = {
  eyebrow: 'About Me',
  heading:
    'Providing expert legal services in corporate, family, personal injury, and criminal law — dedicated attorneys who prioritize personalized solutions and client success.',
  paragraphs: [
    'Our team of experienced attorneys brings a diverse range of expertise across a wide spectrum of legal areas. We specialize in corporate law, family law, and civil litigation with a client-first approach.',
    'From contract negotiation to courtroom advocacy, we deliver clear counsel and strategic representation. Every case receives the attention, preparation, and integrity it deserves.',
  ],
};

export default function GerozAbout({ content = {} }) {
  const {
    eyebrow = defaultContent.eyebrow,
    heading = defaultContent.heading,
    paragraphs = defaultContent.paragraphs,
  } = content;

  return (
    <section
      id="about"
      className="bg-stone-900 py-20 font-sans text-stone-100 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-3">
            {eyebrow ? <GerozSectionLabel content={{ label: eyebrow }} /> : null}
          </div>

          <div className="flex flex-col gap-8 lg:col-span-8">
            {heading ? (
              <h2 className="font-serif text-3xl leading-tight text-stone-100 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                {heading}
              </h2>
            ) : null}

            {paragraphs?.length ? (
              <div className="space-y-5">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-stone-400 sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
