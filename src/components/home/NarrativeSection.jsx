import { useSite } from '../../context/SiteContext';

export default function NarrativeSection() {
  const { site } = useSite();
  const narrative = site.home.narrative;

  if (!narrative?.paragraphs?.length) return null;

  return (
    <section data-nav="peach" className="section narrative-section">
      <div className="narrative-wrapper">
        <div className="narrative-header">
          <span className="tag-text narrative-tag">{narrative.tag}</span>
          <div className="narrative-line" />
        </div>
        <div className="narrative-content">
          {narrative.paragraphs.map((para, i) => (
            <p key={i} className="narrative-para">{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
