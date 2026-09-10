import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'
import { useRsvpStore } from '../../store/rsvpStore'

const regOpen = vi.fn()
vi.mock('../../hooks/useRegistrationOpen', () => ({ useRegistrationOpen: () => regOpen() }))

const renderNav = () => render(<MemoryRouter><Navbar /></MemoryRouter>)

beforeEach(() => {
  vi.clearAllMocks()
  useRsvpStore.setState({ modalOpen: false })
})

describe('Navbar', () => {
  it('opens the RSVP modal from the CTA when registration is open', async () => {
    regOpen.mockReturnValue(true)
    const user = userEvent.setup()
    renderNav()
    await user.click(screen.getByRole('button', { name: /register now/i }))
    expect(useRsvpStore.getState().modalOpen).toBe(true)
  })

  it('shows "Learn More" instead when registration is closed', () => {
    regOpen.mockReturnValue(false)
    renderNav()
    expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /register now/i })).not.toBeInTheDocument()
  })
})
