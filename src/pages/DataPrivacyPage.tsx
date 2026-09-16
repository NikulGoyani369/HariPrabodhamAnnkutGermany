import { Box, Container, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { PageShell } from '../App'
import { FOOTER } from '../data/data'
import { C } from '../theme/theme'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        sx={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: { xs: '1.2rem', md: '1.35rem' },
          fontWeight: 700,
          color: C.ink,
          mb: 1.25,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  )
}

function Para({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: C.inkSoft, mb: 0.75 }}>
      {children}
    </Typography>
  )
}

export default function DataPrivacyPage() {
  usePageMeta('Data Privacy', 'Privacy policy for the HariPrabodham Annakut.')
  return (
    <PageShell>
      <Box sx={{ background: C.ivory, minHeight: '100vh' }}>
        {/* Page hero */}
        <Box
          sx={{
            py: { xs: '64px', md: '80px' },
            textAlign: 'center',
            background: `radial-gradient(600px 300px at 50% 0%, ${C.shell}B3, transparent 70%), ${C.ivory}`,
          }}
        >
          <Container maxWidth="md">
            <Typography component="span" sx={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, fontWeight: 600 }}>
              Legal Notice
            </Typography>
            <Typography
              variant="h1"
              sx={{ mt: 0.75, fontSize: { xs: '2.25rem', md: 'clamp(2rem, 4vw, 3rem)' }, color: C.ink, fontFamily: '"Blue Mirage", serif' }}
            >
              Data Privacy
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.25, mt: 1.75, color: C.goldLight, fontSize: 14 }}>
              <Box sx={{ height: '1px', width: 40, background: `linear-gradient(to right, transparent, ${C.goldLight}, transparent)` }} />
              ✦
              <Box sx={{ height: '1px', width: 40, background: `linear-gradient(to left, transparent, ${C.goldLight}, transparent)` }} />
            </Box>
          </Container>
        </Box>

        {/* Content */}
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Box
            sx={{
              background: C.shell,
              border: `1px solid ${C.gold}55`,
              borderRadius: '18px',
              p: { xs: 3.5, md: 5 },
            }}
          >
            {/* PLACEHOLDER — organiser to replace with the full privacy notice */}
            <Section title="Data Privacy">
              <Para>
                Privacy notice to be completed by the organiser. Registration data (name, contact details,
                party size) is stored solely to organise this event and is not shared.
              </Para>
              <Para>
                Email:{' '}
                <Box
                  component="a"
                  href={`mailto:${FOOTER.email}`}
                  sx={{ color: C.mintDeep, '&:hover': { color: C.mintDeep }, transition: 'color .2s' }}
                >
                  {FOOTER.email}
                </Box>
              </Para>
            </Section>
          </Box>
        </Container>
      </Box>
    </PageShell>
  )
}
