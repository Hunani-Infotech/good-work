import { useEffect, useLayoutEffect } from 'react';
import '../styles/geroz-tailwind.css';

import {
  applyGerozImageCssVars,
  clearGerozImageCssVars,
  clearGerozThemeCssVars,
} from '../data/geroz/constants.js';
import { useContent } from '../hooks/geroz/useContent.js';
import { usePageAnimations } from '../hooks/geroz/usePageAnimations.js';
import { GerozColorThemeProvider } from '../templates/geroz/context/ColorThemeContext.jsx';

import CvHeader from '../templates/geroz/components/CvHeader.jsx';
import CvCtaSection from '../templates/geroz/components/CvCtaSection.jsx';
import CvFooter from '../templates/geroz/components/CvFooter.jsx';
import GerozBackToTop from '../templates/geroz/components/utils/BackToTopBtn.jsx';
import HeroSection4 from '../templates/geroz/components/hero/HeroSection4.jsx';
import AboutSection4 from '../templates/geroz/components/about/AboutSection4.jsx';
import VideoSection from '../templates/geroz/components/video/VideoSection.jsx';
import CapabilitiesSection from '../templates/geroz/components/capabilities/CapabilitiesSection.jsx';
import CustomCursor from '../components/ui/CustomCursor.jsx';

function GerozCvPageContent() {
  const { siteMeta, images } = useContent();
  usePageAnimations();

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
      <CvHeader />
      <GerozBackToTop />
      <main className="overflow-hidden geroz-cv-main">
        <div className="cv-page-screens">
          <HeroSection4 />
          <VideoSection />
          <AboutSection4 />
          <CapabilitiesSection />
        </div>
        <CvCtaSection />
        <CvFooter />
      </main>
    </>
  );
}

export default function GerozCvPage() {
  const { theme: initialTheme } = useContent();

  return (
    <GerozColorThemeProvider initialIndex={initialTheme.colorThemeIndex ?? 0}>
      <GerozCvPageContent />
    </GerozColorThemeProvider>
  );
}
