import { supabase } from '../lib/supabase'

export interface RegistrationSummaryRow {
  id: string
  created_at: string
  name: string
  email: string
  phone: string | null
  adults: number
  children: number
  party_size: number
}

export async function fetchRegistrationSummary(): Promise<RegistrationSummaryRow[]> {
  const { data, error } = await supabase.from('registration_summary').select('*')
  if (error) throw new Error(error.message)
  return data ?? []
}
