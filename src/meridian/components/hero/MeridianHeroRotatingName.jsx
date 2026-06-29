export default function MeridianHeroRotatingName({ lines = [] }) {
  const uniqueLines = lines
    .filter(Boolean)
    .filter((line, index, all) => all.indexOf(line) === index);

  if (!uniqueLines.length) return null;

  return (
    <div className="meridian-hero__rotator" aria-live="polite">
      <div className="meridian-hero__rotator-mask">
        <div className="meridian-hero__rotator-track">
          {uniqueLines.map((line) => (
            <span key={line} className="meridian-hero__rotator-line">
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
