import type { Accidental } from '../domain/notes'

interface Props {
  value: Accidental
  onChange: (accidental: Accidental) => void
}

const OPTIONS: readonly { value: Accidental; label: string }[] = [
  { value: 'flat', label: '♭' },
  { value: 'natural', label: '♮' },
  { value: 'sharp', label: '#' },
]

export function AccidentalToggle({ value, onChange }: Props) {
  return (
    <div role="group" aria-label="変化記号" className="flex items-center gap-1">
      <span className="mr-1 text-sm text-ink/70">変化記号:</span>
      {OPTIONS.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`h-9 w-9 rounded-lg border text-lg leading-none transition-colors ${
              isActive
                ? 'border-pressed bg-pressed font-bold text-white'
                : 'border-ink/25 bg-white hover:bg-ink/5'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
