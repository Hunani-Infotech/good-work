import MediaImage from '../ui/MediaImage';
import LazyVideo from '../ui/LazyVideo';
import { useSite } from '../../context/SiteContext';

function ProjectMedia({ item }) {
  if (item.type === 'video') {
    const containerClass = `video-cont-p2${item.variant && item.variant !== 'default' ? ` ${item.variant}` : ''}`;
    return <LazyVideo src={item.src} poster={item.poster} containerClass={containerClass} />;
  }
  return <MediaImage src={item.src} className="img-project" variant={item.variant} />;
}

export default function ProjectCard({ project }) {
  const { site } = useSite();
  const { arrowGreyOut } = site.site.assets;

  return (
    <div id={project.id} className="main-project-wrapper">
      <div className="cont-project-content">
        <div className="content-project-info first">
          <h3 className="headline-project">
            {project.titleLine1}
            <br />
            {project.titleLine2}
          </h3>
          <div className="pill-year">{project.year}</div>
          <div className="dot-project" />
          {project.liveUrl && (
            <div className="cont-cta-work">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="main-cont-button w-variant-948bd83d-21eb-0eb2-4275-2385c9d64bcd w-inline-block"
              >
                <div className="icon-wrapper-cta-first w-variant-948bd83d-21eb-0eb2-4275-2385c9d64bcd">
                  <img loading="lazy" src={arrowGreyOut} alt="" className="arrow-cion w-variant-948bd83d-21eb-0eb2-4275-2385c9d64bcd" />
                </div>
                <div className="text-wrapper-cta w-variant-948bd83d-21eb-0eb2-4275-2385c9d64bcd">
                  {project.liveCtaLabel}
                </div>
                <div className="icon-wrapper-cta w-variant-948bd83d-21eb-0eb2-4275-2385c9d64bcd">
                  <img loading="lazy" src={arrowGreyOut} alt="" className="arrow-cion w-variant-948bd83d-21eb-0eb2-4275-2385c9d64bcd" />
                </div>
              </a>
            </div>
          )}
        </div>
        <div className="content-project-info">
          <p className="body-copy title">Challenge:</p>
          <p className="body-copy black">{project.challenge}</p>
        </div>
        <div className="content-project-info">
          <p className="body-copy title">Services:</p>
          <div className="pill-services-cont">
            {project.services.map((service) => (
              <div key={service} className="pill-service">
                {service}
              </div>
            ))}
          </div>
        </div>
        <div className="content-project-info">
          <p className="body-copy title">Role:</p>
          <p className="body-copy black">{project.role}</p>
        </div>
      </div>
      <div className={`cont-project-imgs ${project.galleryLayoutClass}`}>
        {project.media.map((item, idx) => (
          <ProjectMedia key={`${project.id}-media-${idx}`} item={item} />
        ))}
      </div>
    </div>
  );
}
