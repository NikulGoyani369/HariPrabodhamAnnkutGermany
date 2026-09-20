import { usePageMeta } from '../hooks/usePageMeta'
import { PageShell } from '../App'
import ContactSection from '../components/sections/ContactSection'

export default function ContactPage() {
  usePageMeta('Contact', 'Contact the HariPrabodham Annakut Utsav team.')
  return (
    <PageShell>
      <ContactSection />
    </PageShell>
  )
}
