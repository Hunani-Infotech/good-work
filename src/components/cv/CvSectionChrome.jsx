export function CvSectionLabel({ children, light = false }) {
  if (!children) return null;
  return (
    <p className={`section-label${light ? ' section-label--light' : ''}`}>{children}</p>
  );
}

export function CvSectionEyebrow({ children, id, className = '' }) {
  if (!children) return null;

  return (
    <div id={id} className={`eyebrow ${className}`.trim()}>
      <span className="eyebrow__dot" aria-hidden="true" />
      <span className="eyebrow__line" aria-hidden="true" />
      <span className="eyebrow__text">{children}</span>
    </div>
  );
}
