#!/usr/bin/env node
/**
 * MIRICE 2026 — MIGRACIÓN DIRECTA DESDE LOS EXCEL ORIGINALES
 * Liceo de Huara • SLEP Tamarugal
 *
 * Qué hace
 * --------
 * Lee las dos planillas reales:
 *   1. "apoderados y estudantes 2026 Liceo Huara_2026-07-07.xlsx" (59 columnas)
 *   2. "NOMINA PERSONAL 2026.xlsx" (personal del liceo)
 *
 * y sube a Supabase SOLO los campos que la aplicación realmente necesita
 * para el login y para mostrar el perfil de cada persona:
 *   estudiantes: RUT, nombre, curso, email, teléfono, matrícula, estado
 *   apoderados:  RUT, nombre, email, teléfono, y el RUT de su pupilo
 *   funcionarios: RUT, nombre, cargo, email, teléfono
 *
 * A propósito NO se sube nada de lo demás que trae la planilla de
 * estudiantes: alergias, enfermedades crónicas, grupo sanguíneo, peso,
 * estatura, religión, etnia, dirección, seguro médico, nivel educacional
 * de los padres, etc. — son datos sensibles que la app no necesita para
 * funcionar, y agregarlos solo aumentaría el daño de una futura filtración.
 *
 * El RUT nunca se guarda en texto plano (se hashea con MIRICE_PEPPER) y la
 * clave inicial (últimos 4 dígitos del RUT) se guarda con scrypt — igual
 * que en migrar_personas.js.
 *
 * Este script NUNCA escribe un archivo JSON intermedio con los datos
 * reales: lee el Excel y sube directo a Supabase, fila por fila.
 *
 * Cómo correrlo
 * -------------
 *   1. En la misma carpeta donde está este archivo, corre una vez:
 *        npm install xlsx
 *   2. Luego:
 *        SUPABASE_URL=... SUPABASE_SERVICE_KEY=... MIRICE_PEPPER=... \
 *        node migrar_desde_excel.js "ruta/apoderados_y_estudiantes.xlsx" "ruta/NOMINA_PERSONAL_2026.xlsx"
 *   3. Cuando termine, BORRA los dos archivos Excel de este computador
 *      (Descargas, Escritorio, donde sea que los tengas).
 *
 * Panel de administración
 * ------------------------
 * Solo quedan con acceso al panel quienes tengan alguno de estos nombres
 * (sin distinguir mayúsculas/tildes) en "NOMBRE COMPLETO" de la nómina.
 * Ajusta esta lista si corresponde antes de correr el script.
 */

const NOMBRES_PANEL_ADMIN = ['omar contreras', 'carmen barrera'];

const XLSX = require('xlsx');
const crypto = require('crypto');

const SCRYPT_LARGO = 32;
const SCRYPT_COSTO = 16384;

function normalizarTexto(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Coincide si TODAS las palabras de un nombre de la lista aparecen en el
// nombre completo, sin importar el orden (algunas planillas traen
// "Apellido Apellido, Nombre" en vez de "Nombre Apellido").
function esPanelAdmin(nombreCompleto) {
  const norm = normalizarTexto(nombreCompleto);
  return NOMBRES_PANEL_ADMIN.some((candidato) =>
    candidato.split(' ').every((palabra) => norm.includes(palabra))
  );
}

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

  // Documento de identidad extranjero (29-jul-2026): mismo criterio que
  // api/_comun.js — sin dígito verificador chileno, se acepta un formato
  // razonable para no excluir a estudiantes/apoderados/funcionarios
  // extranjeros.
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

function celda(row, nombre) {
  return row[nombre] != null ? String(row[nombre]).trim() : '';
}

// Clave inicial universal (29-jul-2026): antes eran los últimos 4 dígitos
// del RUT, pero eso no sirve para estudiantes extranjeros sin RUT chileno.
// La fecha de nacimiento (formato DD-MM-YYYY en esta planilla) funciona
// igual para cualquier nacionalidad. Si no hay fecha registrada, se usan
// los últimos 4 caracteres del documento como respaldo.
function claveInicialDesdeFecha(fechaTexto, documentoLimpio) {
  const m = /^(\d{2})-(\d{2})-\d{4}$/.exec(String(fechaTexto || '').trim());
  if (m) return m[1] + m[2]; // DDMM
  return documentoLimpio.slice(-4);
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
  const archivoEstudiantes = process.argv[2];
  const archivoPersonal = process.argv[3];

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !MIRICE_PEPPER) {
    console.error('Faltan variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_KEY, MIRICE_PEPPER.');
    process.exit(1);
  }
  if (!archivoEstudiantes || !archivoPersonal) {
    console.error('Uso: node migrar_desde_excel.js <estudiantes.xlsx> <personal.xlsx>');
    process.exit(1);
  }

  let ok = 0;
  let saltados = 0;
  const apoderadosVistos = new Map(); // rut_limpio -> datos (evita subir al mismo apoderado varias veces)

  // ------------------------------------------------------------------
  // 1. Estudiantes y apoderados (misma planilla, una fila por estudiante)
  // ------------------------------------------------------------------
  const wb1 = XLSX.readFile(archivoEstudiantes);
  const hoja1 = wb1.Sheets[wb1.SheetNames[0]];
  const filasEst = XLSX.utils.sheet_to_json(hoja1, { defval: '' });

  for (const [i, row] of filasEst.entries()) {
    const filaExcel = i + 2; // +2 porque la fila 1 es encabezado y el índice empieza en 0
    const rutEst = celda(row, 'DNI Estudiante');

    if (rutValido(rutEst)) {
      const nombreEst = [
        celda(row, 'Nombres Estudiante'),
        celda(row, 'Apellido Paterno Estudiante'),
        celda(row, 'Apellido Materno Estudiante'),
      ].filter(Boolean).join(' ');

      const rutLimpio = normalizarRut(rutEst);
      const { sal, hash } = hashClave(
        claveInicialDesdeFecha(celda(row, 'Fecha de nacimiento Estudiante'), rutLimpio)
      );

      try {
        await upsertPersona(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
          rut_hash: hashRut(rutLimpio, MIRICE_PEPPER),
          rol: 'estudiante',
          nombre: nombreEst,
          curso: celda(row, 'Curso Estudiante') || null,
          email: celda(row, 'Email Estudiante') || null,
          telefono: celda(row, 'Teléfono celular Estudiante') || celda(row, 'Teléfono emergencia Estudiante') || null,
          matricula: celda(row, 'Número de matrícula Estudiante') || null,
          estado: celda(row, 'Fecha de retiro Estudiante') ? 'Retirado' : 'Regular',
          panel_admin: false,
          clave_sal: sal,
          clave_hash: hash,
          debe_cambiar_clave: true,
          activo: true,
        });
        ok++;
      } catch (e) {
        console.error('Error con un estudiante (fila omitida):', e.message);
        saltados++;
      }
    } else if (rutEst) {
      console.warn('Fila ' + filaExcel + ' del Excel: RUT de estudiante con formato inválido, se omite. Revísala tú mismo.');
      saltados++;
    }

    const rutApo = celda(row, 'DNI Apoderado Titular');
    if (rutValido(rutApo)) {
      const rutApoLimpio = normalizarRut(rutApo);
      if (!apoderadosVistos.has(rutApoLimpio)) {
        apoderadosVistos.set(rutApoLimpio, {
          nombre: [
            celda(row, 'Nombres Apoderado Titular'),
            celda(row, 'Apellido Paterno Apoderado Titular'),
            celda(row, 'Apellido Materno Apoderado Titular'),
          ].filter(Boolean).join(' '),
          email: celda(row, 'Email Apoderado Titular') || null,
          telefono: celda(row, 'Teléfono celular Apoderado Titular') || celda(row, 'Teléfono fijo Apoderado Titular') || null,
          fechaNacimiento: celda(row, 'Fecha de Nacimiento Apoderado Titular'),
          vinculo_rut: rutValido(rutEst) ? normalizarRut(rutEst) : null,
        });
      }
    }
  }

  // ------------------------------------------------------------------
  // 2. Subir apoderados (uno por RUT único — un apoderado puede repetirse
  //    si tiene más de un hijo en la planilla; solo se vincula al primero
  //    que aparece. Si necesitas vincular a varios hijos, avísame.)
  // ------------------------------------------------------------------
  for (const [rutLimpio, datos] of apoderadosVistos) {
    const { sal, hash } = hashClave(claveInicialDesdeFecha(datos.fechaNacimiento, rutLimpio));
    try {
      await upsertPersona(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        rut_hash: hashRut(rutLimpio, MIRICE_PEPPER),
        rol: 'apoderado',
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono,
        vinculo_rut_hash: datos.vinculo_rut ? hashRut(datos.vinculo_rut, MIRICE_PEPPER) : null,
        panel_admin: false,
        clave_sal: sal,
        clave_hash: hash,
        debe_cambiar_clave: true,
        activo: true,
      });
      ok++;
    } catch (e) {
      console.error('Error con un apoderado (fila omitida):', e.message);
      saltados++;
    }
  }

  // ------------------------------------------------------------------
  // 3. Personal (NOMINA_PERSONAL_2026.xlsx) — la tabla real empieza en
  //    la fila 5 (hay 4 filas de encabezado gráfico antes). La columna
  //    del RUT no tiene título de texto, así que se toma por posición
  //    (3ª columna).
  // ------------------------------------------------------------------
  const wb2 = XLSX.readFile(archivoPersonal);
  const hoja2 = wb2.Sheets[wb2.SheetNames[0]];
  const filasPersonal = XLSX.utils.sheet_to_json(hoja2, { defval: '', range: 4 });

  for (const [i, row] of filasPersonal.entries()) {
    const filaExcel = i + 6; // fila 5 es encabezado, los datos parten en la 6, +1 por índice 0
    const nombre = celda(row, 'NOMBRE COMPLETO');
    const valores = Object.values(row);
    const rut = String(valores[2] || '').trim(); // columna C, sin encabezado

    if (!nombre || !rutValido(rut)) {
      if (nombre) {
        console.warn('Fila ' + filaExcel + ' de la nómina: RUT con formato inválido, se omite. Revísala tú mismo.');
        saltados++;
      }
      continue;
    }

    const rutLimpio = normalizarRut(rut);
    const { sal, hash } = hashClave(rutLimpio.slice(-4));
    const esAdmin = esPanelAdmin(nombre);

    try {
      await upsertPersona(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        rut_hash: hashRut(rutLimpio, MIRICE_PEPPER),
        rol: 'funcionario',
        nombre,
        email: celda(row, 'CORREO ') || celda(row, 'CORREO') || null,
        telefono: celda(row, 'CELULAR') || null,
        cargo: celda(row, 'CARGO') || null,
        panel_admin: esAdmin,
        clave_sal: sal,
        clave_hash: hash,
        debe_cambiar_clave: true,
        activo: true,
      });
      ok++;
      if (esAdmin) {
        console.log('→ Acceso a panel admin otorgado a un funcionario coincidente con la lista configurada.');
      }
    } catch (e) {
      console.error('Error con un funcionario (fila omitida):', e.message);
      saltados++;
    }
  }

  console.log('\nMigración terminada. Cargados:', ok, '— Omitidos:', saltados);
  console.log('Clave inicial: día y mes de nacimiento (DDMM) para estudiantes/apoderados con fecha registrada;');
  console.log('los últimos 4 caracteres del documento para el resto (incluido todo el personal).');
  console.log('BORRA los dos archivos Excel de este computador ahora que ya terminó.');
}

main().catch((e) => {
  console.error('Error fatal:', e);
  process.exit(1);
});
