import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import HeroSection from './HeroSection'
import { useRsvpStore } from '../../store/rsvpStore'

const regOpen = vi.fn()
vi.mock('../../hooks/useRegistrationOpen', () => ({ useRegistrationOpen: () => regOpen() }))

const renderHero = () => render(<MemoryRouter><HeroSection /></MemoryRouter>)

beforeEach(() => {
  vi.clearAllMocks()
  useRsvpStore.setState({ modalOpen: false })
})

describe('HeroSection', () => {
  it('renders the event title as the hero heading', () => {
    regOpen.mockReturnValue(true)
    renderHero()
    expect(screen.getByRole('heading', { level: 1, name: /the divine spark/i })).toBeInTheDocument()
  })

  it('opens the modal from "Register Now" when registration is open', async () => {
    regOpen.mockReturnValue(true)
    const user = userEvent.setup()
    renderHero()
    await user.click(screen.getByRole('button', { name: /register now/i }))
    expect(useRsvpStore.getState().modalOpen).toBe(true)
  })

  it('hides the CTA and shows a learn-more link when closed', () => {
    regOpen.mockReturnValue(false)
    renderHero()
    expect(screen.queryByRole('button', { name: /register now/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument()
  })
})
