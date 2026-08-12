-- Relationship Reality Check ka poora Supabase schema.
--
-- Ye file dobara dobara chalayi ja sakti hai, kuch tootega nahi. Table pehle
-- se ho toh chhod deti hai, na ho toh bana deti hai.
--
-- Chalane ka tareeka: Supabase dashboard -> SQL Editor -> ye poora paste
-- karke Run. Bas.

create table if not exists public.reality_check_responses (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  submitted_at   timestamptz,
  submission_id  text,
  respondent     text not null default 'nainu',
  answers        jsonb not null,
  responses      jsonb,
  export_text    text,
  answered_count integer,
  total_count    integer
);

-- Purani table me ye column na ho toh add kar do.
alter table public.reality_check_responses
  add column if not exists submission_id text;

comment on table public.reality_check_responses is
  'Relationship Reality Check ke submit kiye hue jawab. Insert-only.';
comment on column public.reality_check_responses.submission_id is
  'Har submit ka apna id. Google Sheet ki lines se milane ke liye.';

-- ── Suraksha ───────────────────────────────────────────────────────────────
-- Website anon key se aati hai. Usse sirf naya jawab daalna aana chahiye.
-- Padhna, badalna, mitana, teenon band. Jawab dekhne ke liye dashboard hai,
-- jo service role se chalta hai aur RLS se bahar rehta hai.

alter table public.reality_check_responses enable row level security;

revoke all on table public.reality_check_responses from anon, authenticated;

-- Table-level grant, column-level nahi. Isse aage koi naya column add karo
-- toh wo apne aap cover ho jaata hai aur insert chalta rehta hai.
grant insert on table public.reality_check_responses to anon;

drop policy if exists "anon insert only" on public.reality_check_responses;
create policy "anon insert only"
  on public.reality_check_responses
  for insert
  to anon
  with check (true);

-- ── Check kar lo ki sach me set hua ────────────────────────────────────────
-- Ye chalao. Pehla result me sirf INSERT dikhna chahiye, aur privilege_type
-- ke saath column_name khaali (matlab table-level grant hai).

-- select grantee, privilege_type
--   from information_schema.table_privileges
--  where table_name = 'reality_check_responses' and grantee = 'anon';

-- select column_name from information_schema.column_privileges
--  where table_name = 'reality_check_responses' and grantee = 'anon';
