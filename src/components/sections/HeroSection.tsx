import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { Box, Container, Typography, Button, Stack, Link } from '@mui/material'
import { EVENT } from '../../data/data'
import { useRsvpStore } from '../../store/rsvpStore'
import { useRegistrationOpen } from '../../hooks/useRegistrationOpen'
import { useCountdown } from '../../hooks/useCountdown'
import { C } from '../../theme/theme'
import { heroStyles as s } from './HeroSection.styles'

export default function HeroSection() {
  const navigate = useNavigate()
  const openModal = useRsvpStore((st) => st.openModal)
  const registrationOpen = useRegistrationOpen()
  const { d, h, m, s: sec } = useCountdown(EVENT.dateISO)

  const cells = [
    { num: String(d).padStart(3, '0'), label: 'Days' },
    { num: String(h).padStart(2, '0'), label: 'Hours' },
    { num: String(m).padStart(2, '0'), label: 'Mins' },
    { num: String(sec).padStart(2, '0'), label: 'Secs' },
  ]

  return (
    <Box component="section" id="hero" sx={s.outerBox}>
      <Box aria-hidden="true" sx={s.emberGlow} />

      <Container
        maxWidth="md"
        sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
      >
        <Typography component="p" sx={{ ...s.overline }}>
          {EVENT.presents}
        </Typography>
        <Typography sx={s.kicker}>{EVENT.kicker}</Typography>
        <Typography component="h1" sx={s.title}>
          {EVENT.title}
        </Typography>
        <Typography variant="h3" sx={{ mt: 1, color: C.maroon700 }}>
          {EVENT.tagline}
        </Typography>

        <Box sx={s.metaRow}>
          {EVENT.dateLabel}&nbsp;·&nbsp;{EVENT.venueName}&nbsp;·&nbsp;{EVENT.city}
        </Box>

        {registrationOpen ? (
          <Stack
            direction="row"
            spacing={1.5}
            sx={s.ctaRow}
            justifyContent="center"
          >
            <Button variant="contained" size="large" onClick={openModal}>
              Register Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/venue')}
            >
              Learn More
            </Button>
          </Stack>
        ) : (
          <Typography sx={{ mt: 3, color: C.maroon700 }}>
            RSVP is not open at the moment.{' '}
            <Link component={RouterLink} to="/venue" sx={{ fontWeight: 600 }}>
              Learn more
            </Link>
            .
          </Typography>
        )}

        <Box sx={s.countdown}>
          {cells.map(({ num, label }) => (
            <Box key={label} sx={s.cdCell}>
              <Typography sx={s.cdNum}>{num}</Typography>
              <Typography sx={s.cdLabel}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      <Box
        component="svg"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        aria-hidden="true"
        sx={{
          ...s.waveBottom,
          width: '100%',
          height: { xs: 50, md: 110 },
          display: 'block',
        }}
      >
        <path
          d="M0,80 C360,20 720,130 1080,60 C1260,25 1380,90 1440,60 L1440,160 L0,160 Z"
          fill={C.saffron300}
          fillOpacity="0.35"
        />
        <path
          d="M0,110 C240,60 480,140 720,100 C960,55 1200,130 1440,90 L1440,160 L0,160 Z"
          fill={C.gold300}
          fillOpacity="0.3"
        />
      </Box>
    </Box>
  )
}
