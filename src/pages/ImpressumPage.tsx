import { Box, Container, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { PageShell } from '../App'
import { C } from '../theme/theme'

// Adapted from the HariPrabodham Amrut Mahotsav Impressum. Two deliberate
// departures from that source, both noted to the organiser:
//  - it cites § 5 / § 7 / §§ 8–10 TMG; the TMG was replaced by the DDG in
//    May 2024, so the DDG is cited here instead.
//  - its EU online dispute resolution (ODR) section is omitted: the European
//    Commission's ODR platform ceased operating in July 2025.
const PROVIDER = {
  org: 'Yogi Divine Society e.V.',
  street: 'Im Tal 16',
  city: '14532 Kleinmachnow',
  phone: '033203 78408',
  email: 'info@yds-germany.de',
  representatives: ['Manfred Gutheins', 'Suyogi Gessner', 'Marion Zehe'],
  contentResponsible: 'Manfred Gutheins',
}

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

function MailLink({ email }: { email: string }) {
  return (
    <Box
      component="a"
      href={`mailto:${email}`}
      sx={{ color: C.mintDeep, '&:hover': { color: C.mintDeep }, transition: 'color .2s' }}
    >
      {email}
    </Box>
  )
}

export default function ImpressumPage() {
  usePageMeta(
    'Impressum',
    'Legal notice for the HariPrabodham Annakut — Impressum as required by German law.',
  )
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
              sx={{ mt: 0.75, fontSize: { xs: '2.25rem', md: 'clamp(2rem, 4vw, 3rem)' }, color: C.ink, fontFamily: '"GC Commune", serif' }}
            >
              Impressum
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
            <Section title="Information according to § 5 DDG">
              <Para>{PROVIDER.org}</Para>
              <Para>{PROVIDER.street}</Para>
              <Para>{PROVIDER.city}</Para>
            </Section>

            <Section title="Represented by">
              {PROVIDER.representatives.map((name) => (
                <Para key={name}>{name}</Para>
              ))}
            </Section>

            <Section title="Contact">
              <Para>Phone: {PROVIDER.phone}</Para>
              <Para>
                Email: <MailLink email={PROVIDER.email} />
              </Para>
            </Section>

            <Section title="Responsible for the content according to § 18 (2) MStV">
              <Para>{PROVIDER.contentResponsible}</Para>
              <Para>{`${PROVIDER.street}, ${PROVIDER.city}`}</Para>
            </Section>

            <Section title="Consumer Dispute Resolution / Universal Arbitration Board">
              <Para>
                We are not willing or obliged to participate in dispute resolution proceedings
                before a consumer arbitration board.
              </Para>
            </Section>

            <Section title="Liability for Content">
              <Para>
                As a service provider, we are responsible for our own content on these pages in
                accordance with general laws pursuant to § 7 (1) DDG. According to §§ 8 to 10 DDG,
                however, we are not obligated as a service provider to monitor transmitted or
                stored third-party information or to investigate circumstances that indicate
                illegal activity.
              </Para>
              <Para>
                Obligations to remove or block the use of information under general law remain
                unaffected. However, liability in this regard is only possible from the time of
                knowledge of a specific legal violation. Upon becoming aware of corresponding legal
                violations, we will remove this content immediately.
              </Para>
            </Section>

            <Section title="Liability for Links">
              <Para>
                Our website contains links to external third-party websites over whose content we
                have no influence. Therefore, we cannot accept any liability for this external
                content. The respective provider or operator of the pages is always responsible for
                the content of the linked pages. The linked pages were checked for possible legal
                violations at the time of linking. Illegal content was not recognisable at the time
                of linking.
              </Para>
              <Para>
                However, permanent monitoring of the content of the linked pages is not reasonable
                without concrete evidence of a violation of the law. Upon becoming aware of legal
                violations, we will remove such links immediately.
              </Para>
            </Section>

            <Section title="Copyright">
              <Para>
                The content and works on these pages created by the site operators are subject to
                German copyright law. The duplication, processing, distribution and any kind of
                exploitation outside the limits of copyright law require the written consent of the
                respective author or creator. Downloads and copies of this site are only permitted
                for private, non-commercial use.
              </Para>
              <Para>
                Insofar as the content on this site was not created by the operator, the copyrights
                of third parties are respected. In particular, third-party content is marked as
                such. Should you nevertheless become aware of a copyright infringement, please
                inform us accordingly. Upon becoming aware of legal violations, we will remove such
                content immediately.
              </Para>
            </Section>
          </Box>
        </Container>
      </Box>
    </PageShell>
  )
}
