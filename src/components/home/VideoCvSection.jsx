import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';

export default function WorkPreviewSection() {
  const { site } = useSite();
  const projects = site.work.projects;

  if (!projects?.length) return null;

  const preview = projects.slice(0, 3);

  return (
    <section data-nav="peach" className="section work-preview-section">
      <div className="work-preview-wrapper">
        <div className="work-preview-header">
          <span className="tag-text work-preview-tag">Selected Work</span>
          <h2 className="work-preview-headline">A few things I've built</h2>
        </div>
        <div className="work-preview-cards">
          {preview.map((project) => (
            <Link
              key={project.id}
              to="/work"
              className="work-preview-card"
            >
              <div className="work-preview-card__thumb">
                <img
                  src={project.navThumb}
                  alt={project.titleLine1}
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
        <div className="work-preview-cta">
          <Link to="/work" className="work-preview-cta__link">
            View all work →
          </Link>
        </div>
      </div>
    </section>
  );
}
