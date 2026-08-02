/**
 * MIRICE 2026 — ENCUESTA ANÓNIMA DE CLIMA ESCOLAR (usuario final)
 * Liceo de Huara • SLEP Tamarugal
 *
 * Qué reemplaza
 * -------------
 * `climate_survey.js` tenía el banco de preguntas fijo en el código y
 * guardaba las respuestas en `localStorage` — nunca salían del navegador de
 * quien respondía, y el "ya respondiste" solo se recordaba en ese mismo
 * dispositivo (alguien podía responder de nuevo desde otro celular, o
 * borrando datos del navegador). Este endpoint guarda las preguntas y
 * respuestas de verdad en Supabase.
 *
 * Cómo se preserva el anonimato
 * ------------------------------
 * La respuesta (`encuesta_respuestas`) NUNCA lleva el hash del RUT de quien
 * contestó — no hay columna para eso. El control de "ya respondiste esta
 * semana" vive en una tabla aparte (`encuesta_marcas`) que solo guarda que
 * ese hash respondió ese periodo, nunca qué contestó. Ni con acceso total a
 * la base de datos se puede reconstruir qué opinó una persona específica.
 *
 * Contrato
 * --------
 *   GET /api/encuesta
 *   Authorization: Bearer <token>
 *     200 { estado:"ok", periodo, ya_respondio:true, texto }
 *     200 { estado:"ok", periodo, ya_respondio:false, preguntas:[{id,texto,opciones}] }
 *
 *   POST /api/encuesta
 *   Authorization: Bearer <token>
 *   { "respuestas": [ { "pregunta_id":"...", "opcion_texto":"..." }, ... ] }
 *     201 { estado:"ok" }
 *     400 { error:"respuestas_invalidas" }
 *     409 { error:"ya_respondida" }
 */

const {
  verificarToken,
  tokenDe,
  db,
  excedeLimite,
  ipDe,
  cuerpoDe,
  periodoActual,
} = require('./_comun');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const sesion = verificarToken(tokenDe(req));
  if (!sesion) return res.status(401).json({ error: 'sesion_invalida' });
  if (sesion.cam) {
    return res.status(403).json({
      error: 'cambio_requerido',
      texto: 'Cambia tu contraseña inicial antes de continuar.',
    });
  }

  const periodo = periodoActual();

  if (req.method === 'GET') {
    if (excedeLimite('encuesta-get:' + ipDe(req), 60, 5 * 60 * 1000)) {
      return res.status(429).json({ error: 'demasiadas_solicitudes' });
    }

    let marca;
    try {
      marca = await db(
        'encuesta_marcas?autor_rut_hash=eq.' + encodeURIComponent(sesion.rh) +
          '&periodo=eq.' + encodeURIComponent(periodo) + '&select=periodo&limit=1'
      );
    } catch (e) {
      console.error('[encuesta] no se pudo leer marca:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }

    if (Array.isArray(marca) && marca.length > 0) {
      return res.status(200).json({
        estado: 'ok',
        periodo,
        ya_respondio: true,
        texto: 'Tu opinión anónima ya fue incorporada a las estadísticas institucionales. La próxima semana se abrirá una nueva consulta de bienestar.',
      });
    }

    let preguntas;
    try {
      preguntas = await db(
        'encuesta_preguntas?perfil=eq.' + encodeURIComponent(sesion.rol) +
          '&activa=eq.true&select=id,texto,opciones&order=orden.asc'
      );
    } catch (e) {
      console.error('[encuesta] no se pudo leer preguntas:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }

    return res.status(200).json({
      estado: 'ok',
      periodo,
      ya_respondio: false,
      preguntas: preguntas || [],
    });
  }

  if (req.method === 'POST') {
    if (excedeLimite('encuesta-post:' + ipDe(req), 10, 10 * 60 * 1000)) {
      return res.status(429).json({ error: 'demasiadas_solicitudes' });
    }

    const cuerpo = cuerpoDe(req);
    if (!cuerpo) return res.status(400).json({ error: 'json_invalido' });

    const respuestas = Array.isArray(cuerpo.respuestas) ? cuerpo.respuestas.slice(0, 20) : [];
    if (respuestas.length === 0) {
      return res.status(400).json({ error: 'respuestas_invalidas' });
    }

    // Confirmar que las preguntas enviadas son de verdad de este perfil y
    // están activas — nunca confiar en lo que declare el cliente.
    let preguntasValidas;
    try {
      preguntasValidas = await db(
        'encuesta_preguntas?perfil=eq.' + encodeURIComponent(sesion.rol) +
          '&activa=eq.true&select=id,opciones'
      );
    } catch (e) {
      console.error('[encuesta] no se pudo validar preguntas:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }

    const porId = new Map((preguntasValidas || []).map((p) => [p.id, p]));
    const filas = [];
    for (const r of respuestas) {
      const preguntaId = String((r && r.pregunta_id) || '');
      const opcionTexto = String((r && r.opcion_texto) || '');
      const pregunta = porId.get(preguntaId);
      if (!pregunta) continue; // pregunta inexistente/inactiva/de otro perfil: se ignora
      if (!Array.isArray(pregunta.opciones) || !pregunta.opciones.includes(opcionTexto)) continue;
      filas.push({
        pregunta_id: preguntaId,
        perfil: sesion.rol,
        periodo,
        opcion_texto: opcionTexto,
      });
    }

    if (filas.length === 0) {
      return res.status(400).json({ error: 'respuestas_invalidas' });
    }

    // Intentar crear la marca ANTES de guardar las respuestas: la clave
    // primaria (autor_rut_hash, periodo) hace que un segundo intento
    // simultáneo choque acá y nunca llegue a insertar respuestas duplicadas.
    try {
      await db('encuesta_marcas', {
        method: 'POST',
        prefer: 'return=minimal',
        body: { autor_rut_hash: sesion.rh, periodo },
      });
    } catch (e) {
      if (e.estado === 409 || (e.detalle && /duplicate key/i.test(e.detalle))) {
        return res.status(409).json({ error: 'ya_respondida' });
      }
      console.error('[encuesta] no se pudo marcar:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }

    try {
      await db('encuesta_respuestas', {
        method: 'POST',
        prefer: 'return=minimal',
        body: filas,
      });
    } catch (e) {
      // La marca ya quedó registrada aunque esto falle: es preferible que la
      // persona no pueda reintentar infinitas veces a duplicar respuestas.
      console.error('[encuesta] NO SE GUARDARON las respuestas (marca ya creada):', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }

    return res.status(201).json({ estado: 'ok' });
  }

  return res.status(405).json({ error: 'metodo_no_permitido' });
};
