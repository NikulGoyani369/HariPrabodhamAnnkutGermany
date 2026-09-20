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
    // Hero renders the event title as the page's single <h1>; the tagline
    // below it is a plain <p>. Assert the hero heading rendered.
    expect(
      await screen.findByRole('heading', { name: /annakut/i, level: 1 }),
    ).toBeInTheDocument()
    // and the tagline text is present (Footer repeats it as plain text too).
    expect(screen.getAllByText(/the divine spark/i).length).toBeGreaterThan(0)
  })

  it('renders the venue page at /venue', async () => {
    renderAt('/venue')
    // On /venue the VenueSection is the page, so its "The Venue" title is the
    // single <h1>; the venue-name-in-card is now an <h3>.
    expect(
      await screen.findByRole('heading', { name: /the venue/i, level: 1 }),
    ).toBeInTheDocument()
  })

  it('renders a 404 for an unknown route', async () => {
    renderAt('/nope')
    expect(await screen.findByText(/page not found/i)).toBeInTheDocument()
  })

  it('sets the document title from usePageMeta', async () => {
    renderAt('/contact')
    // Wait for the lazy ContactPage chunk to resolve before reading the title.
    // The ContactSection title is the page's single <h1>.
    await screen.findByRole('heading', { name: /^contact$/i, level: 1 })
    expect(document.title).toBe('Contact · HariPrabodham Annakut Utsav')
  })
})
