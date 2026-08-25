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

/** キーの配置(縦構図・正面view)。座標はviewBox(0 0 240 560)基準 */
const KEYS: readonly KeySpec[] = [
  // 左手親指(裏側のため本体の左に別枠表示)
  { id: 'octave', cx: 48, cy: 130, r: 8 },
  // 左手の平(パームキー)
  { id: 'palmD', cx: 92, cy: 140, r: 6 },
  { id: 'palmEb', cx: 82, cy: 158, r: 6 },
  { id: 'palmF', cx: 92, cy: 176, r: 6 },
  // 左手メイン
  { id: 'frontF', cx: 122, cy: 116, r: 6 },
  { id: 'L1', cx: 122, cy: 142, r: 10 },
  { id: 'bis', cx: 122, cy: 162, r: 5 },
  { id: 'L2', cx: 122, cy: 184, r: 10 },
  { id: 'L3', cx: 122, cy: 210, r: 10 },
  // 左手小指(テーブルキー)
  { id: 'gSharp', cx: 92, cy: 240, r: 6 },
  { id: 'lowCsharp', cx: 80, cy: 256, r: 6 },
  { id: 'lowB', cx: 92, cy: 272, r: 6 },
  { id: 'lowBb', cx: 104, cy: 260, r: 6 },
  // 右手サイドキー
  { id: 'sideE', cx: 158, cy: 240, r: 6 },
  { id: 'sideC', cx: 158, cy: 260, r: 6 },
  { id: 'sideBb', cx: 158, cy: 280, r: 6 },
  // 右手メイン
  { id: 'R1', cx: 126, cy: 296, r: 10 },
  { id: 'R2', cx: 126, cy: 322, r: 10 },
  { id: 'R3', cx: 126, cy: 348, r: 10 },
  { id: 'highFsharp', cx: 156, cy: 322, r: 6 },
  // 右手小指
  { id: 'lowEb', cx: 140, cy: 376, r: 7 },
  { id: 'lowC', cx: 136, cy: 398, r: 7 },
]

const BRASS = '#e4b94f'
const BRASS_DARK = '#a97b12'

export function SaxDiagram({ pressedKeys }: Props) {
  const pressed = new Set<KeyId>(pressedKeys)

  return (
    <svg viewBox="0 0 240 560" className="h-105 max-h-[60vh]" role="img" aria-label="サックス運指図">
      {/* マウスピース・ネック */}
      <path d="M56 12 L80 24 L72 40 Q54 30 56 12 Z" fill="#4a4a4a" stroke="#333" strokeWidth={1} />
      <path
        d="M70 30 Q104 44 112 84 L134 76 Q120 26 80 12 Z"
        fill={BRASS}
        stroke={BRASS_DARK}
        strokeWidth={1.5}
      />
      {/* 本体の管 */}
      <path
        d="M106 78 L140 72 Q146 240 142 408 Q141 432 158 444 Q180 456 196 440 Q208 428 204 396 L202 330 L216 328 L220 400 Q224 444 196 462 Q160 482 128 458 Q104 440 104 404 Z"
        fill={BRASS}
        stroke={BRASS_DARK}
        strokeWidth={1.5}
      />
      {/* ベル */}
      <path
        d="M202 330 L216 328 L212 260 Q210 236 228 224 L240 244 Q226 252 226 276 L230 326 Z"
        fill={BRASS}
        stroke={BRASS_DARK}
        strokeWidth={1.5}
      />
      <ellipse
        cx={232}
        cy={233}
        rx={9}
        ry={17}
        transform="rotate(-32 232 233)"
        fill={BRASS}
        stroke={BRASS_DARK}
        strokeWidth={1.5}
      />
      {/* オクターブキーの注記 */}
      <text x={48} y={158} fontSize={10} textAnchor="middle" fill="currentColor">
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
            fill={isPressed ? 'var(--color-pressed)' : 'white'}
            stroke={isPressed ? 'var(--color-pressed)' : '#8a857b'}
            strokeWidth={1.5}
          />
        )
      })}
    </svg>
  )
}
