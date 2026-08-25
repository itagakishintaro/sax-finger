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

describe('noteName', () => {
  it('幹音はカタカナのみ', () => {
    expect(noteName(note({ pitch: 'F' }))).toBe('ファ')
  })
  it('変化記号が付く', () => {
    expect(noteName(note({ pitch: 'G', accidental: 'sharp' }))).toBe('ソ#')
    expect(noteName(note({ pitch: 'A', accidental: 'flat' }))).toBe('ラ♭')
  })
})
