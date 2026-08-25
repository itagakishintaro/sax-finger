import { useState } from 'react'
import { StaffSelector } from './components/StaffSelector'
import { SaxDiagram } from './components/SaxDiagram'
import { getFingering } from './domain/fingerings'
import { noteName, SELECTABLE_NATURALS, type Note } from './domain/notes'

export default function App() {
  const [selected, setSelected] = useState<Note>()
  const fingering = selected ? getFingering(selected) : undefined

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4">
      <header className="border-b border-brass/30 py-4">
        <h1 className="text-2xl font-bold text-brass">Sax Finger</h1>
        <p className="text-sm">五線譜の音符をタップすると、サックスの運指を表示します</p>
      </header>
      <main className="flex flex-col items-center gap-6 py-6">
        <StaffSelector notes={SELECTABLE_NATURALS} selected={selected} onSelect={setSelected} />
        {selected ? (
          <>
            <p className="text-lg">
              選択中: <span data-testid="selected-note" className="font-bold text-pressed">{noteName(selected)}</span>
            </p>
            <SaxDiagram pressedKeys={fingering ?? []} />
          </>
        ) : (
          <p className="text-sm text-ink/60">音符を選んでください</p>
        )}
      </main>
    </div>
  )
}
