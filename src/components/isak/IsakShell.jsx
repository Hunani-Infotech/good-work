import { useEffect } from 'react';
import { IsakThemeProvider } from './IsakThemeProvider.jsx';
import { BodyBackground } from './BodyBackground.jsx';
import { SettingColorProvider } from './SettingColorMenu.jsx';
import { MobileMenu } from './MobileMenu.jsx';
import { DesktopSidebar } from './DesktopSidebar.jsx';
import { HeaderClock } from './HeaderClock.jsx';
import { UserSidebar } from './UserSidebar.jsx';
import { Intro } from './sections/Intro.jsx';
import { About } from './sections/About.jsx';
import { Footer } from './sections/Footer.jsx';
import { useClock } from '../../hooks/isak/useClock.js';
import { useHeadlineRotate } from '../../hooks/isak/useHeadlineRotate.js';
import { useBodyThemeClass } from '../../hooks/isak/useBodyThemeClass.js';

function IsakShellInner({
  defaultMode = 'dark',
  forceMode,
  showCloudBg = true,
  bodyClass = 'counter-scroll',
}) {
  useBodyThemeClass({ defaultMode });

  useEffect(() => {
    const body = document.body;
    const classes = bodyClass.split(' ').filter(Boolean);

    classes.forEach((c) => body.classList.add(c));

    return () => {
      classes.forEach((c) => body.classList.remove(c));
    };
  }, [bodyClass]);

  useClock();
  useHeadlineRotate();

  return (
    <SettingColorProvider defaultMode={defaultMode} forceMode={forceMode}>
      <BodyBackground showCloudItem={showCloudBg} />

      <MobileMenu />

      <DesktopSidebar />

      <main id="wrapper">
        <HeaderClock />

        <UserSidebar />

        <div className="main-content">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-xl-8 ms-auto">
                <div className="wrap-container">
                  <Intro />
                  <About />
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SettingColorProvider>
  );
}

export default function IsakShell(props) {
  return (
    <IsakThemeProvider defaultTheme={props.defaultMode ?? 'dark'} forceTheme={props.forceMode}>
      <IsakShellInner {...props} />
    </IsakThemeProvider>
  );
}
