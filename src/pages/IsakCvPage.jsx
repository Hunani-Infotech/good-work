import { useEffect } from 'react';
import CustomCursor from '../components/ui/CustomCursor';
import IsakShell from '../components/isak/IsakShell.jsx';
import { useIsakAnimations } from '../hooks/isak/useIsakPageAnimations.js';
import { useIsakContent } from '../hooks/isak/useIsakContent.js';
import '../styles/isak.css';

export default function IsakCvPage() {
  useIsakAnimations();
  const { meta } = useIsakContent();

  useEffect(() => {
    document.documentElement.classList.add('isak-template');
    document.body.classList.add('isak-template');

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/isak/vendor.css';
    document.head.insertBefore(link, document.head.firstChild);

    return () => {
      document.documentElement.classList.remove('isak-template');
      document.body.classList.remove('isak-template');
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  useEffect(() => {
    document.title = meta.title;
    const favicon = document.querySelector('link[rel="shortcut icon"]');
    if (favicon && meta.favicon) favicon.setAttribute('href', meta.favicon);
  }, [meta.title, meta.favicon]);

  return (
    <>
      <CustomCursor />
      <IsakShell />
    </>
  );
}
