import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StaffSelector } from './StaffSelector'
import type { Note, PitchName } from '../domain/notes'

const natural = (pitch: PitchName): Note => ({ pitch, accidental: 'natural', octave: 4 })
const NOTES = (['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const).map(natural)

describe('StaffSelector', () => {
  it('全音符がボタンとして表示される', () => {
    render(<StaffSelector notes={NOTES} onSelect={() => {}} />)
    for (const name of ['ド', 'レ', 'ミ', 'ファ', 'ソ', 'ラ', 'シ']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
  })

  it('音符をクリックするとonSelectが呼ばれる', async () => {
    const onSelect = vi.fn()
    render(<StaffSelector notes={NOTES} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: 'ソ' }))
    expect(onSelect).toHaveBeenCalledWith(natural('G'))
  })

  it('選択中の音符はaria-pressedになる', () => {
    render(<StaffSelector notes={NOTES} selected={natural('A')} onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: 'ラ' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'ド' })).toHaveAttribute('aria-pressed', 'false')
  })
})
