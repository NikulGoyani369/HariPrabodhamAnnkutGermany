import { supabase } from '../lib/supabase'

export interface RsvpInput {
  fullName: string
  email: string
  dialCode: string
  phone: string
  city: string
  adults: number
  children: number
  darshanSlot: string
  notes?: string
  consent: boolean
}

export async function submitRsvp(input: RsvpInput): Promise<{ id: string }> {
  const digits = input.phone.replace(/[^\d]/g, '')
  const dial = input.dialCode.replace(/^\+/, '')
  const notes = input.notes?.trim() ? input.notes.trim() : null

  const row = {
    full_name: input.fullName.trim(),
    email: input.email.trim(),
    phone: `${dial} ${digits}`,
    city: input.city.trim(),
    adults: input.adults,
    children: input.children,
    darshan_slot: input.darshanSlot,
    notes,
    consent: input.consent,
  }

  const { data, error } = await supabase.from('rsvps').insert(row).select('id').single()

  if (error) throw new Error(error.message)
  return { id: (data as { id: string }).id }
}
