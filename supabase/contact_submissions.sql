-- Contact form submissions from the Hirepulse website
-- Run in Supabase: SQL Editor -> New query -> paste -> Run

create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  -- Form fields (same limits as ContactForm.tsx and api/contact/route.ts)
  name        text not null check (char_length(name) between 1 and 120),
  phone       text check (phone is null or phone ~ '^[+()0-9 .-]{5,40}$'),
  subject     text not null check (char_length(subject) between 1 and 200),
  message     text not null check (char_length(message) between 2 and 4000),

  -- Extra info, filled in by the API route
  source_page text,                 -- e.g. '/', '/contact'
  ip_address  inet,
  user_agent  text,

  -- For your team to track follow-up
  status      text not null default 'new'
              check (status in ('new', 'contacted', 'closed', 'spam')),
  notes       text
);

-- Newest messages first in the dashboard
create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

create index if not exists contact_submissions_status_idx
  on public.contact_submissions (status);

-- Security: Row Level Security is on. The website (publishable key = "anon" role) may only
-- INSERT new messages. It cannot read, edit or delete any of them, so submissions stay private.
-- View them in the dashboard: Table Editor -> contact_submissions.
alter table public.contact_submissions enable row level security;

-- Remove every existing policy on this table (including any "allow all" policy added elsewhere),
-- so only the insert policy below remains.
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'contact_submissions'
  loop
    execute format('drop policy %I on public.contact_submissions', p.policyname);
  end loop;
end $$;

revoke all on public.contact_submissions from public, anon, authenticated;
grant insert on public.contact_submissions to anon;

create policy "Website can submit contact messages"
  on public.contact_submissions
  for insert
  to anon
  with check (status = 'new' and notes is null);

-- Check: this should list exactly one policy, for INSERT.
select policyname, cmd, roles from pg_policies
where schemaname = 'public' and tablename = 'contact_submissions';
