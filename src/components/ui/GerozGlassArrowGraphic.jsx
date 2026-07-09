import { useId } from 'react';

/**
 * Chrome glass boomerang — tip at (1.25, 1.25), wings to top-right + bottom-left.
 * Concave notch on the trailing edge (reference dd766401). 20×24 anchor = Meridian.
 */
const BOOMERANG_OUTER =
  'M 1.25 1.25 C 7 3.5, 12.5 4.75, 17 7.25 C 18.25 8.5, 17.5 10.5, 15.5 12.5 C 12.5 15.5, 8 17.5, 4.5 18.75 C 2.5 15, 1.5 8.5, 1.25 1.25 Z';

const BOOMERANG_INNER =
  'M 3.15 3.15 C 7.25 4.85, 11.25 6, 14.75 8.15 C 15.75 9.15, 15.15 10.65, 13.65 12 C 11.35 13.85, 7.85 15.35, 5.35 16.75 C 3.85 13.85, 3.35 9.35, 3.15 3.15 Z';

const BOOMERANG_SHINE =
  'M 1.25 1.25 C 7 3.5, 12.5 4.75, 14.75 6.35';

export function GerozGlassArrowGraphic({ className = '' }) {
  const rawId = useId().replace(/:/g, '');
  const chromeGradId = `gz-chrome-${rawId}`;
  const chromeEdgeId = `gz-chrome-edge-${rawId}`;
  const darkGradId = `gz-dark-${rawId}`;
  const shineGradId = `gz-shine-${rawId}`;
  const shadowId = `gz-shadow-${rawId}`;

  return (
    <svg
      className={className}
      viewBox="0 0 20 24"
      width="20"
      height="24"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={chromeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="22%" stopColor="#eef3f9" />
          <stop offset="55%" stopColor="#b8c2ce" />
          <stop offset="100%" stopColor="#6d7682" />
        </linearGradient>
        <linearGradient id={chromeEdgeId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#e8f0fa" />
          <stop offset="100%" stopColor="#7a8490" />
        </linearGradient>
        <linearGradient id={darkGradId} x1="8%" y1="4%" x2="92%" y2="96%">
          <stop offset="0%" stopColor="rgba(42, 46, 52, 0.94)" />
          <stop offset="100%" stopColor="rgba(10, 12, 16, 0.98)" />
        </linearGradient>
        <linearGradient id={shineGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.98)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>
        <filter id={shadowId} x="-80%" y="-80%" width="260%" height="260%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="rgba(0, 0, 0, 0.38)" />
          <feDropShadow dx="-0.5" dy="-0.5" stdDeviation="1" floodColor="rgba(255, 255, 255, 0.35)" />
        </filter>
      </defs>

      <g filter={`url(#${shadowId})`}>
        <path
          d={BOOMERANG_OUTER}
          fill="none"
          stroke={`url(#${chromeEdgeId})`}
          strokeWidth="3.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <path
          d={BOOMERANG_OUTER}
          fill={`url(#${chromeGradId})`}
          stroke="rgba(255, 255, 255, 0.88)"
          strokeWidth="0.55"
          strokeLinejoin="round"
        />

        <path
          d={BOOMERANG_INNER}
          fill={`url(#${darkGradId})`}
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="0.3"
          strokeLinejoin="round"
        />

        <path
          d={BOOMERANG_SHINE}
          fill="none"
          stroke={`url(#${shineGradId})`}
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
