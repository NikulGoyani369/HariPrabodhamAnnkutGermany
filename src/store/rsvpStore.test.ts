import { describe, it, expect, beforeEach } from 'vitest'
import { useRsvpStore } from './rsvpStore'

beforeEach(() => {
  useRsvpStore.setState({ modalOpen: false })
})

describe('rsvpStore', () => {
  it('starts closed', () => {
    expect(useRsvpStore.getState().modalOpen).toBe(false)
  })

  it('openModal / closeModal toggle modalOpen', () => {
    useRsvpStore.getState().openModal()
    expect(useRsvpStore.getState().modalOpen).toBe(true)
    useRsvpStore.getState().closeModal()
    expect(useRsvpStore.getState().modalOpen).toBe(false)
  })
})
