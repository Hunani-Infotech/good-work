import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import SiteLoader from '../components/ui/SiteLoader';
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


function HomeTicker({ site }) {
  const serviceItems = site.home.services?.items?.map((s) => s.title) || [];
  const expertiseItems = site.home.expertise?.categories?.map((c) => c.name) || [];
  const items = [...serviceItems, ...expertiseItems].filter(Boolean);
  if (!items.length) return null;
  /* Duplicate so the -50% translateX loop is seamless */
  const doubled = [...items, ...items];
  return (
    <div className="home-ticker-wrap" aria-hidden="true">
      <div className="home-ticker-track">
        {doubled.map((label, i) => (
          <span key={i} className="home-ticker-item">
            {label}
            <span className="home-ticker-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

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
        <HomeTicker site={site} />
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
