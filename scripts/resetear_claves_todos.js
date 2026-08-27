/**
 * MIRICE 2026 — REINICIO MASIVO: CLAVE = PRIMEROS 4 DÍGITOS DEL RUT
 * Liceo de Huara • SLEP Tamarugal
 *
 * Qué hace (regla nueva, ago-2026)
 * --------------------------------
 * Recorre la nómina completa (estudiantes + apoderados + funcionarios desde
 * los dos Excel) y, para CADA persona:
 *   1. La vuelve a vincular con su RUT: calcula rut_hash con el pepper y
 *      busca su fila en Supabase (PATCH por rut_hash). Si no está, la
 *      reporta al final en la lista de "no encontrados" — esa lista sirve
 *      para detectar a quién le falta cuenta (correr migrar_desde_excel.js
 *      para crearla) o a quién se le cargó el RUT con un error de tipeo.
 *   2. Reinicia su clave a los PRIMEROS 4 caracteres de su RUT/documento
 *      normalizado (ej. 12.345.678-9 → "1234"). Ya no se usa DDMM ni los
 *      últimos 4: una sola regla para todos los roles.
 *   3. Marca debe_cambiar_clave = true: en su próximo ingreso se le pedirá
 *      elegir una clave propia, con la opción explícita de mantener la
 *      clave por defecto si así lo prefiere (ver api/cambiar-clave.js).
 *
 * Solo toca las 3 columnas de clave (clave_sal, clave_hash,
 * debe_cambiar_clave). Nunca el nombre, curso, correo ni ningún otro dato.
 *
 * Uso (SIEMPRE en tu computador local, NUNCA en el repositorio ni en la nube):
 *   $env:SUPABASE_URL="https://xxxxx.supabase.co"
 *   $env:SUPABASE_SERVICE_KEY="....."
 *   $env:MIRICE_PEPPER="....."
 *   node scripts/resetear_claves_todos.js <estudiantes.xlsx> <personal.xlsx>
 *
 * Cuando termine, BORRA los dos Excel de este computador.
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
  // Documentos extranjeros (mismo criterio que api/_comun.js)
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

/** REGLA ÚNICA: primeros 4 caracteres del documento normalizado. */
function claveInicial(rutLimpio) {
  return rutLimpio.slice(0, 4);
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
    console.error('Uso: node scripts/resetear_claves_todos.js <estudiantes.xlsx> <personal.xlsx>');
    process.exit(1);
  }

  let ok = 0, errores = 0;
  const noEncontrados = [];      // [contexto legible, SIN el RUT completo]
  const apoderadosVistos = new Set();

  // 1. Estudiantes + apoderados (mismo Excel de matrícula)
  const wb1 = XLSX.readFile(archivoEstudiantes);
  const filasEst = XLSX.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]], { defval: '' });

  for (const [i, row] of filasEst.entries()) {
    if ((i + 1) % 50 === 0 || i === 0) console.log('Estudiantes... ' + (i + 1) + ' de ' + filasEst.length);

    const rutEst = celda(row, 'DNI Estudiante');
    if (rutValido(rutEst)) {
      const rutLimpio = normalizarRut(rutEst);
      const resultado = await reiniciarClave(
        SUPABASE_URL, SUPABASE_SERVICE_KEY,
        hashRut(rutLimpio, MIRICE_PEPPER),
        claveInicial(rutLimpio),
        'Estudiante fila ' + (i + 2)
      );
      if (resultado === 'ok') ok++;
      else if (resultado === 'no_encontrado') noEncontrados.push('Estudiante fila ' + (i + 2) + ' del Excel (' + celda(row, 'Nombre Estudiante') + ')');
      else errores++;
    } else if (rutEst) {
      noEncontrados.push('Estudiante fila ' + (i + 2) + ': documento con formato no reconocido');
    }

    const rutApo = celda(row, 'DNI Apoderado Titular');
    if (rutValido(rutApo)) {
      apoderadosVistos.add(normalizarRut(rutApo));
    }
  }

  // 2. Apoderados únicos
  console.log('Apoderados únicos a reiniciar: ' + apoderadosVistos.size);
  let contadorApo = 0;
  for (const rutLimpio of apoderadosVistos) {
    contadorApo++;
    if (contadorApo % 50 === 0) console.log('Apoderados... ' + contadorApo + ' de ' + apoderadosVistos.size);
    const resultado = await reiniciarClave(
      SUPABASE_URL, SUPABASE_SERVICE_KEY,
      hashRut(rutLimpio, MIRICE_PEPPER),
      claveInicial(rutLimpio),
      'Apoderado #' + contadorApo
    );
    if (resultado === 'ok') ok++;
    else if (resultado === 'no_encontrado') noEncontrados.push('Apoderado #' + contadorApo + ' (aparece en el Excel de matrícula pero no tiene cuenta en Supabase)');
    else errores++;
  }

  // 3. Funcionarios (columna C, hoja con 4 filas de encabezado — mismo
  //    criterio que migrar_desde_excel.js y resetear_claves.js)
  const wb2 = XLSX.readFile(archivoPersonal);
  const filasPersonal = XLSX.utils.sheet_to_json(wb2.Sheets[wb2.SheetNames[0]], { defval: '', range: 4 });

  console.log('Procesando personal...');
  for (const [i, row] of filasPersonal.entries()) {
    if ((i + 1) % 20 === 0) console.log('Personal... ' + (i + 1) + ' de ' + filasPersonal.length);

    const valores = Object.values(row);
    const rut = String(valores[2] || '').trim();

    if (rutValido(rut)) {
      const rutLimpio = normalizarRut(rut);
      const resultado = await reiniciarClave(
        SUPABASE_URL, SUPABASE_SERVICE_KEY,
        hashRut(rutLimpio, MIRICE_PEPPER),
        claveInicial(rutLimpio),
        'Personal fila ' + (i + 6)
      );
      if (resultado === 'ok') ok++;
      else if (resultado === 'no_encontrado') noEncontrados.push('Personal fila ' + (i + 6) + ' del Excel');
      else errores++;
    }
  }

  console.log('');
  console.log('=====================================================');
  console.log('Reinicio masivo terminado.');
  console.log('  Vinculados y reiniciados OK : ' + ok);
  console.log('  Errores de servidor         : ' + errores);
  console.log('  Sin cuenta en Supabase      : ' + noEncontrados.length);
  if (noEncontrados.length > 0) {
    console.log('');
    console.log('Personas de la nómina que NO tienen cuenta (revisar y, si');
    console.log('corresponde, crearlas con scripts/migrar_desde_excel.js o');
    console.log('desde el panel admin → "Agregar Persona"):');
    noEncontrados.forEach((n) => console.log('   - ' + n));
  }
  console.log('');
  console.log('Nueva clave de todos: los PRIMEROS 4 dígitos de su RUT.');
  console.log('En su próximo ingreso podrán elegir una clave propia o');
  console.log('mantener la clave por defecto (decisión de cada persona).');
  console.log('BORRA los dos archivos Excel de este computador ahora.');
}

main();
