import { useSite } from '../../context/SiteContext';

export default function WorkMobileNav() {
  const { site } = useSite();

  return (
    <nav className="work-mobile-nav" aria-label="Project navigation">
      <ul role="list" className="work-mobile-nav__list w-list-unstyled">
        {site.work.projects.map((project) => (
          <li key={project.id} className="work-mobile-nav__item">
            <a href={`#${project.id}`} className="link-wrapper-project work-mobile-nav__link">
              {project.navLabel}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
