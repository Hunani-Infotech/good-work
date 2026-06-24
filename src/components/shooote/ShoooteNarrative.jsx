import GwSection from '../shared/GwSection.jsx';
import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';

export default function ShoooteNarrative() {
  const { narrative } = useShoooteContent();

  if (!narrative.paragraphs.length) return null;

  return (
    <GwSection
      theme="shooote"
      id="narrative"
      className="wpo-about-section"
      sectionLabel={narrative.sectionLabel}
      title={narrative.tag}
      backgroundImage={narrative.backgroundImage}
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
