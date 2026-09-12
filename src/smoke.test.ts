import { describe, it, expect } from 'vitest'
import theme, { C } from './theme/theme'

describe('toolchain', () => {
  it('theme exports tokens and a palette', () => {
    expect(C.saffron).toBe('#E98A3C')
    expect(theme.palette.primary.main).toBe('#E98A3C')
  })
})
