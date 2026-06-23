import { useSite } from '../../context/SiteContext';
import CvSection from './CvSection';

export default function CvExpertiseSection() {
  const { site } = useSite();
  const { hero } = site.home;
  const { contact } = site.site;
  const videoCv = hero.videoCv || {};
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(contact.mailtoSubjectNav || '')}`;
  const ctaLabel = hero.ctaLabel || "Let's Connect";

  return (
    <CvSection screenClass="cv-what-screen" label="02 — Video" poweredByDark>
      <div className="cv-panel" id="whatPanel">
        {videoCv.src ? (
          <div className="cv-panel-video">
            <video autoPlay muted loop playsInline poster={videoCv.poster || undefined}>
              <source src={videoCv.src} type="video/mp4" />
            </video>
          </div>
        ) : null}

        <div className="cv-panel-body">
          <h2 className="cv-what-header" id="whatHeader">{hero.heading}</h2>

          {hero.heroStatement ? (
            <p className="cv-what-statement" id="whatStatement">{hero.heroStatement}</p>
          ) : null}

          <a href={mailto} className="cta-btn" id="whatCta">
            {ctaLabel} →
          </a>
        </div>
      </div>
    </CvSection>
  );
}
