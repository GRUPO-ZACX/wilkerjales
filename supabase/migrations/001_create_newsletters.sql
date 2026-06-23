create extension if not exists pgcrypto;

create table if not exists public.newsletters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  content jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists newsletters_user_id_updated_at_idx
  on public.newsletters (user_id, updated_at desc);

create index if not exists newsletters_status_slug_idx
  on public.newsletters (status, slug);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists newsletters_set_updated_at on public.newsletters;

create trigger newsletters_set_updated_at
before update on public.newsletters
for each row
execute function public.set_updated_at();

alter table public.newsletters enable row level security;

drop policy if exists "Users can select their own newsletters"
  on public.newsletters;
drop policy if exists "Users can insert their own newsletters"
  on public.newsletters;
drop policy if exists "Users can update their own newsletters"
  on public.newsletters;
drop policy if exists "Users can delete their own newsletters"
  on public.newsletters;
drop policy if exists "Public can read published newsletters"
  on public.newsletters;

create policy "Users can select their own newsletters"
on public.newsletters
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert their own newsletters"
on public.newsletters
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update their own newsletters"
on public.newsletters
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their own newsletters"
on public.newsletters
for delete
to authenticated
using (user_id = auth.uid());

create policy "Public can read published newsletters"
on public.newsletters
for select
to anon, authenticated
using (status = 'published');
