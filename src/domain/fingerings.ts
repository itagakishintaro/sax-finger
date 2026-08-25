import { noteId, type Note, type PitchName } from './notes'

/** サックスの全キー(docs/design.md「キー定義」参照) */
export type KeyId =
  | 'octave'
  | 'palmD'
  | 'palmEb'
  | 'palmF'
  | 'frontF'
  | 'L1'
  | 'bis'
  | 'L2'
  | 'L3'
  | 'gSharp'
  | 'lowCsharp'
  | 'lowB'
  | 'lowBb'
  | 'R1'
  | 'R2'
  | 'R3'
  | 'sideE'
  | 'sideC'
  | 'sideBb'
  | 'highFsharp'
  | 'lowEb'
  | 'lowC'

export const KEY_IDS: readonly KeyId[] = [
  'octave',
  'palmD',
  'palmEb',
  'palmF',
  'frontF',
  'L1',
  'bis',
  'L2',
  'L3',
  'gSharp',
  'lowCsharp',
  'lowB',
  'lowBb',
  'R1',
  'R2',
  'R3',
  'sideE',
  'sideC',
  'sideBb',
  'highFsharp',
  'lowEb',
  'lowC',
]

/** 基本運指マスタ(記譜音)。シ♭3〜ファ#6の全半音をシャープ表記で持つ(フラットは正規化して参照) */
const FINGERINGS: Record<string, readonly KeyId[]> = {
  'A#3': ['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowBb'],
  B3: ['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowB'],
  C4: ['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowC'],
  'C#4': ['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowCsharp'],
  D4: ['L1', 'L2', 'L3', 'R1', 'R2', 'R3'],
  'D#4': ['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowEb'],
  E4: ['L1', 'L2', 'L3', 'R1', 'R2'],
  F4: ['L1', 'L2', 'L3', 'R1'],
  'F#4': ['L1', 'L2', 'L3', 'R2'],
  G4: ['L1', 'L2', 'L3'],
  'G#4': ['L1', 'L2', 'L3', 'gSharp'],
  A4: ['L1', 'L2'],
  'A#4': ['L1', 'bis'],
  B4: ['L1'],
  C5: ['L2'],
  'C#5': [], // 開放
  // レ5〜シ5は下のオクターブと同じ運指にオクターブキーを加える
  D5: ['octave', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3'],
  'D#5': ['octave', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowEb'],
  E5: ['octave', 'L1', 'L2', 'L3', 'R1', 'R2'],
  F5: ['octave', 'L1', 'L2', 'L3', 'R1'],
  'F#5': ['octave', 'L1', 'L2', 'L3', 'R2'],
  G5: ['octave', 'L1', 'L2', 'L3'],
  'G#5': ['octave', 'L1', 'L2', 'L3', 'gSharp'],
  A5: ['octave', 'L1', 'L2'],
  'A#5': ['octave', 'L1', 'bis'],
  B5: ['octave', 'L1'],
  C6: ['octave', 'L2'],
  'C#6': ['octave'],
  D6: ['octave', 'palmD'],
  'D#6': ['octave', 'palmD', 'palmEb'],
  E6: ['octave', 'palmD', 'palmEb', 'sideE'],
  F6: ['octave', 'palmD', 'palmEb', 'palmF', 'sideE'],
  'F#6': ['octave', 'palmD', 'palmEb', 'palmF', 'sideE', 'highFsharp'],
}

/** フラットを異名同音のシャープに正規化する(レ♭4 → ド#4)。ド♭・ファ♭は対象外 */
const FLAT_TO_SHARP: Partial<Record<PitchName, PitchName>> = {
  D: 'C',
  E: 'D',
  G: 'F',
  A: 'G',
  B: 'A',
}

function normalize(note: Note): Note | undefined {
  if (note.accidental !== 'flat') return note
  const pitch = FLAT_TO_SHARP[note.pitch]
  return pitch && { pitch, accidental: 'sharp', octave: note.octave }
}

/** 音に対応する基本運指を返す。未対応の音はundefined(開放のド#5は空配列) */
export function getFingering(note: Note): readonly KeyId[] | undefined {
  const normalized = normalize(note)
  return normalized && FINGERINGS[noteId(normalized)]
}

/** その音をアプリで選択できるか。ミ#・シ#・ファ♭・ド♭と運指未定義の音は不可 */
export function isSelectable(note: Note): boolean {
  if (note.accidental === 'sharp' && (note.pitch === 'E' || note.pitch === 'B')) return false
  if (note.accidental === 'flat' && (note.pitch === 'C' || note.pitch === 'F')) return false
  return getFingering(note) !== undefined
}
