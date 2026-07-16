import GwSection from '../../../components/shared/GwSection.jsx';
import { useContent } from '../../../hooks/shooote/useContent.js';

export default function Narrative() {
  const { narrative } = useContent();

  if (!narrative.paragraphs.length) return null;

  return (
    <GwSection
      theme="shooote"
      id="narrative"
      className="wpo-about-section"
      sectionLabel={narrative.sectionLabel}
      title={narrative.tag}
    >
      <div className="about-wrap">
        <div className="gw-section__prose">
          {narrative.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="shooote-scroll-fade">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </GwSection>
  );
}
