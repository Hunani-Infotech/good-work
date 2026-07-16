export default function SectionHeading({
  tag,
  sectionIndex,
  singleLine = false,
}) {
  const titleClass = [
    'isak-section-heading__title',
    'split-text',
    'effect-blur-fade',
    singleLine ? 'isak-section-heading__title--single-line' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (!tag) return null;

  return (
    <header className="isak-section-heading">
      <div className="isak-section-heading__title-row effectFade fadeUp no-div">
        {sectionIndex ? (
          <span className="isak-section-heading__index">{sectionIndex}</span>
        ) : null}
        <h2 className={titleClass}>{tag}</h2>
      </div>
      <div className="isak-section-heading__baseline" aria-hidden="true">
        <span className="isak-luxury__gem" />
        <span className="isak-section-heading__rule" />
      </div>
    </header>
  );
}
