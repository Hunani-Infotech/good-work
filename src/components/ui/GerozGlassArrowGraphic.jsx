import { useId } from 'react';

/**
 * Chrome glass pointer — Meridian-classic silhouette with smoothed notch + concave tail.
 * Tip hotspot at (1.25, 1.25); left stem stays vertical so the shape reads as a cursor, not a triangle.
 */
const POINTER_OUTER =
  'M 1.25 1.25 V 16.75 C 2.1 15.2, 3.6 13.6, 4.65 13.35 C 5.9 16.4, 6.7 18.9, 7.35 20.25 C 8.75 19.7, 9.85 18.4, 10.15 19.05 C 9.6 16.2, 8.6 13.4, 7.45 12.15 C 9.7 12, 11.6 12.05, 13.25 12.15 C 10.4 7.8, 5.8 3.2, 1.25 1.25 Z';

const POINTER_INNER =
  'M 3.45 3.45 V 15.15 C 3.85 14.1, 5.05 12.85, 5.85 12.55 C 6.75 14.55, 7.35 16.35, 7.75 17.45 C 8.65 17.1, 9.35 16.2, 9.55 16.55 C 9.15 14.75, 8.45 13.15, 7.75 12.15 C 9.35 12.05, 10.55 12.05, 11.45 12.15 C 9.35 8.65, 6.15 5.35, 3.45 3.45 Z';

const POINTER_SHINE =
  'M 1.25 1.25 C 5.2 2.55, 9.4 4.2, 11.8 6.4';

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
          <stop offset="0%" stopColor="#1a1d22" />
          <stop offset="55%" stopColor="#0a0c10" />
          <stop offset="100%" stopColor="#050608" />
        </linearGradient>
        <linearGradient id={shineGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.98)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>
        <filter id={shadowId} x="-70%" y="-60%" width="240%" height="240%">
          <feDropShadow dx="2.5" dy="4.5" stdDeviation="3.75" floodColor="rgba(0, 0, 0, 0.5)" />
        </filter>
      </defs>

      <g filter={`url(#${shadowId})`}>
        {/* Thick chrome rim */}
        <path
          className="gz-cursor-rim"
          d={POINTER_OUTER}
          fill="none"
          stroke={`url(#${chromeEdgeId})`}
          strokeWidth="3.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Chrome shell */}
        <path
          className="gz-cursor-chrome"
          d={POINTER_OUTER}
          fill={`url(#${chromeGradId})`}
          stroke="rgba(255, 255, 255, 0.88)"
          strokeWidth="0.55"
          strokeLinejoin="round"
        />

        {/* Dark glass center */}
        <path
          className="gz-cursor-dark"
          d={POINTER_INNER}
          fill={`url(#${darkGradId})`}
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="0.3"
          strokeLinejoin="round"
        />

        {/* Specular highlight on leading edge */}
        <path
          className="gz-cursor-shine"
          d={POINTER_SHINE}
          fill="none"
          stroke={`url(#${shineGradId})`}
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
