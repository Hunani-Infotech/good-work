import { useEffect } from 'react';
import CvTopBar from './CvTopBar';
import SharePreviewBanner from '../ui/SharePreviewBanner';
import CustomCursor from '../ui/CustomCursor';
import { useSite } from '../../context/SiteContext';
import { resetDocumentScrollState } from '../../animations/scrollRuntime.js';

export default function Layout({ children }) {
  const { site } = useSite();
  const theme = site.site.theme || {};

  useEffect(() => {
    document.body.className = 'body cv-page';
    resetDocumentScrollState({ keepSiteReady: true });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme.purple) root.style.setProperty('--brand-purple', theme.purple);
    if (theme.orange) root.style.setProperty('--brand-orange', theme.orange);
    if (theme.bgWarm) root.style.setProperty('--brand-bg-warm', theme.bgWarm);
    if (theme.grey) root.style.setProperty('--brand-grey', theme.grey);
    if (site.site.meta?.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = site.site.meta.favicon;
    }
  }, [theme, site.site.meta?.favicon]);

  return (
    <>
      <CustomCursor />
      <SharePreviewBanner />
      <CvTopBar />
      {children}
    </>
  );
}
