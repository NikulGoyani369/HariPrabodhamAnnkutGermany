import { Box, Container, Typography, Divider, Grid } from '@mui/material'
import { GLANCE } from '../../data/data'
import { C } from '../../theme/theme'
import SectionDivider from '../common/SectionDivider'

export default function GlanceSection() {
  return (
    <Box
      component="section"
      id="glance"
      sx={{
        borderTop: `1px solid ${C.shell}`,
        borderBottom: `1px solid ${C.shell}`,
        background: C.cream,
        py: { xs: 5, md: 5.5 },
      }}
    >
      <Container maxWidth="lg">
        {/* Section heading */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Typography
            variant="h2"
            sx={{
              mt: 0.75,
              fontFamily: '"Blue Mirage", serif',
              fontSize: { xs: '1.75rem', md: 'clamp(1.9rem, 3.4vw, 2.75rem)' },
              color: C.ink,
            }}
          >
            Annakut at a Glance
          </Typography>
          <SectionDivider sx={{ mt: 1.75 }} />
        </Box>

        {/* Desktop: one row with vertical dividers */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0 }}>
          {GLANCE.map((item, idx) => (
            <Box key={item.title} sx={{ display: 'flex', flex: 1, minWidth: 0 }}>
              {idx > 0 && (
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderColor: C.shell, mx: { md: 1.5, lg: 2.5 } }}
                />
              )}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.75,
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
                >
                  <Typography
                    component="span"
                    aria-hidden="true"
                    sx={{ fontSize: 22, lineHeight: 1 }}
                  >
                    {item.icon}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Blue Mirage", serif',
                      fontWeight: 700,
                      fontSize: { md: '0.68rem', lg: '0.78rem' },
                      letterSpacing: { md: '0.06em', lg: '0.1em' },
                      textTransform: 'uppercase',
                      color: C.ink,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>
                {item.lines.map((line, i) => (
                  <Typography
                    key={i}
                    sx={{
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      lineHeight: 1.65,
                    }}
                  >
                    {line}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Mobile: 2-column grid */}
        <Grid container spacing={3} sx={{ display: { xs: 'flex', md: 'none' } }}>
          {GLANCE.map((item, idx) => (
            <Grid
              key={item.title}
              size={{
                xs:
                  idx === GLANCE.length - 1 && GLANCE.length % 2 !== 0 ? 12 : 6,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    mb: 0.25,
                  }}
                >
                  <Typography
                    component="span"
                    aria-hidden="true"
                    sx={{ fontSize: 20, lineHeight: 1 }}
                  >
                    {item.icon}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Blue Mirage", serif',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: C.ink,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>
                {item.lines.map((line, i) => (
                  <Typography
                    key={i}
                    sx={{
                      fontSize: '0.82rem',
                      color: 'text.secondary',
                      lineHeight: 1.65,
                    }}
                  >
                    {line}
                  </Typography>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
