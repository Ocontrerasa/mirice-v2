/**
 * MIRICE 2026 — RECEPCIÓN DE REPORTES DE CONVIVENCIA
 * Liceo de Huara • SLEP Tamarugal
 *
 * Qué reemplaza
 * -------------
 * `cloud_storage.js` decía en su encabezado que permitía al Coordinador de
 * Convivencia ver los reportes en tiempo real desde cualquier dispositivo.
 * Declaraba un endpoint y una clave, y no los usaba nunca: no había una sola
 * llamada de red en el archivo. `guardarEnNube()` escribía en localStorage y
 * luego imprimía en consola "respaldado exitosamente en la nube".
 *
 * El resultado concreto: un estudiante escribía que le pegaban, presionaba
 * enviar, veía la confirmación, y el reporte quedaba en su propio teléfono. El
 * Coordinador de Convivencia Educativa abría el panel y veía la lista vacía. Nadie se
 * enteraba, y el estudiante creía que ya había avisado, así que tampoco
 * hablaba con su profesor jefe. Un canal que no entrega es peor que no tener
 * canal, porque desactiva los otros.
 *
 * La regla que ordena este archivo
 * --------------------------------
 * NUNCA responder "recibido" si no se guardó. Si la base falla, la respuesta
 * es un 503 con el teléfono de Convivencia, y `cloud_storage.js` lo muestra
 * tal cual. Es peor noticia y es la verdad.
 *
 * Contrato
 * --------
 *   POST /api/reporte
 *   Authorization: Bearer <token>   (opcional: se puede reportar sin sesión)
 *   {
 *     "categoria": "acoso",
 *     "relato": "...",
 *     "identificarse": true,
 *     "contacto": "opcional, lo escribe la persona",
 *     "rol": "estudiante"           (solo se usa si no hay sesión)
 *   }
 *
 *   201 { estado: "recibido", folio, prioridad, aviso, texto }
 *   201 { estado: "recibido", folio, tipo: "crisis", motivo }
 *   400 { error: "relato_corto" | "categoria_invalida" | "json_invalido" }
 *   429 { error: "demasiados_reportes" }
 *   503 { error: "no_registrado", texto }   ← con el teléfono de Convivencia
 *
 * Privacidad del aviso al equipo
 * ------------------------------
 * El correo o mensaje que recibe Convivencia lleva folio, categoría, prioridad
 * y hora. No lleva el relato ni el nombre de nadie. Si ese aviso pasa por
 * Resend, por un webhook de Slack o por WhatsApp, el contenido del caso no
 * sale del liceo por esa vía: hay que entrar al panel para leerlo, y ese
 * ingreso queda en la bitácora.
 */

const {
  verificarToken,
  tokenDe,
  db,
  excedeLimite,
  ipDe,
  cuerpoDe,
  textoDerivacion,
  clasificarUrgencia,
} = require('./_comun');

const CATEGORIAS = [
  'acoso', 'violencia', 'discriminacion', 'ciberacoso', 'robo',
  'drogas', 'armas', 'maltrato_adulto', 'autolesion', 'vulneracion',
  'transporte', 'otro',
];

const RELATO_MINIMO = 15;
const RELATO_MAXIMO = 5000;

/**
 * Aviso al equipo. Nunca lanza: un problema avisando no puede convertirse en
 * un reporte perdido, porque el reporte ya está guardado en este punto.
 */
async function avisar(reporte) {
  const asunto =
    (reporte.prioridad === 'critica' ? '[URGENTE] ' : '') +
    'MiRice · reporte ' + reporte.folio + ' (' + reporte.categoria + ')';

  const cuerpo =
    'Entró un reporte nuevo en MiRice.\n\n' +
    'Folio: ' + reporte.folio + '\n' +
    'Categoría: ' + reporte.categoria + '\n' +
    'Prioridad: ' + reporte.prioridad + '\n' +
    'Rol de quien reporta: ' + reporte.rol_autor + '\n' +
    'Recibido: ' + new Date(reporte.creado_en).toLocaleString('es-CL') + '\n\n' +
    (reporte.prioridad === 'critica'
      ? 'Este reporte contiene señales de riesgo vital o de abuso. ' +
        'Corresponde activar el protocolo hoy, no dejarlo en la lista.\n\n'
      : '') +
    'El contenido no se envía por este medio. Entra al panel de Convivencia ' +
    'para leerlo.';

  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), 5000);

  try {
    if (process.env.RESEND_API_KEY && process.env.AVISO_CORREO_DESTINO) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        signal: control.signal,
        headers: {
          Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.AVISO_CORREO_REMITENTE || 'MiRice <onboarding@resend.dev>',
          to: String(process.env.AVISO_CORREO_DESTINO).split(',').map((s) => s.trim()),
          subject: asunto,
          text: cuerpo,
        }),
      });
      clearTimeout(reloj);
      return r.ok ? 'correo' : 'fallo_correo';
    }

    if (process.env.AVISO_WEBHOOK_URL) {
      const r = await fetch(process.env.AVISO_WEBHOOK_URL, {
        method: 'POST',
        signal: control.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: asunto + '\n\n' + cuerpo }),
      });
      clearTimeout(reloj);
      return r.ok ? 'webhook' : 'fallo_webhook';
    }

    clearTimeout(reloj);
    // No es un error del código: es que nadie configuró el destino todavía.
    console.warn('[reporte] sin canal de aviso configurado. Folio', reporte.folio);
    return 'sin_configurar';
  } catch (e) {
    clearTimeout(reloj);
    console.error('[reporte] el aviso no salió:', e.name);
    return 'fallo';
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'metodo_no_permitido' });
  }

  // Más holgado que en el chat: alguien asustado puede enviar dos veces.
  if (excedeLimite('reporte:' + ipDe(req), 6, 10 * 60 * 1000)) {
    return res.status(429).json({
      error: 'demasiados_reportes',
      texto:
        'Ya enviaste varios reportes seguidos. Si falta algo importante, ' +
        'acude directamente a Convivencia Educativa.',
    });
  }

  const cuerpo = cuerpoDe(req);
  if (!cuerpo) return res.status(400).json({ error: 'json_invalido' });

  const relato = String(cuerpo.relato || '').trim();
  const categoria = String(cuerpo.categoria || 'otro').toLowerCase();

  if (relato.length < RELATO_MINIMO) {
    return res.status(400).json({
      error: 'relato_corto',
      texto: 'Cuéntame un poco más para que el equipo pueda entender qué pasó.',
    });
  }
  if (!CATEGORIAS.includes(categoria)) {
    return res.status(400).json({ error: 'categoria_invalida' });
  }

  const sesion = verificarToken(tokenDe(req));

  // Con la clave inicial sin cambiar no se puede reportar: no hay certeza de
  // que quien escribe sea el dueño de la cuenta.
  if (sesion && sesion.cam) {
    return res.status(403).json({
      error: 'cambio_requerido',
      texto: 'Antes de continuar tienes que elegir tu clave nueva.',
    });
  }

  const rolAutor = sesion
    ? sesion.rol
    : ['estudiante', 'apoderado', 'funcionario'].includes(String(cuerpo.rol))
      ? String(cuerpo.rol)
      : 'estudiante';

  // La identificación es una decisión de la persona, no del sistema. Solo se
  // guarda si hay sesión Y la persona la aceptó explícitamente.
  const identificarse = cuerpo.identificarse === true && !!sesion;

  const urgencia = clasificarUrgencia(relato);

  const nuevo = {
    categoria,
    relato: relato.slice(0, RELATO_MAXIMO),
    rol_autor: rolAutor,
    curso_autor: identificarse ? (String(cuerpo.curso || '').slice(0, 20) || null) : null,
    autor_rut_hash: identificarse ? sesion.rh : null,
    contacto: String(cuerpo.contacto || '').slice(0, 200) || null,
    prioridad: urgencia.prioridad,
    motivo_urgencia: urgencia.motivo,
    estado: 'recibido',
  };

  let guardado;
  try {
    const filas = await db('reportes', { method: 'POST', body: nuevo });
    guardado = Array.isArray(filas) && filas.length ? filas[0] : null;
    if (!guardado) throw new Error('sin_confirmacion');
  } catch (e) {
    // Este es el caso que antes se ocultaba tras un "enviado" falso.
    console.error('[reporte] NO SE GUARDÓ:', e.codigo || e.message);
    return res.status(503).json({
      error: 'no_registrado',
      texto: textoDerivacion(),
    });
  }

  // Bitácora. No bloquea la respuesta si falla.
  try {
    await db('reporte_eventos', {
      method: 'POST',
      prefer: 'return=minimal',
      body: {
        reporte_id: guardado.id,
        tipo: 'creado',
        actor_rut_hash: nuevo.autor_rut_hash,
        detalle: identificarse ? 'identificado' : 'sin identificar',
      },
    });
  } catch (e) {
    console.error('[reporte] bitácora no registrada para', guardado.folio);
  }

  const aviso = await avisar(guardado);

  // Riesgo vital o abuso: la aplicación tiene que mostrar los teléfonos de
  // emergencia además del comprobante. El reporte ya quedó guardado y marcado
  // como crítico, pero un folio no es lo que necesita alguien en ese momento.
  if (urgencia.prioridad === 'critica') {
    return res.status(201).json({
      estado: 'recibido',
      folio: guardado.folio,
      prioridad: 'critica',
      tipo: 'crisis',
      motivo: urgencia.motivo,
      aviso,
    });
  }

  return res.status(201).json({
    estado: 'recibido',
    folio: guardado.folio,
    prioridad: guardado.prioridad,
    aviso,
    texto:
      'Tu reporte quedó registrado con el folio ' + guardado.folio + '. ' +
      'Lo va a revisar el equipo de Convivencia. Guarda el folio: sirve para ' +
      'preguntar por tu caso sin tener que contar todo de nuevo. ' +
      'Queda reservado dentro del equipo. Si se trata de algo donde el liceo ' +
      'tiene la obligación de avisar a tu familia o a la autoridad, se te va a ' +
      'explicar antes lo que va a ocurrir.',
  });
};
