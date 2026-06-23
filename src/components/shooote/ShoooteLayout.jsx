import { useEffect, useRef, useState } from 'react';
import { destroySiteLoader, revealSiteContent } from '../../animations/loaderAnimations.js';
import '../../styles/shooote.css';
import ShoootePreloader from './ShoootePreloader.jsx';
import ShoooteCursor from './ShoooteCursor.jsx';
import ShoooteHeader from './ShoooteHeader.jsx';
import ShoooteBackToTop from './ShoooteBackToTop.jsx';

export default function ShoooteLayout({ wrapperClass = 'page-wrapper', children }) {
  const [ready, setReady] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('shooote-template');
    destroySiteLoader();
    revealSiteContent();
    document.documentElement.classList.remove('is-loader-active');

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/shooote/vendor.css';
    document.head.insertBefore(link, document.head.firstChild);

    return () => {
      document.body.classList.remove('shooote-template');
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  return (
    <>
      <ShoooteHeader />
      <div className={wrapperClass} ref={wrapperRef}>
        {!ready && <ShoootePreloader onComplete={() => setReady(true)} />}
        <ShoooteCursor />
        {children}
        <ShoooteBackToTop ready={ready} />
      </div>
    </>
  );
}
