import { useEffect, useRef } from 'react';
import '../../styles/shooote.css';
import ShoooteCursor from './ShoooteCursor.jsx';
import ShoooteHeader from './ShoooteHeader.jsx';
import ShoooteBackToTop from './ShoooteBackToTop.jsx';

export default function ShoooteLayout({ wrapperClass = 'page-wrapper', children }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('shooote-template');

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
        <ShoooteCursor />
        {children}
        <ShoooteBackToTop />
      </div>
    </>
  );
}
