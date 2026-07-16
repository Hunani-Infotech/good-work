const EXPERTISE_IMG_CLASS =
  'gz-portrait__img block h-[clamp(16rem,34vw,34rem)] w-full object-cover object-top contrast-[1.02] saturate-[0.94]';

const HERO_IMG_CLASS = 'gz-portrait__img gz-portrait__img--hero';

const CORNER_POSITIONS = ['tl', 'tr', 'bl', 'br'];

const PLACEHOLDER_CLASS = 'h-[clamp(16rem,34vw,34rem)] w-full bg-stone-200';

function PortraitMedia({
  hasVideo,
  imageSrc,
  imgClassName,
  alt,
  width,
  height,
  loading,
  videoSrc,
}) {
  if (hasVideo) {
    return (
      <video
        className={imgClassName}
        src={videoSrc}
        poster={imageSrc || undefined}
        aria-label={alt}
        width={width}
        height={height}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return (
    <img
      className={imgClassName}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
    />
  );
}

export default function PortraitFrame({
  src,
  alt = '',
  width = 670,
  height = 955,
  loading = 'lazy',
  className = '',
  size = 'expertise',
  videoSrc = '',
  poster = '',
}) {
  const hasVideo = Boolean(videoSrc?.trim());
  const imageSrc = src?.trim() || poster?.trim() || '';
  const isHero = size === 'hero';

  if (!imageSrc && !hasVideo) {
    return (
      <div
        className={`${PLACEHOLDER_CLASS} ${className}`.trim()}
        aria-hidden="true"
      />
    );
  }

  const imgClassName = isHero ? HERO_IMG_CLASS : EXPERTISE_IMG_CLASS;

  return (
    <div
      className={`gz-portrait gz-portrait--${size} relative mx-auto w-full max-w-[min(100%,28rem)] ${className}`.trim()}
    >
      <span className="gz-portrait__halo" aria-hidden="true" />

      {isHero ? (
        <>
          <span className="gz-portrait__mat gz-portrait__mat--outer" aria-hidden="true" />
          <span className="gz-portrait__mat gz-portrait__mat--inner" aria-hidden="true" />
        </>
      ) : null}

      {CORNER_POSITIONS.map((position) => (
        <span
          key={position}
          className={`gz-portrait__corner gz-portrait__corner--${position}`}
          aria-hidden="true"
        />
      ))}

      <span className="gz-portrait__ring" aria-hidden="true" />

      <div className="gz-portrait__frame">
        <PortraitMedia
          hasVideo={hasVideo}
          imageSrc={imageSrc}
          imgClassName={imgClassName}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          videoSrc={videoSrc}
        />
        <span className="gz-portrait__fade" aria-hidden="true" />
      </div>
    </div>
  );
}
