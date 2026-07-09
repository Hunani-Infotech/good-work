import { useEffect, useLayoutEffect } from 'react';
import '../styles/geroz-tailwind.css';

import {
  applyGerozImageCssVars,
  clearGerozImageCssVars,
  clearGerozThemeCssVars,
} from '../data/geroz/constants.js';
import { useGerozContent } from '../hooks/geroz/useGerozContent.js';
import { useGerozPageAnimations } from '../hooks/geroz/useGerozPageAnimations.js';
import { GerozColorThemeProvider } from '../geroz/context/GerozColorThemeContext.jsx';

import CustomCursor from '../components/ui/CustomCursor.jsx';
import GerozCvHeader from '../components/geroz/GerozCvHeader.jsx';
import GerozCvFooter from '../components/geroz/GerozCvFooter.jsx';
import GerozBackToTop from '../geroz/components/utils/BackToTopBtn.jsx';
import HeroSection4 from '../geroz/components/hero/HeroSection4.jsx';
import AboutSection4 from '../geroz/components/about/AboutSection4.jsx';
import VideoSection from '../geroz/components/video/VideoSection.jsx';
import CapabilitiesSection from '../geroz/components/capabilities/CapabilitiesSection.jsx';

function GerozCvPageContent() {
  const { siteMeta, images } = useGerozContent();
  useGerozPageAnimations();

  useLayoutEffect(() => {
    document.documentElement.classList.add('geroz-template');
    document.body.classList.add('geroz-template');
    applyGerozImageCssVars(images);

    return () => {
      document.documentElement.classList.remove('geroz-template');
      document.body.classList.remove('geroz-template');
      clearGerozImageCssVars();
      clearGerozThemeCssVars();
    };
  }, [images]);

  useEffect(() => {
    document.title = siteMeta.title;
  }, [siteMeta.title]);

  return (
    <>
      <CustomCursor variant="geroz" />
      <GerozCvHeader />
      <GerozBackToTop />
      <main className="overflow-hidden geroz-cv-main">
        <HeroSection4 />
        <VideoSection />
        <AboutSection4 />
        <CapabilitiesSection />
        <GerozCvFooter />
      </main>
    </>
  );
}

export default function GerozCvPage() {
  const { theme: initialTheme } = useGerozContent();

  return (
    <GerozColorThemeProvider initialIndex={initialTheme.colorThemeIndex ?? 0}>
      <GerozCvPageContent />
    </GerozColorThemeProvider>
  );
}
