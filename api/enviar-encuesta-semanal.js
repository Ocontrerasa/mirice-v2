/**
 * MIRICE 2026 — AVISO PUSH SEMANAL DE LA ENCUESTA DE CLIMA
 * Liceo de Huara • SLEP Tamarugal
 *
 * Este endpoint NO lo llama ningún navegador — lo dispara Vercel Cron según
 * el horario definido en vercel.json ("crons"). Manda una notificación push
 * real (llega aunque el celular tenga la app cerrada) a quienes se hayan
 * suscrito, avisando que hay una nueva encuesta de bienestar esa semana.
 *
 * Seguridad
 * ---------
 * Protegido con CRON_SECRET: Vercel manda automáticamente
 * `Authorization: Bearer <CRON_SECRET>` en cada invocación programada si esa
 * variable de entorno existe en el proyecto — sin ella, cualquiera que
 * adivinara esta URL podría disparar el envío. Ver vercel.json para el
 * horario configurado.
 *
 * Variables de entorno que necesita (además de las ya existentes):
 *   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY   — par de llaves del Web Push,
 *                                            generadas una sola vez, fijas.
 *   VAPID_SUBJECT                          — "mailto:alguien@dominio.cl"
 *                                            (contacto del remitente, lo
 *                                            exige el estándar).
 *   CRON_SECRET                            — cadena aleatoria, la misma que
 *                                            configuras en Vercel Cron.
 *
 * A quién le llega
 * -----------------
 * Por defecto, a las suscripciones con rol=estudiante (lo pedido). Se puede
 * probar manualmente con otros roles agregando ?rol=funcionario a la URL,
 * siempre con el mismo CRON_SECRET.
 */

const webPush = require('web-push');
const { db } = require('./_comun');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const secreto = process.env.CRON_SECRET;
  const auth = String((req.headers && req.headers.authorization) || '');
  if (!secreto || auth !== 'Bearer ' + secreto) {
    return res.status(401).json({ error: 'no_autorizado' });
  }

  const vapidPublic = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT;
  if (!vapidPublic || !vapidPrivate || !vapidSubject) {
    console.error('[enviar-encuesta-semanal] faltan variables VAPID_*');
    return res.status(503).json({ error: 'push_no_configurado' });
  }

  webPush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);

  const rol = (req.query && req.query.rol) || 'estudiante';

  let suscripciones;
  try {
    suscripciones = await db(
      'push_suscripciones?rol=eq.' + encodeURIComponent(rol) +
        '&select=id,endpoint,p256dh,auth'
    );
  } catch (e) {
    console.error('[enviar-encuesta-semanal] no se pudo leer suscripciones:', e.codigo || e.message);
    return res.status(503).json({ error: 'servicio_no_disponible' });
  }

  const payload = JSON.stringify({
    title: '📊 MiRice — Encuesta de bienestar',
    body: 'Ya está disponible el Termómetro de Clima Escolar de esta semana. Responde en menos de un minuto, es anónimo.',
    url: './index.html?abrir=encuesta',
  });

  let enviados = 0;
  let vencidas = 0;
  let fallidas = 0;

  for (const s of suscripciones || []) {
    const sub = {
      endpoint: s.endpoint,
      keys: { p256dh: s.p256dh, auth: s.auth },
    };
    try {
      await webPush.sendNotification(sub, payload);
      enviados++;
    } catch (e) {
      // 404/410: el navegador ya no reconoce esa suscripción (desinstaló la
      // app, borró datos, etc.) — se limpia para no seguir intentando.
      if (e.statusCode === 404 || e.statusCode === 410) {
        vencidas++;
        try {
          await db('push_suscripciones?id=eq.' + encodeURIComponent(s.id), {
            method: 'DELETE',
            prefer: 'return=minimal',
          });
        } catch (e2) {
          console.warn('[enviar-encuesta-semanal] no se pudo limpiar suscripción vencida', s.id);
        }
      } else {
        fallidas++;
        console.error('[enviar-encuesta-semanal] fallo enviando a', s.id, e.statusCode || e.message);
      }
    }
  }

  return res.status(200).json({
    estado: 'ok',
    rol,
    total: (suscripciones || []).length,
    enviados,
    vencidas_limpiadas: vencidas,
    fallidas,
  });
};
