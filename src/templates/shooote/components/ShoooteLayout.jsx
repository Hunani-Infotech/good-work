import { useRef } from 'react';
import CustomCursor from '../../../components/ui/CustomCursor.jsx';
import ShoooteHeader from './ShoooteHeader.jsx';
import ShoooteBackToTop from './ShoooteBackToTop.jsx';

export default function ShoooteLayout({ wrapperClass = 'page-wrapper', children }) {
  const wrapperRef = useRef(null);

  return (
    <>
      <CustomCursor variant="shooote" />
      <ShoooteHeader />
      <div className={wrapperClass} ref={wrapperRef}>
        {children}
        <ShoooteBackToTop />
      </div>
    </>
  );
}
