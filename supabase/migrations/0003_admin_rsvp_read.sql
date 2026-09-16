-- Admin dashboard: invited (authenticated) organiser accounts may read all
-- registrations. rsvp_summary (security_invoker = on) inherits this
-- automatically — no change needed to the view itself.
create policy "authenticated can read rsvps"
  on public.rsvps for select to authenticated
  using (true);
