/**
 * MIRICE 2026 — LOGIN POR RUT
 * Liceo de Huara • SLEP Tamarugal
 *
 * Qué reemplaza
 * -------------
 * Antes, app.js comparaba el RUT ingresado contra `estudiantesData` /
 * `apoderadosData` / `funcionariosData`, cargados enteros en el navegador
 * desde `src/data/liceo_db.js` — 481 estudiantes con RUT, teléfono y correo,
 * descargables por cualquiera sin iniciar sesión. Este endpoint verifica el
 * RUT y la clave en el servidor y solo devuelve al navegador el perfil de la
 * persona que efectivamente inició sesión, nunca la base completa.
 *
 * Contrato
 * --------
 *   POST /api/login
 *   { "rut": "12345678-9", "clave": "5678", "rol": "estudiante" }
 *
 *   200 { estado:"ok", token, debe_cambiar, perfil: {...} }
 *   400 { error: "json_invalido" | "rut_invalido" | "rol_invalido" }
 *   401 { error: "credenciales_invalidas" }
 *   403 { error: "cuenta_inactiva" }
 *   429 { error: "demasiados_intentos" }
 *   503 { error: "servicio_no_disponible" }
 *
 * La clave inicial de toda cuenta son los últimos 4 dígitos del RUT (igual
 * que en el diseño anterior). `debe_cambiar` viene en true hasta que la
 * persona la cambie por `/api/cambiar-clave` — mientras tanto no puede
 * enviar reportes (ver la verificación de `sesion.cam` en api/reporte.js).
 */

const {
  normalizarRut,
  rutValido,
  hashRut,
  claveCoincide,
  emitirToken,
  db,
  excedeLimite,
  ipDe,
  cuerpoDe,
} = require('./_comun');

const ROLES = ['estudiante', 'apoderado', 'funcionario'];

function perfilPublico(persona) {
  // Solo los campos que la interfaz necesita mostrar. Nunca el hash del RUT,
  // ni la clave, ni columnas internas.
  const base = {
    nombre: persona.nombre,
    email: persona.email || '',
    telefono: persona.telefono || '',
    estado: persona.estado || 'Regular',
  };
  if (persona.rol === 'estudiante') {
    base.curso = persona.curso || '';
    base.matricula = persona.matricula || '';
  } else if (persona.rol === 'funcionario') {
    base.cargo = persona.cargo || '';
    base.departamento = persona.departamento || '';
    base.registro_docente = persona.registro_docente || '';
  }
  return base;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'metodo_no_permitido' });
  }

  const ip = ipDe(req);
  // Por IP: frena escaneo masivo de RUT. Ver también el límite por cuenta más abajo.
  if (excedeLimite('login:ip:' + ip, 20, 10 * 60 * 1000)) {
    return res.status(429).json({
      error: 'demasiados_intentos',
      texto: 'Demasiados intentos desde este dispositivo. Espera unos minutos.',
    });
  }

  const cuerpo = cuerpoDe(req);
  if (!cuerpo) return res.status(400).json({ error: 'json_invalido' });

  const rol = String(cuerpo.rol || '').toLowerCase();
  if (!ROLES.includes(rol)) {
    return res.status(400).json({ error: 'rol_invalido' });
  }

  const rutBruto = String(cuerpo.rut || '');
  if (!rutValido(rutBruto)) {
    return res.status(400).json({ error: 'rut_invalido' });
  }

  const rutLimpio = normalizarRut(rutBruto);
  const clave = String(cuerpo.clave || '');

  // Por cuenta: frena el intento dirigido contra un RUT específico incluso
  // si viene repartido entre varias IP.
  let hash;
  try {
    hash = hashRut(rutLimpio);
  } catch (e) {
    console.error('[login] falta configuración de servidor:', e.message);
    return res.status(503).json({ error: 'servicio_no_disponible' });
  }

  if (excedeLimite('login:cuenta:' + hash, 8, 10 * 60 * 1000)) {
    return res.status(429).json({
      error: 'demasiados_intentos',
      texto: 'Demasiados intentos con este RUT. Espera unos minutos.',
    });
  }

  let filas;
  try {
    filas = await db(
      'personas?rut_hash=eq.' + encodeURIComponent(hash) + '&select=*&limit=1'
    );
  } catch (e) {
    console.error('[login] base no disponible:', e.codigo || e.message);
    return res.status(503).json({ error: 'servicio_no_disponible' });
  }

  const persona = Array.isArray(filas) && filas[0] ? filas[0] : null;

  // Mensaje idéntico exista o no la cuenta, o esté mal la clave: no hay que
  // confirmarle a quien pregunta si un RUT específico está en la base.
  const credencialesInvalidas = () =>
    res.status(401).json({
      error: 'credenciales_invalidas',
      texto: 'RUT o contraseña incorrectos.',
    });

  if (!persona || persona.rol !== rol) {
    return credencialesInvalidas();
  }
  if (!persona.activo) {
    return res.status(403).json({
      error: 'cuenta_inactiva',
      texto: 'Esta cuenta no está activa. Consulta con Convivencia Educativa.',
    });
  }
  if (!claveCoincide(clave, persona.clave_sal, persona.clave_hash)) {
    return credencialesInvalidas();
  }

  const token = emitirToken({
    rut_hash: hash,
    rol: persona.rol,
    panel_admin: !!persona.panel_admin,
    debe_cambiar: !!persona.debe_cambiar_clave,
  });

  const perfil = perfilPublico(persona);

  // Apoderado: se agrega el nombre y curso del estudiante vinculado, sin
  // exponer su RUT ni el resto de su ficha.
  if (persona.rol === 'apoderado' && persona.vinculo_rut_hash) {
    try {
      const filasPupilo = await db(
        'personas?rut_hash=eq.' + encodeURIComponent(persona.vinculo_rut_hash) +
          '&select=nombre,curso&limit=1'
      );
      const pupilo = Array.isArray(filasPupilo) && filasPupilo[0] ? filasPupilo[0] : null;
      if (pupilo) {
        perfil.pupilo = pupilo.nombre + (pupilo.curso ? ' (' + pupilo.curso + ')' : '');
      }
    } catch (e) {
      // No bloquea el login si esto falla; solo no se muestra el dato.
      console.warn('[login] no se pudo leer el vínculo de apoderado');
    }
  }

  return res.status(200).json({
    estado: 'ok',
    token,
    debe_cambiar: !!persona.debe_cambiar_clave,
    panel_admin: !!persona.panel_admin,
    perfil,
  });
};
