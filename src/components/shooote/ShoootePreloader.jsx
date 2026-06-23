import { useEffect, useState } from 'react';
import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';

export default function ShoootePreloader({ onComplete }) {
  const { preloaderImage } = useShoooteContent();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      setHidden(true);
      window.setTimeout(() => onComplete?.(), 500);
    }, 100);

    return () => window.clearTimeout(showTimer);
  }, [onComplete]);

  return (
    <div className={`preloader${hidden ? ' is-hidden' : ''}`}>
      <div className="vertical-centered-box">
        <div className="content">
          <div className="loader-circle" />
          <div className="loader-line-mask">
            <div className="loader-line" />
          </div>
          <img src={preloaderImage} alt="Loading" />
        </div>
      </div>
    </div>
  );
}
