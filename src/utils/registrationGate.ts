// Single source of truth for whether the RSVP form is open.
// Bounds come from two env vars; either may be blank (unbounded on that side).

function parse(value: string | undefined): number | null {
  if (!value || !value.trim()) return null
  const t = new Date(value).getTime()
  return Number.isNaN(t) ? null : t
}

export function isRegistrationOpenNow(): boolean {
  const openAt  = parse(import.meta.env.VITE_RSVP_OPEN_AT as string | undefined)
  const closeAt = parse(import.meta.env.VITE_RSVP_CLOSE_AT as string | undefined)
  const now = Date.now()

  if (openAt !== null && now < openAt) return false
  if (closeAt !== null && now >= closeAt) return false
  return true
}
