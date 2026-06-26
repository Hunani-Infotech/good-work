export default function GerozThemeButton({
  href,
  children,
  className = '',
  variant = 'dark',
}) {
  const variantClass =
    variant === 'lawyer'
      ? 'bg-lawyer hover:bg-[color-mix(in_srgb,var(--color-lawyer)_88%,#000)]'
      : 'bg-[#333] hover:bg-[#151515]';

  return (
    <a
      href={href}
      className={`geroz-theme-btn ${variantClass} ${className}`.trim()}
    >
      <span className="geroz-theme-btn__label">{children}</span>
    </a>
  );
}
