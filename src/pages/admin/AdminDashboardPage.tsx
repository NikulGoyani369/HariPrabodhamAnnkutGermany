import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import { fetchRegistrationSummary, type RegistrationSummaryRow } from '../../api/adminRsvps'
import { usePageMeta } from '../../hooks/usePageMeta'
import { C } from '../../theme/theme'

type Status = 'loading' | 'error' | 'ready'

export default function AdminDashboardPage() {
  usePageMeta('Admin Dashboard')
  const [rows, setRows] = useState<RegistrationSummaryRow[]>([])
  const [status, setStatus] = useState<Status>('loading')

  // Initial state is already 'loading', so the mount fetch below never needs
  // to set it synchronously — only its async .then/.catch update state.
  const runFetch = () => {
    fetchRegistrationSummary()
      .then((data) => {
        setRows(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(() => {
    runFetch()
  }, [])

  const retry = () => {
    setStatus('loading')
    runFetch()
  }

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} sx={{ color: C.saffron }} />
      </Box>
    )
  }

  if (status === 'error') {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Alert severity="error" sx={{ display: 'inline-flex', mb: 2 }}>
          Couldn't load registrations.
        </Alert>
        <Box>
          <Button variant="outlined" onClick={retry}>
            Retry
          </Button>
        </Box>
      </Box>
    )
  }

  const totalAttendees = rows.reduce((sum, r) => sum + r.party_size, 0)

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: C.ink }}>
        Registrations
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Paper sx={{ p: 2, minWidth: 160 }}>
          <Typography sx={{ fontSize: 13, color: C.inkSoft }}>Total Registrations</Typography>
          <Typography variant="h4" sx={{ color: C.ink }}>{rows.length}</Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 160 }}>
          <Typography sx={{ fontSize: 13, color: C.inkSoft }}>Total Attendees</Typography>
          <Typography variant="h4" sx={{ color: C.ink }}>{totalAttendees}</Typography>
        </Paper>
      </Box>

      {rows.length === 0 ? (
        <Typography sx={{ color: C.inkSoft }}>No registrations yet.</Typography>
      ) : (
        <Box sx={{ overflowX: 'auto', border: `1px solid ${C.shell}`, borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Submitted</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="right">Adults</TableCell>
                <TableCell align="right">Children</TableCell>
                <TableCell align="right">Party</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{r.phone ?? '—'}</TableCell>
                  <TableCell align="right">{r.adults}</TableCell>
                  <TableCell align="right">{r.children}</TableCell>
                  <TableCell align="right">{r.party_size}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  )
}
