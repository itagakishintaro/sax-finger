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
