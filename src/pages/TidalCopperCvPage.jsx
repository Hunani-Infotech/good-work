import { useEffect } from 'react';
import TidalCopperLayout from '../templates/tidal-copper/components/TidalCopperLayout.jsx';
import TidalCopperHero from '../templates/tidal-copper/components/TidalCopperHero.jsx';
import TidalCopperExpertiseSection from '../templates/tidal-copper/components/TidalCopperExpertiseSection.jsx';
import TidalCopperNarrativeSection from '../templates/tidal-copper/components/TidalCopperNarrativeSection.jsx';
import TidalCopperCapabilitiesSection from '../templates/tidal-copper/components/TidalCopperCapabilitiesSection.jsx';
import TidalCopperCtaSection from '../templates/tidal-copper/components/TidalCopperCtaSection.jsx';
import TidalCopperFooter from '../templates/tidal-copper/components/TidalCopperFooter.jsx';
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
        <main className="main tidal-copper-landing cv-page-screens">
          <TidalCopperHero />
          <TidalCopperExpertiseSection />
          <TidalCopperNarrativeSection />
          <TidalCopperCapabilitiesSection />
        </main>
        <TidalCopperCtaSection />
        <TidalCopperFooter />
      </TidalCopperLayout>
      <VideoCvWidget accentColor="#510066" position="bottom-right" />
    </>
  );
}
