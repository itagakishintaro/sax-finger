import { describe, it, expect } from 'vitest'
import { noteId, noteName, type Note } from './notes'

const note = (partial: Partial<Note>): Note => ({
  pitch: 'C',
  accidental: 'natural',
  octave: 4,
  ...partial,
})

describe('noteId', () => {
  it('幹音はピッチ名+オクターブ', () => {
    expect(noteId(note({ pitch: 'G', octave: 4 }))).toBe('G4')
  })
  it('シャープは#付き', () => {
    expect(noteId(note({ pitch: 'C', accidental: 'sharp', octave: 5 }))).toBe('C#5')
  })
  it('フラットは♭付き', () => {
    expect(noteId(note({ pitch: 'B', accidental: 'flat', octave: 3 }))).toBe('B♭3')
  })
})

describe('SELECTABLE_NATURALS', () => {
  it('シ3〜ファ6の幹音19音が音高順に並ぶ', async () => {
    const { SELECTABLE_NATURALS } = await import('./notes')
    expect(SELECTABLE_NATURALS).toHaveLength(19)
    expect(SELECTABLE_NATURALS[0]).toEqual(note({ pitch: 'B', octave: 3 }))
    expect(SELECTABLE_NATURALS[1]).toEqual(note({ pitch: 'C', octave: 4 }))
    expect(SELECTABLE_NATURALS[18]).toEqual(note({ pitch: 'F', octave: 6 }))
    expect(SELECTABLE_NATURALS.every((n) => n.accidental === 'natural')).toBe(true)
  })
})

describe('noteName', () => {
  it('幹音はカタカナのみ', () => {
    expect(noteName(note({ pitch: 'F' }))).toBe('ファ')
  })
  it('変化記号が付く', () => {
    expect(noteName(note({ pitch: 'G', accidental: 'sharp' }))).toBe('ソ#')
    expect(noteName(note({ pitch: 'A', accidental: 'flat' }))).toBe('ラ♭')
  })
})

describe('enharmonicEquivalent', () => {
  it('シャープは上の音のフラット', async () => {
    const { enharmonicEquivalent } = await import('./notes')
    expect(enharmonicEquivalent(note({ pitch: 'G', accidental: 'sharp' }))).toEqual(
      note({ pitch: 'A', accidental: 'flat' }),
    )
  })
  it('フラットは下の音のシャープ', async () => {
    const { enharmonicEquivalent } = await import('./notes')
    expect(enharmonicEquivalent(note({ pitch: 'E', accidental: 'flat' }))).toEqual(
      note({ pitch: 'D', accidental: 'sharp' }),
    )
  })
  it('幹音はundefined', async () => {
    const { enharmonicEquivalent } = await import('./notes')
    expect(enharmonicEquivalent(note({ pitch: 'G' }))).toBeUndefined()
  })
})

