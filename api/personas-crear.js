/**
 * MIRICE 2026 — CREAR PERSONA (alta manual, solo panel admin)
 * Liceo de Huara • SLEP Tamarugal
 *
 * Por qué existe
 * ---------------
 * Las cuentas de "Estudiante/Apoderado/Funcionario de Prueba" que vivían
 * hardcodeadas en app.js son 100% de vitrina: nunca pasan por /api/login, así
 * que nunca reciben un token real del servidor — cualquier función que
 * necesite sesión (encuesta, reportes, incidentes, push) les da 401 siempre,
 * por diseño, no por un error. Este endpoint da de alta una persona real en
 * la base de datos (con el mismo RUT que uno quiera, ej. una cuenta de
 * prueba) para poder probar el sistema de punta a punta de verdad.
 *
 * También sirve como alta manual de personas reales sin tener que tocar el
 * Excel/SQL directamente — panel admin, no expuesto a nadie más.
 *
 * Contrato
 * --------
 *   POST /api/personas-crear
 *   Authorization: Bearer <token de un panel_admin>
 *   {
 *     "rut": "11.111.111-2", "clave": "1112", "nombre": "Alumno Demo Pérez",
 *     "rol": "estudiante", "curso": "1er Año Medio A",
 *     "email"?, "telefono"?, "cargo"?, "departamento"?,
 *     "debe_cambiar_clave"?: false (por defecto),
 *     "panel_admin"?: false (por defecto)
 *   }
 *     201 { estado:"ok" }
 *     409 { error:"ya_existe", texto:"..." }  — ya hay alguien con ese RUT
 */

const {
  verificarToken,
  tokenDe,
  normalizarRut,
  rutValido,
  hashRut,
  hashClave,
  db,
  excedeLimite,
  ipDe,
  cuerpoDe,
} = require('./_comun');

const ROLES_VALIDOS = ['estudiante', 'apoderado', 'funcionario'];

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'metodo_no_permitido' });
  }

  const sesion = verificarToken(tokenDe(req));
  if (!sesion) return res.status(401).json({ error: 'sesion_invalida' });
  if (!sesion.adm) return res.status(403).json({ error: 'sin_permiso' });
  if (sesion.cam) {
    return res.status(403).json({
      error: 'cambio_requerido',
      texto: 'Cambia tu contraseña inicial antes de continuar.',
    });
  }

  if (excedeLimite('personas-crear:' + ipDe(req), 20, 10 * 60 * 1000)) {
    return res.status(429).json({ error: 'demasiadas_solicitudes' });
  }

  const cuerpo = cuerpoDe(req);
  if (!cuerpo) return res.status(400).json({ error: 'json_invalido' });

  const rutNormalizado = normalizarRut(String(cuerpo.rut || ''));
  const clave = String(cuerpo.clave || '');
  const nombre = String(cuerpo.nombre || '').trim().slice(0, 200);
  const rol = String(cuerpo.rol || '');

  if (!rutValido(rutNormalizado)) return res.status(400).json({ error: 'rut_invalido' });
  if (!clave || clave.length < 4) return res.status(400).json({ error: 'clave_muy_corta' });
  if (!nombre) return res.status(400).json({ error: 'nombre_requerido' });
  if (!ROLES_VALIDOS.includes(rol)) return res.status(400).json({ error: 'rol_invalido' });

  const rutHash = hashRut(rutNormalizado);

  let existente;
  try {
    existente = await db('personas?rut_hash=eq.' + encodeURIComponent(rutHash) + '&select=id&limit=1');
  } catch (e) {
    console.error('[personas-crear] no se pudo verificar existencia:', e.codigo || e.message);
    return res.status(503).json({ error: 'servicio_no_disponible' });
  }
  if (Array.isArray(existente) && existente.length > 0) {
    return res.status(409).json({
      error: 'ya_existe',
      texto: 'Ya existe una persona con ese RUT. Si es para cambiarle la clave, usa /api/resetear-clave-admin en vez de este endpoint.',
    });
  }

  const { sal, hash } = hashClave(clave);

  const fila = {
    rut_hash: rutHash,
    rol,
    nombre,
    curso: cuerpo.curso ? String(cuerpo.curso).slice(0, 120) : null,
    email: cuerpo.email ? String(cuerpo.email).slice(0, 200) : null,
    telefono: cuerpo.telefono ? String(cuerpo.telefono).slice(0, 40) : null,
    cargo: cuerpo.cargo ? String(cuerpo.cargo).slice(0, 200) : null,
    departamento: cuerpo.departamento ? String(cuerpo.departamento).slice(0, 200) : null,
    clave_hash: hash,
    clave_sal: sal,
    debe_cambiar_clave: cuerpo.debe_cambiar_clave === true,
    panel_admin: cuerpo.panel_admin === true,
    activo: true,
  };

  try {
    await db('personas', { method: 'POST', prefer: 'return=minimal', body: fila });
  } catch (e) {
    console.error('[personas-crear] no se pudo crear:', e.codigo || e.message);
    return res.status(503).json({ error: 'servicio_no_disponible' });
  }

  return res.status(201).json({ estado: 'ok' });
};
