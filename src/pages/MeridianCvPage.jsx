import { useEffect } from 'react';
import '../styles/meridian-tailwind.css';

import CustomCursor from '../components/ui/CustomCursor.jsx';
import { useMeridianContent } from '../hooks/meridian/useMeridianContent.js';
import { useMeridianPageAnimations } from '../hooks/meridian/useMeridianPageAnimations.js';
import { MeridianColorThemeProvider } from '../meridian/context/MeridianColorThemeContext.jsx';

import MeridianHeader from '../meridian/components/layout/MeridianHeader.jsx';
import MeridianHeroSection from '../meridian/components/hero/MeridianHeroSection.jsx';
import MeridianManifestoSection from '../meridian/components/manifesto/MeridianManifestoSection.jsx';
import MeridianAboutSection from '../meridian/components/about/MeridianAboutSection.jsx';
import MeridianCapabilitiesSection from '../meridian/components/capabilities/MeridianCapabilitiesSection.jsx';
import MeridianContactSection from '../meridian/components/contact/MeridianContactSection.jsx';

function MeridianCvPageContent() {
  const { siteMeta } = useMeridianContent();
  useMeridianPageAnimations();

  useEffect(() => {
    document.title = siteMeta.title;
  }, [siteMeta.title]);

  return (
    <>
      <CustomCursor variant="meridian" />
      <MeridianHeader />
      <main className="meridian-cv-main">
        <MeridianHeroSection />
        <MeridianManifestoSection />
        <MeridianAboutSection />
        <MeridianCapabilitiesSection />
        <MeridianContactSection />
      </main>
    </>
  );
}

export default function MeridianCvPage() {
  return (
    <MeridianColorThemeProvider>
      <MeridianCvPageContent />
    </MeridianColorThemeProvider>
  );
}
