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
