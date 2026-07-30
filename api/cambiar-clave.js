/**
 * MIRICE 2026 — CAMBIO DE CLAVE
 * Liceo de Huara • SLEP Tamarugal
 *
 * Toda cuenta empieza con `debe_cambiar_clave = true` y una clave inicial
 * igual a los últimos 4 dígitos del RUT. Mientras esa marca siga en true,
 * `api/reporte.js` no permite enviar reportes con sesión (ver `sesion.cam`),
 * precisamente para obligar a pasar por este endpoint antes de usar el resto
 * de la plataforma con la clave por defecto.
 *
 * Contrato
 * --------
 *   POST /api/cambiar-clave
 *   Authorization: Bearer <token>
 *   { "clave_actual": "5678", "clave_nueva": "unaClaveMejor" }
 *
 *   200 { estado:"ok", token }              ← token nuevo, ya sin la marca
 *   400 { error: "clave_nueva_corta" | "clave_igual" | "json_invalido" }
 *   401 { error: "sesion_invalida" | "clave_actual_incorrecta" }
 *   429 { error: "demasiados_intentos" }
 *   503 { error: "servicio_no_disponible" }
 */

const {
  verificarToken,
  tokenDe,
  hashClave,
  claveCoincide,
  emitirToken,
  db,
  excedeLimite,
  ipDe,
  cuerpoDe,
} = require('./_comun');

const CLAVE_MINIMA = 6;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'metodo_no_permitido' });
  }

  if (excedeLimite('cambiar-clave:' + ipDe(req), 12, 10 * 60 * 1000)) {
    return res.status(429).json({ error: 'demasiados_intentos' });
  }

  const sesion = verificarToken(tokenDe(req));
  if (!sesion) {
    return res.status(401).json({ error: 'sesion_invalida' });
  }

  const cuerpo = cuerpoDe(req);
  if (!cuerpo) return res.status(400).json({ error: 'json_invalido' });

  const claveActual = String(cuerpo.clave_actual || '');
  const claveNueva = String(cuerpo.clave_nueva || '');

  if (claveNueva.length < CLAVE_MINIMA) {
    return res.status(400).json({
      error: 'clave_nueva_corta',
      texto: 'La contraseña nueva debe tener al menos ' + CLAVE_MINIMA + ' caracteres.',
    });
  }
  if (claveNueva === claveActual) {
    return res.status(400).json({
      error: 'clave_igual',
      texto: 'La contraseña nueva debe ser distinta de la actual.',
    });
  }

  let filas;
  try {
    filas = await db(
      'personas?rut_hash=eq.' + encodeURIComponent(sesion.rh) + '&select=*&limit=1'
    );
  } catch (e) {
    console.error('[cambiar-clave] base no disponible:', e.codigo || e.message);
    return res.status(503).json({ error: 'servicio_no_disponible' });
  }

  const persona = Array.isArray(filas) && filas[0] ? filas[0] : null;
  if (!persona || !claveCoincide(claveActual, persona.clave_sal, persona.clave_hash)) {
    return res.status(401).json({ error: 'clave_actual_incorrecta' });
  }

  const { sal, hash } = hashClave(claveNueva);

  try {
    await db('personas?rut_hash=eq.' + encodeURIComponent(sesion.rh), {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: {
        clave_sal: sal,
        clave_hash: hash,
        debe_cambiar_clave: false,
        actualizado_en: new Date().toISOString(),
      },
    });
  } catch (e) {
    console.error('[cambiar-clave] no se pudo actualizar:', e.codigo || e.message);
    return res.status(503).json({ error: 'servicio_no_disponible' });
  }

  const nuevoToken = emitirToken({
    rut_hash: sesion.rh,
    rol: sesion.rol,
    panel_admin: sesion.adm,
    debe_cambiar: false,
  });

  return res.status(200).json({ estado: 'ok', token: nuevoToken });
};
