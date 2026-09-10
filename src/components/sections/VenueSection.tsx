import { Box, Container, Typography, Button } from '@mui/material'
import { C } from '../../theme/theme'
import { EVENT, VENUE, DARSHAN_SLOTS } from '../../data/data'

function Ornament() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.25,
        mt: 1.75,
        color: C.gold500,
        fontSize: 14,
      }}
    >
      <Box
        sx={{
          height: '1px',
          width: 40,
          background: `linear-gradient(to right, transparent, ${C.gold500}, transparent)`,
        }}
      />
      ✦
      <Box
        sx={{
          height: '1px',
          width: 40,
          background: `linear-gradient(to left, transparent, ${C.gold500}, transparent)`,
        }}
      />
    </Box>
  )
}

const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  VENUE.addressLines.join(', '),
)}`

export default function VenueSection() {
  return (
    <Box
      component="section"
      id="venue"
      sx={{
        background: `linear-gradient(180deg, ${C.cream} 0%, ${C.cream2} 100%)`,
        py: { xs: 10, md: 13 },
      }}
    >
      <Container maxWidth="lg">
        {/* ── Section header ── */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
          <Typography
            component="span"
            sx={{
              fontFamily: '"Blue Mirage", serif',
              fontSize: '1rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.maroon700,
              fontWeight: 600,
            }}
          >
            Where it happens
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{ mt: 1, color: C.maroon800, fontFamily: '"Blue Mirage", serif' }}
          >
            The Venue
          </Typography>
          <Ornament />
        </Box>

        {/* ── Venue card ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
            background: C.cream,
            border: `1px solid ${C.sand200}B3`,
            borderRadius: '22px',
            overflow: 'hidden',
            boxShadow:
              '0 4px 14px rgba(92,20,32,0.08), 0 12px 40px rgba(92,20,32,0.06)',
            mb: { xs: 6, md: 8 },
          }}
        >
          {/* Info side */}
          <Box sx={{ p: { xs: 3.5, md: 6 } }}>
            <Typography
              variant="h2"
              component="h3"
              sx={{
                fontFamily: '"Blue Mirage", serif',
                fontSize: { xs: '1.75rem', md: 'clamp(1.9rem, 3.4vw, 2.75rem)' },
                color: C.maroon800,
              }}
            >
              {EVENT.venueName}
            </Typography>

            <Box component="dl" sx={{ mt: 3, display: 'grid', gap: 1 }}>
              {VENUE.addressLines.map((line) => (
                <Typography
                  key={line}
                  component="dd"
                  sx={{
                    m: 0,
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                    fontStyle: 'italic',
                    color: C.maroon800,
                    lineHeight: 1.6,
                  }}
                >
                  {line}
                </Typography>
              ))}
            </Box>

            <Box sx={{ mt: 3.5 }}>
              <Button
                variant="contained"
                component="a"
                href={directionsUrl}
                target="_blank"
                rel="noopener"
              >
                Get Directions
              </Button>
            </Box>
          </Box>

          {/* Map side */}
          <Box
            sx={{
              background: C.cream2,
              minHeight: { xs: 260, md: 360 },
              position: 'relative',
              order: { xs: -1, md: 0 },
            }}
          >
            <Box
              component="iframe"
              title="Venue location"
              src={VENUE.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              sx={{
                border: 0,
                width: '100%',
                height: '100%',
                display: 'block',
                minHeight: { xs: 260, md: 360 },
              }}
            />
          </Box>
        </Box>

        {/* ── Getting here ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 4, md: 6 },
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Blue Mirage", serif',
                color: C.maroon800,
                fontSize: { xs: '1.375rem', md: '1.6rem' },
              }}
            >
              Getting here
            </Typography>
            <Box
              component="ul"
              sx={{
                mt: 1.5,
                pl: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.1,
              }}
            >
              {VENUE.directions.map((step) => (
                <Box
                  component="li"
                  key={step}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'baseline',
                    fontSize: { xs: 14, md: 14.5 },
                    lineHeight: 1.6,
                    color: C.ink,
                  }}
                >
                  <Box component="span" sx={{ color: C.gold500 }}>
                    •
                  </Box>
                  <span>{step}</span>
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Blue Mirage", serif',
                color: C.maroon800,
                fontSize: { xs: '1.375rem', md: '1.6rem' },
              }}
            >
              Darshan timings
            </Typography>
            <Box
              component="ul"
              sx={{
                mt: 1.5,
                pl: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.1,
              }}
            >
              {DARSHAN_SLOTS.map((slot) => (
                <Box
                  component="li"
                  key={slot}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'baseline',
                    fontSize: { xs: 14, md: 14.5 },
                    lineHeight: 1.6,
                    color: C.ink,
                  }}
                >
                  <Box component="span" sx={{ color: C.gold500 }}>
                    •
                  </Box>
                  <span>{slot}</span>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
