import { useGerozContent } from '../../../hooks/geroz/useGerozContent.js';
import GerozEyebrow from '../../../components/geroz/GerozEyebrow.jsx';

function AboutDecorativeArrow() {
  return (
    <div
      className="pointer-events-none relative aspect-[241/116] w-full max-w-40 text-lawyer xl:max-w-52"
      aria-hidden="true"
    >
      <svg
        className="block size-full"
        viewBox="0 0 241 116"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.40711 115.742C6.50746 36.6323 90.1951 -41.7371 112.306 36.697C126.105 85.6461 56.5141 32.8646 105.438 8.61389C144.577 -10.7866 206.595 20.1372 232.711 38.0243L207.256 41.9069C216.708 42.7768 236.174 43.9054 238.429 41.4607C240.683 39.0159 225.657 25.7998 217.862 19.4972"
          stroke="currentColor"
          strokeOpacity="0.54"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}

export default function AboutSection4() {
  const { about } = useGerozContent();

  return (
    <section
      id="about"
      className="py-[clamp(5rem,8vw,8.125rem)]"
    >
      <div className="geroz-container flex justify-center">
        <div className="w-full max-w-[55rem] overflow-visible">
          <div className="text-start">
            {about.eyebrow ? <GerozEyebrow>{about.eyebrow}</GerozEyebrow> : null}
            <h3 className="mt-[clamp(1rem,2.5vw,1.75rem)] mb-0 text-start font-serif text-[clamp(1.875rem,3vw,2.375rem)] leading-tight text-stone-900">
              {about.heading}
            </h3>
          </div>

          <div className="mt-0 grid grid-cols-1 items-start pt-[clamp(2rem,5vw,3.5rem)] lg:grid-cols-[minmax(4.5rem,10rem)_minmax(0,1fr)] xl:grid-cols-[minmax(5rem,11rem)_minmax(0,1fr)]">
            <div className="hidden pt-[clamp(2.5rem,6vw,5.5rem)] lg:block xl:-ml-[clamp(1.25rem,10vw,10rem)]">
              <AboutDecorativeArrow />
            </div>
            <div className="min-w-0">
              <p className="relative z-[1] m-0 max-w-[42rem] text-left font-sans text-stone-600">
                {about.body}
              </p>
              {about.extraParagraph ? (
                <p className="relative z-[1] mt-4 max-w-[42rem] text-left font-sans text-stone-600">
                  {about.extraParagraph}
                </p>
              ) : null}
              {about.thirdParagraph ? (
                <p className="relative z-[1] mt-4 max-w-[42rem] text-left font-sans text-stone-600">
                  {about.thirdParagraph}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
