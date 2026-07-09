import { useCallback, useState } from 'react';
import GerozHeader from './GerozHeader.jsx';

export default function GerozLayout({
  children,
  homeLink,
  navLinks,
  className = '',
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleMenu = useCallback(() => {
    setMobileMenuOpen((open) => !open);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className={`min-h-screen bg-stone-950 text-stone-100${className ? ` ${className}` : ''}`}>
      <GerozHeader
        homeLink={homeLink}
        navLinks={navLinks}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={handleToggleMenu}
        onCloseMenu={handleCloseMenu}
      />
      <main className="pt-20">{children}</main>
    </div>
  );
}
