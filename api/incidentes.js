/**
 * MIRICE 2026 — BITÁCORA DE INCIDENTES (funcionario/docente)
 * Liceo de Huara • SLEP Tamarugal
 *
 * Qué reemplaza
 * -------------
 * El formulario de 6 secciones de `app.js` (rol funcionario) guardaba el
 * incidente en CUATRO lugares de `localStorage` del mismo dispositivo
 * (`mirice_bitacora`, `mirice_casos_convivencia`, `mirice_bitacoras_db`,
 * `mirice_mis_reportes_<rut>`) y nunca salía de ese navegador. Un profesor
 * registraba un incidente en su notebook y la Encargada de Convivencia,
 * en el suyo, nunca lo veía. Este endpoint lo guarda en Supabase, visible
 * para quien lo escribió (GET propio) y para el panel admin (GET ?todos=1).
 *
 * Contrato
 * --------
 *   POST /api/incidentes
 *   Authorization: Bearer <token>   (rol funcionario, con clave ya cambiada)
 *   {
 *     "fecha": "2026-07-29", "hora": "10:30", "lugar": "Patio central",
 *     "estamento": "Estudiante", "involucrados": [{nombre,detalle,tipo}],
 *     "roles_situacion": "...", "tipificacion": ["G-01", "..."],
 *     "descripcion": "...", "abordaje": ["..."],
 *     "requiere_derivacion": true, "derivacion_unidades": ["PIE", "..."]
 *   }
 *     201 { estado:"ok", folio }
 *     400 { error: "campos_incompletos" }
 *
 *   GET /api/incidentes            → solo los incidentes de quien pregunta
 *   GET /api/incidentes?todos=1    → todos (solo si panel_admin=true)
 *     200 { estado:"ok", incidentes: [...] }
 *
 * La gravedad y las alertas legales (TEA / abuso / drogas / embarazo) se
 * calculan aquí, no en el navegador — igual criterio que tenía `app.js`,
 * para no depender de que el cliente no lo manipule.
 */

const {
  verificarToken,
  tokenDe,
  db,
  excedeLimite,
  ipDe,
  cuerpoDe,
} = require('./_comun');

const DESCRIPCION_MAXIMA = 4000;

function calcularGravedad(tipificacion, textoAnalisis) {
  const t = tipificacion.map((x) => String(x).toLowerCase());
  const gravisima =
    tipificacion.some((x) => String(x).includes('GG-')) ||
    t.some((x) => /acoso|bullying|drogas|sustancia|sexual|lesiones|riña|armas/.test(x));
  const grave =
    tipificacion.some((x) => String(x).includes('G-')) ||
    t.some((x) => /insultos|burlas|daño|fuga|copiar/.test(x));
  if (gravisima) return 'gravisima';
  if (grave) return 'grave';
  return 'leve';
}

function calcularAlertaTipo(tipificacion, descripcion, abordaje) {
  const t = tipificacion.map((x) => String(x).toLowerCase());
  const texto = (String(descripcion) + ' ' + abordaje.join(' ')).toLowerCase();

  if (t.some((x) => /embarazo|maternidad|paternidad/.test(x)) || /embarazad|embarazo/.test(texto)) {
    return 'REM';
  }
  if (t.some((x) => /tea|desregulacion|autismo/.test(x)) || /\btea\b|autismo|asperger/.test(texto)) {
    return 'TEA';
  }
  if (t.some((x) => /sexual|connotacion|abuso/.test(x)) || /sexual|abuso|tocacion|\btoco\b/.test(texto)) {
    return 'SEX';
  }
  if (t.some((x) => /droga|sustancia|alcohol/.test(x)) || /droga|marihuana|alcohol|\bpito\b|pastilla/.test(texto)) {
    return 'DRG';
  }
  return 'NINGUNA';
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const sesion = verificarToken(tokenDe(req));
  if (!sesion) return res.status(401).json({ error: 'sesion_invalida' });
  if (sesion.rol !== 'funcionario') return res.status(403).json({ error: 'sin_permiso' });
  if (sesion.cam) {
    return res.status(403).json({
      error: 'cambio_requerido',
      texto: 'Cambia tu contraseña inicial antes de continuar.',
    });
  }

  if (req.method === 'GET') {
    if (excedeLimite('incidentes-get:' + ipDe(req), 60, 5 * 60 * 1000)) {
      return res.status(429).json({ error: 'demasiadas_solicitudes' });
    }

    const verTodos = req.query && (req.query.todos === '1' || req.query.todos === 'true');
    if (verTodos && !sesion.adm) {
      return res.status(403).json({ error: 'sin_permiso' });
    }

    const filtro = verTodos
      ? ''
      : '&autor_rut_hash=eq.' + encodeURIComponent(sesion.rh);

    try {
      const incidentes = await db(
        'incidentes?select=folio,autor_nombre,autor_cargo,fecha_incidente,hora_incidente,' +
          'lugar,estamento,involucrados,roles_situacion,tipificacion,descripcion,abordaje,' +
          'requiere_derivacion,derivacion_unidades,gravedad,alerta_tipo,estado,creado_en' +
          filtro + '&order=creado_en.desc&limit=200'
      );
      return res.status(200).json({ estado: 'ok', incidentes: incidentes || [] });
    } catch (e) {
      console.error('[incidentes] no se pudo leer:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }
  }

  if (req.method === 'POST') {
    if (excedeLimite('incidentes-post:' + ipDe(req), 20, 10 * 60 * 1000)) {
      return res.status(429).json({ error: 'demasiadas_solicitudes' });
    }

    const cuerpo = cuerpoDe(req);
    if (!cuerpo) return res.status(400).json({ error: 'json_invalido' });

    const fecha = String(cuerpo.fecha || '').trim();
    const lugar = String(cuerpo.lugar || '').trim();
    const descripcion = String(cuerpo.descripcion || '').trim();
    const estamento = String(cuerpo.estamento || '').trim();

    if (!fecha || !lugar || !descripcion || !estamento) {
      return res.status(400).json({
        error: 'campos_incompletos',
        texto: 'Completa Estamento, Fecha, Lugar y Relato de los Hechos.',
      });
    }

    const involucrados = Array.isArray(cuerpo.involucrados)
      ? cuerpo.involucrados
          .slice(0, 30)
          .map((p) => ({
            nombre: String((p && p.nombre) || '').slice(0, 200),
            detalle: String((p && p.detalle) || '').slice(0, 100),
            tipo: String((p && p.tipo) || '').slice(0, 30),
          }))
      : [];

    const tipificacion = Array.isArray(cuerpo.tipificacion)
      ? cuerpo.tipificacion.slice(0, 30).map((x) => String(x).slice(0, 80))
      : [];
    const abordaje = Array.isArray(cuerpo.abordaje)
      ? cuerpo.abordaje.slice(0, 30).map((x) => String(x).slice(0, 200))
      : [];
    const derivacionUnidades = Array.isArray(cuerpo.derivacion_unidades)
      ? cuerpo.derivacion_unidades.slice(0, 20).map((x) => String(x).slice(0, 80))
      : [];

    const gravedad = calcularGravedad(tipificacion, descripcion);
    const alertaTipo = calcularAlertaTipo(tipificacion, descripcion, abordaje);

    // El nombre y cargo se leen de la base con la sesión de quien registra,
    // no de lo que el cliente declare en el cuerpo de la petición — evita
    // que alguien se identifique como otra persona y cierra, de paso, un
    // punto de entrada de HTML sin validar (encontrado y corregido el
    // 29-jul-2026 junto con el escape en admin.js).
    let autor;
    try {
      const filasAutor = await db(
        'personas?rut_hash=eq.' + encodeURIComponent(sesion.rh) + '&select=nombre,cargo&limit=1'
      );
      autor = Array.isArray(filasAutor) && filasAutor[0] ? filasAutor[0] : null;
    } catch (e) {
      console.error('[incidentes] no se pudo leer el perfil del autor:', e.codigo || e.message);
      return res.status(503).json({ error: 'servicio_no_disponible' });
    }
    if (!autor) return res.status(401).json({ error: 'sesion_invalida' });

    const nuevo = {
      autor_rut_hash: sesion.rh,
      autor_nombre: autor.nombre || 'Funcionario/a',
      autor_cargo: autor.cargo || null,
      fecha_incidente: fecha,
      hora_incidente: String(cuerpo.hora || '').slice(0, 10) || null,
      lugar,
      estamento,
      involucrados,
      roles_situacion: String(cuerpo.roles_situacion || '').slice(0, 500) || null,
      tipificacion,
      descripcion: descripcion.slice(0, DESCRIPCION_MAXIMA),
      abordaje,
      requiere_derivacion: cuerpo.requiere_derivacion === true || cuerpo.requiere_derivacion === 'si',
      derivacion_unidades: derivacionUnidades,
      gravedad,
      alerta_tipo: alertaTipo,
      estado: 'en_seguimiento',
    };

    try {
      const filas = await db('incidentes', { method: 'POST', body: nuevo });
      const guardado = Array.isArray(filas) && filas[0] ? filas[0] : null;
      if (!guardado) throw new Error('sin_confirmacion');
      return res.status(201).json({ estado: 'ok', folio: guardado.folio });
    } catch (e) {
      console.error('[incidentes] NO SE GUARDÓ:', e.codigo || e.message);
      return res.status(503).json({
        error: 'no_registrado',
        texto: 'No se pudo registrar el incidente. Avisa directamente a Convivencia Educativa mientras se soluciona.',
      });
    }
  }

  return res.status(405).json({ error: 'metodo_no_permitido' });
};
