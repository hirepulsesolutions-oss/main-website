# Supabase Setup — Contact Form Storage

This file explains how to save the website's contact form submissions in Supabase.

The form (`src/components/ContactForm.tsx`) sends **name, phone, subject and message** to
`/api/contact` (`src/app/api/contact/route.ts`). That route checks the input, filters spam, and
saves each message to the Supabase table `contact_submissions`.

**The code is already done.** To make it work you only need to create the table (step 1) and add
the environment variables in Vercel (step 2).

---

## 1. Create the table

In the Supabase dashboard, open **SQL Editor**, click **New query**, paste the contents of
`supabase/contact_submissions.sql` (shown below) and click **Run**. It's safe to run more than once.

```sql
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
```

The table will then appear under **Table Editor → contact_submissions**. That's where you read
the messages.

### Columns

| Column        | Type        | Filled by       | Notes                                          |
| ------------- | ----------- | --------------- | ---------------------------------------------- |
| `id`          | uuid        | Supabase        | Generated automatically                        |
| `created_at`  | timestamptz | Supabase        | When the message arrived                       |
| `name`        | text        | Form (required) | 1–120 characters                               |
| `phone`       | text        | Form (optional) | 5–40 characters: digits, spaces, `+ ( ) . -`   |
| `subject`     | text        | Form (required) | 1–200 characters                               |
| `message`     | text        | Form (required) | 2–4000 characters                              |
| `source_page` | text        | API route       | The page the form was sent from                |
| `ip_address`  | inet        | API route       | The visitor's IP address, for spotting spam    |
| `user_agent`  | text        | API route       | The visitor's browser                          |
| `status`      | text        | Your team       | `new` → `contacted` → `closed` (or `spam`)     |
| `notes`       | text        | Your team       | Internal follow-up notes                       |

### Security

The site uses Supabase's **publishable key**. That key is designed to be public, and what it can
do is limited by Row Level Security. The policy above lets it **add** new messages and nothing
else. Nobody can use it to read, change or delete submissions. Only people logged in to your
Supabase dashboard can see them.

---

## 2. Environment variables

These are already in `.env.local` (git-ignored) for local development:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yhoreledphnihmugwzeg.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

For the live site, add the same two variables in **Vercel → Project → Settings → Environment
Variables**, then redeploy. `.env.example` lists the names.

> ⚠️ Never put the **service_role / secret** key in a `NEXT_PUBLIC_` variable. That would give
> every visitor full access to the database. This setup doesn't need it.

---

## 3. What's in the code

- `src/lib/supabase.ts` creates the Supabase client from the two variables above.
- `src/app/api/contact/route.ts` validates the form, rate-limits it (5 messages per 10 minutes
  per IP address), and inserts the row. If Supabase returns an error, the visitor sees "Your
  message could not be sent" and the error is logged on the server.
- `src/components/ContactForm.tsx` shows "Thanks! Your message has been received." when the
  message is saved.

---

## 4. Test it

1. Run `npm run dev` and open http://localhost:3000.
2. Fill in the form. Wait a few seconds before you click **Send Message**: the spam filter quietly
   ignores anything sent within 2.5 seconds of the page loading.
3. In Supabase, open **Table Editor → contact_submissions**. The new row should be there.

If you see "could not be sent", check the terminal running `npm run dev` for the
`contact insert failed` error. Usually the table hasn't been created yet (step 1).

---

## Useful queries

```sql
-- New messages, newest first
select created_at, name, phone, subject, message
from public.contact_submissions
where status = 'new'
order by created_at desc;

-- Mark a message as contacted
update public.contact_submissions
set status = 'contacted', notes = 'Called on 14 Oct'
where id = 'PASTE-ID-HERE';

-- Messages per day for the last 30 days
select date_trunc('day', created_at) as day, count(*)
from public.contact_submissions
where created_at > now() - interval '30 days'
group by 1
order by 1 desc;
```
