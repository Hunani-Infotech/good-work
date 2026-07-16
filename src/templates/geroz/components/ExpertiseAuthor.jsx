export default function ExpertiseAuthor({ name, role, className = '' }) {
  if (!name && !role) return null;

  return (
    <footer className={`gz-expertise__author shrink-0 ${className}`.trim()}>
      <div className="flex items-start gap-4">
        <span
          className="gz-expertise__author-line mt-2 block h-10 w-px shrink-0 bg-[linear-gradient(180deg,var(--color-lawyer),color-mix(in_srgb,var(--color-lawyer)_25%,transparent))]"
          aria-hidden="true"
        />
        <div className="min-w-0">
          {name ? (
            <p className="gz-expertise__author-name m-0 font-sans text-[1.1875rem] font-bold leading-tight tracking-[-0.01em] text-stone-900">
              {name}
            </p>
          ) : null}
          {role ? (
            <p className="gz-expertise__author-role mt-2 m-0 font-sans text-[0.6875rem] font-semibold uppercase leading-relaxed tracking-[0.18em] text-lawyer">
              {role}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
