import { isSelectable } from '../domain/fingerings'
import { noteAriaLabel, noteId, noteName, type Note, type PitchName } from '../domain/notes'

const ACCIDENTAL_GLYPH = { sharp: '♯', flat: '♭', natural: '' } as const

interface Props {
  notes: readonly Note[]
  selected?: Note
  onSelect: (note: Note) => void
}

const PITCH_INDEX: Record<PitchName, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 }

/** 五線譜上の縦位置。E4(第1線)をy=95とし、音が1つ上がるごとに5px上がる */
function noteY(note: Note): number {
  const diatonic = note.octave * 7 + PITCH_INDEX[note.pitch]
  const e4 = 4 * 7 + PITCH_INDEX.E
  return 95 - (diatonic - e4) * 5
}

/** 五線(y=55〜95)の外にある音に必要な加線のy座標 */
function ledgerYs(y: number): number[] {
  const ys: number[] = []
  for (let ledger = 105; ledger <= y; ledger += 10) ys.push(ledger)
  for (let ledger = 45; ledger >= y; ledger -= 10) ys.push(ledger)
  return ys
}

const STAFF_LINES = [55, 65, 75, 85, 95]
const NOTE_GAP = 44
const FIRST_X = 60
const HEIGHT = 140

export function StaffSelector({ notes, selected, onSelect }: Props) {
  const width = FIRST_X + notes.length * NOTE_GAP
  const selectedId = selected && noteId(selected)

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${HEIGHT}`}
        width={width}
        height={HEIGHT}
        className="block"
        aria-label="五線譜から音を選ぶ"
      >
        {/* 五線 */}
        {STAFF_LINES.map((y) => (
          <line
            key={y}
            x1={8}
            y1={y}
            x2={width - 8}
            y2={y}
            stroke="currentColor"
            strokeWidth={1}
          />
        ))}
        {/* ト音記号(フォント未対応環境では省略表示になる) */}
        <text x={12} y={99} fontSize={58} fill="currentColor" aria-hidden>
          {'\u{1D11E}'}
        </text>
        {notes.map((note, i) => {
          const x = FIRST_X + i * NOTE_GAP + NOTE_GAP / 2
          const y = noteY(note)
          const isSelected = noteId(note) === selectedId
          const disabled = !isSelectable(note)
          const select = () => {
            if (!disabled) onSelect(note)
          }
          return (
            <g
              key={noteId(note)}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label={noteAriaLabel(note)}
              aria-pressed={isSelected}
              aria-disabled={disabled}
              className={disabled ? 'opacity-30' : 'cursor-pointer'}
              onClick={select}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  select()
                }
              }}
            >
              {/* タップ領域を広げる透明な帯 */}
              <rect
                x={x - NOTE_GAP / 2}
                y={0}
                width={NOTE_GAP}
                height={HEIGHT}
                fill="transparent"
              />
              {ledgerYs(y).map((ly) => (
                <line
                  key={ly}
                  x1={x - 12}
                  y1={ly}
                  x2={x + 12}
                  y2={ly}
                  stroke="currentColor"
                  strokeWidth={1}
                />
              ))}
              {note.accidental !== 'natural' && (
                <text
                  x={x - 12}
                  y={y + 5}
                  fontSize={15}
                  textAnchor="end"
                  fill={isSelected ? 'var(--color-pressed)' : 'currentColor'}
                >
                  {ACCIDENTAL_GLYPH[note.accidental]}
                </text>
              )}
              <ellipse
                cx={x}
                cy={y}
                rx={8}
                ry={5.5}
                fill={isSelected ? 'var(--color-pressed)' : 'white'}
                stroke={isSelected ? 'var(--color-pressed)' : 'currentColor'}
                strokeWidth={1.8}
                transform={`rotate(-15 ${x} ${y})`}
              />
              <text
                x={x}
                y={128}
                fontSize={13}
                textAnchor="middle"
                fill={isSelected ? 'var(--color-pressed)' : 'currentColor'}
                fontWeight={isSelected ? 700 : 400}
              >
                {noteName(note)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
