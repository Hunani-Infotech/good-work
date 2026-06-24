import GwSection from '../shared/GwSection.jsx';
import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';

function luxuryHeadingLines(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const nativeIdx = trimmed.search(/\s+Native\s+and\s+Cross-Platform/i);
  if (nativeIdx !== -1) {
    return [
      trimmed.slice(0, nativeIdx).trim(),
      trimmed.slice(nativeIdx + 1).trim(),
    ];
  }

  const mid = Math.floor(trimmed.length / 2);
  const spaceIdx = trimmed.indexOf(' ', mid);
  if (spaceIdx === -1) return [trimmed];

  return [trimmed.slice(0, spaceIdx).trim(), trimmed.slice(spaceIdx + 1).trim()];
}

export default function ShoooteExpertise() {
  const { expertise } = useShoooteContent();
  const headingLines = expertise.heading ? luxuryHeadingLines(expertise.heading) : [];
  const headingFitChars = headingLines.reduce((max, line) => Math.max(max, line.length), 0);

  return (
    <GwSection
      theme="shooote"
      id="expertise"
      className="wpo-expertise-section"
      sectionLabel={expertise.sectionLabel}
    >
      <div className="row align-items-center g-4 g-lg-5">
        <div className="col-lg-12 col-12">
          {headingLines.length ? (
            <div className="wow fadeInUp" data-wow-duration="1400ms">
              <h2
                className="gw-section__title shooote-luxury-heading"
                aria-label={expertise.heading}
                style={{ '--heading-fit': headingFitChars }}
              >
                {headingLines.map((line) => (
                  <span
                    key={line}
                    className="shooote-luxury-heading__row poort-text poort-in-right"
                  >
                    {line}
                  </span>
                ))}
              </h2>
            </div>
          ) : null}
          {expertise.statement ? (
            <p className="gw-section__statement shooote-scroll-fade">{expertise.statement}</p>
          ) : null}
          <a href={expertise.mailto} className="theme-btn shooote-mailto-btn">
            <i className="icon">
              <img src="/assets/shooote/images/arrow-2.svg" alt="" />
            </i>
            <i className="link-text">
              <span>{expertise.ctaLabel}</span>
            </i>
          </a>
        </div>
      </div>
    </GwSection>
  );
}
