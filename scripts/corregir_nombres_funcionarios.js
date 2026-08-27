/**
 * MIRICE 2026 — CORRECCIÓN PUNTUAL: orden nombre/apellido de funcionarios
 * Liceo de Huara • SLEP Tamarugal
 *
 * Por qué existe este script
 * ---------------------------
 * La nómina de personal trae el nombre como "Apellido Apellido Nombre[s]"
 * (orden administrativo chileno), pero MiRice espera "Nombre[s] Apellido
 * Apellido" para poder saludar a cada funcionario por su nombre de pila.
 * El intento anterior de corregir esto adivinaba el orden por cantidad de
 * palabras, y falló porque la mayoría del personal tiene dos nombres
 * (ej. "Daniela Romina"), no uno solo. Este script usa en cambio un mapeo
 * revisado persona por persona (ver mapeo_nombres_funcionarios.js),
 * y actualiza SOLO el campo `nombre` de cada registro ya migrado —
 * no vuelve a migrar todo desde cero, no toca claves, RUTs ni ningún
 * otro dato.
 *
 * Variables de entorno que necesita (las mismas de siempre):
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY, MIRICE_PEPPER
 *
 * Uso:
 *   node scripts/corregir_nombres_funcionarios.js "ruta/a/NOMINA_PERSONAL.xlsx"
 */

const fs = require('fs');
const crypto = require('crypto');
const XLSX = require('xlsx');
const MAPEO_NOMBRES = require('./mapeo_nombres_funcionarios.js');

function normalizarRut(bruto) {
  return String(bruto || '').replace(/[.\s-]/g, '').toUpperCase();
}

function hashRut(rut, pepper) {
  return crypto.createHash('sha256').update(pepper + '|' + normalizarRut(rut)).digest('hex');
}

async function main() {
  const rutaExcel = process.argv[2];
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, MIRICE_PEPPER } = process.env;

  if (!rutaExcel) {
    console.error('Uso: node corregir_nombres_funcionarios.js <ruta_al_excel_de_personal.xlsx>');
    process.exit(1);
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !MIRICE_PEPPER) {
    console.error('Faltan variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_KEY, MIRICE_PEPPER');
    process.exit(1);
  }
  if (!fs.existsSync(rutaExcel)) {
    console.error('No se encontró el archivo:', rutaExcel);
    process.exit(1);
  }

  const wb = XLSX.readFile(rutaExcel);
  const filas = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '', range: 4 });

  let corregidos = 0;
  let sinMapeo = 0;
  let errores = 0;

  for (const [i, fila] of filas.entries()) {
    const nombreCrudo = fila['NOMBRE COMPLETO'];
    const rutCrudo = fila['__EMPTY_1'];
    const nombreCorregido = MAPEO_NOMBRES[nombreCrudo];

    if (!nombreCorregido) {
      console.warn('Fila ' + (i + 6) + ': sin entrada en el mapeo, se omite. Revísalo manualmente.');
      sinMapeo++;
      continue;
    }
    if (nombreCorregido === nombreCrudo) {
      // Ya estaba en el orden correcto (ej. "Lorena Mamani", "Nelda Sanchez") — nada que hacer.
      continue;
    }

    const rutHash = hashRut(rutCrudo, MIRICE_PEPPER);

    try {
      const r = await fetch(
        SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/personas?rut_hash=eq.' + rutHash,
        {
          method: 'PATCH',
          headers: {
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: 'Bearer ' + SUPABASE_SERVICE_KEY,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify({ nombre: nombreCorregido }),
        }
      );
      const datos = await r.json().catch(() => null);
      if (!r.ok) {
        console.error('Fila ' + (i + 6) + ': error HTTP ' + r.status + ' al actualizar.');
        errores++;
      } else if (!datos || datos.length === 0) {
        console.warn('Fila ' + (i + 6) + ': no se encontró ningún registro con ese RUT en Supabase (¿ya se había corregido, o el RUT cambió?).');
      } else {
        corregidos++;
      }
    } catch (e) {
      console.error('Fila ' + (i + 6) + ': error de red —', e.message);
      errores++;
    }
  }

  console.log('');
  console.log('Corrección terminada. Actualizados: ' + corregidos + ' — Sin mapeo: ' + sinMapeo + ' — Errores: ' + errores);
  console.log('BORRA el archivo Excel de este computador ahora que ya terminó.');
}

main();
