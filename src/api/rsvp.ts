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

/**
 * Tidies a typed name: collapses runs of whitespace and capitalises words
 * that were entered in all lowercase, including after hyphens and
 * apostrophes ("anna-maria" -> "Anna-Maria", "d'souza" -> "D'Souza").
 *
 * A word that already contains a capital is left alone, so "McDonald" and
 * "van der Berg" survive intact rather than being mangled by naive
 * title-casing.
 */
export function normaliseName(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) =>
      /\p{Lu}/u.test(word)
        ? word
        : word.replace(/(^|[-'\u2019])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase()),
    )
    .join(" ");
}

export async function submitRsvp(input: RsvpInput): Promise<{ id: string }> {
  const digits = input.phone.replace(/[^\d]/g, '')
  const dial = input.dialCode.replace(/^\+/, '')

  const row = {
    name: normaliseName(input.fullName),
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
