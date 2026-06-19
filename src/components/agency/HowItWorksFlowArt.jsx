/** Desktop connector — x swing 435–565 (43.5–56.5%) inside 28% gutter */
export const HOW_FLOW_PATH =
  'M 500,0 C 500,80 435,140 435,200 C 435,260 500,320 500,380 C 500,420 565,440 565,480 C 565,520 500,560 500,640 C 500,700 435,700 435,760 C 435,820 500,880 500,920 C 500,940 500,960 500,960';

/** Mobile step connector (viewBox 0 0 120 900) — nodes at ~17%, 50%, 83% for equal step rows */
export const HOW_FLOW_PATH_MOBILE =
  'M 60,8 C 60,48 60,80 60,150' +
  ' C 60,220 60,280 60,450' +
  ' C 60,620 60,680 60,750' +
  ' C 60,820 60,860 60,892';

export const HOW_FLOW_NODES_DESKTOP = [
  { x: 435, y: 200 },
  { x: 565, y: 480 },
  { x: 435, y: 760 },
];

/* Corner-only wave paths — stay within ~45% of each corner */
const TL_WAVES = [
  'M -30 24 C 70 72, 150 118, 240 168 C 320 212, 390 268, 460 318',
  'M -10 44 C 90 92, 170 138, 260 188 C 340 232, 410 288, 480 338',
  'M -50 64 C 50 112, 130 158, 220 208 C 300 252, 370 308, 440 358',
  'M 10 84 C 110 132, 190 178, 280 228 C 360 272, 430 328, 500 378',
  'M -70 104 C 30 152, 110 198, 200 248 C 280 292, 350 348, 420 398',
  'M 30 124 C 130 172, 210 218, 300 268 C 380 312, 450 368, 520 418',
  'M -90 144 C 10 192, 90 238, 180 288 C 260 332, 330 388, 400 438',
  'M 50 164 C 150 212, 230 258, 320 308 C 400 352, 470 408, 540 458',
];

const BR_WAVES = [
  'M 1470 1176 C 1370 1088, 1270 996, 1160 904 C 1060 820, 960 744, 860 672',
  'M 1490 1156 C 1390 1068, 1290 976, 1180 884 C 1080 800, 980 724, 880 652',
  'M 1450 1196 C 1350 1108, 1250 1016, 1140 924 C 1040 840, 940 764, 840 692',
  'M 1510 1136 C 1410 1048, 1310 956, 1200 864 C 1100 780, 1000 704, 900 632',
  'M 1430 1216 C 1330 1128, 1230 1036, 1120 944 C 1020 860, 920 784, 820 712',
  'M 1530 1116 C 1430 1028, 1330 936, 1220 844 C 1120 760, 1020 684, 920 612',
  'M 1410 1236 C 1310 1148, 1210 1056, 1100 964 C 1000 880, 900 804, 800 732',
  'M 1550 1096 C 1450 1008, 1350 916, 1240 824 C 1140 740, 1040 664, 940 592',
];

function CornerWaves({ paths, stroke, className }) {
  return (
    <g className={className} fill="none" stroke={stroke} strokeLinecap="round">
      {paths.map(function (d, i) {
        return (
          <path
            key={i}
            d={d}
            strokeWidth={i % 3 === 0 ? 1.2 : 0.9}
            opacity={0.55 + (i % 3) * 0.1}
          />
        );
      })}
    </g>
  );
}

/** Corner flow art — brand orange / peach / warm grey, static SVG */
export default function HowItWorksFlowArt() {
  return (
    <svg
      className="agency-how__flow-art"
      viewBox="0 0 1440 1200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="how-glow-tl" cx="0%" cy="0%" r="75%">
          <stop offset="0%" stopColor="#f25828" stopOpacity="0.14" />
          <stop offset="35%" stopColor="#ffbc95" stopOpacity="0.1" />
          <stop offset="72%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#faf8f5" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="how-glow-br" cx="100%" cy="100%" r="75%">
          <stop offset="0%" stopColor="#f25828" stopOpacity="0.12" />
          <stop offset="30%" stopColor="#ffbc95" stopOpacity="0.09" />
          <stop offset="55%" stopColor="#510066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#faf8f5" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="how-stroke-tl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f25828" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#ffbc95" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#c9bfb3" stopOpacity="0.12" />
        </linearGradient>

        <linearGradient id="how-stroke-br" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f25828" stopOpacity="0.38" />
          <stop offset="45%" stopColor="#ffbc95" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#96908c" stopOpacity="0.14" />
        </linearGradient>

        <filter id="how-corner-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" result="blur" />
        </filter>

        <radialGradient id="how-mask-tl" cx="0%" cy="0%" r="85%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="72%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="how-mask-br" cx="100%" cy="100%" r="85%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="72%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        <mask id="how-corner-tl-mask">
          <rect x="0" y="0" width="820" height="640" fill="url(#how-mask-tl)" />
        </mask>

        <mask id="how-corner-br-mask">
          <rect x="620" y="560" width="820" height="640" fill="url(#how-mask-br)" />
        </mask>
      </defs>

      {/* Top-left corner — soft mask (no hard clip) */}
      <g mask="url(#how-corner-tl-mask)">
        <rect x="0" y="0" width="760" height="580" fill="url(#how-glow-tl)" />
        <g filter="url(#how-corner-blur)" opacity="0.55">
          <ellipse cx="80" cy="60" rx="220" ry="160" fill="#ffffff" opacity="0.65" />
          <ellipse cx="140" cy="120" rx="160" ry="120" fill="#ffbc95" opacity="0.2" />
        </g>
        <CornerWaves paths={TL_WAVES} stroke="url(#how-stroke-tl)" className="agency-how__waves agency-how__waves--tl" />
      </g>

      {/* Bottom-right corner — soft mask (no hard clip) */}
      <g mask="url(#how-corner-br-mask)">
        <rect x="692" y="624" width="748" height="576" fill="url(#how-glow-br)" />
        <g filter="url(#how-corner-blur)" opacity="0.5">
          <ellipse cx="1360" cy="1140" rx="240" ry="180" fill="#ffffff" opacity="0.6" />
          <ellipse cx="1280" cy="1060" rx="170" ry="130" fill="#ffbc95" opacity="0.18" />
        </g>
        <CornerWaves paths={BR_WAVES} stroke="url(#how-stroke-br)" className="agency-how__waves agency-how__waves--br" />
      </g>
    </svg>
  );
}
