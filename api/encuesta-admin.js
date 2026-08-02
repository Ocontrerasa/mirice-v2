/**
 * MIRICE 2026 — ADMINISTRACIÓN DE LA ENCUESTA DE CLIMA ESCOLAR
 * Liceo de Huara • SLEP Tamarugal
 *
 * Todo este endpoint requiere panel_admin=true y clave ya cambiada. Permite
 * gestionar el banco de preguntas (por perfil: estudiante/apoderado/
 * funcionario) y ver/exportar las respuestas ya acumuladas.
 *
 * Las respuestas que se listan acá NUNCA llevan el hash del RUT de quien
 * respondió — esa columna no existe en `encuesta_respuestas` (ver
 * api/encuesta.js) — así que exportarlas tal cual no rompe el anonimato.
 *
 * Contrato
 * --------
 *   GET /api/encuesta-admin                              → todas las preguntas (activas e inactivas)
 *   GET /api/encuesta-admin?respuestas=1&periodo=2026-S31 → respuestas crudas de ese periodo (o todas si se omite periodo)
 *
 *   POST /api/encuesta-admin
 *   { "perfil":"estudiante", "texto":"...", "opciones":["...","..."] }
 *     201 { estado:"ok", pregunta:{...} }
 *
 *   PATCH /api/encuesta-admin
 *   { "id":"...", "texto"?, "opciones"?, "activa"?, "orden"? }
 *     200 { estado:"ok" }
 *
 *   DELETE /api/encuesta-admin  { "id":"..." }
 *     200 { estado:"ok", accion:"eliminada" }
 *     200 { estado:"ok", accion:"desactivada", texto:"Ya tenía respuestas, se desactivó en vez de eliminarla." }
 */

const {
  verificarToken,
  tokenDe,
  db,
  excedeLimite,
  ipDe,
  cuerpoDe,
} = require('./_comun');

const PERFILES_VALIDOS = ['estudiante', 'apoderado', 'funcionario'];
const OPCIONES_MINIMO = 2;
const OPCIONES_MAXIMO = 6;

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

function opcionesValidas(opciones) {
  return (
    Array.isArray(opciones) &&
    opciones.length >= OPCIONES_MINIMO &&
    opciones.length <= OPCIONES_MAXIMO &&
    opciones.every((o) => typeof o === 'string' && o.trim().length > 0 && o.length <= 120)
  );
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (excedeLimite('encuesta-admin:' + ipDe(req), 60, 5 * 60 * 1000)) {
    return res.status(429).json({ error: 'demasiadas_solicitudes' });
  }

  const sesion = exigirSesionAdmin(req, res);
  if (!sesion) return;

  if (req.method === 'GET') {
    const verRespuestas = req.query && (req.query.respuestas === '1' || req.query.respuestas === 'true');

    if (verRespuestas) {
      const periodo = req.query && req.query.periodo ? String(req.query.periodo).slice(0, 20) : '';
      const filtroPeriodo = periodo ? '&periodo=eq.' + encodeURIComponent(periodo) : '';
      try {
        const respuestas = await db(
          'encuesta_respuestas?select=pregunta_id,perfil,periodo,opcion_texto,creado_en' +
            filtroPeriodo + '&order=creado_en.desc&limit=5000'
        );
        return res.status(200).json({ estado: 'ok', respuestas: respuestas || [] });
      } catch (e) {
        console.error('[encuesta-admin] no se pudo leer respuestas:', e.codigo || e.message);
        return res.status(503).json({ error: 'servicio_no_disponible' });
      }
    }

    try {
      const preguntas = await db(
        'encuesta_preguntas?select=id,perfil,texto,opciones,activa,orden,creado_en&order=perfil.asc,orden.asc'
      );
      return res.status(200).json({ estado: 'ok', preguntas: preguntas || [] });
    } catch (e) {
      console.error('[encuesta-admin] no se pudo leer preguntas:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }
  }

  if (req.method === 'POST') {
    const cuerpo = cuerpoDe(req);
    if (!cuerpo) return res.status(400).json({ error: 'json_invalido' });

    const perfil = String(cuerpo.perfil || '');
    const texto = String(cuerpo.texto || '').trim().slice(0, 300);
    const opciones = Array.isArray(cuerpo.opciones)
      ? cuerpo.opciones.map((o) => String(o).trim().slice(0, 120))
      : [];

    if (!PERFILES_VALIDOS.includes(perfil)) {
      return res.status(400).json({ error: 'perfil_invalido' });
    }
    if (!texto) return res.status(400).json({ error: 'texto_requerido' });
    if (!opcionesValidas(opciones)) {
      return res.status(400).json({
        error: 'opciones_invalidas',
        texto: `Cada pregunta necesita entre ${OPCIONES_MINIMO} y ${OPCIONES_MAXIMO} alternativas de texto.`,
      });
    }

    try {
      const filas = await db('encuesta_preguntas', {
        method: 'POST',
        body: { perfil, texto, opciones, orden: Number(cuerpo.orden) || 0 },
      });
      const nueva = Array.isArray(filas) && filas[0] ? filas[0] : null;
      return res.status(201).json({ estado: 'ok', pregunta: nueva });
    } catch (e) {
      console.error('[encuesta-admin] no se pudo crear:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }
  }

  if (req.method === 'PATCH') {
    const cuerpo = cuerpoDe(req);
    if (!cuerpo) return res.status(400).json({ error: 'json_invalido' });

    const id = String(cuerpo.id || '');
    if (!id) return res.status(400).json({ error: 'id_requerido' });

    const cambios = {};
    if (typeof cuerpo.texto === 'string') {
      const texto = cuerpo.texto.trim().slice(0, 300);
      if (!texto) return res.status(400).json({ error: 'texto_requerido' });
      cambios.texto = texto;
    }
    if (cuerpo.opciones !== undefined) {
      const opciones = Array.isArray(cuerpo.opciones)
        ? cuerpo.opciones.map((o) => String(o).trim().slice(0, 120))
        : [];
      if (!opcionesValidas(opciones)) {
        return res.status(400).json({
          error: 'opciones_invalidas',
          texto: `Cada pregunta necesita entre ${OPCIONES_MINIMO} y ${OPCIONES_MAXIMO} alternativas de texto.`,
        });
      }
      cambios.opciones = opciones;
    }
    if (typeof cuerpo.activa === 'boolean') cambios.activa = cuerpo.activa;
    if (cuerpo.orden !== undefined) cambios.orden = Number(cuerpo.orden) || 0;

    if (Object.keys(cambios).length === 0) {
      return res.status(400).json({ error: 'nada_que_cambiar' });
    }
    cambios.actualizado_en = new Date().toISOString();

    try {
      const filas = await db('encuesta_preguntas?id=eq.' + encodeURIComponent(id), {
        method: 'PATCH',
        body: cambios,
      });
      if (!Array.isArray(filas) || filas.length === 0) {
        return res.status(404).json({ error: 'pregunta_no_encontrada' });
      }
      return res.status(200).json({ estado: 'ok' });
    } catch (e) {
      console.error('[encuesta-admin] no se pudo editar:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }
  }

  if (req.method === 'DELETE') {
    const cuerpo = cuerpoDe(req);
    const id = String((cuerpo && cuerpo.id) || '');
    if (!id) return res.status(400).json({ error: 'id_requerido' });

    // Si ya tiene respuestas asociadas, no se borra (perdería el historial
    // de esa pregunta en las estadísticas ya exportadas) — se desactiva.
    let tieneRespuestas;
    try {
      tieneRespuestas = await db(
        'encuesta_respuestas?pregunta_id=eq.' + encodeURIComponent(id) + '&select=id&limit=1'
      );
    } catch (e) {
      console.error('[encuesta-admin] no se pudo verificar respuestas:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }

    if (Array.isArray(tieneRespuestas) && tieneRespuestas.length > 0) {
      try {
        const filas = await db('encuesta_preguntas?id=eq.' + encodeURIComponent(id), {
          method: 'PATCH',
          body: { activa: false, actualizado_en: new Date().toISOString() },
        });
        if (!Array.isArray(filas) || filas.length === 0) {
          return res.status(404).json({ error: 'pregunta_no_encontrada' });
        }
      } catch (e) {
        console.error('[encuesta-admin] no se pudo desactivar:', e.codigo || e.message);
        return res.status(503).json({ error: 'servicio_no_disponible' });
      }
      return res.status(200).json({
        estado: 'ok',
        accion: 'desactivada',
        texto: 'Esta pregunta ya tiene respuestas registradas, así que se desactivó en vez de eliminarse (para no perder el historial). Ya no se les mostrará a las personas.',
      });
    }

    try {
      const filas = await db('encuesta_preguntas?id=eq.' + encodeURIComponent(id), {
        method: 'DELETE',
      });
      if (!Array.isArray(filas) || filas.length === 0) {
        return res.status(404).json({ error: 'pregunta_no_encontrada' });
      }
    } catch (e) {
      console.error('[encuesta-admin] no se pudo eliminar:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }
    return res.status(200).json({ estado: 'ok', accion: 'eliminada' });
  }

  return res.status(405).json({ error: 'metodo_no_permitido' });
};
