-- Run this in Supabase Dashboard > SQL Editor.
-- This creates one shared JSON content table for the website editors.
--
-- The website stores each editable area as a JSON row:
-- - madison88-home-hero-content: home hero text/media
-- - madison88-program-content: program cards and program detail content
-- - madison88-featured-programs: selected home featured program slugs
-- - madison88-featured-courses-content: featured course cards, links, images, and text
-- - madison88-about-page-content: about page text, images, extra sections, hidden section flags
-- - madison88-team-content: L&D specialist, HR members, contributors, images, and profile text
--
-- Add/delete/edit actions in the admin UI update these JSON rows with upsert.

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

-- Starter rows keep each editor key present with the correct JSON type.
-- Existing saved content is preserved.
insert into public.site_content (key, content)
values
  ('madison88-home-hero-content', '{}'::jsonb),
  ('madison88-program-content', '[]'::jsonb),
  ('madison88-featured-programs', '[]'::jsonb),
  ('madison88-featured-courses-content', '{}'::jsonb),
  (
    'madison88-about-page-content',
    '{"isAboutHidden": false, "isExcellenceHidden": false, "sections": []}'::jsonb
  ),
  ('madison88-team-content', '{}'::jsonb)
on conflict (key) do nothing;

-- Ask Supabase/PostgREST to refresh its schema cache after creating the table.
notify pgrst, 'reload schema';

-- Public image bucket used by the website editors.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can read site editor images" on storage.objects;
create policy "Anyone can read site editor images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-images');

drop policy if exists "Website editors can upload site images" on storage.objects;
create policy "Website editors can upload site images"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'site-images');

drop policy if exists "Website editors can see site images" on storage.objects;
create policy "Website editors can see site images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-images');

drop policy if exists "Website editors can update site images" on storage.objects;
create policy "Website editors can update site images"
on storage.objects
for update
to anon, authenticated
using (bucket_id = 'site-images')
with check (bucket_id = 'site-images');
