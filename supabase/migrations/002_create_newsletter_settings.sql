create table if not exists public.newsletter_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists newsletter_settings_user_id_idx
  on public.newsletter_settings (user_id);

drop trigger if exists newsletter_settings_set_updated_at
  on public.newsletter_settings;

create trigger newsletter_settings_set_updated_at
before update on public.newsletter_settings
for each row
execute function public.set_updated_at();

alter table public.newsletter_settings enable row level security;

drop policy if exists "Public can read newsletter settings"
  on public.newsletter_settings;
drop policy if exists "Users can insert their own newsletter settings"
  on public.newsletter_settings;
drop policy if exists "Users can update their own newsletter settings"
  on public.newsletter_settings;
drop policy if exists "Users can delete their own newsletter settings"
  on public.newsletter_settings;

create policy "Public can read newsletter settings"
on public.newsletter_settings
for select
to anon, authenticated
using (true);

create policy "Users can insert their own newsletter settings"
on public.newsletter_settings
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update their own newsletter settings"
on public.newsletter_settings
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their own newsletter settings"
on public.newsletter_settings
for delete
to authenticated
using (user_id = auth.uid());
