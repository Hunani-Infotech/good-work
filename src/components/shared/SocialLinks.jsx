const ICONS = {
  linkedin: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.5A1.96 1.96 0 1 0 5.28 7.4a1.96 1.96 0 0 0-.03-3.9ZM20.44 20h-3.37v-5.9c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.1V20H9.5V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.21-1.77 3.43 0 4.06 2.26 4.06 5.2V20Z" />
    </svg>
  ),
};

/**
 * Renders one icon link per platform in `links` — callers already filter
 * this list down to platforms that have a URL (see buildSocialLinks).
 */
export default function SocialLinks({
  links = [],
  className = '',
  itemClassName = '',
  linkClassName = '',
  iconSize = 16,
}) {
  if (!links.length) return null;

  return (
    <ul className={className}>
      {links.map((link, index) => {
        const Icon = ICONS[link.id];

        return (
          <li
            key={link.id}
            className={itemClassName}
            style={{ '--social-index': index }}
          >
            <a
              href={link.href}
              className={linkClassName}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={link.label}
              title={link.label}
            >
              {Icon ? <Icon width={iconSize} height={iconSize} /> : link.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
