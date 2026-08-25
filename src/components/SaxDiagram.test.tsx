import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SaxDiagram } from './SaxDiagram'
import { KEY_IDS } from '../domain/fingerings'

describe('SaxDiagram', () => {
  it('全キーがdata-key付きで描画される', () => {
    const { container } = render(<SaxDiagram pressedKeys={[]} />)
    for (const key of KEY_IDS) {
      expect(container.querySelector(`[data-key="${key}"]`)).not.toBeNull()
    }
  })

  it('押さえるキーはdata-pressed=true、それ以外はfalse', () => {
    const { container } = render(<SaxDiagram pressedKeys={['L1', 'L2', 'L3']} />)
    expect(container.querySelector('[data-key="L1"]')).toHaveAttribute('data-pressed', 'true')
    expect(container.querySelector('[data-key="L3"]')).toHaveAttribute('data-pressed', 'true')
    expect(container.querySelector('[data-key="R1"]')).toHaveAttribute('data-pressed', 'false')
    expect(container.querySelector('[data-key="octave"]')).toHaveAttribute('data-pressed', 'false')
  })
})
