import { supabase } from '../lib/supabase'

export interface RsvpInput {
  fullName: string
  email: string
  dialCode: string
  phone: string
  city: string
  adults: number
  children: number
  consent: boolean
}

export async function submitRsvp(input: RsvpInput): Promise<{ id: string }> {
  const digits = input.phone.replace(/[^\d]/g, '')
  const dial = input.dialCode.replace(/^\+/, '')

  const row = {
    full_name: input.fullName.trim(),
    email: input.email.trim(),
    phone: `${dial} ${digits}`,
    city: input.city.trim(),
    adults: input.adults,
    children: input.children,
    consent: input.consent,
  }

  const id = crypto.randomUUID()
  const { error } = await supabase.from('rsvps').insert({ id, ...row })

  if (error) throw new Error(error.message)
  return { id }
}
