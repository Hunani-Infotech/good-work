import { useState } from 'react';

const DEFAULT_ITEMS = [
  {
    id: 1,
    question: 'How to Create a Chatbot to Fit Your Needs?',
    answer:
      'We help ambitious businesses like yours generate more profits by building awareness, driving web traffic, connecting with customers, and growing overall.',
  },
  {
    id: 2,
    question: 'What is off page SEO link building?',
    answer:
      'We help ambitious businesses like yours generate more profits by building awareness, driving web traffic, connecting with customers, and growing overall.',
  },
  {
    id: 3,
    question: 'How to Create a Chatbot to Fit Your Needs?',
    answer:
      'We help ambitious businesses like yours generate more profits by building awareness, driving web traffic, connecting with customers, and growing overall.',
  },
  {
    id: 4,
    question: 'How can I order web design for my website?',
    answer:
      'We help ambitious businesses like yours generate more profits by building awareness, driving web traffic, connecting with customers, and growing overall.',
  },
  {
    id: 5,
    question: 'How To Choose A Good QA Consultant?',
    answer:
      'We help ambitious businesses like yours generate more profits by building awareness, driving web traffic, connecting with customers, and growing overall.',
  },
];

export default function GerozFaq({
  eyebrow = 'FAQ',
  title = 'Frequently Asked Questions',
  description = 'Owing to advancements in product other designer technologies, chatbots have increased into greater popularity in the past few years',
  items = DEFAULT_ITEMS,
  defaultOpenId = 1,
}) {
  const [openId, setOpenId] = useState(defaultOpenId);

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="bg-stone-950 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
            <span className="text-sm font-medium uppercase tracking-widest text-amber-500">{eyebrow}</span>
          </div>
          <h2 className="text-3xl font-bold uppercase text-stone-100 md:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-6 text-stone-400">{description}</p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-3">
          {items.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-xl border transition-colors${
                  isOpen ? ' border-amber-500/50 bg-stone-900' : ' border-stone-800 bg-stone-900/50'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold text-stone-100 transition-colors hover:text-amber-500"
                  >
                    <span>{item.question}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-700 text-amber-500 transition-transform${
                        isOpen ? ' rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                </h3>

                <div
                  className={`grid transition-all duration-300 ease-in-out${
                    isOpen ? ' grid-rows-[1fr] opacity-100' : ' grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-stone-400">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
