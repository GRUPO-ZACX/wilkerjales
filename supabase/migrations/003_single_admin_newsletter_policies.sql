drop policy if exists "Users can select their own newsletters"
  on public.newsletters;
drop policy if exists "Users can insert their own newsletters"
  on public.newsletters;
drop policy if exists "Users can update their own newsletters"
  on public.newsletters;
drop policy if exists "Users can delete their own newsletters"
  on public.newsletters;
drop policy if exists "Authenticated can select newsletters"
  on public.newsletters;
drop policy if exists "Authenticated can insert newsletters"
  on public.newsletters;
drop policy if exists "Authenticated can update newsletters"
  on public.newsletters;
drop policy if exists "Authenticated can delete newsletters"
  on public.newsletters;
drop policy if exists "Public can read published newsletters"
  on public.newsletters;

create policy "Authenticated can select newsletters"
on public.newsletters
for select
to authenticated
using (true);

create policy "Authenticated can insert newsletters"
on public.newsletters
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Authenticated can update newsletters"
on public.newsletters
for update
to authenticated
using (true)
with check (user_id = auth.uid());

create policy "Authenticated can delete newsletters"
on public.newsletters
for delete
to authenticated
using (true);

create policy "Public can read published newsletters"
on public.newsletters
for select
to anon
using (status = 'published');
