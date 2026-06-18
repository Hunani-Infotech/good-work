import { useSite } from '../../context/SiteContext';

export default function MainCtaSection({ cta, sectionId = 'main-cta' }) {
  const { site } = useSite();
  const { email, emailDisplay, mailtoSubjectFooter } = site.site.contact;
  const { arrowGrey } = site.site.assets;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(mailtoSubjectFooter || 'Hello')}`;

  return (
    <section data-nav="grey" className="section">
      <div id={sectionId} className="main-cta-wrapper">
        <div className="content-cta-wrapper">
          <div className="cta-text-wrapper">
            <h2 className="heading-cta main">{cta.headline}</h2>
            <p className="body-copy-cta">{cta.subheadline}</p>
          </div>
          <a href={mailto} className="cta-button-wrapper w-inline-block">
            {arrowGrey ? (
              <div className="cont-icon-cta">
                <img src={arrowGrey} loading="lazy" alt="" className="arrow-cta" />
              </div>
            ) : null}
            <h2 className="heading-cta">{cta.buttonLabel}</h2>
            <h2 className="email-cta">{emailDisplay}</h2>
            <div className="hover-main-cta" />
            <div className="cta-copy-tooltip" aria-hidden="true">
              {cta.tooltip}
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
