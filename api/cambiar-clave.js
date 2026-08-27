/**
 * MIRICE 2026 — CAMBIO DE CLAVE (con opción de mantener la clave por defecto)
 * Liceo de Huara • SLEP Tamarugal
 *
 * Toda cuenta empieza con `debe_cambiar_clave = true` y una clave inicial
 * igual a los PRIMEROS 4 dígitos del RUT (regla nueva, ago-2026 — antes eran
 * los últimos 4). Mientras esa marca siga en true, los endpoints sensibles
 * (reportes, incidentes, encuesta, panel) no permiten operar.
 *
 * En el primer ingreso la persona ve dos caminos:
 *   A) Elegir una clave propia (recomendado) — modo clásico.
 *   B) Mantener la clave por defecto — decisión explícita del liceo
 *      (ago-2026): la persona demuestra que conoce su clave actual y la
 *      marca `debe_cambiar_clave` se apaga SIN cambiar el hash. Queda
 *      registrado en la bitácora del servidor (console) que eligió
 *      mantenerla. ADVERTENCIA documentada: los primeros 4 dígitos del RUT
 *      son adivinables entre compañeros de generación; quien mantiene la
 *      clave por defecto asume ese riesgo.
 *
 * Contrato
 * --------
 *   POST /api/cambiar-clave
 *   Authorization: Bearer <token>
 *
 *   Modo A (cambiar):
 *     { "clave_actual": "1234", "clave_nueva": "unaClaveMejor" }
 *   Modo B (mantener la clave por defecto):
 *     { "clave_actual": "1234", "mantener": true }
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
  const mantener = cuerpo.mantener === true;

  if (!mantener) {
    if (claveNueva.length < CLAVE_MINIMA) {
      return res.status(400).json({
        error: 'clave_nueva_corta',
        texto: 'La contraseña nueva debe tener al menos ' + CLAVE_MINIMA + ' caracteres.',
      });
    }
    if (claveNueva === claveActual) {
      return res.status(400).json({
        error: 'clave_igual',
        texto: 'La contraseña nueva debe ser distinta de la actual. Si quieres conservar la actual, usa el botón "Mantener mi clave por defecto".',
      });
    }
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
  // En ambos modos se exige demostrar que se conoce la clave actual: es la
  // única prueba de que quien está frente a la pantalla es el dueño de la
  // cuenta (especialmente importante en el modo "mantener").
  if (!persona || !claveCoincide(claveActual, persona.clave_sal, persona.clave_hash)) {
    return res.status(401).json({ error: 'clave_actual_incorrecta' });
  }

  const cambios = mantener
    ? {
        // No se toca el hash: la clave sigue siendo la por defecto. Solo se
        // apaga la marca para que la cuenta pueda operar con normalidad.
        debe_cambiar_clave: false,
        actualizado_en: new Date().toISOString(),
      }
    : (() => {
        const { sal, hash } = hashClave(claveNueva);
        return {
          clave_sal: sal,
          clave_hash: hash,
          debe_cambiar_clave: false,
          actualizado_en: new Date().toISOString(),
        };
      })();

  try {
    await db('personas?rut_hash=eq.' + encodeURIComponent(sesion.rh), {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: cambios,
    });
  } catch (e) {
    console.error('[cambiar-clave] no se pudo actualizar:', e.codigo || e.message);
    return res.status(503).json({ error: 'servicio_no_disponible' });
  }

  if (mantener) {
    // Sin datos personales: solo el hecho, para poder auditar cuántas
    // cuentas eligieron quedarse con la clave por defecto.
    console.log('[cambiar-clave] una cuenta (' + sesion.rol + ') eligió mantener su clave por defecto');
  }

  const nuevoToken = emitirToken({
    rut_hash: sesion.rh,
    rol: sesion.rol,
    panel_admin: sesion.adm,
    debe_cambiar: false,
  });

  return res.status(200).json({ estado: 'ok', token: nuevoToken, mantenida: mantener });
};
