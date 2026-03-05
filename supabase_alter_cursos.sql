-- Agregar campos editables a la tabla cursos
-- Ejecutar en Supabase → SQL Editor

alter table cursos
  add column if not exists duracion text default '12 Horas',
  add column if not exists nivel text default 'Principiante',
  add column if not exists acceso text default 'De por vida',
  add column if not exists certificado text default 'SI',
  add column if not exists temario jsonb default '[]'::jsonb;

-- Ejemplo de cómo se guarda el temario:
-- ["Técnica 1: Introducción", "Técnica 2: Avanzado", ...]
