/**
 * MIRICE 2026 — REINICIO DE CLAVE POR UN ADMINISTRADOR
 * Liceo de Huara • SLEP Tamarugal
 *
 * Por qué existe
 * ---------------
 * El 01-ago-2026 un administrador quedó bloqueado tras un cambio de clave
 * que luego una migración reseteó sin querer. Cualquier funcionario con
 * panel_admin puede reiniciar la clave de una persona directamente desde el
 * panel, sin tocar código.
 *
 * Regla nueva de clave por defecto (ago-2026)
 * -------------------------------------------
 * La clave reiniciada queda como los PRIMEROS 4 caracteres del RUT/documento
 * normalizado (antes eran los últimos 4). Ej: 12.345.678-9 → "1234".
 * Misma fórmula que usa scripts/resetear_claves_todos.js en el reinicio
 * masivo, para que la regla sea una sola en todo el sistema.
 *
 * Por qué se pide el RUT y no solo el nombre
 * -------------------------------------------
 * El servidor NUNCA guarda el RUT de nadie, solo su hash irreversible
 * (rut_hash). Quien reinicia la clave debe volver a escribir el RUT de la
 * persona para poder calcular el hash y encontrar su registro.
 *
 * Contrato
 * --------
 *   POST /api/resetear-clave-admin
 *   Authorization: Bearer <token>   (debe tener panel_admin=true y clave ya cambiada)
 *   { "rut": "12345678-9" }
 *
 *     200 { estado:"ok", clave_nueva:"1234", nombre:"...", rol:"..." }
 *     400 { error: "rut_invalido" }
 *     401 { error: "sesion_invalida" }
 *     403 { error: "sin_permiso" | "cambio_requerido" }
 *     404 { error: "persona_no_encontrada" }
 *     429 { error: "demasiadas_solicitudes" }
 */

const {
  normalizarRut,
  rutValido,
  hashRut,
  hashClave,
  verificarToken,
  tokenDe,
  db,
  excedeLimite,
  ipDe,
  cuerpoDe,
} = require('./_comun');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'metodo_no_permitido' });
  }

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
    console.error('[resetear-clave-admin] error', e.codigo || e.message);
    return res.status(503).json({ error: 'servicio_no_disponible' });
  }
};
