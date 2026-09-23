-- CODE +IA — esquema de Supabase (Auth real + progreso + proyectos)
-- Ejecutar completo en: Supabase → SQL Editor → New query → Run

-- ---------------------------------------------------------------
-- 1) Tabla de perfiles (uno por usuario de Supabase Auth)
-- ---------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique not null,
  name text not null,
  role text not null default 'student' check (role in ('student','admin')),
  progress boolean[] not null default array_fill(false, array[12]),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Cualquier usuario logueado puede leer todos los perfiles
-- (nicknames y progreso no son datos sensibles acá; el admin
-- necesita ver la lista completa para el panel de seguimiento).
create policy "profiles_select_authenticated"
  on profiles for select
  to authenticated
  using (true);

-- Solo un admin puede actualizar perfiles (tildar progreso de otros).
create policy "profiles_update_admin_only"
  on profiles for update
  to authenticated
  using (exists (select 1 from profiles me where me.id = auth.uid() and me.role = 'admin'))
  with check (exists (select 1 from profiles me where me.id = auth.uid() and me.role = 'admin'));

-- No hay policy de INSERT para authenticated/anon a propósito:
-- las cuentas se crean únicamente desde /api/create-student, que usa
-- la service role key (server-side) y por lo tanto se salta RLS.

-- ---------------------------------------------------------------
-- 2) Storage: bucket público "projects" para los proyectos HTML/CSS/JS
-- ---------------------------------------------------------------
-- Creá el bucket desde el dashboard (Storage → New bucket → "projects" → Public)
-- o corré esto:
insert into storage.buckets (id, name, public)
values ('projects', 'projects', true)
on conflict (id) do nothing;

-- Cada estudiante solo puede subir/editar/borrar dentro de su propia
-- carpeta, nombrada con su auth.uid(). La lectura es pública (bucket
-- público) para que los links "ver proyecto" funcionen sin login.
create policy "projects_insert_own_folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'projects'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "projects_update_own_folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'projects'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "projects_delete_own_folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'projects'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------
-- 3) Primeros dos admins (Mauri y Siro) — paso manual, una sola vez
-- ---------------------------------------------------------------
-- Supabase Auth no permite crear usuarios por SQL plano de forma segura,
-- así que el primer alta de un admin se hace a mano:
--
-- 1. Supabase Dashboard → Authentication → Users → Add user
--    - email: mauri@codeia.local   password: la que quieras
--    - email: siro@codeia.local    password: la que quieras
--    (el "email" es interno, nadie lo usa: el login real es por nickname)
--
-- 2. Copiá el UUID que les asignó Supabase a cada uno y corré:
--
-- insert into profiles (id, nickname, name, role) values
--   ('PEGAR-UUID-DE-MAURI', 'mauri', 'Mauri', 'admin'),
--   ('PEGAR-UUID-DE-SIRO',  'siro',  'Siro',  'admin');
--
-- Una vez que existe al menos un admin, el resto de los estudiantes
-- se crean directamente desde el panel del taller (/portal), sin
-- volver a tocar SQL.
