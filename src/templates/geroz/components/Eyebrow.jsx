export default function Eyebrow({ children, className = '' }) {
  if (!children) return null;

  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-[1.25rem] border border-[rgba(77,77,77,0.14)] bg-white py-[0.3125rem] pl-2.5 pr-4 ${className}`.trim()}
    >
      <span
        className="relative size-[1.125rem] shrink-0 rounded-full bg-[color-mix(in_srgb,var(--brand-purple,#510066)_10%,white)] after:absolute after:left-1/2 after:top-1/2 after:size-1.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-[linear-gradient(84deg,var(--brand-purple,#510066)_0%,var(--brand-orange,#f25828)_100%)] after:content-['']"
        aria-hidden="true"
      />
      <span className="font-sans text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-stone-500">
        {children}
      </span>
    </div>
  );
}
