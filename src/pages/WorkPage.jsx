import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import WorkSidebarNav from '../components/work/WorkSidebarNav';
import WorkMobileNav from '../components/work/WorkMobileNav';
import WorkHeader from '../components/work/WorkHeader';
import ProjectCard from '../components/work/ProjectCard';
import MainCtaSection from '../components/sections/MainCtaSection';
import SiteFooter from '../components/sections/SiteFooter';
import { useWorkAnimations } from '../hooks/useWorkAnimations';
import { useSite } from '../context/SiteContext';
import '../styles/work.css';

export default function WorkPage() {
  useWorkAnimations();
  const { site } = useSite();

  useEffect(() => {
    document.title = site.site.meta.workTitle;
  }, [site.site.meta.workTitle]);

  return (
    <Layout bodyClass="work">
      <main className="main">
        <div className="blur work" />
        <section data-nav="grey" className="section work">
          <WorkSidebarNav />
          <div className="main-wrapper-work">
            <WorkHeader />
            <WorkMobileNav />
            {site.work.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
        <MainCtaSection cta={site.work.cta} sectionId="work-main-cta" />
        <SiteFooter />
      </main>
    </Layout>
  );
}
