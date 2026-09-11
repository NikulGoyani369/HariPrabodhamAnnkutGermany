import { describe, it, expect } from 'vitest'
import theme, { C } from './theme/theme'

describe('toolchain', () => {
  it('theme exports tokens and a palette', () => {
    expect(C.gold).toBe('#9C6B2E')
    expect(theme.palette.primary.main).toBe('#9C6B2E')
  })
})
