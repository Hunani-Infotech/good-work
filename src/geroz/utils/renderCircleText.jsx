/** Rotating circle CTA label — matches Geroz template `renderCircleText` behavior. */
export function renderCircleText(text) {
  return text.split('').map((char, index) => (
    <span key={`${char}-${index}`} style={{ transform: `rotate(${index * 9.1}deg)` }}>
      {char}
    </span>
  ));
}
