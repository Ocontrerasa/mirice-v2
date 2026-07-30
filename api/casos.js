/**
 * MIRICE 2026 — CASOS PARA EL PANEL DE CONVIVENCIA
 * Liceo de Huara • SLEP Tamarugal
 *
 * Qué reemplaza
 * -------------
 * `admin.html` leía los "casos" desde `localStorage` del propio dispositivo
 * (datos de demostración) — nunca estuvo conectado a los reportes reales que
 * llegan por `api/reporte.js`. Este endpoint lee los reportes de verdad desde
 * Supabase, solo para quien tiene sesión de funcionario con `panel_admin`.
 *
 * Contrato
 * --------
 *   GET /api/casos
 *   Authorization: Bearer <token>   (debe tener panel_admin=true y clave ya cambiada)
 *     200 { estado:"ok", casos: [ {folio, categoria, relato, prioridad, estado, creado_en, ...} ] }
 *     401 { error: "sesion_invalida" }
 *     403 { error: "sin_permiso" | "cambio_requerido" }
 *
 *   PATCH /api/casos  { folio, estado: "en_proceso" | "cerrado" }
 *     200 { estado:"ok" }
 *     400 { error: "estado_invalido" | "folio_requerido" }
 */

const {
  verificarToken,
  tokenDe,
  db,
  excedeLimite,
  ipDe,
  cuerpoDe,
} = require('./_comun');

const ESTADOS_VALIDOS = ['recibido', 'en_proceso', 'cerrado'];

function exigirSesionAdmin(req, res) {
  const sesion = verificarToken(tokenDe(req));
  if (!sesion) {
    res.status(401).json({ error: 'sesion_invalida' });
    return null;
  }
  if (!sesion.adm) {
    res.status(403).json({ error: 'sin_permiso' });
    return null;
  }
  if (sesion.cam) {
    res.status(403).json({
      error: 'cambio_requerido',
      texto: 'Cambia tu contraseña inicial antes de entrar al panel.',
    });
    return null;
  }
  return sesion;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (excedeLimite('casos:' + ipDe(req), 60, 5 * 60 * 1000)) {
    return res.status(429).json({ error: 'demasiadas_solicitudes' });
  }

  if (req.method === 'GET') {
    const sesion = exigirSesionAdmin(req, res);
    if (!sesion) return;

    try {
      const casos = await db(
        'reportes?select=folio,categoria,relato,rol_autor,curso_autor,contacto,' +
          'prioridad,motivo_urgencia,estado,creado_en&order=creado_en.desc&limit=200'
      );
      return res.status(200).json({ estado: 'ok', casos: casos || [] });
    } catch (e) {
      console.error('[casos] no se pudo leer:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }
  }

  if (req.method === 'PATCH') {
    const sesion = exigirSesionAdmin(req, res);
    if (!sesion) return;

    const cuerpo = cuerpoDe(req);
    if (!cuerpo) return res.status(400).json({ error: 'json_invalido' });

    const folio = String(cuerpo.folio || '').trim();
    const nuevoEstado = String(cuerpo.estado || '');

    if (!folio) return res.status(400).json({ error: 'folio_requerido' });
    if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
      return res.status(400).json({ error: 'estado_invalido' });
    }

    try {
      await db('reportes?folio=eq.' + encodeURIComponent(folio), {
        method: 'PATCH',
        prefer: 'return=minimal',
        body: { estado: nuevoEstado },
      });
      return res.status(200).json({ estado: 'ok' });
    } catch (e) {
      console.error('[casos] no se pudo actualizar:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }
  }

  return res.status(405).json({ error: 'metodo_no_permitido' });
};
