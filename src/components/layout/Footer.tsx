import { Box, Container, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { EVENT, FOOTER } from '../../data/data'
import { C } from '../../theme/theme'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(180deg, ${C.gold}, ${C.espresso})`,
        color: `${C.paper}E6`,
        pt: { xs: 5, md: 6 },
        pb: { xs: 3, md: 3.5 },
      }}
    >
      <Container maxWidth="lg">
        {/* Tagline */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Typography
            sx={{
              fontFamily: '"Blue Mirage", serif',
              fontSize: { xs: '1.25rem', md: 'clamp(1.25rem, 2.4vw, 1.75rem)' },
              color: C.paper,
              lineHeight: 1.4,
            }}
          >
            {EVENT.tagline}
          </Typography>
          <Typography
            sx={{
              display: 'block',
              mt: 1,
              fontFamily: '"Blue Mirage", serif',
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.paper,
              fontWeight: 600,
            }}
          >
            {FOOTER.closing}
          </Typography>
        </Box>

        {/* Bottom bar */}
        <Box
          sx={{
            mt: { xs: 4, md: 5 },
            pt: { xs: 2.5, md: 3 },
            borderTop: `1px solid ${C.paper}2E`,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2 },
            fontSize: 13,
            color: `${C.paper}99`,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography sx={{ fontSize: 'inherit', color: 'inherit' }}>
            {FOOTER.legal}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-end' },
            }}
          >
            <Box
              component="span"
              role="button"
              tabIndex={0}
              onClick={() => navigate('/impressum')}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') && navigate('/impressum')
              }
              sx={{
                color: `${C.paper}99`,
                cursor: 'pointer',
                fontSize: 13,
                '&:hover': { color: C.mint },
                transition: 'color .2s',
              }}
            >
              Impressum
            </Box>
            <Box
              component="span"
              role="button"
              tabIndex={0}
              onClick={() => navigate('/data-privacy')}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') &&
                navigate('/data-privacy')
              }
              sx={{
                color: `${C.paper}99`,
                cursor: 'pointer',
                fontSize: 13,
                '&:hover': { color: C.mint },
                transition: 'color .2s',
              }}
            >
              Data Privacy
            </Box>
            <Box
              component="a"
              href={`mailto:${FOOTER.email}`}
              sx={{
                color: `${C.paper}99`,
                '&:hover': { color: C.mint },
                transition: 'color .2s',
                fontSize: 13,
              }}
            >
              {FOOTER.email}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
