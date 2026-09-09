import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePageMeta } from './usePageMeta'

describe('usePageMeta', () => {
  it('sets the base title when no title is given', () => {
    renderHook(() => usePageMeta())
    expect(document.title).toBe('HariPrabodham Annakut')
  })

  it('prefixes a page title before the base title', () => {
    renderHook(() => usePageMeta('Venue'))
    expect(document.title).toBe('Venue · HariPrabodham Annakut')
  })

  it('restores the base title on unmount', () => {
    const { unmount } = renderHook(() => usePageMeta('Contact'))
    unmount()
    expect(document.title).toBe('HariPrabodham Annakut')
  })
})
