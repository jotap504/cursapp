-- ════════════════════════════════════════════════════════
--  SUPABASE SCHEMA — cursApp
--  Run this in Supabase → SQL Editor → Run
-- ════════════════════════════════════════════════════════

-- Tabla cursos
create table if not exists cursos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  precio numeric not null default 0,
  categoria text default 'Holístico',
  descripcion text,
  imagen_url text,
  video_url text,
  archivos jsonb default '[]'::jsonb,
  activo boolean default true,
  fecha_creacion timestamptz default now(),
  fecha_actualizacion timestamptz default now()
);

-- Tabla configuracion (single row: id = 'general')
create table if not exists configuracion (
  id text primary key default 'general',
  nombre_pagina text default 'Aura Healing',
  logo_url text default '/logo.png',
  hero_titulo text default 'Elevate Your Vibrational Spirit',
  hero_subtitulo text default 'Innovative holistic courses for modern wellness.',
  esquema_colores text default '1',
  contacto jsonb default '{"email":"","telefono":"","direccion":""}'::jsonb,
  redes jsonb default '{"instagram":"","facebook":"","twitter":"","youtube":""}'::jsonb
);
-- Insert default row
insert into configuracion (id) values ('general') on conflict (id) do nothing;

-- Tabla usuarios
create table if not exists usuarios (
  id uuid references auth.users(id) on delete cascade primary key,
  nombre text,
  email text,
  foto text,
  rol text default 'estudiante',
  cursos_comprados jsonb default '[]'::jsonb,
  fecha_registro timestamptz default now()
);

-- Tabla mensajes de contacto
create table if not exists mensajes_contacto (
  id uuid default gen_random_uuid() primary key,
  nombre text,
  email text,
  mensaje text,
  fecha timestamptz default now()
);

-- ════════════════════════════════════════════════
--  Row Level Security (RLS)
-- ════════════════════════════════════════════════

-- Cursos: public read, authenticated write
alter table cursos enable row level security;
create policy "cursos_read_public" on cursos for select using (true);
create policy "cursos_write_auth"  on cursos for all using (auth.role() = 'authenticated');

-- Configuracion: public read, authenticated write
alter table configuracion enable row level security;
create policy "config_read_public" on configuracion for select using (true);
create policy "config_write_auth"  on configuracion for all using (auth.role() = 'authenticated');

-- Usuarios: users can read/write their own row
alter table usuarios enable row level security;
create policy "usuarios_own" on usuarios for all using (auth.uid() = id);

-- Mensajes: anyone can insert, authenticated can read
alter table mensajes_contacto enable row level security;
create policy "mensajes_insert_public" on mensajes_contacto for insert with check (true);
create policy "mensajes_read_auth"     on mensajes_contacto for select using (auth.role() = 'authenticated');

-- ════════════════════════════════════════════════
--  Storage: create bucket course-files
--  Do this via dashboard: Storage → New Bucket → "course-files" → Public
-- ════════════════════════════════════════════════
