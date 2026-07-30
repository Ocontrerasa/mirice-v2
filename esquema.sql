-- MIRICE 2026 — ESQUEMA DE BASE DE DATOS (Supabase / Postgres)
-- Liceo de Huara • SLEP Tamarugal
--
-- Cómo aplicarlo: Supabase → tu proyecto → SQL Editor → pega este archivo
-- completo → Run. Se puede correr más de una vez sin romper nada (todo usa
-- IF NOT EXISTS).
--
-- Diseño general
-- --------------
-- Ninguna tabla tiene políticas RLS que permitan acceso desde el navegador.
-- Todo el acceso pasa por las funciones serverless de /api, que usan la
-- clave service_role (nunca la anon/pública). Con RLS activado y cero
-- políticas, ni siquiera si alguien obtuviera la URL y la clave anon de este
-- proyecto podría leer una fila.

create extension if not exists pgcrypto;

-- ------------------------------------------------------------------
-- 1. personas — reemplaza a src/data/liceo_db.js
--    Nunca se sirve completa a ningún navegador. Los endpoints de /api
--    devuelven, como máximo, una sola fila: la de la persona que inició
--    sesión con su propio RUT y clave.
-- ------------------------------------------------------------------
create table if not exists personas (
  id                  uuid primary key default gen_random_uuid(),

  -- No se guarda el RUT en texto plano: solo su hash con pepper
  -- (ver hashRut en api/_comun.js). Sirve para buscar, no para leer.
  rut_hash            text unique not null,

  rol                 text not null check (rol in ('estudiante','apoderado','funcionario')),
  nombre              text not null,
  curso               text,
  email               text,
  telefono            text,
  matricula           text,
  cargo               text,          -- solo funcionarios
  departamento        text,          -- solo funcionarios
  registro_docente    text,          -- solo funcionarios/docentes
  estado              text default 'Regular',

  -- Vínculo apoderado → estudiante (para mostrar "pupilo" en el panel del
  -- apoderado). Es el rut_hash del estudiante, no su RUT.
  vinculo_rut_hash    text references personas(rut_hash),

  -- Clave con scrypt (ver hashClave/claveCoincide en api/_comun.js).
  -- Nunca se guarda la clave en texto plano.
  clave_hash          text,
  clave_sal           text,
  debe_cambiar_clave  boolean not null default true,

  -- true solo para las cuentas que deben entrar al panel de convivencia.
  panel_admin         boolean not null default false,

  activo              boolean not null default true,
  creado_en           timestamptz not null default now(),
  actualizado_en      timestamptz not null default now()
);

create index if not exists personas_rut_hash_idx on personas (rut_hash);
create index if not exists personas_vinculo_idx on personas (vinculo_rut_hash);

alter table personas enable row level security;
-- Sin políticas: cero acceso desde anon/authenticated. Solo service_role
-- (usado exclusivamente por las funciones de /api) puede leer o escribir.

-- ------------------------------------------------------------------
-- 2. reportes — ya usada por api/reporte.js
-- ------------------------------------------------------------------
create table if not exists reportes (
  id               uuid primary key default gen_random_uuid(),
  folio            text unique not null
                     default ('MR-' || to_char(now(), 'YYYYMMDD') || '-' ||
                               upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))),
  categoria        text not null,
  relato           text not null,
  rol_autor        text not null,
  curso_autor      text,
  autor_rut_hash   text,
  contacto         text,
  prioridad        text not null default 'normal',
  motivo_urgencia  text,
  estado           text not null default 'recibido'
                     check (estado in ('recibido','en_proceso','cerrado')),
  creado_en        timestamptz not null default now()
);

create index if not exists reportes_creado_en_idx on reportes (creado_en desc);
create index if not exists reportes_prioridad_idx on reportes (prioridad);

alter table reportes enable row level security;

-- ------------------------------------------------------------------
-- 3. reporte_eventos — bitácora, ya usada por api/reporte.js
-- ------------------------------------------------------------------
create table if not exists reporte_eventos (
  id              uuid primary key default gen_random_uuid(),
  reporte_id      uuid references reportes(id) on delete cascade,
  tipo            text not null,
  actor_rut_hash  text,
  detalle         text,
  creado_en       timestamptz not null default now()
);

create index if not exists reporte_eventos_reporte_idx on reporte_eventos (reporte_id);

alter table reporte_eventos enable row level security;

-- ------------------------------------------------------------------
-- 4. incidentes — bitácora que llena el funcionario/docente
--    Reemplaza los 4 localStorage.setItem distintos que usaba app.js
--    (mirice_bitacora, mirice_casos_convivencia, mirice_bitacoras_db,
--    mirice_mis_reportes_<rut>) — ninguno de los cuatro salía del
--    dispositivo de quien llenaba el formulario.
-- ------------------------------------------------------------------
create table if not exists incidentes (
  id                  uuid primary key default gen_random_uuid(),
  folio               text unique not null
                        default ('INC-' || to_char(now(), 'YYYYMMDD') || '-' ||
                                  upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))),

  -- Quién registra el incidente: a diferencia de un reporte de convivencia
  -- (que puede ser anónimo), aquí sí corresponde identificar al
  -- funcionario responsable del registro. Se guarda una copia del nombre y
  -- cargo al momento de escribir el incidente (queda igual aunque la
  -- persona cambie de cargo después).
  autor_rut_hash      text not null,
  autor_nombre        text not null,
  autor_cargo         text,

  fecha_incidente     date not null,
  hora_incidente       text,
  lugar               text not null,
  estamento           text,

  -- Personas mencionadas (estudiantes/funcionarios), sin su RUT: solo
  -- nombre, curso/cargo y tipo, tal como los entrega /api/buscar-personas.
  involucrados        jsonb not null default '[]'::jsonb,
  roles_situacion     text,

  tipificacion        jsonb not null default '[]'::jsonb,
  descripcion         text not null,
  abordaje            jsonb not null default '[]'::jsonb,
  requiere_derivacion boolean not null default false,
  derivacion_unidades jsonb not null default '[]'::jsonb,

  gravedad            text not null default 'leve' check (gravedad in ('leve','grave','gravisima')),
  alerta_tipo         text not null default 'NINGUNA',
  estado              text not null default 'en_seguimiento'
                        check (estado in ('en_seguimiento','cerrado')),

  creado_en           timestamptz not null default now()
);

create index if not exists incidentes_autor_idx on incidentes (autor_rut_hash);
create index if not exists incidentes_creado_en_idx on incidentes (creado_en desc);

alter table incidentes enable row level security;
