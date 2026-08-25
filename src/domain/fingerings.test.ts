import { describe, it, expect } from 'vitest'
import { getAlternateFingerings, getFingering, isSelectable, KEY_IDS } from './fingerings'
import type { Accidental, Note, PitchName } from './notes'

const natural = (pitch: PitchName, octave: Note['octave'] = 4): Note => ({
  pitch,
  accidental: 'natural',
  octave,
})

const withAcc = (
  pitch: PitchName,
  accidental: Accidental,
  octave: Note['octave'] = 4,
): Note => ({ pitch, accidental, octave })

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
    expect(getFingering(withAcc('A', 'sharp', 6))).toBeUndefined()
  })
})

describe('getFingering(シャープ・フラット)', () => {
  it.each([
    ['シ♭3', withAcc('B', 'flat', 3), ['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowBb']],
    ['ド#4', withAcc('C', 'sharp'), ['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowCsharp']],
    ['ミ♭4', withAcc('E', 'flat'), ['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowEb']],
    ['ファ#4', withAcc('F', 'sharp'), ['L1', 'L2', 'L3', 'R2']],
    ['ソ#4', withAcc('G', 'sharp'), ['L1', 'L2', 'L3', 'gSharp']],
    ['シ♭4', withAcc('B', 'flat'), ['L1', 'bis']],
    ['ミ♭6', withAcc('E', 'flat', 6), ['octave', 'palmD', 'palmEb']],
    [
      'ファ#6',
      withAcc('F', 'sharp', 6),
      ['octave', 'palmD', 'palmEb', 'palmF', 'sideE', 'highFsharp'],
    ],
  ] as const)('%s の運指', (_label, note, expected) => {
    expect(getFingering(note)).toEqual(expected)
  })

  it('ド#5は開放(空配列)', () => {
    expect(getFingering(withAcc('C', 'sharp', 5))).toEqual([])
  })

  it('異名同音は同じ運指(フラット→シャープに正規化)', () => {
    expect(getFingering(withAcc('D', 'flat'))).toEqual(getFingering(withAcc('C', 'sharp')))
    expect(getFingering(withAcc('A', 'flat', 5))).toEqual(getFingering(withAcc('G', 'sharp', 5)))
  })

  it('ソ#5はソ5+オクターブキーではなく専用定義に従う(ソ#4+octave)', () => {
    expect(getFingering(withAcc('G', 'sharp', 5))).toEqual(['octave', 'L1', 'L2', 'L3', 'gSharp'])
  })
})

describe('getAlternateFingerings', () => {
  it('シ♭4はサイドB♭と1&1の2つ', () => {
    expect(getAlternateFingerings(withAcc('B', 'flat'))).toEqual([
      { label: 'サイドB♭', keys: ['L1', 'sideBb'] },
      { label: '1&1', keys: ['L1', 'R1'] },
    ])
  })

  it('シ♭5はオクターブキー付きの同じ替え指', () => {
    expect(getAlternateFingerings(withAcc('B', 'flat', 5))).toEqual([
      { label: 'サイドB♭', keys: ['octave', 'L1', 'sideBb'] },
      { label: '1&1', keys: ['octave', 'L1', 'R1'] },
    ])
  })

  it('異名同音(ラ#4)でも同じ替え指', () => {
    expect(getAlternateFingerings(withAcc('A', 'sharp'))).toEqual(
      getAlternateFingerings(withAcc('B', 'flat')),
    )
  })

  it('ド5・ド6はサイドC', () => {
    expect(getAlternateFingerings(natural('C', 5))).toEqual([
      { label: 'サイドC', keys: ['L1', 'sideC'] },
    ])
    expect(getAlternateFingerings(natural('C', 6))).toEqual([
      { label: 'サイドC', keys: ['octave', 'L1', 'sideC'] },
    ])
  })

  it('ファ#4・ファ#5は替えF#(薬指)', () => {
    expect(getAlternateFingerings(withAcc('F', 'sharp'))).toEqual([
      { label: '替えF#', keys: ['L1', 'L2', 'L3', 'R3'] },
    ])
    expect(getAlternateFingerings(withAcc('F', 'sharp', 5))).toEqual([
      { label: '替えF#', keys: ['octave', 'L1', 'L2', 'L3', 'R3'] },
    ])
  })

  it('替え指のない音は空配列', () => {
    expect(getAlternateFingerings(natural('G'))).toEqual([])
    expect(getAlternateFingerings(natural('A', 3))).toEqual([])
  })

  it('替え指はすべて定義済みキーのみで構成される', () => {
    for (const note of [withAcc('B', 'flat'), withAcc('B', 'flat', 5), natural('C', 5)]) {
      for (const alt of getAlternateFingerings(note)) {
        for (const key of alt.keys) expect(KEY_IDS).toContain(key)
      }
    }
  })
})

describe('isSelectable', () => {
  it('ミ#・シ#・ファ♭・ド♭は選べない', () => {
    expect(isSelectable(withAcc('E', 'sharp'))).toBe(false)
    expect(isSelectable(withAcc('B', 'sharp'))).toBe(false)
    expect(isSelectable(withAcc('F', 'flat'))).toBe(false)
    expect(isSelectable(withAcc('C', 'flat'))).toBe(false)
  })
  it('運指が定義されている音は選べる(開放のド#5も含む)', () => {
    expect(isSelectable(withAcc('G', 'sharp'))).toBe(true)
    expect(isSelectable(withAcc('B', 'flat', 3))).toBe(true)
    expect(isSelectable(withAcc('F', 'sharp', 6))).toBe(true)
    expect(isSelectable(withAcc('C', 'sharp', 5))).toBe(true)
  })
  it('運指が未定義の音は選べない', () => {
    expect(isSelectable(natural('A', 3))).toBe(false)
    expect(isSelectable(withAcc('A', 'sharp', 6))).toBe(false)
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
