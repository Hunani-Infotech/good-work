import { useSite } from '../../context/SiteContext';

export default function WorkSidebarNav() {
  const { site } = useSite();

  return (
    <div className="main-cont-nav-work">
      <div className="wrapper-work-nav" />
      <ul role="list" className="wrapper-work-nav w-list-unstyled">
        {site.work.projects.map((project) => (
          <li key={project.id} className="wrapper-nav-work">
            <div className="nav-dot off" />
            <a href={`#${project.id}`} className="link-wrapper-project w-inline-block">
              <div className="nav-dot" />
              <div className="project-cont-nav">
                <div>{project.navLabel}</div>
                <img src={project.navThumb} loading="lazy" sizes="100vw" alt="" className="img-project-nav" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
