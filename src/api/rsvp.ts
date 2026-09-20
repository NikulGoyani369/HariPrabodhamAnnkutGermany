import { supabase } from '../lib/supabase'

export interface RsvpInput {
  fullName: string
  email: string
  dialCode: string
  /** Optional — a blank value is stored as null. */
  phone: string
  /** Additional adults beyond the registrant (0–3). */
  extraAdults: number
  /** Children in the party (0–4). */
  children: number
  consent: boolean
}

export async function submitRsvp(input: RsvpInput): Promise<{ id: string }> {
  const digits = input.phone.replace(/[^\d]/g, '')
  const dial = input.dialCode.replace(/^\+/, '')

  const row = {
    name: input.fullName.trim(),
    email: input.email.trim(),
    phone: digits ? `${dial} ${digits}` : null,
    extra_adults: input.extraAdults,
    children: input.children,
    consent: input.consent,
  }

  const id = crypto.randomUUID()
  const { error } = await supabase.from('registrations').insert({ id, ...row })

  if (error) throw new Error(error.message)
  return { id }
}
