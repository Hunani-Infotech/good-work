const defaultContent = {
  label: '',
};

export default function GerozSectionLabel({ content = {}, className = '' }) {
  const { label = defaultContent.label } = content;

  if (!label) return null;

  return (
    <div
      className={`flex items-center gap-3 font-sans text-sm uppercase tracking-[0.2em] text-amber-500 ${className}`.trim()}
    >
      <span
        className="size-2 shrink-0 rounded-full bg-amber-500"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
