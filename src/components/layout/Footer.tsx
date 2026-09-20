import { Box, Container, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { EVENT, FOOTER } from '../../data/data'
import { C } from '../../theme/theme'
import SectionDivider from '../common/SectionDivider'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(180deg, color-mix(in srgb, ${C.lilacDeep} 55%, ${C.ink}), ${C.ink})`,
        color: `${C.ivory}E6`,
        pt: { xs: 2, md: 2 },
        pb: { xs: 1.5, md: 1.5 },
      }}
    >
      <Container maxWidth="lg">
        {/* Tagline */}
        <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 1 } }}>
          <Box
            component="img"
            src="/images/lotus-mark.png"
            alt=""
            aria-hidden="true"
            sx={{ width: 22, height: 'auto', mx: 'auto', mb: 0.5, display: 'block' }}
          />
          <Typography
            sx={{
              fontFamily: '"GC Commune", serif',
              fontSize: { xs: '1.05rem', md: '1.25rem' },
              color: C.ivory,
              lineHeight: 1.3,
            }}
          >
            {EVENT.tagline}
          </Typography>
          <Typography
            sx={{
              display: 'block',
              mt: 0.25,
              fontFamily: '"GC Commune", serif',
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.ivory,
              fontWeight: 600,
            }}
          >
            {FOOTER.closing}
          </Typography>
        </Box>

        <SectionDivider sx={{ mt: { xs: 1, md: 1 }, opacity: 0.9 }} />

        {/* Bottom bar */}
        <Box
          sx={{
            pt: { xs: 1, md: 1 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: 'center',
            gap: { xs: 0.5, sm: 2 },
            fontSize: 13,
            color: `${C.ivory}99`,
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
                color: `${C.ivory}99`,
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
                color: `${C.ivory}99`,
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
                color: `${C.ivory}99`,
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
