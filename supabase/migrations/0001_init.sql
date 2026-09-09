-- rsvps ---------------------------------------------------------------
create table public.rsvps (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  full_name    text not null,
  email        text not null,
  phone        text not null,
  city         text not null,
  adults       int  not null check (adults  >= 1  and adults  <= 10),
  children     int  not null default 0 check (children >= 0 and children <= 10),
  darshan_slot text not null,
  notes        text,
  consent      boolean not null
);

alter table public.rsvps enable row level security;

-- anon may INSERT only, and only with consent = true
create policy "public can insert rsvp"
  on public.rsvps for insert to anon
  with check (consent = true);
-- (no select / update / delete policy for anon → denied by default)

create view public.rsvp_summary as
  select created_at, full_name, email, phone, city,
         adults, children, (adults + children) as party_size,
         darshan_slot, notes
  from public.rsvps
  order by created_at desc;

-- keepalive ----------------------------------------------------------
create table public.keepalive (
  id         bigint generated always as identity primary key,
  note       text,
  created_at timestamptz not null default now()
);
alter table public.keepalive enable row level security;
-- written only by the edge function using the service-role key,
-- which bypasses RLS; no anon policy.
