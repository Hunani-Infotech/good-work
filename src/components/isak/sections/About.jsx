import { ImageSwitch } from '../ImageSwitch.jsx';
import GwSection from '../../shared/GwSection.jsx';
import { useIsakContent } from '../../../hooks/isak/useIsakContent.js';

export function About() {
  const { about, education, capabilities } = useIsakContent();

  return (
    <>
      <GwSection
        theme="isak"
        id="about"
        className="section-about"
        icon="icon-user-circle"
        eyebrow={about.tag}
        title={about.title}
      >
        <p className="s-desc text-black-56 scrolling-effect effectTop">
          {about.paragraphs.map((paragraph) => (
            <span key={paragraph.slice(0, 32)}>
              {paragraph}
              <br />
              <br />
            </span>
          ))}
        </p>
      </GwSection>

      {education.length > 0 ? (
        <GwSection
          theme="isak"
          id="education"
          className="section-education-experience"
          icon="icon-edu"
          eyebrow={capabilities.tag}
        >
          <div className="timeline scroll-down">
            <div className="timeline-line">
              <div className="prg-line" />
            </div>
            {education.map((item, i) => (
              <div className="timeline-item effectFade fadeUp no-div" key={i}>
                <p className="timeline-date text-black-56">{item.period}</p>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <p className="timeline-role text-body-3 text-black-56">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </GwSection>
      ) : null}
    </>
  );
}
