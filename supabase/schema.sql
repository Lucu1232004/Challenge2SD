-- Challenge 08: gestor de tareas con Supabase.
-- Ejecuta este archivo completo en el SQL Editor del proyecto.
-- Es idempotente: puedes correrlo más de una vez sin romper nada.

-- 1. Tabla de tareas -------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  description text not null default '',
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

drop policy if exists "ver mis tareas" on public.tasks;
create policy "ver mis tareas" on public.tasks
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "crear mis tareas" on public.tasks;
create policy "crear mis tareas" on public.tasks
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "editar mis tareas" on public.tasks;
create policy "editar mis tareas" on public.tasks
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "borrar mis tareas" on public.tasks;
create policy "borrar mis tareas" on public.tasks
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- 2. Perfiles --------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "ver mi perfil" on public.profiles;
create policy "ver mi perfil" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "crear mi perfil" on public.profiles;
create policy "crear mi perfil" on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "editar mi perfil" on public.profiles;
create policy "editar mi perfil" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Crea el perfil automáticamente cuando alguien se registra.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Realtime --------------------------------------------------------------
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'tasks'
  ) then
    alter publication supabase_realtime add table public.tasks;
  end if;
end $$;

-- 4. Bucket de avatares ----------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "subir mi avatar" on storage.objects;
create policy "subir mi avatar" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "reemplazar mi avatar" on storage.objects;
create policy "reemplazar mi avatar" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "borrar mi avatar" on storage.objects;
create policy "borrar mi avatar" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "ver avatares" on storage.objects;
create policy "ver avatares" on storage.objects
  for select to public
  using (bucket_id = 'avatars');
