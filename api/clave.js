/**
 * MIRICE 2026 — GESTIÓN DE CLAVES (endpoint unificado)
 * Liceo de Huara • SLEP Tamarugal
 *
 * Por qué este archivo une dos endpoints (31-ago-2026)
 * ----------------------------------------------------
 * El plan Hobby de Vercel permite máximo 12 funciones serverless y /api llegó
 * a 13: TODOS los deploys fallaron en silencio desde el 04-ago-2026 con
 * "No more than 12 Serverless Functions...", dejando producción congelada en
 * el commit del 03-ago mientras GitHub acumulaba un mes de cambios.
 *
 * Solución: cambiar-clave.js y resetear-clave-admin.js (misma familia, mismas
 * dependencias) viven ahora aquí. Dos "rewrites" en vercel.json mantienen las
 * URLs históricas, así que app.js y admin.js no cambiaron ni una línea:
 *   /api/cambiar-clave        → /api/clave?accion=cambiar
 *   /api/resetear-clave-admin → /api/clave?accion=resetear-admin
 *
 * OJO A FUTURO: quedamos en 12/12 funciones exactas. Antes de crear un
 * endpoint nuevo hay que fusionar otro par (candidato natural: encuesta.js +
 * encuesta-admin.js) o pasar a plan Pro.
 *
 * ============================================================
 * ACCIÓN "cambiar" — cambio de clave del propio usuario
 * ============================================================
 * Toda cuenta reiniciada parte con `debe_cambiar_clave = true` y clave
 * inicial = PRIMEROS 4 dígitos del RUT (regla ago-2026). En el primer
 * ingreso hay dos caminos:
 *   A) Elegir una clave propia (recomendado):
 *      { "clave_actual": "1234", "clave_nueva": "unaClaveMejor" }
 *   B) Mantener la clave por defecto (decisión explícita del liceo):
 *      { "clave_actual": "1234", "mantener": true }
 *      Demuestra que conoce su clave y se apaga la marca SIN cambiar el
 *      hash. Advertencia documentada: los primeros 4 dígitos del RUT son
 *      adivinables entre compañeros de generación.
 *   200 { estado:"ok", token }  ← token nuevo, sin la marca de cambio
 *
 * ============================================================
 * ACCIÓN "resetear-admin" — reinicio hecho por un panel_admin
 * ============================================================
 * La clave queda como los PRIMEROS 4 caracteres del RUT normalizado y
 * debe_cambiar_clave = true. Se pide el RUT porque el servidor solo guarda
 * su hash irreversible.
 *   { "rut": "12345678-9" } → 200 { estado:"ok", clave_nueva, nombre, rol }
 */

const {
  normalizarRut,
  rutValido,
  hashRut,
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

/* ------------------------------------------------------------------ */
/*  ACCIÓN: cambiar (o mantener) la clave propia                       */
/* ------------------------------------------------------------------ */
async function manejarCambio(req, res) {
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
    console.error('[clave/cambiar] base no disponible:', e.codigo || e.message);
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
    console.error('[clave/cambiar] no se pudo actualizar:', e.codigo || e.message);
    return res.status(503).json({ error: 'servicio_no_disponible' });
  }

  if (mantener) {
    // Sin datos personales: solo el hecho, para poder auditar cuántas
    // cuentas eligieron quedarse con la clave por defecto.
    console.log('[clave/cambiar] una cuenta (' + sesion.rol + ') eligió mantener su clave por defecto');
  }

  const nuevoToken = emitirToken({
    rut_hash: sesion.rh,
    rol: sesion.rol,
    panel_admin: sesion.adm,
    debe_cambiar: false,
  });

  return res.status(200).json({ estado: 'ok', token: nuevoToken, mantenida: mantener });
}

/* ------------------------------------------------------------------ */
/*  ACCIÓN: resetear-admin (reinicio hecho por un administrador)       */
/* ------------------------------------------------------------------ */
async function manejarReseteoAdmin(req, res) {
  if (excedeLimite('resetear-clave-admin:' + ipDe(req), 20, 5 * 60 * 1000)) {
    return res.status(429).json({ error: 'demasiadas_solicitudes' });
  }

  const sesion = verificarToken(tokenDe(req));
  if (!sesion) return res.status(401).json({ error: 'sesion_invalida' });
  if (!sesion.adm) return res.status(403).json({ error: 'sin_permiso' });
  if (sesion.cam) {
    return res.status(403).json({
      error: 'cambio_requerido',
      texto: 'Cambia tu contraseña inicial antes de usar esta función.',
    });
  }

  const cuerpo = cuerpoDe(req);
  const rutBruto = cuerpo && cuerpo.rut;
  if (!rutValido(rutBruto)) {
    return res.status(400).json({ error: 'rut_invalido' });
  }

  const rutLimpio = normalizarRut(rutBruto);
  // PRIMEROS 4 caracteres del documento normalizado. Para RUT chilenos son
  // siempre dígitos; para documentos extranjeros pueden incluir letras, que
  // quedan en MAYÚSCULA (tal como aparecen en el documento).
  const claveNueva = rutLimpio.slice(0, 4);
  const rutHash = hashRut(rutLimpio);
  const { sal, hash } = hashClave(claveNueva);

  try {
    const filas = await db('personas?rut_hash=eq.' + rutHash, {
      method: 'PATCH',
      body: { clave_sal: sal, clave_hash: hash, debe_cambiar_clave: true },
      prefer: 'return=representation',
    });

    if (!filas || filas.length === 0) {
      return res.status(404).json({ error: 'persona_no_encontrada' });
    }

    return res.status(200).json({
      estado: 'ok',
      clave_nueva: claveNueva,
      nombre: filas[0].nombre || null,
      rol: filas[0].rol || null,
    });
  } catch (e) {
    console.error('[clave/resetear-admin] error', e.codigo || e.message);
    return res.status(503).json({ error: 'servicio_no_disponible' });
  }
}

/* ------------------------------------------------------------------ */
/*  Enrutador por acción (viene del rewrite en vercel.json)            */
/* ------------------------------------------------------------------ */
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'metodo_no_permitido' });
  }

  let accion = '';
  try {
    accion = new URL(req.url, 'http://interno').searchParams.get('accion') || '';
  } catch (e) {
    accion = '';
  }

  if (accion === 'cambiar') return manejarCambio(req, res);
  if (accion === 'resetear-admin') return manejarReseteoAdmin(req, res);

  return res.status(400).json({
    error: 'accion_invalida',
    texto: 'Usa /api/cambiar-clave o /api/resetear-clave-admin (redirigen aquí automáticamente).',
  });
};
