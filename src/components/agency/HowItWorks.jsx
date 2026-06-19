const STEPS = [
  {
    number: '01',
    icon: '✏️',
    title: 'Fill in your details',
    desc: 'Add your experience, skills, projects, and education through our guided step-by-step form.',
    side: 'left',
  },
  {
    number: '02',
    icon: '🎨',
    title: 'Choose your template',
    desc: 'Pick from our library of modern, recruiter-approved designs built for Gen-Z professionals.',
    side: 'right',
  },
  {
    number: '03',
    icon: '🔗',
    title: 'Share your link',
    desc: 'Get a unique URL for your CV portfolio. Share it on WhatsApp, LinkedIn, email, or anywhere.',
    side: 'left',
  },
];

const NODES = [
  { x: 350, y: 200 },
  { x: 650, y: 480 },
  { x: 350, y: 760 },
];

const PATH_D = [
  'M 500,0',
  'C 500,80 350,140 350,200',
  'C 350,260 500,320 500,380',
  'C 500,420 650,440 650,480',
  'C 650,520 500,560 500,640',
  'C 500,700 350,700 350,760',
  'C 350,820 500,880 500,920',
  'C 500,940 500,960 500,960',
].join(' ');

export default function HowItWorks() {
  return (
    <section className="agency-how" id="how-it-works">
      <div className="agency-section__inner">
        <div className="agency-section__header">
          <span className="agency-tag">Simple process</span>
          <h2 className="agency-section__headline">
            Three steps to your career page
          </h2>
        </div>

        <div className="agency-how__body">
          <svg
            className="agency-how__svg"
            viewBox="0 0 1000 960"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={PATH_D}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.07"
            />
            <path
              className="agency-how__path"
              d={PATH_D}
              fill="none"
              stroke="var(--brand-orange, #f25828)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {NODES.map((n, i) => (
              <g key={i} className={`agency-how__node agency-how__node--${i}`}>
                <circle cx={n.x} cy={n.y} r="13" fill="var(--brand-orange, #f25828)" fillOpacity="0.1" />
                <circle cx={n.x} cy={n.y} r="5" fill="var(--brand-orange, #f25828)" />
              </g>
            ))}
          </svg>

          {STEPS.map((step, i) => (
            <div key={step.number} className={`agency-how__step agency-how__step--${step.side}`} data-step={i}>
              <div className="agency-how__card">
                <span className="agency-how__num">{step.number}</span>
                <span className="agency-how__icon" aria-hidden="true">{step.icon}</span>
                <h3 className="agency-how__title">{step.title}</h3>
                <p className="agency-how__desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
