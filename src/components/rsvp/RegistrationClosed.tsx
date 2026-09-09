import { Box, Typography, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { C } from '../../theme/theme'
import { PEOPLE } from '../../data/data'

export default function RegistrationClosed() {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
      <Typography
        variant="h3"
        component="p"
        sx={{ fontFamily: '"Blue Mirage", serif', color: C.maroon800, mb: 1.5 }}
      >
        RSVP is now closed
      </Typography>
      <Typography sx={{ color: C.muted, fontSize: '0.95rem', mb: 2.5, maxWidth: 420, mx: 'auto' }}>
        Jai Swaminarayan. RSVP for the HariPrabodham Annakut has now closed. For any
        queries, please reach out through our{' '}
        <Link component={RouterLink} to="/contact" sx={{ fontWeight: 600 }}>
          Contact page
        </Link>
        .
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, maxWidth: 420, mx: 'auto' }}>
        {PEOPLE.map((p) => (
          <Box key={p.name} sx={{ border: `1px solid ${C.sand200}`, borderRadius: '14px', p: 2 }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: C.maroon800 }}>{p.name}</Typography>
            <Box component="a" href={p.phone} sx={{ display: 'block', mt: 0.5, fontSize: '0.9rem', color: C.muted, textDecoration: 'none' }}>
              {p.phone.replace('tel:', '')}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
