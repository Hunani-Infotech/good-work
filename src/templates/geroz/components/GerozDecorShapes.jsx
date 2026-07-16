import { GEROZ_DECOR_SHAPES } from '../../../data/geroz/constants.js';

export default function GerozDecorShapes({ className = '' }) {
  return (
    <div
      className={`relative h-full min-h-(--spacing-screen-2-media) ${className}`.trim()}
      aria-hidden="true"
    >
      <img
        className="gz-expertise__decor pointer-events-none absolute right-0 bottom-[8%] block w-[clamp(1.5rem,3.5vw,2.05rem)] select-none motion-safe:animate-cir36 motion-reduce:animate-none"
        src={GEROZ_DECOR_SHAPES.star}
        alt=""
        width="33"
        height="33"
      />
      <img
        className="gz-expertise__decor pointer-events-none absolute top-0 left-[32%] block w-[clamp(4.5rem,10vw,7.6rem)] select-none motion-safe:animate-geroz-decor-fade motion-reduce:animate-none"
        src={GEROZ_DECOR_SHAPES.starLarge}
        alt=""
        width="79"
        height="76"
      />
      <img
        className="gz-expertise__decor pointer-events-none absolute top-[42%] left-0 block w-[clamp(2rem,5vw,2.65rem)] select-none motion-safe:animate-cir36 motion-reduce:animate-none"
        src={GEROZ_DECOR_SHAPES.sunburst}
        alt=""
        width="42"
        height="42"
      />
    </div>
  );
}
