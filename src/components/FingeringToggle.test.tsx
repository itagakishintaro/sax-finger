import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FingeringToggle } from './FingeringToggle'

const ALTERNATES = [
  { label: 'サイドB♭', keys: ['L1', 'sideBb'] },
  { label: '1&1', keys: ['L1', 'R1'] },
] as const

describe('FingeringToggle', () => {
  it('「基本」と替え指のボタンが表示される', () => {
    render(<FingeringToggle alternates={ALTERNATES} value={-1} onChange={() => {}} />)
    expect(screen.getByRole('group', { name: '運指' })).toBeInTheDocument()
    for (const name of ['基本', 'サイドB♭', '1&1']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
  })

  it('現在値のボタンがaria-pressedになる', () => {
    render(<FingeringToggle alternates={ALTERNATES} value={0} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'サイドB♭' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: '基本' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('クリックでonChangeが呼ばれる(基本=-1、替え指=index)', async () => {
    const onChange = vi.fn()
    render(<FingeringToggle alternates={ALTERNATES} value={-1} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: '1&1' }))
    expect(onChange).toHaveBeenCalledWith(1)
    await userEvent.click(screen.getByRole('button', { name: '基本' }))
    expect(onChange).toHaveBeenCalledWith(-1)
  })
})
