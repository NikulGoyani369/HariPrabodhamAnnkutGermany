import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAdminSession } from '../../hooks/useAdminSession'
import { C } from '../../theme/theme'

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const session = useAdminSession()
  const location = useLocation()

  if (session === undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={32} sx={{ color: C.saffron }} />
      </Box>
    )
  }

  if (session === null) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
