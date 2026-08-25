import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StaffSelector } from './StaffSelector'
import { SELECTABLE_NATURALS, noteAriaLabel, type Note, type PitchName } from '../domain/notes'

const natural = (pitch: PitchName, octave: Note['octave'] = 4): Note => ({
  pitch,
  accidental: 'natural',
  octave,
})

describe('StaffSelector', () => {
  it('全音符がオクターブ付きのアクセシブル名を持つボタンとして表示される', () => {
    render(<StaffSelector notes={SELECTABLE_NATURALS} onSelect={() => {}} />)
    for (const note of SELECTABLE_NATURALS) {
      expect(screen.getByRole('button', { name: noteAriaLabel(note) })).toBeInTheDocument()
    }
  })

  it('音符をクリックするとonSelectが呼ばれる', async () => {
    const onSelect = vi.fn()
    render(<StaffSelector notes={SELECTABLE_NATURALS} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: 'ソ5' }))
    expect(onSelect).toHaveBeenCalledWith(natural('G', 5))
  })

  it('選択中の音符はaria-pressedになる', () => {
    render(
      <StaffSelector notes={SELECTABLE_NATURALS} selected={natural('A')} onSelect={() => {}} />,
    )
    expect(screen.getByRole('button', { name: 'ラ4' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'ラ5' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('選択不可の音符はaria-disabledになりクリックしてもonSelectが呼ばれない', async () => {
    const sharps = SELECTABLE_NATURALS.map((n) => ({ ...n, accidental: 'sharp' as const }))
    const onSelect = vi.fn()
    render(<StaffSelector notes={sharps} onSelect={onSelect} />)
    const disabled = screen.getByRole('button', { name: 'ミ#4' })
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(disabled)
    expect(onSelect).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'ソ#4' }))
    expect(onSelect).toHaveBeenCalledWith({ pitch: 'G', accidental: 'sharp', octave: 4 })
  })
})
