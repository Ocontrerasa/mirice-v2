/**
 * MIRICE 2026 — REINICIO DE CLAVE DE UNA SOLA PERSONA (SIN EXCEL)
 * Liceo de Huara • SLEP Tamarugal
 *
 * Para cuando alguien queda bloqueado y ya no tienes o no quieres volver a
 * abrir los Excel completos. Solo pide el RUT de esa persona.
 *
 * La clave nueva queda como los primeros 4 caracteres de ese RUT, y se le
 * pedirá elegir una clave propia en su próximo ingreso.
 *
 * Uso:
 *   node scripts/resetear_clave_individual.js "12345678-9"
 */

const crypto = require('crypto');

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
  const derivada = crypto.scryptSync(String(clave).normalize('NFKC'), sal, 32, { N: 16384 });
  return { sal: sal.toString('hex'), hash: derivada.toString('hex') };
}

async function main() {
  const rutBruto = process.argv[2];
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, MIRICE_PEPPER } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !MIRICE_PEPPER) {
    console.error('Faltan variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_KEY, MIRICE_PEPPER');
    process.exit(1);
  }
  if (!rutBruto || !rutValido(rutBruto)) {
    console.error('Uso: node resetear_clave_individual.js "12345678-9"  (RUT invalido o faltante)');
    process.exit(1);
  }

  const rutLimpio = normalizarRut(rutBruto);
  const claveNueva = rutLimpio.slice(0, 4);
  const rutHash = hashRut(rutLimpio, MIRICE_PEPPER);
  const { sal, hash } = hashClave(claveNueva);

  const r = await fetch(SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/personas?rut_hash=eq.' + rutHash, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: 'Bearer ' + SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ clave_sal: sal, clave_hash: hash, debe_cambiar_clave: true }),
  });

  const datos = await r.json().catch(() => null);
  if (!r.ok) {
    console.error('Error HTTP ' + r.status + ' al actualizar.');
    process.exit(1);
  }
  if (!datos || datos.length === 0) {
    console.error('No se encontró ninguna persona con ese RUT en Supabase.');
    process.exit(1);
  }

  console.log('Listo. Clave reiniciada para: ' + (datos[0].nombre || '(sin nombre)'));
  console.log('La clave nueva es: ' + claveNueva);
  console.log('Se le pedirá elegir una clave propia en su próximo ingreso.');
}

main();
