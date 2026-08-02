/**
 * MIRICE 2026 — UTILIDADES COMPARTIDAS DEL SERVIDOR
 * Liceo de Huara • SLEP Tamarugal
 *
 * Vercel no publica como ruta los archivos de /api que empiezan con guion
 * bajo, así que este módulo es interno: nadie puede invocarlo desde internet.
 *
 * Sin dependencias, igual que api/chat.js
 * --------------------------------------
 * Todo lo que hay acá usa el módulo `crypto` que trae Node y `fetch`, que ya
 * es global. No hace falta package.json, ni npm install, ni que el despliegue
 * resuelva un árbol de dependencias. Es una decisión deliberada: en un
 * proyecto que va a mantener una persona a ratos, cada dependencia es una
 * actualización de seguridad que alguien tendrá que atender el año que viene.
 *
 * Variables de entorno que necesita (Vercel → Settings → Environment Variables)
 * ---------------------------------------------------------------------------
 *   SUPABASE_URL             https://xxxxx.supabase.co
 *   SUPABASE_SERVICE_KEY     la clave service_role, NUNCA la anon
 *   MIRICE_PEPPER            cadena aleatoria larga, fija. Ver nota abajo.
 *   MIRICE_SECRETO_SESION    otra cadena aleatoria larga, distinta
 *   (ya no se usa TELEFONO_CONVIVENCIA — no existe un teléfono central de
 *   Convivencia Educativa; el mensaje de error siempre deriva a acudir en
 *   persona, ver textoDerivacion() más abajo)
 *
 * Para generar las dos cadenas:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 *
 * ATENCIÓN CON MIRICE_PEPPER: si se cambia, todos los RUT dejan de calzar y
 * nadie puede iniciar sesión. No se rota sin volver a cargar la nómina.
 */

const crypto = require('crypto');

/* --------------------------------------------------------------
   1. RUT
   Se normaliza antes de cualquier cosa: la gente lo escribe con
   puntos, con guion, sin guion, con la k en minúscula.
   -------------------------------------------------------------- */

function normalizarRut(bruto) {
  return String(bruto || '')
    .replace(/[.\s-]/g, '')
    .toUpperCase();
}

function rutValido(rut) {
  const limpio = normalizarRut(rut);

  // RUT chileno con dígito verificador (caso más común)
  const esFormaChilena = /^\d{7,8}[0-9K]$/.test(limpio);
  if (esFormaChilena) {
    const cuerpo = limpio.slice(0, -1);
    const dado = limpio.slice(-1);

    let suma = 0;
    let factor = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += Number(cuerpo[i]) * factor;
      factor = factor === 7 ? 2 : factor + 1;
    }
    const resto = 11 - (suma % 11);
    const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);

    if (dado === esperado) return true;
  }

  // Documento de identidad extranjero (29-jul-2026): varios estudiantes del
  // Liceo de Huara son bolivianos, venezolanos, peruanos o cubanos y su
  // documento no tiene dígito verificador chileno. Se acepta un formato
  // razonable para no excluirlos — solo se descartan errores de tipeo
  // obvios (vacío, demasiado corto/largo, caracteres fuera de lo esperado).
  return /^[A-Z0-9]{6,15}$/.test(limpio);
}

/**
 * Hash determinista del RUT.
 *
 * Determinista porque hay que poder buscar por RUT: si el hash llevara sal
 * aleatoria no habría forma de encontrar la fila. La protección viene del
 * pepper, que vive solo en las variables de entorno de Vercel.
 *
 * Lo que compra: si alguien se lleva la base de datos, no se lleva los RUT.
 * Lo que no compra: con el pepper en la mano, los 481 RUT del liceo se
 * recorren en segundos. El pepper es el secreto que hay que cuidar.
 */
function hashRut(rut) {
  const pepper = process.env.MIRICE_PEPPER;
  if (!pepper) throw new Error('falta_pepper');
  return crypto
    .createHash('sha256')
    .update(pepper + '|' + normalizarRut(rut))
    .digest('hex');
}

/* --------------------------------------------------------------
   2. Claves
   scrypt con sal por persona. Viene en Node, así que no hace
   falta bcrypt ni argon2 desde npm.
   -------------------------------------------------------------- */

const SCRYPT_LARGO = 32;
const SCRYPT_COSTO = 16384; // N

function hashClave(clave, salHex) {
  const sal = salHex ? Buffer.from(salHex, 'hex') : crypto.randomBytes(16);
  const derivada = crypto.scryptSync(
    String(clave).normalize('NFKC'),
    sal,
    SCRYPT_LARGO,
    { N: SCRYPT_COSTO }
  );
  return { sal: sal.toString('hex'), hash: derivada.toString('hex') };
}

function claveCoincide(clave, salHex, hashHex) {
  if (!salHex || !hashHex) return false;
  try {
    const { hash } = hashClave(clave, salHex);
    const a = Buffer.from(hash, 'hex');
    const b = Buffer.from(hashHex, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (e) {
    return false;
  }
}

/* --------------------------------------------------------------
   3. Sesiones
   Token firmado, sin estado. No hay tabla de sesiones que limpiar
   ni consulta extra por cada petición.
   Contrapartida: no se puede revocar un token antes de que expire.
   Para eso están las 8 horas de vigencia y el campo `activo` de la
   tabla, que se revisa en cada operación sensible.
   -------------------------------------------------------------- */

const VIGENCIA_HORAS = 8;

function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function deB64url(s) {
  return Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function firmar(texto) {
  const secreto = process.env.MIRICE_SECRETO_SESION;
  if (!secreto) throw new Error('falta_secreto_sesion');
  return b64url(crypto.createHmac('sha256', secreto).update(texto).digest());
}

/**
 * El token lleva lo mínimo para que el servidor sepa quién pide qué:
 * el hash del RUT, el rol, si tiene acceso al panel, y cuándo caduca.
 * No lleva nombre, ni RUT, ni curso, ni correo.
 */
function emitirToken(datos) {
  const carga = {
    rh: datos.rut_hash,
    rol: datos.rol,
    adm: !!datos.panel_admin,
    // Clave inicial sin cambiar. Con esta marca encendida, el token sirve
    // para cambiar la clave y para nada más.
    cam: !!datos.debe_cambiar,
    exp: Date.now() + VIGENCIA_HORAS * 3600 * 1000,
  };
  const cuerpo = b64url(JSON.stringify(carga));
  return cuerpo + '.' + firmar(cuerpo);
}

function verificarToken(token) {
  if (!token || typeof token !== 'string') return null;
  const partes = token.split('.');
  if (partes.length !== 2) return null;

  const [cuerpo, firma] = partes;
  let esperada;
  try {
    esperada = firmar(cuerpo);
  } catch (e) {
    return null;
  }

  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  let carga;
  try {
    carga = JSON.parse(deB64url(cuerpo).toString('utf8'));
  } catch (e) {
    return null;
  }

  if (!carga || typeof carga.exp !== 'number' || carga.exp < Date.now()) {
    return null;
  }
  return carga;
}

/** Lee el token del encabezado Authorization: Bearer xxx */
function tokenDe(req) {
  const cabecera = String((req.headers && req.headers.authorization) || '');
  const m = cabecera.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : '';
}

/* --------------------------------------------------------------
   4. Base de datos: Supabase por su API REST
   Se usa la clave service_role, que salta las políticas RLS. Es
   correcto porque quien decide qué puede ver cada persona es este
   servidor, no la base. Por eso mismo la clave service_role no
   puede aparecer nunca en el navegador.
   -------------------------------------------------------------- */

const TIEMPO_MAXIMO_MS = 8000;

async function db(recurso, opciones) {
  const cfg = opciones || {};
  const base = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_KEY;

  if (!base || !clave) {
    const e = new Error('base_no_configurada');
    e.codigo = 'base_no_configurada';
    throw e;
  }

  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), TIEMPO_MAXIMO_MS);

  let r;
  try {
    r = await fetch(base.replace(/\/+$/, '') + '/rest/v1/' + recurso, {
      method: cfg.method || 'GET',
      signal: control.signal,
      headers: Object.assign(
        {
          apikey: clave,
          Authorization: 'Bearer ' + clave,
          'Content-Type': 'application/json',
          Prefer: cfg.prefer || 'return=representation',
        },
        cfg.headers || {}
      ),
      body: cfg.body ? JSON.stringify(cfg.body) : undefined,
    });
  } catch (err) {
    clearTimeout(reloj);
    const e = new Error(err.name === 'AbortError' ? 'base_lenta' : 'base_inalcanzable');
    e.codigo = e.message;
    throw e;
  }
  clearTimeout(reloj);

  const texto = await r.text();
  let datos = null;
  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch (e) {
      datos = null;
    }
  }

  if (!r.ok) {
    // El detalle se registra sin cuerpo de la petición: ahí pueden ir datos
    // personales o el relato de un caso.
    console.error('[db] respuesta', r.status, 'en', recurso.split('?')[0]);
    const e = new Error('base_error_' + r.status);
    e.codigo = 'base_error';
    e.estado = r.status;
    e.detalle = datos && datos.message;
    throw e;
  }

  return datos;
}

/* --------------------------------------------------------------
   5. Limitador de frecuencia
   En memoria, por instancia. Igual que en api/chat.js: frena el
   mal uso ocasional, no un ataque decidido. Si el uso crece,
   migrar a Vercel KV.
   -------------------------------------------------------------- */

const cubos = new Map();

function excedeLimite(llave, limite, ventanaMs) {
  const ahora = Date.now();
  const cubo = (cubos.get(llave) || []).filter((t) => ahora - t < ventanaMs);
  cubo.push(ahora);
  cubos.set(llave, cubo);
  if (cubos.size > 3000) cubos.clear();
  return cubo.length > limite;
}

function ipDe(req) {
  return (
    String((req.headers && req.headers['x-forwarded-for']) || '')
      .split(',')[0]
      .trim() || 'desconocida'
  );
}

/* --------------------------------------------------------------
   6. Cuerpo de la petición
   -------------------------------------------------------------- */

function cuerpoDe(req) {
  let cuerpo = req.body;
  if (typeof cuerpo === 'string') {
    try {
      cuerpo = JSON.parse(cuerpo);
    } catch (e) {
      return null;
    }
  }
  return cuerpo && typeof cuerpo === 'object' ? cuerpo : {};
}

/* --------------------------------------------------------------
   7. Derivación honesta
   Cuando algo falla del lado del servidor, la persona no puede
   quedarse con un "listo" en la pantalla. Este texto es el que
   se entrega en su lugar.
   -------------------------------------------------------------- */

function textoDerivacion() {
  // No existe un teléfono central de Convivencia Educativa en el Liceo de
  // Huara (confirmado 29-jul-2026) — el mensaje siempre deriva a acudir
  // en persona, nunca a un número de teléfono inventado.
  return (
    'No pude registrar tu mensaje en este momento, así que no quiero decirte ' +
    'que quedó enviado, porque no es así. Por favor acude directamente a ' +
    'Convivencia Educativa o a Inspectoría General para contarlo en persona.'
  );
}

/* --------------------------------------------------------------
   8. Detección de crisis
   Mismos patrones que api/chat.js. Aquí cumplen otra función: un
   reporte con estas señales no puede esperar en una lista.
   -------------------------------------------------------------- */

const RIESGO_VITAL = /(suicid|quitarme la vida|quitarse la vida|matarme|me quiero morir|no quiero vivir|no quiero seguir viviendo|acabar con todo|hacerme da[nñ]o|autolesion|autoles|cortarme|me corto|desaparecer para siempre)/i;

const ABUSO_SEXUAL = /(abus(o|ar|aron|ando) sexual|me toc(o|a|aron) sus? partes|violaci[oó]n|me viol(o|aron)|tocaciones|me obligo a tocar)/i;

function clasificarUrgencia(texto) {
  const t = String(texto || '');
  if (RIESGO_VITAL.test(t)) return { prioridad: 'critica', motivo: 'riesgo_vital' };
  if (ABUSO_SEXUAL.test(t)) return { prioridad: 'critica', motivo: 'abuso' };
  return { prioridad: 'normal', motivo: null };
}

/* --------------------------------------------------------------
   9. Periodo semanal (para la encuesta de clima)
   Formato AAAA-Wss, ej. "2026-S31". Con el año adelante para que la
   semana 1 de un año no se confunda con la semana 1 del siguiente
   (el cálculo anterior en climate_survey.js no llevaba año).
   -------------------------------------------------------------- */

function periodoActual() {
  const hoy = new Date();
  const inicioAno = new Date(Date.UTC(hoy.getUTCFullYear(), 0, 1));
  const dias = Math.floor((hoy - inicioAno) / (24 * 60 * 60 * 1000));
  const semana = Math.ceil((dias + inicioAno.getUTCDay() + 1) / 7);
  return hoy.getUTCFullYear() + '-S' + String(semana).padStart(2, '0');
}

module.exports = {
  normalizarRut,
  rutValido,
  hashRut,
  hashClave,
  claveCoincide,
  emitirToken,
  verificarToken,
  tokenDe,
  db,
  excedeLimite,
  ipDe,
  cuerpoDe,
  textoDerivacion,
  clasificarUrgencia,
  periodoActual,
  VIGENCIA_HORAS,
};
