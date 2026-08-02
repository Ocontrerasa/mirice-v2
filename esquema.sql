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

-- ------------------------------------------------------------------
-- 5. encuesta_preguntas — banco de preguntas del Termómetro de Clima,
--    editable desde el panel admin (agregado 02-ago-2026). Reemplaza el
--    banco fijo que vivía hardcodeado en climate_survey.js.
-- ------------------------------------------------------------------
create table if not exists encuesta_preguntas (
  id          uuid primary key default gen_random_uuid(),
  perfil      text not null check (perfil in ('estudiante','apoderado','funcionario')),
  texto       text not null,
  -- Lista de alternativas, en el orden en que se muestran.
  opciones    jsonb not null default '[]'::jsonb,
  activa      boolean not null default true,
  orden       int not null default 0,
  creado_en   timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists encuesta_preguntas_perfil_idx on encuesta_preguntas (perfil, activa);

alter table encuesta_preguntas enable row level security;

-- ------------------------------------------------------------------
-- 6. encuesta_respuestas — respuestas 100% anónimas: a propósito NO
--    lleva rut_hash ni ninguna columna que permita ligarla a una persona.
--    El control de "solo una vez por semana" vive aparte, en
--    encuesta_marcas, precisamente para que ni el propio servidor pueda
--    cruzar una respuesta con quién la escribió.
-- ------------------------------------------------------------------
create table if not exists encuesta_respuestas (
  id            uuid primary key default gen_random_uuid(),
  pregunta_id   uuid not null references encuesta_preguntas(id) on delete cascade,
  perfil        text not null check (perfil in ('estudiante','apoderado','funcionario')),
  periodo       text not null,   -- formato 'AAAA-Wss', ej. '2026-S31'
  opcion_texto  text not null,
  creado_en     timestamptz not null default now()
);

create index if not exists encuesta_respuestas_pregunta_idx on encuesta_respuestas (pregunta_id, periodo);

alter table encuesta_respuestas enable row level security;

-- ------------------------------------------------------------------
-- 7. encuesta_marcas — SOLO existencia, sin contenido: registra que esta
--    persona (por su rut_hash) ya respondió la encuesta de su perfil en
--    este periodo, para impedir una segunda respuesta. No guarda qué
--    contestó, solo que ya contestó.
-- ------------------------------------------------------------------
create table if not exists encuesta_marcas (
  autor_rut_hash text not null,
  periodo        text not null,
  creado_en      timestamptz not null default now(),
  primary key (autor_rut_hash, periodo)
);

alter table encuesta_marcas enable row level security;

-- ------------------------------------------------------------------
-- 8. push_suscripciones — suscripciones de notificaciones push del
--    navegador (Web Push estándar), para el aviso semanal de la encuesta
--    y, a futuro, otros avisos. Cada dispositivo agrega su propia fila;
--    una persona con el celular y el computador tiene dos filas.
-- ------------------------------------------------------------------
create table if not exists push_suscripciones (
  id             uuid primary key default gen_random_uuid(),
  autor_rut_hash text not null,
  rol            text not null check (rol in ('estudiante','apoderado','funcionario')),
  endpoint       text not null unique,
  p256dh         text not null,
  auth           text not null,
  creado_en      timestamptz not null default now()
);

create index if not exists push_suscripciones_rut_idx on push_suscripciones (autor_rut_hash);
create index if not exists push_suscripciones_rol_idx on push_suscripciones (rol);

alter table push_suscripciones enable row level security;

-- ------------------------------------------------------------------
-- 9. Siembra inicial: las preguntas que antes vivían hardcodeadas en
--    climate_survey.js, para que la encuesta no empiece vacía. Se puede
--    correr más de una vez sin duplicar (revisa si ya existe una
--    pregunta con exactamente ese texto y perfil).
-- ------------------------------------------------------------------
insert into encuesta_preguntas (perfil, texto, opciones, orden)
select * from (values
  ('estudiante', '¿Cómo te has sentido en tus espacios de recreo esta semana?',
    '["😄 Muy seguro y bien acompañado", "🙂 Tranquilo en general", "😐 A veces incómodo", "😟 Inseguro o solo"]'::jsonb, 1),
  ('estudiante', '¿Sientes que tus profesores y el Equipo de Convivencia Educativa te escuchan cuando lo necesitas?',
    '["👍 Sí, siempre", "🙂 La mayoría de las veces", "😐 Rara vez", "👎 No siento apoyo"]'::jsonb, 2),
  ('apoderado', '¿Cómo califica la atención y disponibilidad del liceo para resolver dudas sobre su pupilo/a?',
    '["⭐ Excelente y oportuna", "🙂 Buena", "😐 Regular", "🙁 Insuficiente"]'::jsonb, 1),
  ('apoderado', '¿Siente que su hijo/a asiste al Liceo de Huara en un entorno seguro y protegido?',
    '["🛡️ Totalmente seguro", "🙂 Seguro en general", "😐 Con algunas inquietudes", "⚠️ Inseguro"]'::jsonb, 2),
  ('funcionario', '¿Cómo evalúa la efectividad en la aplicación de los protocolos RICE en el establecimiento?',
    '["🟢 Altamente efectiva y clara", "🙂 Adecuada", "😐 Requiere mayor coordinación", "🔴 Deficiente"]'::jsonb, 1),
  ('funcionario', '¿Cómo percibe el ambiente de respeto y colaboración laboral esta semana?',
    '["🌟 Muy positivo y colaborativo", "🙂 Bueno y respetuoso", "😐 Neutro", "⚠️ Tenso"]'::jsonb, 2)
) as nuevas(perfil, texto, opciones, orden)
where not exists (
  select 1 from encuesta_preguntas ep
  where ep.perfil = nuevas.perfil and ep.texto = nuevas.texto
);
