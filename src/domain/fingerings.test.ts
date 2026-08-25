import { describe, it, expect } from 'vitest'
import { getFingering, KEY_IDS } from './fingerings'
import type { Note, PitchName } from './notes'

const natural = (pitch: PitchName, octave: Note['octave'] = 4): Note => ({
  pitch,
  accidental: 'natural',
  octave,
})

describe('getFingering(ド4〜シ4の幹音)', () => {
  it.each([
    ['C', ['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowC']],
    ['D', ['L1', 'L2', 'L3', 'R1', 'R2', 'R3']],
    ['E', ['L1', 'L2', 'L3', 'R1', 'R2']],
    ['F', ['L1', 'L2', 'L3', 'R1']],
    ['G', ['L1', 'L2', 'L3']],
    ['A', ['L1', 'L2']],
    ['B', ['L1']],
  ] as const)('%s4の運指', (pitch, expected) => {
    expect(getFingering(natural(pitch))).toEqual(expected)
  })

  it('運指はすべて定義済みキーのみで構成される', () => {
    for (const pitch of ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const) {
      for (const key of getFingering(natural(pitch)) ?? []) {
        expect(KEY_IDS).toContain(key)
      }
    }
  })

  it('未対応の音はundefined', () => {
    expect(getFingering(natural('C', 3))).toBeUndefined()
    expect(getFingering({ pitch: 'C', accidental: 'sharp', octave: 4 })).toBeUndefined()
  })
})

describe('getFingering(全音域の幹音)', () => {
  it('シ3は全指+lowB', () => {
    expect(getFingering(natural('B', 3))).toEqual(['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowB'])
  })

  it('ド5はL2のみ', () => {
    expect(getFingering(natural('C', 5))).toEqual(['L2'])
  })

  it('レ5〜シ5は下のオクターブの運指+オクターブキー', () => {
    for (const pitch of ['D', 'E', 'F', 'G', 'A', 'B'] as const) {
      expect(getFingering(natural(pitch, 5))).toEqual([
        'octave',
        ...(getFingering(natural(pitch, 4)) ?? []),
      ])
    }
  })

  it('ド6はオクターブキー+L2', () => {
    expect(getFingering(natural('C', 6))).toEqual(['octave', 'L2'])
  })

  it('レ6以上はパームキーを使う', () => {
    expect(getFingering(natural('D', 6))).toEqual(['octave', 'palmD'])
    expect(getFingering(natural('E', 6))).toEqual(['octave', 'palmD', 'palmEb', 'sideE'])
    expect(getFingering(natural('F', 6))).toEqual(['octave', 'palmD', 'palmEb', 'palmF', 'sideE'])
  })

  it('選択可能な幹音すべてに運指が定義されている', async () => {
    const { SELECTABLE_NATURALS } = await import('./notes')
    for (const note of SELECTABLE_NATURALS) {
      expect(getFingering(note), `${note.pitch}${note.octave}`).toBeDefined()
    }
  })
})
