import { lazy, Suspense, type ReactNode } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Typography, Button } from '@mui/material'
import { C } from './theme/theme'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import RsvpModal from './components/rsvp/RsvpModal'
import HeroSection from './components/sections/HeroSection'
import GlanceSection from './components/sections/GlanceSection'
import AboutAnnakutSection from './components/sections/AboutAnnakutSection'
import { usePageMeta } from './hooks/usePageMeta'

const VenuePage       = lazy(() => import('./pages/VenuePage'))
const ContactPage     = lazy(() => import('./pages/ContactPage'))
const ImpressumPage   = lazy(() => import('./pages/ImpressumPage'))
const DataPrivacyPage = lazy(() => import('./pages/DataPrivacyPage'))

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress size={32} sx={{ color: C.maroon700 }} />
    </Box>
  )
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ pt: { xs: '64px', md: '72px' } }}>{children}</Box>
      <Footer />
      <RsvpModal />
    </>
  )
}

function LandingPage() {
  usePageMeta(undefined, 'HariPrabodham Annakut — The Divine Spark. Read about the celebration and RSVP for free.')
  return (
    <PageShell>
      <HeroSection />
      <GlanceSection />
      <AboutAnnakutSection />
    </PageShell>
  )
}

function NotFoundPage() {
  const navigate = useNavigate()
  usePageMeta('Page not found')
  return (
    <PageShell>
      <Box sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: 2 }}>
        <Typography sx={{ fontFamily: '"Blue Mirage", serif', fontSize: { xs: '5rem', md: '8rem' }, color: C.sand300, lineHeight: 1, mb: 1 }}>404</Typography>
        <Typography variant="h4" sx={{ color: C.maroon800, mb: 1.5 }}>Page not found</Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/')}>Back to Home</Button>
      </Box>
    </PageShell>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/venue" element={<VenuePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/data-privacy" element={<DataPrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
