import GwSection from '../../../../components/shared/GwSection.jsx';
import SectionHeading from '../SectionHeading.jsx';
import { useContent } from '../../../../hooks/isak/useContent.js';

export function About() {
  const { about, education, capabilities } = useContent();

  return (
    <>
      <GwSection theme="isak" id="about" className="section-about">
        <SectionHeading tag={about.tag} sectionIndex="01" />
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
        <GwSection theme="isak" id="education" className="section-education-experience">
          <SectionHeading tag={capabilities.tag} sectionIndex="02" singleLine />
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
