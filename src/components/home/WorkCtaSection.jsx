import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';

export default function WorkCtaSection() {
  const { site } = useSite();
  const { workCta } = site.home;
  const { folderFront, folderProjects, folderBack } = site.site.assets;

  return (
    <section data-nav="grey" className="section">
      <div className="work-cta-wrapper">
        <div className="work-big-text" aria-label="Work">
          <span className="work-letter work-letter-w">{workCta.bigText.w}</span>
          <div className="work-cta-o-slot">
            <span className="work-o-spacer" aria-hidden="true">
              o
            </span>
            <div className="work-cta-content-wrapper">
              <div className="body-copy work-copy-line work-copy-top">
                {workCta.topWords.map((word) => (
                  <span key={word} className="work-word">
                    {word}
                  </span>
                ))}
              </div>
              <Link to="/work" className="folder-wrapper w-inline-block">
                {folderFront ? (
                  <>
                    <img src={folderFront} loading="lazy" alt="" className="front-folder" />
                    {folderProjects ? (
                      <img src={folderProjects} loading="lazy" alt="" className="projects-folder" />
                    ) : null}
                    {folderBack ? (
                      <img src={folderBack} loading="lazy" alt="" className="back-folder" />
                    ) : null}
                  </>
                ) : (
                  <span className="work-folder-label">Work</span>
                )}
              </Link>
              <div className="body-copy work-copy-line work-copy-bottom">
                {workCta.bottomWords.map((word) => (
                  <span key={word} className="work-word">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <span className="work-letter work-letter-rk">{workCta.bigText.rk}</span>
        </div>
      </div>
    </section>
  );
}
