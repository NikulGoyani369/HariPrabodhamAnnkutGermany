-- The registration form no longer collects a darshan time slot or notes.
drop view public.rsvp_summary;

alter table public.rsvps
  drop column darshan_slot,
  drop column notes;

create view public.rsvp_summary
  with (security_invoker = on)
  as
  select created_at, full_name, email, phone, city,
         adults, children, (adults + children) as party_size
  from public.rsvps
  order by created_at desc;
