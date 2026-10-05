import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'
import { REGISTER_URL } from '../../data/data'
import { useRsvpStore } from '../../store/rsvpStore'

const regOpen = vi.fn()
vi.mock('../../hooks/useRegistrationOpen', () => ({ useRegistrationOpen: () => regOpen() }))

const renderNav = () => render(<MemoryRouter><Navbar /></MemoryRouter>)

beforeEach(() => {
  vi.clearAllMocks()
  useRsvpStore.setState({ modalOpen: false })
})

describe('Navbar', () => {
  it('links to the external registration page from the CTA when registration is open', () => {
    regOpen.mockReturnValue(true)
    renderNav()
    expect(screen.getByRole('link', { name: /register now/i })).toHaveAttribute('href', REGISTER_URL)
  })

  it('shows "Learn More" instead when registration is closed', () => {
    regOpen.mockReturnValue(false)
    renderNav()
    expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /register now/i })).not.toBeInTheDocument()
  })
})
