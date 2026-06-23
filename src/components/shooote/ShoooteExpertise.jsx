import GwSection from '../shared/GwSection.jsx';
import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';

export default function ShoooteExpertise() {
  const { expertise } = useShoooteContent();
  const { video } = expertise;

  return (
    <GwSection
      theme="shooote"
      id="expertise"
      className="wpo-expertise-section"
      sectionLabel={expertise.sectionLabel}
    >
      <div className="row align-items-center g-4 g-lg-5">
        {video.src ? (
          <div className="col-lg-6 col-12">
            <div className="gw-section__video wow fadeInUp" data-wow-duration="1200ms">
              <video autoPlay muted loop playsInline poster={video.poster || undefined}>
                <source src={video.src} type="video/mp4" />
              </video>
            </div>
          </div>
        ) : null}
        <div className={video.src ? 'col-lg-6 col-12' : 'col-lg-10 col-12'}>
          <div className="wow fadeInUp" data-wow-duration="1400ms">
            {expertise.heading ? (
              <h2 className="gw-section__title poort-text poort-in-right">{expertise.heading}</h2>
            ) : null}
            {expertise.statement ? (
              <p className="gw-section__statement">{expertise.statement}</p>
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
      </div>
    </GwSection>
  );
}
