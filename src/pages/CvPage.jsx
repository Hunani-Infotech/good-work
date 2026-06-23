import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import CvHero from '../components/cv/CvHero';
import CvExpertiseSection from '../components/cv/CvExpertiseSection';
import CvNarrativeSection from '../components/cv/CvNarrativeSection';
import CvCapabilitiesSection from '../components/cv/CvCapabilitiesSection';
import { useCvAnimations } from '../hooks/useScrollPageAnimations';
import { useSite } from '../context/SiteContext';
import '../styles/cv-landing.css';

export default function CvPage() {
  useCvAnimations();
  const { site } = useSite();

  useEffect(() => {
    document.title = site.site.meta.homeTitle;
  }, [site.site.meta.homeTitle]);

  return (
    <Layout>
      <div id="scroll-progress" aria-hidden="true" />
      <main className="main cv-landing">
        <CvHero />
        <CvExpertiseSection />
        <CvNarrativeSection />
        <CvCapabilitiesSection />
      </main>
    </Layout>
  );
}
