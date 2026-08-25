export type PitchName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
export type Accidental = 'natural' | 'sharp' | 'flat'
export type Octave = 3 | 4 | 5 | 6

export interface Note {
  pitch: PitchName
  accidental: Accidental
  octave: Octave
}

const KATAKANA: Record<PitchName, string> = {
  C: 'ド',
  D: 'レ',
  E: 'ミ',
  F: 'ファ',
  G: 'ソ',
  A: 'ラ',
  B: 'シ',
}

const ACCIDENTAL_MARK: Record<Accidental, string> = {
  natural: '',
  sharp: '#',
  flat: '♭',
}

/** 音の一意なID(例: 'C4', 'C#4', 'B♭3')。異名同音は区別したまま表す */
export function noteId(note: Note): string {
  return `${note.pitch}${ACCIDENTAL_MARK[note.accidental]}${note.octave}`
}

/** カタカナ音名(例: 'ド', 'ソ#', 'シ♭') */
export function noteName(note: Note): string {
  return `${KATAKANA[note.pitch]}${ACCIDENTAL_MARK[note.accidental]}`
}

/** 同名異オクターブを区別するためのアクセシブル名(例: 'ソ4', 'シ♭3') */
export function noteAriaLabel(note: Note): string {
  return `${noteName(note)}${note.octave}`
}

/** 異名同音(ソ# ⇔ ラ♭)。幹音はundefined。ミ#・シ#・ファ♭・ド♭は扱わない(isSelectableで除外) */
export function enharmonicEquivalent(note: Note): Note | undefined {
  if (note.accidental === 'sharp') {
    const upper: Partial<Record<PitchName, PitchName>> = { C: 'D', D: 'E', F: 'G', G: 'A', A: 'B' }
    const pitch = upper[note.pitch]
    return pitch && { pitch, accidental: 'flat', octave: note.octave }
  }
  if (note.accidental === 'flat') {
    const lower: Partial<Record<PitchName, PitchName>> = { D: 'C', E: 'D', G: 'F', A: 'G', B: 'A' }
    const pitch = lower[note.pitch]
    return pitch && { pitch, accidental: 'sharp', octave: note.octave }
  }
  return undefined
}

const PITCH_ORDER: readonly PitchName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

/** 選択可能な幹音(シ3〜ファ6)を音高順に並べた一覧 */
export const SELECTABLE_NATURALS: readonly Note[] = (
  [[3, ['B']], [4, PITCH_ORDER], [5, PITCH_ORDER], [6, ['C', 'D', 'E', 'F']]] as const
).flatMap(([octave, pitches]) =>
  pitches.map((pitch): Note => ({ pitch, accidental: 'natural', octave })),
)
