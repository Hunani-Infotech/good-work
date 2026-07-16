import { Fragment } from 'react';

function splitWords(text) {
  return String(text).trim().split(/\s+/).filter(Boolean);
}

function RevealWord({ word }) {
  return (
    <span className="shooote-scroll-text-reveal__word">
      <span className="shooote-scroll-text-reveal__muted" aria-hidden="true">
        {word}
      </span>
      <span className="shooote-scroll-text-reveal__ink" aria-hidden="true">
        <span className="shooote-scroll-text-reveal__ink-inner">{word}</span>
      </span>
    </span>
  );
}

/**
 * Scroll text reveal — each word fades from muted to cream ink on scroll.
 */
export default function ScrollTextReveal({
  as: Tag = 'span',
  className = '',
  text = '',
}) {
  const trimmed = String(text).trim();
  const words = splitWords(trimmed);
  if (!words.length) return null;

  return (
    <Tag
      className={['shooote-scroll-text-reveal', className].filter(Boolean).join(' ')}
      aria-label={trimmed}
    >
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          {index > 0 ? ' ' : null}
          <RevealWord word={word} />
        </Fragment>
      ))}
    </Tag>
  );
}
