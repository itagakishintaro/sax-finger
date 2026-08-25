import type { AlternateFingering } from '../domain/fingerings'

interface Props {
  alternates: readonly AlternateFingering[]
  /** -1 = 基本運指、0以上 = alternatesのindex */
  value: number
  onChange: (index: number) => void
}

export function FingeringToggle({ alternates, value, onChange }: Props) {
  const options = [{ label: '基本', index: -1 }].concat(
    alternates.map((alt, index) => ({ label: alt.label, index })),
  )

  return (
    <div role="group" aria-label="運指" className="flex flex-wrap items-center gap-1">
      <span className="mr-1 text-sm text-ink/70">運指:</span>
      {options.map(({ label, index }) => {
        const isActive = index === value
        return (
          <button
            key={label}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(index)}
            className={`h-9 rounded-lg border px-3 text-sm leading-none transition-colors ${
              isActive
                ? 'border-pressed bg-pressed font-bold text-white'
                : 'border-ink/25 bg-white hover:bg-ink/5'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
