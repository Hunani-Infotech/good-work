import { useCallback, useEffect, useId, useRef } from 'react';
import { initPortfolioTemplatePicker } from '../../animations/portfolioTemplatePicker.js';
import '../../styles/template-picker.css';

export default function PortfolioTemplatePicker({ onSelect }) {
  const clipId = useId().replace(/:/g, '');
  const sectionRef = useRef(null);
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);
  const canvasRef = useRef(null);

  const handleSelect = useCallback((detail) => {
    onSelect?.(detail);
  }, [onSelect]);

  useEffect(() => {
    if (!sectionRef.current) return undefined;

    return initPortfolioTemplatePicker({
      section: sectionRef.current,
      scroller: scrollerRef.current,
      track: trackRef.current,
      canvas: canvasRef.current,
      clipPathId: clipId,
      onSelect: handleSelect,
    });
  }, [clipId, handleSelect]);

  return (
    <div className="template-picker-wrap">
      <div
        ref={sectionRef}
        className="template-picker"
        data-purpose="portfolio-template-picker"
        tabIndex={0}
        role="region"
        aria-label="Portfolio template picker"
      >
        <div ref={scrollerRef} className="template-picker__scroller">
          <div ref={trackRef} className="template-picker__scroller-track" />
        </div>
        <svg className="template-picker__clip-defs" aria-hidden="true" width="0" height="0">
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path d="M 0.05,0.05 L 0.95,0.08 L 0.97,0.93 L 0.03,0.90 Z" />
            </clipPath>
          </defs>
        </svg>
        <div ref={canvasRef} className="template-picker__canvas" />
      </div>
    </div>
  );
}
