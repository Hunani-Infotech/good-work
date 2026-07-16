import { useId } from 'react';

/**
 * Entis-style pointer — classic OS arrow silhouette with dark fill + thick white rim.
 * Tip hotspot at (1.25, 1.25); matches Meridian anchor for consistent tracking.
 */
const POINTER_PATH =
  'M 1.25 1.25 V 16.75 L 4.65 13.35 L 7.35 20.25 L 10.15 19.05 L 7.45 12.15 L 13.25 12.15 L 1.25 1.25 Z';

export function EntisArrowGraphic({ className = '' }) {
  const rawId = useId().replace(/:/g, '');
  const shadowId = `gz-entis-shadow-${rawId}`;

  return (
    <svg
      className={className}
      viewBox="0 0 20 24"
      width="20"
      height="24"
      aria-hidden="true"
    >
      <defs>
        <filter id={shadowId} x="-60%" y="-50%" width="220%" height="220%">
          <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.75" floodColor="rgba(0, 0, 0, 0.45)" />
        </filter>
      </defs>

      <g filter={`url(#${shadowId})`}>
        {/* Thick white rim — Entis signature outline */}
        <path
          className="gz-entis-rim"
          d={POINTER_PATH}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dark fill body */}
        <path
          className="gz-entis-body"
          d={POINTER_PATH}
          fill="#1a1a1a"
          stroke="#1a1a1a"
          strokeWidth="0.4"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
