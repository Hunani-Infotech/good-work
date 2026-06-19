import { useSite } from '../../context/SiteContext';

export default function BenefitsSection() {
  const { site } = useSite();
  const { benefits } = site.home;
  const { checkMark, arrowGrey } = site.site.assets;
  const { step1, step2 } = benefits;

  const bgStyle = step1.backgroundImage
    ? { backgroundImage: `url(${step1.backgroundImage})` }
    : undefined;

  return (
    <section data-nav="peach" className="section">
      <div className="ticker-main-wrapper" />
      <div className="benefits-main-wrapper">
        <div className={`bg-benefits-wrapper${step1.backgroundImage ? ' has-bg-image' : ''}`} style={bgStyle}>
          <div className="main-cont-step1">
            <div className="text-wrapper-align-benefit">
              <h2 className="h2-headline-step1-1">{step1.line1}</h2>
            </div>
            <div className="text-wrapper-align-benefit _2">
              <h2 className="h2-headline-step1-2">{step1.line2}</h2>
            </div>
            {step1.silhouette ? (
              <img src={step1.silhouette} loading="lazy" sizes="100vw" alt="" className="about-silhouette-img" />
            ) : null}
            <div className="line step1" />
            <h2 className="h2-headline-step1-3">{step1.line3}</h2>
          </div>
          <div className="main-cont-step2">
            <div className="step2-headline-wrapper">
              <h2 className="h2-benefit-1">{step2.headline1}</h2>
              <h2
                className="h2-benefit-2"
                dangerouslySetInnerHTML={{ __html: step2.headline2 }}
              />
            </div>
            <div className="line-step2" />
            <ul role="list" className="list-benefits w-list-unstyled">
              {step2.bullets.map((text) => (
                <li key={text} className="item-benefits-cont">
                  <div className="text-benefit-cont">
                    {checkMark ? (
                      <img src={checkMark} loading="lazy" alt="" className="check-icon" />
                    ) : null}
                    <h3 className="he-bulltet">{text}</h3>
                  </div>
                  <div className="line-benefit" />
                </li>
              ))}
            </ul>
            <div className="cont-cta-benefitc">
              <a href="#main-cta" className="main-cont-button w-inline-block">
                {arrowGrey ? (
                  <div className="icon-wrapper-cta-first">
                    <img loading="lazy" src={arrowGrey} alt="" className="arrow-cion" />
                  </div>
                ) : null}
                <div className="text-wrapper-cta">{step2.ctaLabel}</div>
                {arrowGrey ? (
                  <div className="icon-wrapper-cta">
                    <img loading="lazy" src={arrowGrey} alt="" className="arrow-cion" />
                  </div>
                ) : null}
              </a>
            </div>
          </div>
          {step2.darkImage ? (
            <img src={step2.darkImage} loading="lazy" sizes="100vw" alt="" className="about-dark-img" />
          ) : null}
          {step2.lightImage ? (
            <img src={step2.lightImage} loading="lazy" sizes="100vw" alt="" className="about-light-img" />
          ) : null}
          {(step2.darkImage || step2.lightImage) ? (
            <div className="benefits-bg-overlay" aria-hidden="true" />
          ) : null}
        </div>
        <div className="benefits-height-1step" />
        <div className="benefits-height-2step" />
      </div>
    </section>
  );
}
