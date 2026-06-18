export default function MediaImage({ src, className = 'img-project', sizes, srcset, alt = '', variant }) {
  const cls = [className, variant === 'small' ? 'small' : '', variant === 'hide' ? 'hide' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <img
      src={src}
      loading="lazy"
      sizes={sizes || '100vw'}
      srcSet={srcset}
      alt={alt}
      className={cls}
    />
  );
}
