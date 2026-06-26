export default function HeroAnimatedName({
  as: Tag = 'span',
  text = '',
  className = '',
}) {
  if (!text) return null;

  const chars = [...text];

  return (
    <Tag
      className={`gz-hero__name-line ${className}`.trim()}
      aria-label={text}
    >
      {chars.map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="gz-hero__char"
          aria-hidden="true"
        >
          {char === ' ' ? '\u00a0' : char}
        </span>
      ))}
    </Tag>
  );
}
