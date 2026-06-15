-- Run this in Supabase Dashboard > SQL Editor.
-- This creates one shared JSON content table for the website editors.

create table if not exists public.site_content (
  key text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

grant select, insert, update on public.site_content to anon;
grant select, insert, update on public.site_content to authenticated;

drop policy if exists "Anyone can read site content" on public.site_content;
create policy "Anyone can read site content"
on public.site_content
for select
to anon, authenticated
using (true);

-- Temporary policy for the current frontend-only admin screen.
-- This lets the existing Save Changes buttons write through the publishable key.
-- For stronger security, replace this with Supabase Auth and restrict writes to admin users.
drop policy if exists "Website editors can insert site content" on public.site_content;
create policy "Website editors can insert site content"
on public.site_content
for insert
to anon, authenticated
with check (true);

drop policy if exists "Website editors can update site content" on public.site_content;
create policy "Website editors can update site content"
on public.site_content
for update
to anon, authenticated
using (true)
with check (true);
