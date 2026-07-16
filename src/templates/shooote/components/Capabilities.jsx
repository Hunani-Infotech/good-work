import GwSection from '../../../components/shared/GwSection.jsx';
import { useContent } from '../../../hooks/shooote/useContent.js';

export default function Capabilities() {
  const { capabilities } = useContent();

  if (!capabilities.bullets.length) return null;

  return (
    <GwSection
      theme="shooote"
      id="capabilities"
      className="wpo-portfolio-section"
      sectionLabel={capabilities.sectionLabel}
      eyebrow={capabilities.tag}
      backgroundImage={capabilities.backgroundImage}
    >
      <ul className="gw-section__cap-list" role="list">
        {capabilities.bullets.map((bullet, index) => (
          <li
            key={bullet}
            className="gw-section__cap-item shooote-scroll-fade"
          >
            <span className="gw-section__cap-num" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <p>{bullet}</p>
          </li>
        ))}
      </ul>
    </GwSection>
  );
}
