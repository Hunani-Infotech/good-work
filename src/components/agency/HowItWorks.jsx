import HowItWorksFlowArt, {
  HOW_FLOW_PATH,
  HOW_FLOW_PATH_MOBILE,
  HOW_FLOW_NODES_DESKTOP,
} from './HowItWorksFlowArt';

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

function FlowSvg({ className, viewBox, pathD, nodes, nodeHalo = 13, nodeCore = 5 }) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.06"
      />
      <path
        className="agency-how__path"
        d={pathD}
        fill="none"
        stroke="var(--brand-orange, #f25828)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {nodes.map((n, i) => (
        <g key={i} className={`agency-how__node agency-how__node--${i}`}>
          <circle cx={n.x} cy={n.y} r={nodeHalo} fill="var(--brand-orange, #f25828)" fillOpacity="0.12" />
          <circle cx={n.x} cy={n.y} r={nodeCore} fill="var(--brand-orange, #f25828)" />
        </g>
      ))}
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section className="agency-how" id="how-it-works" data-nav-logo="light">
      <HowItWorksFlowArt />

      <div className="agency-section__inner">
        <div className="agency-section__header">
          <span className="agency-tag">Simple process</span>
          <h2 className="agency-section__headline">
            Three steps to your career page
          </h2>
        </div>

        <div className="agency-how__body">
          <div className="agency-how__rail" aria-hidden="true">
            <FlowSvg
              className="agency-how__svg agency-how__svg--desktop"
              viewBox="0 -40 1000 1040"
              pathD={HOW_FLOW_PATH}
              nodes={HOW_FLOW_NODES_DESKTOP}
            />
            <FlowSvg
              className="agency-how__svg agency-how__svg--mobile"
              viewBox="0 0 120 900"
              pathD={HOW_FLOW_PATH_MOBILE}
              nodes={[]}
            />
          </div>

          {STEPS.map((step, i) => (
            <div key={step.number} className={`agency-how__step agency-how__step--${step.side}`} data-step={i}>
              <div className="agency-how__card">
                <div className="agency-how__card-head">
                  <div className="agency-how__lead">
                    <span className="agency-how__step-dot" aria-hidden="true" />
                    <span className="agency-how__num">{step.number}</span>
                  </div>
                  <span className="agency-how__icon" aria-hidden="true">{step.icon}</span>
                </div>
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
