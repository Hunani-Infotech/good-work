import LottieEmbed from '../ui/LottieEmbed';
import { useSite } from '../../context/SiteContext';

export default function ClickScrollSection() {
  const { site } = useSite();
  const { clickScroll } = site.home;
  const suffix = clickScroll.suffix ?? 'my designs';

  return (
    <section data-nav="grey" className="section">
      <div className="click-scroll-height">
        <div className="wrapper-cont-50">
          <h1 className="click-scroll-text">
            {clickScroll.lines[0]}
            <br />
            {clickScroll.lines[1]}
            <br />
            {clickScroll.lines[2] ? (
              <>
                {clickScroll.lines[2]}
                <br />
              </>
            ) : null}
            <span className="click-scroll-row">
              <span className="click-scroll-inline-slot">
                <span className="click-scroll-spacer" aria-hidden="true">
                  {clickScroll.clickWord}
                </span>
                <div className="cont-click">
                  <div className="cont-hover-click" />
                  <div className="click-hover-huh">
                    {clickScroll.hoverWord}
                    <br />
                  </div>
                  <div className="click">{clickScroll.clickWord}</div>
                </div>
              </span>
              {'\u00A0'}and{' '}
              <span className="click-scroll-inline-slot">
                <span className="click-scroll-spacer text-span" aria-hidden="true">
                  {clickScroll.highlightWord}
                </span>
                <div className="scroll">{clickScroll.scrollWord}</div>
              </span>
              {suffix ? <> {'\u00A0'}{suffix}</> : null}
            </span>
          </h1>
        </div>
        <div className="wrapper-icons">
          {clickScroll.lottie ? (
            <LottieEmbed src={clickScroll.lottie} className="ll-scroll" />
          ) : null}
          {clickScroll.shapes
            .filter((shape) => shape.src)
            .map((shape) => (
              <img
                key={shape.className}
                src={shape.src}
                loading="lazy"
                sizes={shape.sizes}
                alt=""
                className={shape.className}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
