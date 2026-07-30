#!/usr/bin/env node
/**
 * MIRICE 2026 — MIGRACIÓN DE PERSONAS A SUPABASE
 * Liceo de Huara • SLEP Tamarugal
 *
 * Qué hace
 * --------
 * Lee un archivo JSON con la lista de estudiantes / apoderados / funcionarios
 * (el mismo tipo de datos que antes vivía en `src/data/liceo_db.js`) y crea
 * o actualiza cada persona en la tabla `personas` de Supabase:
 *   - El RUT se hashea con MIRICE_PEPPER antes de guardarse (nunca en texto plano).
 *   - La clave inicial (últimos 4 dígitos del RUT) se guarda con scrypt, no en
 *     texto plano, y con `debe_cambiar_clave = true`.
 *
 * Este script se corre UNA VEZ, en tu computador, con tus propias variables
 * de entorno. Nunca se sube al repositorio ni se corre en un chat de IA,
 * porque en el momento en que corre tiene en memoria el RUT real de cada
 * persona.
 *
 * Cómo correrlo
 * -------------
 *   1. Ten a mano: SUPABASE_URL, SUPABASE_SERVICE_KEY, MIRICE_PEPPER
 *      (las mismas que configuraste en Vercel).
 *   2. Prepara un archivo JSON (ver formato de entrada más abajo).
 *   3. Corre:
 *        SUPABASE_URL=... SUPABASE_SERVICE_KEY=... MIRICE_PEPPER=... \
 *        node migrar_personas.js ruta/al/archivo.json
 *   4. Cuando termine, BORRA ese archivo JSON de tu computador
 *      (no lo dejes en Descargas, ni en el Escritorio, ni menos en el repo).
 *
 * Formato de entrada esperado (un array de objetos; los campos que no
 * apliquen a un rol se pueden omitir u dejar vacíos):
 * [
 *   {
 *     "rut": "27.720.558-0",
 *     "rol": "estudiante",            // "estudiante" | "apoderado" | "funcionario"
 *     "nombre": "Amy Josefa Alcayaga Masoliver",
 *     "curso": "Primer Nivel Transición A",
 *     "email": "",
 *     "telefono": "933615196",
 *     "matricula": "2026-H001",
 *     "estado": "Regular",
 *     "vinculo_rut": "",              // solo apoderados: RUT del pupilo
 *     "cargo": "",                    // solo funcionarios
 *     "departamento": "",             // solo funcionarios
 *     "registro_docente": "",         // solo funcionarios
 *     "panel_admin": false            // true solo para cuentas de Convivencia/Dirección
 *   }
 * ]
 *
 * Nada de dependencias externas: usa `crypto` y `fetch`, igual que el resto
 * del backend.
 */

const fs = require('fs');
const crypto = require('crypto');

const SCRYPT_LARGO = 32;
const SCRYPT_COSTO = 16384;

function normalizarRut(bruto) {
  return String(bruto || '').replace(/[.\s-]/g, '').toUpperCase();
}

function rutValido(rut) {
  const limpio = normalizarRut(rut);
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;
  const cuerpo = limpio.slice(0, -1);
  const dado = limpio.slice(-1);
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dado === esperado;
}

function hashRut(rut, pepper) {
  return crypto.createHash('sha256').update(pepper + '|' + normalizarRut(rut)).digest('hex');
}

function hashClave(clave) {
  const sal = crypto.randomBytes(16);
  const derivada = crypto.scryptSync(String(clave).normalize('NFKC'), sal, SCRYPT_LARGO, { N: SCRYPT_COSTO });
  return { sal: sal.toString('hex'), hash: derivada.toString('hex') };
}

async function upsertPersona(base, clave, fila) {
  const r = await fetch(base.replace(/\/+$/, '') + '/rest/v1/personas?on_conflict=rut_hash', {
    method: 'POST',
    headers: {
      apikey: clave,
      Authorization: 'Bearer ' + clave,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(fila),
  });
  if (!r.ok) {
    const texto = await r.text().catch(() => '');
    throw new Error('HTTP ' + r.status + ' ' + texto.slice(0, 300));
  }
}

async function main() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const MIRICE_PEPPER = process.env.MIRICE_PEPPER;
  const archivo = process.argv[2];

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !MIRICE_PEPPER) {
    console.error('Faltan variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_KEY, MIRICE_PEPPER.');
    process.exit(1);
  }
  if (!archivo) {
    console.error('Uso: node migrar_personas.js ruta/al/archivo.json');
    process.exit(1);
  }

  const registros = JSON.parse(fs.readFileSync(archivo, 'utf8'));
  if (!Array.isArray(registros)) {
    console.error('El archivo debe contener un array JSON.');
    process.exit(1);
  }

  let ok = 0;
  let saltados = 0;

  for (const r of registros) {
    if (!rutValido(r.rut)) {
      console.warn('RUT inválido, se omite:', r.nombre || '(sin nombre)');
      saltados++;
      continue;
    }
    if (!['estudiante', 'apoderado', 'funcionario'].includes(r.rol)) {
      console.warn('Rol inválido, se omite:', r.nombre || '(sin nombre)');
      saltados++;
      continue;
    }

    const rutLimpio = normalizarRut(r.rut);
    const claveInicial = rutLimpio.slice(-4);
    const { sal, hash } = hashClave(claveInicial);

    const fila = {
      rut_hash: hashRut(rutLimpio, MIRICE_PEPPER),
      rol: r.rol,
      nombre: r.nombre || '',
      curso: r.curso || null,
      email: r.email || null,
      telefono: r.telefono || null,
      matricula: r.matricula || null,
      estado: r.estado || 'Regular',
      cargo: r.cargo || null,
      departamento: r.departamento || null,
      registro_docente: r.registro_docente || null,
      vinculo_rut_hash: r.vinculo_rut && rutValido(r.vinculo_rut)
        ? hashRut(normalizarRut(r.vinculo_rut), MIRICE_PEPPER)
        : null,
      panel_admin: !!r.panel_admin,
      clave_sal: sal,
      clave_hash: hash,
      debe_cambiar_clave: true,
      activo: true,
    };

    try {
      await upsertPersona(SUPABASE_URL, SUPABASE_SERVICE_KEY, fila);
      ok++;
    } catch (e) {
      console.error('Error con', r.nombre || r.rut, ':', e.message);
      saltados++;
    }
  }

  console.log('Migración terminada. Cargados:', ok, '— Omitidos:', saltados);
  console.log('Recuerda: la clave inicial de cada cuenta son los últimos 4 dígitos de su RUT.');
  console.log('BORRA el archivo JSON de entrada de este computador ahora que ya terminó.');
}

main().catch((e) => {
  console.error('Error fatal:', e);
  process.exit(1);
});
