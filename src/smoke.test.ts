import { describe, it, expect } from 'vitest'
import theme, { C } from './theme/theme'

describe('toolchain', () => {
  it('theme exports tokens and a palette', () => {
    expect(C.maroon700).toBe('#7A1E2B')
    expect(theme.palette.primary.main).toBe('#7A1E2B')
  })
})
