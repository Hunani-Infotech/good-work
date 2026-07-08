import { useEffect } from 'react';
import TidalCopperLayout from '../components/tidal-copper/TidalCopperLayout.jsx';
import TidalCopperHero from '../components/tidal-copper/TidalCopperHero.jsx';
import TidalCopperExpertiseSection from '../components/tidal-copper/TidalCopperExpertiseSection.jsx';
import TidalCopperNarrativeSection from '../components/tidal-copper/TidalCopperNarrativeSection.jsx';
import TidalCopperCapabilitiesSection from '../components/tidal-copper/TidalCopperCapabilitiesSection.jsx';
import TidalCopperFooter from '../components/tidal-copper/TidalCopperFooter.jsx';
import { useTidalCopperAnimations } from '../hooks/tidal-copper/useTidalCopperPageAnimations.js';
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
      <TidalCopperLayout>
        <div id="scroll-progress" aria-hidden="true" />
        <main className="main tidal-copper-landing">
          <TidalCopperHero />
          <TidalCopperExpertiseSection />
          <TidalCopperNarrativeSection />
          <TidalCopperCapabilitiesSection />
        </main>
        <TidalCopperFooter />
      </TidalCopperLayout>
      <VideoCvWidget accentColor="#510066" position="bottom-right" />
    </>
  );
}
