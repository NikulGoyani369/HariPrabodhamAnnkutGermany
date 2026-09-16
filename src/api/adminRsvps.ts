import { supabase } from '../lib/supabase'

export interface RsvpSummaryRow {
  created_at: string
  full_name: string
  email: string
  phone: string
  city: string
  adults: number
  children: number
  party_size: number
}

export async function fetchRsvpSummary(): Promise<RsvpSummaryRow[]> {
  const { data, error } = await supabase.from('rsvp_summary').select('*')
  if (error) throw new Error(error.message)
  return data ?? []
}
