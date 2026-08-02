/**
 * MIRICE 2026 — REINICIO MASIVO DE CLAVES A SU VALOR INICIAL
 * Liceo de Huara • SLEP Tamarugal
 *
 * Qué hace
 * --------
 * Recalcula y reinicia la clave de TODOS (estudiantes, apoderados y
 * funcionarios) a su valor inicial, y marca debe_cambiar_clave = true
 * para que a todos se les pida elegir una clave nueva en su próximo
 * ingreso. A diferencia de migrar_desde_excel.js, este script usa PATCH
 * (no upsert): solo toca las 3 columnas de clave, nunca el nombre, curso,
 * correo ni ningún otro dato de la persona.
 *
 * Fórmula de la clave inicial (la misma de siempre):
 *   Estudiantes y apoderados: DDMM (día+mes de nacimiento) si hay fecha
 *     registrada en la planilla; si no, los últimos 4 caracteres de su
 *     documento de identidad.
 *   Funcionarios: siempre los últimos 4 caracteres de su RUT (la nómina
 *     de personal no registra fecha de nacimiento).
 *
 * Uso:
 *   node scripts/resetear_claves.js <estudiantes.xlsx> <personal.xlsx>
 *
 * Variables de entorno necesarias: SUPABASE_URL, SUPABASE_SERVICE_KEY,
 * MIRICE_PEPPER (las mismas de siempre).
 */

const crypto = require('crypto');
const XLSX = require('xlsx');

const SCRYPT_LARGO = 32;
const SCRYPT_COSTO = 16384;

function normalizarRut(bruto) {
  return String(bruto || '').replace(/[.\s-]/g, '').toUpperCase();
}

function rutValido(rut) {
  const limpio = normalizarRut(rut);
  const esFormaChilena = /^\d{7,8}[0-9K]$/.test(limpio);
  if (esFormaChilena) {
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
    if (dado === esperado) return true;
  }
  return /^[A-Z0-9]{6,15}$/.test(limpio);
}

function hashRut(rut, pepper) {
  return crypto.createHash('sha256').update(pepper + '|' + normalizarRut(rut)).digest('hex');
}

function hashClave(clave) {
  const sal = crypto.randomBytes(16);
  const derivada = crypto.scryptSync(String(clave).normalize('NFKC'), sal, SCRYPT_LARGO, { N: SCRYPT_COSTO });
  return { sal: sal.toString('hex'), hash: derivada.toString('hex') };
}

function claveInicialDesdeFecha(fechaTexto, documentoLimpio) {
  const m = /^(\d{2})-(\d{2})-\d{4}$/.exec(String(fechaTexto || '').trim());
  if (m) return m[1] + m[2]; // DDMM
  // La K queda en minúscula en la clave (aunque el RUT normalizado la usa
  // en mayúscula internamente) — es lo que la persona naturalmente escribe.
  return documentoLimpio.slice(-4).replace(/K/g, 'k');
}

function celda(row, nombre) {
  return row[nombre] != null ? String(row[nombre]).trim() : '';
}

async function reiniciarClave(base, claveApi, rutHash, clave, contexto) {
  const { sal, hash } = hashClave(clave);
  const r = await fetch(base.replace(/\/+$/, '') + '/rest/v1/personas?rut_hash=eq.' + rutHash, {
    method: 'PATCH',
    headers: {
      apikey: claveApi,
      Authorization: 'Bearer ' + claveApi,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ clave_sal: sal, clave_hash: hash, debe_cambiar_clave: true }),
  });
  const datos = await r.json().catch(() => null);
  if (!r.ok) {
    console.error(contexto + ': error HTTP ' + r.status);
    return 'error';
  }
  if (!datos || datos.length === 0) {
    console.warn(contexto + ': no se encontró ningún registro con ese RUT en Supabase, se omite.');
    return 'no_encontrado';
  }
  return 'ok';
}

async function main() {
  const archivoEstudiantes = process.argv[2];
  const archivoPersonal = process.argv[3];
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, MIRICE_PEPPER } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !MIRICE_PEPPER) {
    console.error('Faltan variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_KEY, MIRICE_PEPPER');
    process.exit(1);
  }
  if (!archivoEstudiantes || !archivoPersonal) {
    console.error('Uso: node resetear_claves.js <estudiantes.xlsx> <personal.xlsx>');
    process.exit(1);
  }

  let ok = 0, sinEncontrar = 0, errores = 0;
  const apoderadosVistos = new Map();

  // 1. Estudiantes + apoderados
  const wb1 = XLSX.readFile(archivoEstudiantes);
  const filasEst = XLSX.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]], { defval: '' });

  for (const [i, row] of filasEst.entries()) {
    if ((i + 1) % 50 === 0 || i === 0) console.log('Estudiantes... ' + (i + 1) + ' de ' + filasEst.length);

    const rutEst = celda(row, 'DNI Estudiante');
    if (rutValido(rutEst)) {
      const rutLimpio = normalizarRut(rutEst);
      const clave = claveInicialDesdeFecha(celda(row, 'Fecha de nacimiento Estudiante'), rutLimpio);
      const resultado = await reiniciarClave(SUPABASE_URL, SUPABASE_SERVICE_KEY, hashRut(rutLimpio, MIRICE_PEPPER), clave, 'Estudiante fila ' + (i + 2));
      if (resultado === 'ok') ok++; else if (resultado === 'no_encontrado') sinEncontrar++; else errores++;
    }

    const rutApo = celda(row, 'DNI Apoderado Titular');
    if (rutValido(rutApo)) {
      const rutApoLimpio = normalizarRut(rutApo);
      if (!apoderadosVistos.has(rutApoLimpio)) {
        apoderadosVistos.set(rutApoLimpio, celda(row, 'Fecha de Nacimiento Apoderado Titular'));
      }
    }
  }

  console.log('Apoderados únicos a reiniciar: ' + apoderadosVistos.size);
  let contadorApo = 0;
  for (const [rutLimpio, fechaNacimiento] of apoderadosVistos) {
    contadorApo++;
    if (contadorApo % 50 === 0) console.log('Apoderados... ' + contadorApo + ' de ' + apoderadosVistos.size);
    const clave = claveInicialDesdeFecha(fechaNacimiento, rutLimpio);
    const resultado = await reiniciarClave(SUPABASE_URL, SUPABASE_SERVICE_KEY, hashRut(rutLimpio, MIRICE_PEPPER), clave, 'Apoderado #' + contadorApo);
    if (resultado === 'ok') ok++; else if (resultado === 'no_encontrado') sinEncontrar++; else errores++;
  }

  // 2. Funcionarios
  const wb2 = XLSX.readFile(archivoPersonal);
  const filasPersonal = XLSX.utils.sheet_to_json(wb2.Sheets[wb2.SheetNames[0]], { defval: '', range: 4 });

  console.log('Procesando personal...');
  for (const [i, row] of filasPersonal.entries()) {
    if ((i + 1) % 20 === 0) console.log('Personal... ' + (i + 1) + ' de ' + filasPersonal.length);

    const valores = Object.values(row);
    const rut = String(valores[2] || '').trim(); // columna C, sin encabezado (mismo criterio que migrar_desde_excel.js)

    if (rutValido(rut)) {
      const rutLimpio = normalizarRut(rut);
      const clave = rutLimpio.slice(-4).replace(/K/g, 'k');
      const resultado = await reiniciarClave(SUPABASE_URL, SUPABASE_SERVICE_KEY, hashRut(rutLimpio, MIRICE_PEPPER), clave, 'Personal fila ' + (i + 6));
      if (resultado === 'ok') ok++; else if (resultado === 'no_encontrado') sinEncontrar++; else errores++;
    }
  }

  console.log('');
  console.log('Reinicio de claves terminado. OK: ' + ok + ' — Sin encontrar: ' + sinEncontrar + ' — Errores: ' + errores);
  console.log('Todas las personas afectadas deberán elegir una clave nueva en su próximo ingreso.');
  console.log('BORRA los dos archivos Excel de este computador ahora que ya terminó.');
}

main();
