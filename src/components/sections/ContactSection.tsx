import { Box, Container, Typography } from '@mui/material'
import { C } from '../../theme/theme'
import { FOOTER, PEOPLE } from '../../data/data'

const cardSx = {
  background: C.ivory,
  border: `1px solid ${C.shell}B3`,
  borderRadius: '18px',
  p: { xs: 3.5, md: 4 },
  textAlign: 'center',
  transition: 'transform .25s ease, border-color .25s ease, box-shadow .25s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    borderColor: `${C.saffron}80`,
    boxShadow: '0 1px 2px rgba(74,55,40,0.06), 0 4px 14px rgba(74,55,40,0.06)',
  },
}

const iconCircleSx = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: C.cream,
  border: `1px solid ${C.gold}88`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: C.gold,
  mb: 1.75,
}

export default function ContactSection() {
  return (
    <Box
      component="section"
      id="contact"
      sx={{ background: C.ivory, py: { xs: 10, md: 13 } }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
          <Typography
            component="span"
            sx={{
              fontFamily: '"Blue Mirage", serif',
              fontSize: '1rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.gold,
              fontWeight: 600,
            }}
          >
            Reach Out
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{ mt: 1, color: C.ink, fontFamily: '"Blue Mirage", serif' }}
          >
            Contact
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.25,
              mt: 1.75,
              color: C.goldLight,
              fontSize: 14,
            }}
          >
            <Box
              sx={{
                height: '1px',
                width: 40,
                background: `linear-gradient(to right, transparent, ${C.goldLight}, transparent)`,
              }}
            />
            ✦
            <Box
              sx={{
                height: '1px',
                width: 40,
                background: `linear-gradient(to left, transparent, ${C.goldLight}, transparent)`,
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: { xs: 2.5, md: 2.75 },
          }}
        >
          {/* Email card */}
          <Box sx={cardSx}>
            <Box sx={iconCircleSx}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16v12H4z" />
                <path d="M4 6l8 7 8-7" />
              </svg>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: '1.375rem',
                fontStyle: 'italic',
                fontFamily: '"Blue Mirage", serif',
                color: C.gold,
              }}
            >
              Email
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                mt: 0.75,
                fontFamily: '"Blue Mirage", serif',
                color: C.gold,
              }}
            >
              For general queries
            </Typography>
            <Box
              component="a"
              href={`mailto:${FOOTER.email}`}
              sx={{
                display: 'block',
                mt: 1.5,
                color: C.inkSoft,
                fontSize: '1.05rem',
                lineHeight: 1.75,
                textDecoration: 'none',
                '&:hover': { color: C.ink },
                transition: 'color .2s',
              }}
            >
              {FOOTER.email}
            </Box>
          </Box>

          {/* Contact card */}
          <Box sx={cardSx}>
            <Box sx={iconCircleSx}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: '1.375rem',
                fontStyle: 'italic',
                fontFamily: '"Blue Mirage", serif',
                color: C.gold,
              }}
            >
              Phone / WhatsApp
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                mt: 0.75,
                fontFamily: '"Blue Mirage", serif',
                color: C.gold,
              }}
            >
              Get in touch
            </Typography>

            <Box
              sx={{
                mt: 1.75,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              {PEOPLE.map((person) => (
                <Box key={person.name}>
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: C.ink,
                    }}
                  >
                    {person.name}
                  </Typography>
                  <Box
                    component="a"
                    href={person.phone}
                    sx={{
                      display: 'block',
                      mt: 0.25,
                      fontSize: '1.05rem',
                      color: C.inkSoft,
                      textDecoration: 'none',
                      lineHeight: 1.75,
                      overflowWrap: 'break-word',
                      '&:hover': { color: C.ink },
                      transition: 'color .2s',
                    }}
                  >
                    {person.phone.replace('tel:', '')}
                  </Box>
                  <Box
                    component="a"
                    href={person.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'inline-block',
                      mt: 0.5,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: C.mintDeep,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    WhatsApp
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
