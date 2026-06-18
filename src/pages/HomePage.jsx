import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import SiteLoader from '../components/ui/SiteLoader';
import HomeHero from '../components/home/HomeHero';
import ClickScrollSection from '../components/home/ClickScrollSection';
import ServicesSection from '../components/home/ServicesSection';
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
        <SiteLoader />
        <div className="top-glow">
          <div className="blur" />
        </div>
        <HomeHero />
        <ClickScrollSection />
        <ServicesSection />
        <WorkCtaSection />
        <BenefitsSection />
        <MainCtaSection cta={site.home.cta} />
        <SiteFooter />
      </main>
    </Layout>
  );
}
