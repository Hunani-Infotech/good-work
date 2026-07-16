import { useEffect } from 'react';
import Layout from '../templates/tidal-copper/components/Layout.jsx';
import Hero from '../templates/tidal-copper/components/Hero.jsx';
import ExpertiseSection from '../templates/tidal-copper/components/ExpertiseSection.jsx';
import NarrativeSection from '../templates/tidal-copper/components/NarrativeSection.jsx';
import CapabilitiesSection from '../templates/tidal-copper/components/CapabilitiesSection.jsx';
import CtaSection from '../templates/tidal-copper/components/CtaSection.jsx';
import Footer from '../templates/tidal-copper/components/Footer.jsx';
import { useTidalCopperAnimations } from '../hooks/tidal-copper/usePageAnimations.js';
import { useSite } from '../context/SiteContext.jsx';
import VideoCvWidget from '../components/ui/VideoCvWidget.jsx';
import '../styles/tidal-copper.css';
import '../styles/video-cv-widget.css';

export default function TidalCopperCvPage() {
  useTidalCopperAnimations();
  const { site } = useSite();

  useEffect(() => {
    document.title = site.site.meta.homeTitle;
  }, [site.site.meta.homeTitle]);

  return (
    <>
      <Layout>
        <div id="scroll-progress" aria-hidden="true" />
        <main className="main tidal-copper-landing cv-page-screens">
          <Hero />
          <ExpertiseSection />
          <NarrativeSection />
          <CapabilitiesSection />
        </main>
        <CtaSection />
        <Footer />
      </Layout>
      <VideoCvWidget accentColor="#510066" position="bottom-right" />
    </>
  );
}
