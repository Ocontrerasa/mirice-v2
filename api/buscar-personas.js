/**
 * MIRICE 2026 — BÚSQUEDA DE PERSONAS (autocompletado)
 * Liceo de Huara • SLEP Tamarugal
 *
 * Qué reemplaza
 * -------------
 * El formulario de incidentes de `app.js` (rol funcionario) buscaba
 * coincidencias de nombre directamente en `estudiantesData` /
 * `funcionariosData`, cargados enteros en el navegador desde
 * `src/data/liceo_db.js`. Al sacar ese archivo del cliente (28-jul-2026),
 * esa búsqueda se quedó sin datos. Este endpoint busca en el servidor y
 * devuelve solo las coincidencias (máximo 15), nunca la base completa.
 *
 * Contrato
 * --------
 *   GET /api/buscar-personas?q=texto
 *   Authorization: Bearer <token>   (rol funcionario, con clave ya cambiada)
 *
 *   200 { estado:"ok", resultados: [ {id, nombre, curso, cargo, rol} ] }
 *   400 { error: "consulta_corta" }
 *   401 { error: "sesion_invalida" }
 *   403 { error: "sin_permiso" | "cambio_requerido" }
 *
 * El `id` que se devuelve es el id interno de la tabla (uuid), nunca el RUT
 * ni su hash — solo sirve para que el formulario recuerde a quién
 * seleccionó dentro de esa misma sesión.
 */

const { verificarToken, tokenDe, db, excedeLimite, ipDe } = require('./_comun');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'metodo_no_permitido' });
  }

  if (excedeLimite('buscar-personas:' + ipDe(req), 40, 5 * 60 * 1000)) {
    return res.status(429).json({ error: 'demasiadas_solicitudes' });
  }

  const sesion = verificarToken(tokenDe(req));
  if (!sesion) return res.status(401).json({ error: 'sesion_invalida' });
  if (sesion.rol !== 'funcionario') return res.status(403).json({ error: 'sin_permiso' });
  if (sesion.cam) {
    return res.status(403).json({
      error: 'cambio_requerido',
      texto: 'Cambia tu contraseña inicial antes de continuar.',
    });
  }

  const q = String((req.query && req.query.q) || '').trim().slice(0, 60);
  if (q.length < 2) return res.status(400).json({ error: 'consulta_corta' });

  // Escapar % y , que rompen la sintaxis de filtros de PostgREST.
  const seguro = q.replace(/[%,]/g, '');

  try {
    const filas = await db(
      'personas?or=(nombre.ilike.*' + encodeURIComponent(seguro) +
        '*,curso.ilike.*' + encodeURIComponent(seguro) +
        '*,cargo.ilike.*' + encodeURIComponent(seguro) +
        '*)&select=id,nombre,curso,cargo,rol&activo=eq.true&limit=15'
    );
    const resultados = (filas || []).map((p) => ({
      id: p.id,
      nombre: p.nombre,
      curso: p.curso || '',
      cargo: p.cargo || '',
      rol: p.rol,
    }));
    return res.status(200).json({ estado: 'ok', resultados });
  } catch (e) {
    console.error('[buscar-personas] error:', e.codigo || e.message);
    return res.status(503).json({ error: 'servicio_no_disponible' });
  }
};
