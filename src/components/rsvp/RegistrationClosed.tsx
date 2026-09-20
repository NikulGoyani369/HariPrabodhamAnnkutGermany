import { Box, Typography, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { C } from '../../theme/theme'
import { PEOPLE } from '../../data/data'

interface Props {
  onClose: () => void
}

export default function RegistrationClosed({ onClose }: Props) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
      <Typography
        variant="h3"
        component="p"
        sx={{ fontFamily: '"GC Commune", serif', color: C.ink, mb: 1.5 }}
      >
        Registration is now closed
      </Typography>
      <Typography sx={{ color: C.inkSoft, fontSize: '0.95rem', mb: 2.5, maxWidth: 420, mx: 'auto' }}>
        Jai Swaminarayan. Registration for the HariPrabodham Annakut Utsav has now closed. For any
        queries, please reach out through our{' '}
        <Link
          component={RouterLink}
          to="/contact"
          onClick={onClose}
          sx={{ fontWeight: 600 }}
        >
          Contact page
        </Link>
        .
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, maxWidth: 420, mx: 'auto' }}>
        {PEOPLE.map((p) => (
          <Box key={p.name} sx={{ border: `1px solid ${C.shell}`, borderRadius: '14px', p: 2 }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: C.ink }}>{p.name}</Typography>
            <Box component="a" href={p.phone} sx={{ display: 'block', mt: 0.5, fontSize: '0.9rem', color: C.inkSoft, textDecoration: 'none' }}>
              {p.phone.replace('tel:', '')}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
