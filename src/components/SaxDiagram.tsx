import type { KeyId } from '../domain/fingerings'

interface Props {
  pressedKeys: readonly KeyId[]
}

interface KeySpec {
  id: KeyId
  cx: number
  cy: number
  r: number
}

/** キーの配置(縦構図・正面view)。座標はviewBox(0 0 260 580)基準 */
const KEYS: readonly KeySpec[] = [
  // 左手親指(裏側のため本体の左に別枠表示)
  { id: 'octave', cx: 44, cy: 128, r: 8 },
  // 左手の平(パームキー)
  { id: 'palmD', cx: 94, cy: 142, r: 6 },
  { id: 'palmEb', cx: 84, cy: 160, r: 6 },
  { id: 'palmF', cx: 94, cy: 178, r: 6 },
  // 左手メイン
  { id: 'frontF', cx: 122, cy: 112, r: 6 },
  { id: 'L1', cx: 122, cy: 140, r: 10 },
  { id: 'bis', cx: 122, cy: 160, r: 5 },
  { id: 'L2', cx: 122, cy: 182, r: 10 },
  { id: 'L3', cx: 122, cy: 208, r: 10 },
  // 左手小指(テーブルキー)
  { id: 'gSharp', cx: 92, cy: 238, r: 6 },
  { id: 'lowCsharp', cx: 80, cy: 254, r: 6 },
  { id: 'lowB', cx: 92, cy: 270, r: 6 },
  { id: 'lowBb', cx: 104, cy: 258, r: 6 },
  // 右手サイドキー
  { id: 'sideE', cx: 158, cy: 238, r: 6 },
  { id: 'sideC', cx: 158, cy: 258, r: 6 },
  { id: 'sideBb', cx: 158, cy: 278, r: 6 },
  // 右手メイン
  { id: 'R1', cx: 124, cy: 294, r: 10 },
  { id: 'R2', cx: 124, cy: 320, r: 10 },
  { id: 'R3', cx: 124, cy: 346, r: 10 },
  { id: 'highFsharp', cx: 156, cy: 320, r: 6 },
  // 右手小指
  { id: 'lowEb', cx: 132, cy: 372, r: 7 },
  { id: 'lowC', cx: 128, cy: 394, r: 7 },
]

export function SaxDiagram({ pressedKeys }: Props) {
  const pressed = new Set<KeyId>(pressedKeys)

  return (
    <svg viewBox="0 0 260 580" className="h-105 max-h-[60vh]" role="img" aria-label="サックス運指図">
      <defs>
        <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f7dc8a" />
          <stop offset="0.45" stopColor="#e7b64a" />
          <stop offset="1" stopColor="#c8901f" />
        </linearGradient>
      </defs>

      {/* マウスピース */}
      <path
        d="M34 24 C40 12 52 8 62 12 L66 30 C56 38 44 36 38 32 Z"
        fill="#4a4a4a"
        stroke="#333"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {/* ネック */}
      <path
        d="M52 12 C94 2 128 22 140 58 L114 66 C104 38 82 24 56 30 Z"
        fill="url(#brass)"
        stroke="#8a5f0e"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* 管体〜U字ベンド〜ベル(一筆の輪郭) */}
      <path
        d="M112 62
           C106 180 102 300 106 396
           C108 444 138 464 168 458
           C196 452 206 430 204 402
           C202 366 208 330 216 308
           C222 292 234 288 245 282
           L195 242
           C184 252 176 272 172 300
           C168 330 167 364 169 394
           C169 420 160 432 149 430
           C138 427 130 414 132 398
           C136 300 136 180 134 60
           Z"
        fill="url(#brass)"
        stroke="#8a5f0e"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* ベルのリム(長軸の両端を筒の輪郭の終端に一致させる) */}
      <ellipse
        cx={220}
        cy={262}
        rx={40}
        ry={16}
        transform="rotate(38 220 262)"
        fill="#f2cd6b"
        stroke="#8a5f0e"
        strokeWidth={2}
      />
      <ellipse
        cx={220}
        cy={262}
        rx={30}
        ry={11}
        transform="rotate(38 220 262)"
        fill="#7a5a10"
        opacity={0.55}
      />
      {/* ハイライト */}
      <path
        d="M115 90 C110 200 108 300 110 380"
        fill="none"
        stroke="#fbe9a8"
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.7}
      />
      <path
        d="M197 380 C196 344 198 318 205 298"
        fill="none"
        stroke="#fbe9a8"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.6}
      />

      {/* オクターブキーの注記 */}
      <text x={44} y={156} fontSize={10} textAnchor="middle" fill="currentColor">
        親指(裏)
      </text>

      {/* キー */}
      {KEYS.map(({ id, cx, cy, r }) => {
        const isPressed = pressed.has(id)
        return (
          <circle
            key={id}
            data-key={id}
            data-pressed={isPressed}
            cx={cx}
            cy={cy}
            r={r}
            fill={isPressed ? 'var(--color-pressed)' : '#fffdf6'}
            stroke={isPressed ? '#a51f1d' : '#a98a3c'}
            strokeWidth={2}
          />
        )
      })}
    </svg>
  )
}
