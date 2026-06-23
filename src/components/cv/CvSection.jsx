import CvPoweredBy from './CvPoweredBy';
import { CvSectionEyebrow, CvSectionLabel } from './CvSectionChrome';

export default function CvSection({
  screenClass,
  label,
  labelLight = false,
  eyebrowId,
  eyebrow,
  eyebrowClassName = '',
  poweredByDark = false,
  backgroundImage = '',
  beforeInner = null,
  children,
}) {
  const sectionStyle = backgroundImage
    ? { '--section-photo': `url(${backgroundImage})` }
    : undefined;

  return (
    <section
      className={`${screenClass}${backgroundImage ? ' cv-section--photo-bg' : ''}`}
      style={sectionStyle}
    >
      {beforeInner}
      <div className={`${screenClass}__inner`}>
        <CvSectionLabel light={labelLight}>{label}</CvSectionLabel>
        {eyebrow ? (
          <CvSectionEyebrow id={eyebrowId} className={eyebrowClassName}>
            {eyebrow}
          </CvSectionEyebrow>
        ) : null}
        {children}
      </div>
      <CvPoweredBy dark={poweredByDark} />
    </section>
  );
}
