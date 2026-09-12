import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ABOUT_ANNAKUT, FAQS } from '../../data/data'
import { C } from '../../theme/theme'

export default function AboutAnnakutSection() {
  return (
    <Box
      component="section"
      id="about"
      sx={{ background: C.ivory, py: { xs: 6, md: 8 } }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography
          variant="h2"
          sx={{ fontFamily: '"Blue Mirage", serif', color: C.ink }}
        >
          {ABOUT_ANNAKUT.heading}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.25,
            mt: 1.75,
            mb: 4,
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

        {ABOUT_ANNAKUT.paragraphs.map((p, i) => (
          <Typography
            key={i}
            sx={{
              color: 'text.secondary',
              lineHeight: 1.8,
              fontSize: '1rem',
              mb: 2,
              maxWidth: 680,
              mx: 'auto',
            }}
          >
            {p}
          </Typography>
        ))}

        <Box sx={{ mt: 5, textAlign: 'left' }}>
          {FAQS.map((faq) => (
            <Accordion
              key={faq.q}
              disableGutters
              elevation={0}
              sx={{
                background: 'transparent',
                border: `1px solid ${C.shell}`,
                borderRadius: 2,
                mb: 1.5,
                '&::before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: C.gold }} />}
              >
                <Typography sx={{ fontWeight: 600, color: C.ink }}>
                  {faq.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
