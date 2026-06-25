import { useRef } from 'react';
import ShoooteCursor from './ShoooteCursor.jsx';
import ShoooteHeader from './ShoooteHeader.jsx';
import ShoooteBackToTop from './ShoooteBackToTop.jsx';

export default function ShoooteLayout({ wrapperClass = 'page-wrapper', children }) {
  const wrapperRef = useRef(null);

  return (
    <>
      <ShoooteCursor />
      <ShoooteHeader />
      <div className={wrapperClass} ref={wrapperRef}>
        {children}
        <ShoooteBackToTop />
      </div>
    </>
  );
}
