import { usePageMeta } from '../hooks/usePageMeta'
import { PageShell } from '../App'
import VenueSection from '../components/sections/VenueSection'

export default function VenuePage() {
  usePageMeta('Venue', 'Venue, directions and darshan timings for the HariPrabodham Annakut.')
  return (
    <PageShell>
      <VenueSection />
    </PageShell>
  )
}
