/**
 * MIRICE 2026 — SUSCRIPCIÓN A NOTIFICACIONES PUSH
 * Liceo de Huara • SLEP Tamarugal
 *
 * Guarda la suscripción Web Push del navegador (endpoint + llaves p256dh/auth)
 * de la persona logueada, para poder avisarle por push aunque la app esté
 * cerrada — a diferencia de `daily_notifications.js`, que solo puede mostrar
 * una notificación mientras la pestaña está abierta o recién estuvo activa.
 *
 * Contrato
 * --------
 *   POST /api/push-suscribir
 *   Authorization: Bearer <token>
 *   { "endpoint": "...", "keys": { "p256dh": "...", "auth": "..." } }
 *     200 { estado:"ok" }
 *     400 { error:"suscripcion_invalida" }
 *
 *   DELETE /api/push-suscribir   { "endpoint": "..." }
 *     200 { estado:"ok" }
 */

const {
  verificarToken,
  tokenDe,
  db,
  excedeLimite,
  ipDe,
  cuerpoDe,
} = require('./_comun');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const sesion = verificarToken(tokenDe(req));
  if (!sesion) return res.status(401).json({ error: 'sesion_invalida' });

  if (excedeLimite('push-suscribir:' + ipDe(req), 20, 10 * 60 * 1000)) {
    return res.status(429).json({ error: 'demasiadas_solicitudes' });
  }

  const cuerpo = cuerpoDe(req);
  if (!cuerpo) return res.status(400).json({ error: 'json_invalido' });

  if (req.method === 'POST') {
    const endpoint = String(cuerpo.endpoint || '').slice(0, 600);
    const p256dh = String((cuerpo.keys && cuerpo.keys.p256dh) || '');
    const auth = String((cuerpo.keys && cuerpo.keys.auth) || '');

    if (!endpoint || !p256dh || !auth) {
      return res.status(400).json({ error: 'suscripcion_invalida' });
    }

    try {
      // upsert por endpoint: si ese mismo dispositivo ya estaba suscrito
      // (ej. el navegador rotó la suscripción), se actualiza en vez de
      // duplicar.
      await db('push_suscripciones?on_conflict=endpoint', {
        method: 'POST',
        prefer: 'resolution=merge-duplicates,return=minimal',
        body: {
          autor_rut_hash: sesion.rh,
          rol: sesion.rol,
          endpoint,
          p256dh,
          auth,
        },
      });
      return res.status(200).json({ estado: 'ok' });
    } catch (e) {
      console.error('[push-suscribir] no se pudo guardar:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }
  }

  if (req.method === 'DELETE') {
    const endpoint = String(cuerpo.endpoint || '');
    if (!endpoint) return res.status(400).json({ error: 'endpoint_requerido' });

    try {
      await db('push_suscripciones?endpoint=eq.' + encodeURIComponent(endpoint), {
        method: 'DELETE',
        prefer: 'return=minimal',
      });
      return res.status(200).json({ estado: 'ok' });
    } catch (e) {
      console.error('[push-suscribir] no se pudo borrar:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }
  }

  return res.status(405).json({ error: 'metodo_no_permitido' });
};
