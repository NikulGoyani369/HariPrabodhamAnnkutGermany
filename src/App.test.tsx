import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

vi.mock('./utils/registrationGate', () => ({ isRegistrationOpenNow: () => true }))
vi.mock('./api/rsvp', () => ({ submitRsvp: vi.fn() }))

function renderAt(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}

beforeEach(() => vi.clearAllMocks())

describe('routing', () => {
  it('renders the landing hero at /', async () => {
    renderAt('/')
    // Hero renders the tagline as a level-2 heading; the Footer repeats the
    // tagline as plain text, so scope the assertion to the heading.
    expect(
      await screen.findByRole('heading', { name: /the divine spark/i, level: 3 }),
    ).toBeInTheDocument()
  })

  it('renders the venue page at /venue', async () => {
    renderAt('/venue')
    // VenueSection has two level-2 headings ("The Venue" and the venue name
    // placeholder "Venue name"); match the section title specifically.
    expect(
      await screen.findByRole('heading', { name: /the venue/i, level: 2 }),
    ).toBeInTheDocument()
  })

  it('renders a 404 for an unknown route', async () => {
    renderAt('/nope')
    expect(await screen.findByText(/page not found/i)).toBeInTheDocument()
  })

  it('sets the document title from usePageMeta', async () => {
    renderAt('/contact')
    // Wait for the lazy ContactPage chunk to resolve before reading the title.
    await screen.findByRole('heading', { name: /^contact$/i, level: 2 })
    expect(document.title).toBe('Contact · HariPrabodham Annakut')
  })
})
