import { useState } from 'react'
import { isRegistrationOpenNow } from '../utils/registrationGate'

// One-time-per-mount snapshot. Navbar and Hero have no "opening" event to
// re-check against, so mount-time is the right granularity here.
export function useRegistrationOpen(): boolean {
  return useState(() => isRegistrationOpenNow())[0]
}
