import { Box, Container, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { PageShell } from '../App'
import { C } from '../theme/theme'

// Adapted from the HariPrabodham Amrut Mahotsav privacy policy
// (https://yds-germany.de/privacy-policy/), with the newsletter section
// replaced by the sections that describe what THIS site actually does:
// event registration and the three processors it sends data to.
const CONTROLLER = {
  org: 'Yogi Divine Society e.V.',
  person: 'Manfred Gutheins',
  street: 'Im Tal 16',
  city: '14532 Kleinmachnow',
  email: 'info@yds-germany.de',
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

function Bullets({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ pl: 2.5, mt: 0.5, mb: 0.75 }}>
      {items.map((item) => (
        <Typography
          component="li"
          key={item}
          sx={{ fontSize: 15, lineHeight: 1.8, color: C.inkSoft, mb: 0.5 }}
        >
          {item}
        </Typography>
      ))}
    </Box>
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

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ color: C.mintDeep, '&:hover': { color: C.mintDeep }, transition: 'color .2s' }}
    >
      {children}
    </Box>
  )
}

export default function DataPrivacyPage() {
  usePageMeta(
    'Data Privacy',
    'Privacy policy for the HariPrabodham Annakut — how we collect, use and protect your data.',
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
            <Section title="Responsible Body">
              <Para>
                The responsible body within the meaning of data protection laws, in particular the
                EU General Data Protection Regulation (GDPR), is:
              </Para>
              <Para>{CONTROLLER.person}</Para>
              <Para>{`${CONTROLLER.street}, ${CONTROLLER.city}`}</Para>
              <Para>
                Email: <MailLink email={CONTROLLER.email} />
              </Para>
            </Section>

            <Section title="Event Registration">
              <Para>
                When you register for the Annakut, we collect your name, your email address, your
                phone number if you choose to give one, and the number of adults and children in
                your party. We use this information only to organise the event — to plan seating,
                prasad and capacity — and to send you a confirmation email. It is not shared with
                anyone outside the organising team and the service providers listed below, and it
                is never used for advertising.
              </Para>
              <Para>
                Legal basis: Art. 6 (1) (a) GDPR — your express consent, given by ticking the
                consent box on the registration form. You can revoke your consent at any time with
                future effect by contacting us at <MailLink email={CONTROLLER.email} />.
              </Para>
            </Section>

            <Section title="Service Providers">
              <Para>
                We use the following processors to run this website and store registrations. Each
                processes data on our instructions only:
              </Para>
              <Bullets
                items={[
                  'Supabase — database hosting for registration data.',
                  'Resend — sending your registration confirmation email.',
                  'Vercel — hosting this website and its server logs.',
                ]}
              />
              <Para>
                Resend and Vercel are based in the United States, so your data may be transferred
                there on the basis of the European Commission’s standard contractual clauses.
              </Para>
            </Section>

            <Section title="Your Data Subject Rights">
              <Para>
                You can exercise the following rights at any time using the contact details
                provided above:
              </Para>
              <Bullets
                items={[
                  'Information about your data stored by us and its processing (Art. 15 GDPR)',
                  'Correction of incorrect personal data (Art. 16 GDPR)',
                  'Deletion of your data stored by us (Art. 17 GDPR)',
                  'Restriction of data processing if we are not yet allowed to delete your data due to legal obligations (Art. 18 GDPR)',
                  'Objection to the processing of your data by us (Art. 21 GDPR)',
                  'Data portability, provided that you have consented to data processing or have concluded a contract with us (Art. 20 GDPR)',
                ]}
              />
              <Para>
                If you have given us your consent, you can revoke it at any time with effect for
                the future.
              </Para>
              <Para>
                You can lodge a complaint with a supervisory authority at any time, for example the
                competent supervisory authority in the federal state in which you reside or the
                authority responsible for us as the responsible body.
              </Para>
            </Section>

            <Section title="Collection of General Information When Visiting Our Website">
              <Para>
                When you access our website, general information is automatically collected (server
                log files). This includes the type of web browser, operating system, domain name of
                your internet service provider, your IP address, and similar information. This data
                does not allow any conclusions to be drawn about you personally.
              </Para>
              <Para>
                It is processed to ensure a smooth connection and use of the website, evaluate
                system security and stability, and for further administrative purposes.
              </Para>
              <Para>
                Legal basis: Art. 6 (1) (f) GDPR — our legitimate interest in improving the
                stability and functionality of our website.
              </Para>
              <Para>
                Storage period: The data will be deleted as soon as it is no longer required for
                the purpose for which it was collected.
              </Para>
            </Section>

            <Section title="Use of Script Libraries (Google Webfonts)">
              <Para>
                In order to display our content correctly across all browsers, we use “Google Web
                Fonts” from Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA) to
                display fonts on this website.
              </Para>
              <Para>
                Legal basis: Art. 6 (1) (f) GDPR — our legitimate interest in presenting our
                content consistently. Google may process your data in the USA. Further information
                can be found in{' '}
                <ExternalLink href="https://www.google.com/policies/privacy/">
                  Google’s privacy policy
                </ExternalLink>
                .
              </Para>
            </Section>

            <Section title="SSL Encryption">
              <Para>
                To protect the security of your data during transmission, we use state-of-the-art
                encryption methods (e.g. SSL) over HTTPS.
              </Para>
            </Section>

            <Section title="Changes to Our Privacy Policy">
              <Para>
                We reserve the right to amend this privacy policy to ensure it always complies with
                current legal requirements or to implement changes to our services. The new privacy
                policy will then apply to your next visit.
              </Para>
            </Section>

            <Section title="Questions for the Data Protection Officer">
              <Para>If you have any questions about data protection, please contact us:</Para>
              <Para>{CONTROLLER.org}</Para>
              <Para>{`${CONTROLLER.street}, ${CONTROLLER.city}`}</Para>
              <Para>
                Email: <MailLink email={CONTROLLER.email} />
              </Para>
            </Section>

            <Box sx={{ mt: 2, pt: 3, borderTop: `1px dashed ${C.gold}55` }}>
              <Typography sx={{ fontSize: 12, color: `${C.inkSoft}99`, letterSpacing: '0.02em' }}>
                Source:{' '}
                <ExternalLink href="https://yds-germany.de/privacy-policy/">
                  yds-germany.de/privacy-policy
                </ExternalLink>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </PageShell>
  )
}
