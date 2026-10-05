import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HeroSection from './HeroSection'
import { REGISTER_URL } from '../../data/data'
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

  it('links "Register Now" to the external registration page when registration is open', () => {
    regOpen.mockReturnValue(true)
    renderHero()
    expect(screen.getByRole('link', { name: /register now/i })).toHaveAttribute('href', REGISTER_URL)
  })

  it('hides the CTA and shows a learn-more link when closed', () => {
    regOpen.mockReturnValue(false)
    renderHero()
    expect(screen.queryByRole('button', { name: /register now/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument()
  })
})
