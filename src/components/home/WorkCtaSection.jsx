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
          <span className="work-o-gap">
            <span className="text-span-2" aria-hidden="true">
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
              <Link
                to="/work"
                className={`folder-wrapper w-inline-block${folderFront ? '' : ' folder-wrapper--empty'}`}
                aria-label="View my work"
              >
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
                ) : null}
              </Link>
              <div className="body-copy work-copy-line work-copy-bottom">
                {workCta.bottomWords.map((word) => (
                  <span key={word} className="work-word">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </span>
          <span className="work-letter work-letter-rk">{workCta.bigText.rk}</span>
        </div>
      </div>
    </section>
  );
}
