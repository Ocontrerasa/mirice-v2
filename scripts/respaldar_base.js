/**
 * MIRICE 2026 — RESPALDO COMPLETO DE LA BASE DE DATOS
 * Liceo de Huara • SLEP Tamarugal
 *
 * Por qué existe
 * ---------------
 * El plan gratuito de Supabase NO genera respaldos automáticos de ningún tipo
 * (el panel lo dice: "No backups"). Desde el lanzamiento del 01-sep-2026 la
 * base contiene reportes de convivencia y datos de estudiantes menores de
 * edad. Un borrado accidental, una migración mal hecha o una falla del
 * proveedor serían irrecuperables. Este script descarga TODO a un archivo
 * local con fecha.
 *
 * Qué respalda
 * ------------
 * Las 8 tablas del esquema: personas, reportes, reporte_eventos, incidentes,
 * encuesta_preguntas, encuesta_respuestas, encuesta_marcas y
 * push_suscripciones. Lee por páginas de 1000 filas, así que no importa
 * cuánto crezca la base.
 *
 * Qué NO respalda (y por qué no hace falta)
 * -----------------------------------------
 * El esquema/estructura de las tablas: eso vive en esquema.sql, dentro del
 * repositorio, que ya está versionado en GitHub. Con esquema.sql + este
 * respaldo se reconstruye la base completa.
 *
 * ⚠️ EL ARCHIVO RESULTANTE ES CONFIDENCIAL
 * Contiene nombres, cursos, correos y el texto íntegro de los reportes de
 * convivencia. NUNCA debe entrar al repositorio, ni enviarse por correo, ni
 * subirse a un servicio público. Guárdalo en una carpeta local y, si quieres
 * una segunda copia, en un disco externo o pendrive bajo llave.
 *
 * Uso (en tu computador, nunca en la nube):
 *   $env:SUPABASE_URL="https://unltvmwhsizfbdhhgyvh.supabase.co"
 *   $env:SUPABASE_SERVICE_KEY="sb_secret_..."
 *   node scripts/respaldar_base.js
 *
 * Opcional: ruta de destino distinta a la de por defecto
 *   node scripts/respaldar_base.js "D:\\Respaldos MiRice"
 */

const fs = require('fs');
const path = require('path');

const TABLAS = [
  'personas',
  'reportes',
  'reporte_eventos',
  'incidentes',
  'encuesta_preguntas',
  'encuesta_respuestas',
  'encuesta_marcas',
  'push_suscripciones',
];

const PAGINA = 1000;
const DESTINO_POR_DEFECTO = 'C:\\MiRice_Respaldos';

function sello() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
}

async function descargarTabla(base, clave, tabla) {
  const filas = [];
  let desde = 0;

  for (;;) {
    const url = `${base.replace(/\/+$/, '')}/rest/v1/${tabla}?select=*&order=id.asc&offset=${desde}&limit=${PAGINA}`;
    const r = await fetch(url, {
      headers: {
        apikey: clave,
        Authorization: 'Bearer ' + clave,
        Accept: 'application/json',
      },
    });

    if (!r.ok) {
      // Algunas tablas no tienen columna "id" (ej. encuesta_marcas usa clave
      // compuesta). Se reintenta sin ordenar antes de darla por perdida.
      if (desde === 0) {
        const r2 = await fetch(
          `${base.replace(/\/+$/, '')}/rest/v1/${tabla}?select=*&offset=${desde}&limit=${PAGINA}`,
          { headers: { apikey: clave, Authorization: 'Bearer ' + clave, Accept: 'application/json' } }
        );
        if (r2.ok) {
          const lote2 = await r2.json();
          filas.push(...lote2);
          if (lote2.length < PAGINA) return filas;
          desde += PAGINA;
          continue;
        }
      }
      throw new Error(`HTTP ${r.status} al leer ${tabla}`);
    }

    const lote = await r.json();
    filas.push(...lote);
    if (lote.length < PAGINA) return filas;
    desde += PAGINA;
  }
}

async function main() {
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Faltan variables de entorno: SUPABASE_URL y SUPABASE_SERVICE_KEY');
    process.exit(1);
  }

  const carpetaBase = process.argv[2] || DESTINO_POR_DEFECTO;
  const marca = sello();
  const carpeta = path.join(carpetaBase, 'respaldo_' + marca);
  fs.mkdirSync(carpeta, { recursive: true });

  console.log('MiRice — Respaldo de la base de datos');
  console.log('Destino: ' + carpeta);
  console.log('');

  const resumen = {};
  const completo = { generado_en: new Date().toISOString(), tablas: {} };
  let errores = 0;

  for (const tabla of TABLAS) {
    process.stdout.write('  ' + tabla.padEnd(22));
    try {
      const filas = await descargarTabla(SUPABASE_URL, SUPABASE_SERVICE_KEY, tabla);
      fs.writeFileSync(
        path.join(carpeta, tabla + '.json'),
        JSON.stringify(filas, null, 2),
        'utf8'
      );
      completo.tablas[tabla] = filas;
      resumen[tabla] = filas.length;
      console.log(String(filas.length).padStart(6) + ' filas  OK');
    } catch (e) {
      resumen[tabla] = 'ERROR: ' + e.message;
      errores++;
      console.log('  ERROR: ' + e.message);
    }
  }

  // Archivo único con todo (el más cómodo para restaurar)
  fs.writeFileSync(
    path.join(carpeta, '_respaldo_completo.json'),
    JSON.stringify(completo, null, 2),
    'utf8'
  );

  // Ficha legible para saber qué contiene sin abrir los datos
  const ficha = [
    'RESPALDO MIRICE — Liceo de Huara',
    'Generado: ' + new Date().toLocaleString('es-CL'),
    'Origen:   ' + SUPABASE_URL,
    '',
    'CONTENIDO:',
    ...Object.entries(resumen).map(([t, n]) => '  ' + t.padEnd(24) + n),
    '',
    'ARCHIVO CONFIDENCIAL — Ley 19.628.',
    'Contiene datos de estudiantes menores de edad y reportes de convivencia.',
    'No subir al repositorio, no enviar por correo, no almacenar en servicios publicos.',
    '',
    'Para restaurar: usar esquema.sql del repositorio para recrear las tablas,',
    'y luego cargar _respaldo_completo.json tabla por tabla.',
  ].join('\r\n');
  fs.writeFileSync(path.join(carpeta, '_LEEME.txt'), ficha, 'utf8');

  const pesoMB = fs.statSync(path.join(carpeta, '_respaldo_completo.json')).size / 1048576;

  console.log('');
  console.log('=====================================================');
  if (errores > 0) {
    console.log('TERMINADO CON ' + errores + ' ERROR(ES) — revisa el detalle arriba.');
  } else {
    console.log('Respaldo completo y sin errores.');
  }
  console.log('Carpeta: ' + carpeta);
  console.log('Tamaño:  ' + pesoMB.toFixed(2) + ' MB');
  console.log('');
  console.log('Este respaldo es CONFIDENCIAL: contiene datos de menores.');
  console.log('Guardalo en lugar seguro y no lo subas a ningun servicio publico.');
}

main().catch((e) => {
  console.error('Fallo general del respaldo:', e.message);
  process.exit(1);
});
