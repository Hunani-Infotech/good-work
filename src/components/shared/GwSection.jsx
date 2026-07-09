import TidalCopperPoweredBy from '../tidal-copper/TidalCopperPoweredBy.jsx';
import { TidalCopperSectionEyebrow, TidalCopperSectionLabel } from '../tidal-copper/TidalCopperSectionChrome.jsx';

/**
 * Shared GoodWork 4-screen section shell — one markup/CSS flow per template theme.
 * tidal-copper: full-screen sections + section chrome
 * shooote: container sections + label / title / body
 * isak: flat-spacing blocks + sect-tag / s-title pattern
 */
export default function GwSection({
  theme = 'tidal-copper',  id,
  sectionLabel,
  eyebrow,
  eyebrowId,
  eyebrowClassName = '',
  title,
  labelLight = false,
  icon,
  backgroundImage = '',
  poweredByDark = false,
  beforeInner = null,
  screenClass = '',
  className = '',
  wow = true,
  children,
}) {
  if (theme === 'tidal-copper') {
    const sectionStyle = backgroundImage
      ? { '--section-photo': `url(${backgroundImage})` }
      : undefined;

    return (
      <section
        id={id}
        className={`${screenClass}${backgroundImage ? ' cv-section--photo-bg' : ''}${className ? ` ${className}` : ''}`}
        style={sectionStyle}
      >
        {beforeInner}
        <div className={`${screenClass}__inner`}>
          <TidalCopperSectionLabel light={labelLight}>{sectionLabel}</TidalCopperSectionLabel>
          {eyebrow ? (
            <TidalCopperSectionEyebrow id={eyebrowId} className={eyebrowClassName}>
              {eyebrow}
            </TidalCopperSectionEyebrow>
          ) : null}
          {children}
        </div>
        <TidalCopperPoweredBy dark={poweredByDark} />      </section>
    );
  }

  if (theme === 'shooote') {
    const sectionStyle = backgroundImage
      ? { '--gw-section-photo': `url(${backgroundImage})` }
      : undefined;
    const wowClass = wow ? ' wow fadeInUp' : '';
    const wowProps = wow ? { 'data-wow-duration': '1000ms' } : {};

    return (
      <section
        id={id}
        className={`gw-section gw-section--shooote section-padding${backgroundImage ? ' gw-section--photo-bg' : ''}${className ? ` ${className}` : ''}`}
        style={sectionStyle}
      >
        {beforeInner}
        <div className="container">
          {sectionLabel ? (
            <span className={`gw-section__label${wowClass}`} {...wowProps}>
              {sectionLabel}
            </span>
          ) : null}
          {eyebrow ? (
            <div className="wpo-section-title">
              <h2 className="gw-section__title poort-text poort-in-right">{eyebrow}</h2>
            </div>
          ) : null}
          {title ? (
            <div className="wpo-section-title">
              <h3 className="gw-section__title poort-text poort-in-right">{title}</h3>
            </div>
          ) : null}
          <div className="gw-section__body">{children}</div>
        </div>
      </section>
    );
  }

  if (theme === 'isak') {
    return (
      <div id={id} className={`gw-section gw-section--isak flat-spacing${className ? ` ${className}` : ''}`}>
        {eyebrow ? (
          <div className="sect-tag text-caption fw-medium effectFade fadeUp no-div">
            {icon ? <i className={`icon ${icon}`} /> : null}
            {eyebrow}
          </div>
        ) : null}
        {title ? (
          <h4 className="s-title letter-space--2 text-black-72 split-text effect-blur-fade">
            {title}
          </h4>
        ) : null}
        <div className="gw-section__body">{children}</div>
      </div>
    );
  }

  return null;
}

export function GwSectionLabel({ children, center = false, className = '' }) {
  if (!children) return null;
  return (
    <span
      className={`gw-section__label${center ? ' gw-section__label--center' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </span>
  );
}
