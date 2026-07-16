/**
 * Scroll text reveal — words stay hidden until scroll highlights them.
 */
export default function GerozScrollTextReveal({
  as: Tag = 'span',
  className = '',
  text = '',
}) {
  const trimmed = String(text).trim();
  if (!trimmed) return null;

  const words = trimmed.split(/\s+/).filter(Boolean);

  return (
    <Tag
      className={['geroz-scroll-text-reveal', className].filter(Boolean).join(' ')}
      aria-label={trimmed}
    >
      {words.map((word, index) => (
        <span key={`${index}-${word}`} className="geroz-scroll-text-reveal__word">
          <span className="geroz-scroll-text-reveal__ink" aria-hidden="true">
            <span className="geroz-scroll-text-reveal__ink-inner">{word}</span>
          </span>
        </span>
      ))}
    </Tag>
  );
}
