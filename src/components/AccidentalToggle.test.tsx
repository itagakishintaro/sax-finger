import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccidentalToggle } from './AccidentalToggle'

describe('AccidentalToggle', () => {
  it('♭・♮・#の3ボタンが表示される', () => {
    render(<AccidentalToggle value="natural" onChange={() => {}} />)
    const group = screen.getByRole('group', { name: '変化記号' })
    expect(group).toBeInTheDocument()
    for (const name of ['♭', '♮', '#']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
  })

  it('現在値のボタンがaria-pressedになる', () => {
    render(<AccidentalToggle value="sharp" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: '#' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '♮' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('クリックでonChangeが呼ばれる', async () => {
    const onChange = vi.fn()
    render(<AccidentalToggle value="natural" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: '♭' }))
    expect(onChange).toHaveBeenCalledWith('flat')
  })
})
