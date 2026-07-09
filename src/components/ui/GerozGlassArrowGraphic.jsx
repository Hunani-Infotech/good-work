import { useId } from 'react';

const POINTER_PATH =
  'M 1.25 1.25 V 16.75 L 4.65 13.35 L 7.35 20.25 L 10.15 19.05 L 7.45 12.15 L 13.25 12.15 L 1.25 1.25 Z';

const SHINE_PATH =
  'M 2.5 2.5 V 13.5 L 4.85 11.15 L 6.75 15.75 L 8.15 14.95 L 6.25 11.35 L 10.25 11.35 L 2.5 2.5 Z';

export function GerozGlassArrowGraphic({ className = '' }) {
  const rawId = useId().replace(/:/g, '');
  const bodyGradId = `gz-glass-arrow-body-${rawId}`;
  const shineGradId = `gz-glass-arrow-shine-${rawId}`;
  const shadowId = `gz-glass-arrow-shadow-${rawId}`;

  return (
    <svg
      className={className}
      viewBox="0 0 20 24"
      width="20"
      height="24"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.98)" />
          <stop offset="50%" stopColor="rgba(250, 250, 250, 0.9)" />
          <stop offset="100%" stopColor="rgba(235, 235, 235, 0.82)" />
        </linearGradient>
        <linearGradient id={shineGradId} x1="0%" y1="0%" x2="70%" y2="70%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>
        <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="rgba(0, 0, 0, 0.35)" />
          <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="rgba(0, 0, 0, 0.2)" />
        </filter>
      </defs>

      {/* Dark outline — keeps shape readable on light surfaces */}
      <path
        d={POINTER_PATH}
        fill="rgba(26, 26, 26, 0.88)"
        stroke="rgba(26, 26, 26, 0.92)"
        strokeWidth="0.35"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter={`url(#${shadowId})`}
      />

      <path
        d={POINTER_PATH}
        fill={`url(#${bodyGradId})`}
        stroke="rgba(255, 255, 255, 0.95)"
        strokeWidth="0.85"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <path
        d={SHINE_PATH}
        fill={`url(#${shineGradId})`}
        opacity="0.48"
      />
    </svg>
  );
}
