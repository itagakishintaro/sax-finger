import { useState } from 'react'
import { AccidentalToggle } from './components/AccidentalToggle'
import { FingeringToggle } from './components/FingeringToggle'
import { StaffSelector } from './components/StaffSelector'
import { SaxDiagram } from './components/SaxDiagram'
import { getAlternateFingerings, getFingering, isSelectable } from './domain/fingerings'
import {
  enharmonicEquivalent,
  noteName,
  SELECTABLE_NATURALS,
  type Accidental,
  type Note,
} from './domain/notes'

const BASIC = -1

export default function App() {
  const [accidental, setAccidental] = useState<Accidental>('natural')
  const [selected, setSelected] = useState<Note>()
  const [variant, setVariant] = useState(BASIC)

  const notes = SELECTABLE_NATURALS.map((note): Note => ({ ...note, accidental }))
  const enharmonic = selected && enharmonicEquivalent(selected)
  const alternates = selected ? getAlternateFingerings(selected) : []
  const fingering = selected
    ? (variant >= 0 ? alternates[variant]?.keys : undefined) ?? getFingering(selected)
    : undefined

  const selectNote = (note: Note) => {
    setSelected(note)
    setVariant(BASIC)
  }

  const changeAccidental = (next: Accidental) => {
    setAccidental(next)
    setVariant(BASIC)
    if (selected) {
      const applied: Note = { ...selected, accidental: next }
      setSelected(isSelectable(applied) ? applied : undefined)
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4">
      <header className="border-b border-brass/30 py-4">
        <h1 className="text-2xl font-bold text-brass">Sax Finger</h1>
        <p className="text-sm">五線譜の音符をタップすると、サックスの運指を表示します</p>
      </header>
      <main className="flex flex-col items-center gap-6 py-6">
        <AccidentalToggle value={accidental} onChange={changeAccidental} />
        <StaffSelector notes={notes} selected={selected} onSelect={selectNote} />
        {selected ? (
          <>
            <p className="text-lg">
              選択中:{' '}
              <span data-testid="selected-note" className="font-bold text-pressed">
                {noteName(selected)}
              </span>
              {enharmonic && (
                <span data-testid="enharmonic-note" className="ml-1 text-sm text-ink/70">
                  （= {noteName(enharmonic)}）
                </span>
              )}
            </p>
            {alternates.length > 0 && (
              <FingeringToggle alternates={alternates} value={variant} onChange={setVariant} />
            )}
            <SaxDiagram pressedKeys={fingering ?? []} />
          </>
        ) : (
          <p className="text-sm text-ink/60">音符を選んでください</p>
        )}
      </main>
    </div>
  )
}
