/** Long arrow icon — replaces Font Awesome `fa-long-arrow-right` in the Geroz template. */
export default function GerozLongArrow({ className = '' }) {
  return (
    <svg
      className={className}
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1 8h19M14 3l6 5-6 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
