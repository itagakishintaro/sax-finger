import { noteId, type Note } from './notes'

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

/** 基本運指マスタ(記譜音)。幹音シ3〜ファ6。#/♭は後続Issueで追加 */
const FINGERINGS: Record<string, readonly KeyId[]> = {
  B3: ['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowB'],
  C4: ['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'lowC'],
  D4: ['L1', 'L2', 'L3', 'R1', 'R2', 'R3'],
  E4: ['L1', 'L2', 'L3', 'R1', 'R2'],
  F4: ['L1', 'L2', 'L3', 'R1'],
  G4: ['L1', 'L2', 'L3'],
  A4: ['L1', 'L2'],
  B4: ['L1'],
  C5: ['L2'],
  // レ5〜シ5は下のオクターブと同じ運指にオクターブキーを加える
  D5: ['octave', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3'],
  E5: ['octave', 'L1', 'L2', 'L3', 'R1', 'R2'],
  F5: ['octave', 'L1', 'L2', 'L3', 'R1'],
  G5: ['octave', 'L1', 'L2', 'L3'],
  A5: ['octave', 'L1', 'L2'],
  B5: ['octave', 'L1'],
  C6: ['octave', 'L2'],
  D6: ['octave', 'palmD'],
  E6: ['octave', 'palmD', 'palmEb', 'sideE'],
  F6: ['octave', 'palmD', 'palmEb', 'palmF', 'sideE'],
}

/** 音に対応する基本運指を返す。未対応の音はundefined */
export function getFingering(note: Note): readonly KeyId[] | undefined {
  return FINGERINGS[noteId(note)]
}
