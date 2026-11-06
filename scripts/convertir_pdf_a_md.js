const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PDF_PATH = path.join(__dirname, '..', 'fuentes', 'RICE LICEO DE HUARA 2026.pdf');
const OUTPUT_MD_PATH = path.join(__dirname, '..', 'docs', 'REGLAMENTO_INTERNO_RICE_HUARA_2026_COMPLETO.md');
const OUTPUT_MAESTRO_PATH = path.join(__dirname, '..', '..', '06_Fuentes_Maestras_Oficiales', 'REGLAMENTO_INTERNO_RICE_HUARA_2026_COMPLETO.md');

console.log('Iniciando extracción y estructuración final en Markdown de:', PDF_PATH);
const buf = fs.readFileSync(PDF_PATH);
const content = buf.toString('latin1');

const pageObjRegex = /(\d+)\s+0\s+obj\s*<<[^>]*\/Type\s*\/Page\b/g;
let m;
const pages = [];
while ((m = pageObjRegex.exec(content)) !== null) {
  pages.push({ objNum: parseInt(m[1]), pos: m.index });
}
console.log(`Total de páginas detectadas: ${pages.length}`);

function extractTextFromPage(pageIndex) {
  const p = pages[pageIndex];
  const endObj = content.indexOf('endobj', p.pos);
  const snippet = content.substring(p.pos, endObj);
  
  let streamObjs = [];
  const cmSingle = snippet.match(/\/Contents\s+(\d+)\s+0\s+R/);
  if (cmSingle) {
    streamObjs.push(parseInt(cmSingle[1]));
  } else {
    const cmMulti = snippet.match(/\/Contents\s*\[([^\]]+)\]/);
    if (cmMulti) {
      const nums = cmMulti[1].match(/\d+/g);
      if (nums) streamObjs = nums.filter((_, i) => i % 2 === 0).map(Number);
    }
  }
  
  const textBlocks = [];
  for (const objNum of streamObjs) {
    const objMarker = objNum + ' 0 obj';
    const objPos = content.indexOf(objMarker);
    if (objPos === -1) continue;
    const sPos = content.indexOf('stream', objPos);
    if (sPos === -1) continue;
    let streamStart = sPos + 6;
    if (buf[streamStart] === 0x0d && buf[streamStart+1] === 0x0a) streamStart += 2;
    else if (buf[streamStart] === 0x0a || buf[streamStart] === 0x0d) streamStart += 1;
    const ePos = content.indexOf('endstream', streamStart);
    if (ePos === -1) continue;
    
    const raw = buf.subarray(streamStart, ePos);
    try {
      const dec = zlib.inflateSync(raw).toString('latin1');
      const regex = /\((.*?)\)\s*Tj|\[(.*?)\]\s*TJ/g;
      let tm;
      while ((tm = regex.exec(dec)) !== null) {
        if (tm[1] !== undefined) {
          textBlocks.push(tm[1]);
        } else if (tm[2] !== undefined) {
          const parts = tm[2].match(/\((.*?)\)/g) || [];
          textBlocks.push(parts.map(x => x.slice(1, -1)).join(''));
        }
      }
    } catch (e) {}
  }
  return textBlocks;
}

function cleanPdfText(str) {
  return str
    .replace(/\\([()])/g, '$1')
    .replace(/\\r/g, '')
    .replace(/\\n/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\([0-7]{1,3})/g, (match, octal) => String.fromCharCode(parseInt(octal, 8)))
    .replace(/\s+/g, ' ')
    .trim();
}

console.log('Extrayendo bloques de texto de las 191 páginas...');
const pageTexts = [];
for (let i = 0; i < pages.length; i++) {
  const blocks = extractTextFromPage(i);
  const cleanBlocks = [];
  for (const b of blocks) {
    const cleaned = cleanPdfText(b);
    if (cleaned.length > 0) {
      if (/^UNIDAD DE CONVIVENCIA EDUCATIVA\s*\d*$/i.test(cleaned)) continue;
      if (/^Liceo de Huara$/i.test(cleaned) && cleanBlocks.length === 0) continue;
      if (/^RICE 2026$/i.test(cleaned) && cleanBlocks.length < 3) continue;
      cleanBlocks.push(cleaned);
    }
  }
  pageTexts.push({ pageNum: i + 1, blocks: cleanBlocks });
}

// Nombres oficiales canónicos de Protocolos
const PROTOCOL_NAMES = {
  1: "(PA-MEC) ACTUACIÓN ANTE SITUACIONES DE MALTRATO ESCOLAR, ACOSO (BULLYING) Y CIBERACOSO (CIBERBULLYING) ENTRE ESTUDIANTES",
  2: "(PA-AEV) ACTUACIÓN ANTE AGRESIONES ESCOLARES, VIOLENCIA FÍSICA O RIÑAS ENTRE ESTUDIANTES",
  3: "(PA-MAE) ACTUACIÓN ANTE MALTRATO, ACOSO O AGRESIÓN DE ADULTOS HACIA ESTUDIANTES (VULNERACIÓN DE DERECHOS)",
  4: "(PA-MEF) ACTUACIÓN ANTE ACOSO, HOSTIGAMIENTO, MALTRATO O AGRESIÓN DE ESTUDIANTES HACIA FUNCIONARIOS (LEY KARIN)",
  5: "(PA-ASI) ACTUACIÓN ANTE SITUACIONES DE ABUSO SEXUAL INFANTIL, ACOSO SEXUAL O CONDUCTAS DE CONNOTACIÓN SEXUAL",
  6: "(PA-CDA) ACTUACIÓN ANTE PRESENCIA, CONSUMO, PORTE O TRÁFICO DE DROGAS, ALCOHOL, TABACO Y VAPEADORES (LEY 20.000)",
  7: "(PA-DPT) ACTUACIÓN ANTE DETECCIÓN, PORTE O TENENCIA DE ARMAS O ELEMENTOS PELIGROSOS EN EL ESTABLECIMIENTO",
  8: "(PA-AEE) ACTUACIÓN ANTE ACCIDENTES ESCOLARES Y EMERGENCIAS MÉDICAS (LEY 16.744)",
  9: "(PA-REM) RETENCIÓN Y APOYO ESCOLAR PARA ESTUDIANTES EMBARAZADAS, MADRES Y PADRES ADOLESCENTES",
  10: "(PA-OSP) OPERACIÓN SEGURA EN SALIDAS PEDAGÓGICAS, GIRAS DE ESTUDIO Y ACTIVIDADES EXTRAMUROS",
  11: "(PA-ICA) INTERVENCIÓN Y CONTENCIÓN ANTE CRISIS DE DESREGULACIÓN EMOCIONAL Y CONDUCTUAL (LEY TEA N° 21.545)",
  12: "(PA-VGD) VINCULACIÓN Y GARANTÍA DE DERECHOS PARA ESTUDIANTES TRANS Y DE LA DIVERSIDAD DE GÉNERO (CIRCULAR 812)",
  13: "(PA-RDI) RECONOCIMIENTO DE LA DIVERSIDAD E INCLUSIÓN DE ESTUDIANTES MIGRANTES, PUEBLOS ORIGINARIOS Y CULTURAS RURALES",
  14: "(PA-DEC) DUELO ESCOLAR Y CONTENCIÓN SOCIOEMOCIONAL ANTE PÉRDIDAS SIGNIFICATIVAS EN LA COMUNIDAD",
  15: "(PA-SRH) DETECCIÓN, INTERVENCIÓN Y SEGUIMIENTO ANTE RIESGO DE IDEACIÓN SUICIDA, CONDUCTAS SUICIDAS Y AUTOLESIONES",
  16: "(PA-ISA) INTERVENCIÓN Y ARTICULACIÓN INTERSECTORIAL ANTE CONDICIONES CRÓNICAS DE SALUD MENTAL Y ADICCIONES",
  17: "(PA-SVD) SALIDA NO AUTORIZADA, ABANDONO Y FUGA DE ESTUDIANTES DEL RECINTO EDUCATIVO",
  18: "(PA-FSE) FALSEDAD DOCUMENTAL, FALSIFICACIÓN O ALTERACIÓN DE INSTRUMENTOS PÚBLICOS O PRIVADOS OFICIALES",
  19: "(PA-CNE) ACTUACIÓN ANTE CATÁSTROFES NATURALES, SISMOS, INCENDIOS Y EMERGENCIAS CRÍTICAS (PISE)",
  20: "(PA-SCTE) NORMAS DE SEGURIDAD Y CONVIVENCIA EN EL TRANSPORTE ESCOLAR RURAL",
  21: "(MEGCC) MEDIACIÓN ESCOLAR Y GESTIÓN COLABORATIVA DE CONFLICTOS",
  22: "(PEP-VDP) ACTUACIÓN ANTE SOSPECHA O DETECCIÓN DE VULNERACIÓN DE DERECHOS EN EDUCACIÓN PARVULARIA",
  23: "(PEP-ADP) ABORDAJE DE DESREGULACIONES EMOCIONALES Y CONDUCTUALES EN PÁRVULOS (LEY TEA N° 21.545)",
  24: "(PEP-GCAP) GESTIÓN DE CONFLICTOS Y AGRESIONES ENTRE PÁRVULOS (MORDIDAS, EMPUJONES Y CONDUCTAS DISRUPTIVAS)",
  25: "(PEP-PGAP) PREVENCIÓN Y GESTIÓN DEL ABSENTISMO ESCOLAR TEMPRANO EN EDUCACIÓN PARVULARIA",
  26: "(PEP-AACP) ACTUACIÓN ANTE ACCIDENTES ESCOLARES EN LA EDUCACIÓN PARVULARIA (NT1 Y NT2)"
};

let mdOutput = `# REGLAMENTO INTERNO DE CONVIVENCIA EDUCATIVA (RICE 2026)
## LICEO DE HUARA — COMUNA DE HUARA
**Versión Oficial Maestra Institucional Completa (191 Páginas / 45 MB)**  
*Marco normativo oficial que rige a estudiantes, familias, docentes, asistentes y párvulos bajo el marco de la Circular 482 de la Superintendencia de Educación, Ley 21.430 de Garantías de la Niñez, Ley Karin, Ley TEA N° 21.545 y Orientaciones de Educación Parvularia.*

---

`;

for (let i = 0; i < pageTexts.length; i++) {
  const p = pageTexts[i];
  const isIndice = p.pageNum >= 2 && p.pageNum <= 5;

  if (p.pageNum === 2) {
    mdOutput += `\n# ÍNDICE GENERAL DE MATERIAS\n\n`;
  } else if (p.pageNum === 6) {
    mdOutput += `\n\n---\n\n# GLOSARIO, SIGLAS Y CONCEPTOS FUNDAMENTALES\n\n`;
  }

  for (let j = 0; j < p.blocks.length; j++) {
    let text = p.blocks[j];
    
    // Índice preliminar (páginas 2 a 5)
    if (isIndice) {
      if (text.includes('......') || /\.\s*\.\s*\.\s*\./.test(text) || /^\d{1,3}$/.test(text)) {
        continue;
      }
      if (/^TÍTULO/i.test(text)) {
        mdOutput += `\n* **${text}**\n`;
      } else if (/^ARTÍCULO/i.test(text) || /^PROTOCOLO/i.test(text)) {
        mdOutput += `  - ${text}\n`;
      } else if (text.length > 3) {
        mdOutput += `  - ${text}\n`;
      }
      continue;
    }

    // A partir de la página 9: CUERPO REAL
    // TÍTULOS
    const matchTitulo = text.match(/^TÍTULO\s+([IVXLCDM]+)\s*:?\s*(.*)/i);
    if (matchTitulo && p.pageNum >= 9) {
      const numRomano = matchTitulo[1].toUpperCase();
      let resto = matchTitulo[2] ? matchTitulo[2].trim() : '';
      if (!resto && j + 1 < p.blocks.length && !p.blocks[j+1].startsWith('ARTÍCULO')) {
        j++;
        resto = p.blocks[j].trim();
      }
      mdOutput += `\n\n---\n\n# TÍTULO ${numRomano}: ${resto}\n\n`;
      continue;
    }

    // ARTÍCULOS
    const matchArticulo = text.match(/^ARTÍCULO\s+(\d+)\s*:?\s*(.*)/i);
    if (matchArticulo && p.pageNum >= 9) {
      const numArt = matchArticulo[1];
      let resto = matchArticulo[2] ? matchArticulo[2].trim() : '';
      if (!resto && j + 1 < p.blocks.length && !p.blocks[j+1].startsWith('ARTÍCULO') && !p.blocks[j+1].startsWith('TÍTULO')) {
        j++;
        resto = p.blocks[j].trim();
      }
      mdOutput += `\n\n## ARTÍCULO ${numArt}: ${resto}\n\n`;
      continue;
    }

    // PROTOCOLOS
    const matchProtocolo = text.match(/^PROTOCOLO\s+N[°º]?\s*(\d+)/i);
    if (matchProtocolo && p.pageNum >= 9) {
      const numProt = parseInt(matchProtocolo[1]);
      const canonicalName = PROTOCOL_NAMES[numProt] || `PROTOCOLO N° ${numProt}`;
      mdOutput += `\n\n### PROTOCOLO N° ${numProt}: ${canonicalName}\n\n`;
      
      // Saltar líneas residuales del título que hayan quedado en los siguientes bloques
      while (j + 1 < p.blocks.length && 
             (p.blocks[j+1].startsWith('(') || p.blocks[j+1].startsWith('-') || /^\d{1,3}$/.test(p.blocks[j+1]) || 
              p.blocks[j+1].toUpperCase().includes('ACTUACIÓN') || p.blocks[j+1].toUpperCase().includes('PEP-'))) {
        j++;
      }
      continue;
    }

    // FASES
    const matchFase = text.match(/^FASE\s+(\d+)\s*:?\s*(.*)/i);
    if (matchFase) {
      const numFase = matchFase[1];
      let resto = matchFase[2] ? matchFase[2].trim() : '';
      if (!resto && j + 1 < p.blocks.length) {
        j++;
        resto = p.blocks[j].trim();
      }
      mdOutput += `\n\n#### FASE ${numFase}: ${resto}\n\n`;
      continue;
    }

    // Subtítulos numerados
    const matchSec = text.match(/^(\d+\.\d+(\.\d+)?)\s+(.*)/);
    if (matchSec && p.pageNum >= 9) {
      mdOutput += `\n\n### ${matchSec[1]} ${matchSec[3]}\n\n`;
      continue;
    }

    // Códigos de faltas
    const matchFalta = text.match(/^(L|G|GG)\s*-\s*(\d{2})$/i);
    if (matchFalta) {
      const tipo = matchFalta[1].toUpperCase();
      const num = matchFalta[2];
      mdOutput += `\n\n---\n* **Código ${tipo}-${num}:** `;
      continue;
    }

    // Párrafo continuo
    mdOutput += text + ' ';
    if (text.endsWith('.') || text.endsWith(':')) {
      mdOutput += '\n\n';
    }
  }
}

// Limpieza final
mdOutput = mdOutput
  .replace(/\n{3,}/g, '\n\n')
  .replace(/[ \t]+/g, ' ')
  .trim();

const BOM = Buffer.from([0xEF, 0xBB, 0xBF]);
const mdBuffer = Buffer.concat([BOM, Buffer.from(mdOutput, 'utf8')]);

fs.writeFileSync(OUTPUT_MD_PATH, mdBuffer);
console.log(`✅ Archivo Markdown generado exitosamente en: ${OUTPUT_MD_PATH} (${(mdBuffer.length / 1024).toFixed(2)} KB)`);

try {
  fs.writeFileSync(OUTPUT_MAESTRO_PATH, mdBuffer);
  console.log(`✅ Copia de respaldo maestro generada en: ${OUTPUT_MAESTRO_PATH}`);
} catch (e) {
  console.warn('Nota: No se pudo escribir copia en fuentes maestras:', e.message);
}
