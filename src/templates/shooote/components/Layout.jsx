import { useRef } from 'react';
import CustomCursor from '../../../components/ui/CustomCursor.jsx';
import Header from './Header.jsx';
import BackToTop from './BackToTop.jsx';

export default function Layout({ wrapperClass = 'page-wrapper', children }) {
  const wrapperRef = useRef(null);

  return (
    <>
      <CustomCursor variant="shooote" />
      <Header />
      <div className={wrapperClass} ref={wrapperRef}>
        {children}
        <BackToTop />
      </div>
    </>
  );
}
