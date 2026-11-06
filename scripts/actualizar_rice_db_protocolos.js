const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'src', 'js', 'rice_db.js');
let content = fs.readFileSync(DB_PATH, 'utf8');

const newProtocols = `  {
    id: "RICE-PROT-N22",
    titulo: "PROTOCOLO N°22 (RICE 2026): VULNERACIÓN DE DERECHOS EN EDUCACIÓN PARVULARIA (PEP-VDP)",
    seccion: "TÍTULO XVII — EDUCACIÓN PARVULARIA (RICE 2026)",
    contenido: "VULNERACIÓN DE DERECHOS EN PÁRVULOS: Actuación ante sospecha o detección física/verbal. Fase 1: contención emocional inmediata a la altura de los ojos del párvulo, escucha activa sin preguntas dirigidas ni careos (evitar revictimización), registro manuscrito literal y exacto de sus palabras. Fase 2: reporte presencial prioritario a Convivencia/Inspectoría en máximo 2 horas, notificación inmediata a Dirección y encriptación de antecedentes reservados. Fase 3: citación urgente al apoderado (salvo que sea el presunto agresor), denuncia obligatoria ante Carabineros, PDI o Fiscalía dentro de 24 horas (Art. 175 CPP) y solicitud de medidas de protección ante el Tribunal de Familia. Fase 4: plan de acompañamiento integral y resguardo en aula.",
    keywords: ["parvularia", "parvulo", "vulneracion de derechos", "maltrato en parvulo", "lesiones en kinder", "prekinder", "denuncia derechos nino", "opd", "oln", "tribunal de familia"]
  },
  {
    id: "RICE-PROT-N23",
    titulo: "PROTOCOLO N°23 (RICE 2026): ABORDAJE DE DESREGULACIONES EMOCIONALES Y CONDUCTUALES EN PÁRVULOS - LEY TEA (PEP-ADP)",
    seccion: "TÍTULO XVII — EDUCACIÓN PARVULARIA (RICE 2026)",
    contenido: "DESREGULACIÓN EN PÁRVULOS (LEY TEA 21.545): Enfoque 100% de contención sensorial y afectiva. Fase 1: monitoreo continuo de estímulos detonantes (auditivos, visuales o de fatiga), reducción de sobrecarga sensorial. Fase 2: traslado guiado y respetuoso al Espacio de Calma, entrega de apoyos reguladores (orejeras aislantes, mantas de peso, objetos táctiles); PROHIBIDA la contención física forzada, encierro o inmovilización; el abrazo de contención solo aplica ante riesgo vital inminente y por personal idóneo. Fase 3: reincorporación paulatina guiada por pictogramas ARASAAC. Fase 4: ajuste del Plan de Acompañamiento Individual (PAI) con la educadora diferencial PIE y comunicación empática con la familia.",
    keywords: ["desregulacion parvulo", "crisis tea parvulo", "pataleta kinder", "llanto descontrolado", "espacio de calma", "orejeras", "ley tea", "contencion afectiva", "no punitivo"]
  },
  {
    id: "RICE-PROT-N24",
    titulo: "PROTOCOLO N°24 (RICE 2026): GESTIÓN DE CONFLICTOS Y AGRESIONES ENTRE PÁRVULOS - MORDIDAS Y EMPUJONES (PEP-GCAP)",
    seccion: "TÍTULO XVII — EDUCACIÓN PARVULARIA (RICE 2026)",
    contenido: "CONFLICTOS ENTRE PÁRVULOS (MORDIDAS, EMPUJONES, GOLPES): Abordaje estrictamente formativo y no sancionatorio. Fase 1: separación física inmediata con serenidad y afecto (sin gritos, tirones ni reproches públicos); contención y primeros auxilios prioritarios al párvulo agredido (lavado y hielo si hay mordedura) y contención simultánea al que agredió. Fase 2: mediación pedagógica lúdica en el aula explicando el límite con pictogramas ('en el liceo nos cuidamos, las manos son para acariciar'); reparación simbólica (un dibujo o gesto de cariño) solo si surge voluntariamente. Fase 3: registro pedagógico en bitácora y comunicación informativa (no acusatoria) a ambos apoderados ese mismo día. Fase 4: si se reiteran mordidas o empujones más de 3 veces al mes, activación de Mesa Técnica PIE para evaluar posibles barreras de comunicación o sensoriales.",
    keywords: ["mordida", "mordio", "empujon", "pelea entre parvulos", "parvulo agresivo", "golpe en kinder", "buen trato", "pictogramas", "no sancion"]
  },
  {
    id: "RICE-PROT-N25",
    titulo: "PROTOCOLO N°25 (RICE 2026): PREVENCIÓN Y GESTIÓN DEL ABSENTISMO ESCOLAR TEMPRANO EN PARVULARIA (PEP-PGAP)",
    seccion: "TÍTULO XVII — EDUCACIÓN PARVULARIA (RICE 2026)",
    contenido: "ABSENTISMO EN EDUCACIÓN PARVULARIA: Promoción del derecho a la educación inicial y revinculación. Fase 1: control diario de asistencia nominal a las 08:35 hrs. Fase 2: contacto telefónico o mensaje al apoderado el mismo día de la inasistencia injustificada. Fase 3: al acumular 3 inasistencias en el mes sin justificar, entrevista formal con la Educadora para identificar causas (transporte rural, salud, clima). Fase 4: ante 15 días consecutivos de ausencia sin contacto, se agotan obligatoriamente 3 llamados + 1 carta certificada + 1 visita domiciliaria por dupla psicosocial antes de evaluar la reasignación de vacante; NUNCA se aplica como sanción ni pérdida punitiva de matrícula.",
    keywords: ["inasistencia kinder", "parvulo no asiste", "ausentismo temprano", "abandono escolar parvularia", "revinculacion", "visita domiciliaria", "apoyo familiar"]
  },
  {
    id: "RICE-PROT-N26",
    titulo: "PROTOCOLO N°26 (RICE 2026): ACTUACIÓN ANTE ACCIDENTES ESCOLARES EN EDUCACIÓN PARVULARIA (PEP-AACP)",
    seccion: "TÍTULO XVII — EDUCACIÓN PARVULARIA (RICE 2026)",
    contenido: "ACCIDENTES EN PÁRVULOS (LEY 16.744): Protección integral de salud. Fase 1: evaluación inmediata de la escena y primeros auxilios; PROHIBIDO mover al párvulo ante sospecha de golpe en la cabeza o caída de altura con pérdida de conciencia; mantenerlo abrigado y con contención verbal tranquilizadora. Fase 2: aviso telefónico inmediato al apoderado por Inspectoría y traslado urgente al CESFAM Huara con acompañamiento presencial de una funcionaria del liceo. Fase 3: emisión de la Declaración Individual de Accidente Escolar (DIAE) en un plazo máximo de 24 horas. Fase 4: registro de seguimiento, revisión de la seguridad del patio de párvulos y adecuaciones de reintegro en el aula.",
    keywords: ["accidente kinder", "caida parvulo", "golpe en la cabeza", "cesfam huara", "seguro escolar", "primeros auxilios parvularia", "diae"]
  },`;

const marker = 'id: "RICE-PARVULARIA-PROTOCOLOS",';
if (content.includes(marker) && !content.includes('RICE-PROT-N22')) {
  const idx = content.indexOf(marker);
  const openBrace = content.lastIndexOf('{', idx);
  content = content.substring(0, openBrace) + newProtocols + '\n  ' + content.substring(openBrace);
  
  const BOM = Buffer.from([0xEF, 0xBB, 0xBF]);
  fs.writeFileSync(DB_PATH, Buffer.concat([BOM, Buffer.from(content, 'utf8')]));
  console.log('✅ rice_db.js actualizado exitosamente con Protocolos 22 al 26.');
} else {
  console.log('Los protocolos ya estaban insertados o no se encontró el marcador.');
}

