import type { ReactNode } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAdminSession } from '../../hooks/useAdminSession'
import { C } from '../../theme/theme'

// Deliberately separate from the public PageShell (Navbar/Footer/RsvpModal) —
// this is an internal tool, not part of the marketing site.
export default function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const session = useAdminSession()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <Box sx={{ minHeight: '100vh', background: C.ivory }}>
      <AppBar position="static" elevation={0} sx={{ background: C.ink }}>
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Typography sx={{ fontFamily: '"GC Commune", serif', fontSize: 18, color: C.ivory }}>
            HariPrabodham Annakut — Admin
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {session && (
              <Typography sx={{ fontSize: 13, color: `${C.ivory}B3` }}>
                {session.user.email}
              </Typography>
            )}
            <Button
              variant="outlined"
              size="small"
              onClick={handleSignOut}
              sx={{ color: C.ivory, borderColor: `${C.ivory}66`, '&:hover': { borderColor: C.ivory } }}
            >
              Sign out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {children}
      </Container>
    </Box>
  )
}
