import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import HomeHero from '../components/home/HomeHero';
import ClickScrollSection from '../components/home/ClickScrollSection';
import NarrativeSection from '../components/home/NarrativeSection';
import WorkPreviewSection from '../components/home/VideoCvSection';
import ExpertiseSection from '../components/home/ExpertiseSection';
import WorkCtaSection from '../components/home/WorkCtaSection';
import BenefitsSection from '../components/home/BenefitsSection';
import MainCtaSection from '../components/sections/MainCtaSection';
import SiteFooter from '../components/sections/SiteFooter';
import { useHomeAnimations } from '../hooks/useHomeAnimations';
import { useSite } from '../context/SiteContext';


export default function HomePage() {
  useHomeAnimations();
  const { site } = useSite();

  useEffect(() => {
    document.title = site.site.meta.homeTitle;
  }, [site.site.meta.homeTitle]);

  return (
    <Layout>
      <main className="main">
        <div className="top-glow">
          <div className="blur" />
        </div>
        <HomeHero />
        <ClickScrollSection />
        <NarrativeSection />
        <WorkPreviewSection />
        <ExpertiseSection />
        <WorkCtaSection />
        <BenefitsSection />
        <MainCtaSection cta={site.home.cta} />
        <SiteFooter />
      </main>
    </Layout>
  );
}
