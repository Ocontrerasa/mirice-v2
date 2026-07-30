/**
 * BASE DE CONOCIMIENTO LOCAL COMPLETA (RICE - Liceo de Huara 2026 & Leyes Educativas)
 * Estructurada para el Motor RAG Local y Búsqueda Semántica del Orientador Virtual.
 */

const RICE_DATABASE = [
  {
    id: "RICE-PAR-001",
    titulo: "NORMATIVA Y REGULACIÓN DE EDUCACIÓN PARVULARIA (NT1 Y NT2)",
    seccion: "EDUCACIÓN PARVULARIA — BUEN TRATO Y DESARROLLO INICIAL",
    contenido: "REGULACIÓN DE EDUCACIÓN PARVULARIA (Pre-Kínder y Kínder): En Educación Parvularia no existen medidas disciplinarias ni sanciones punitivas. Las normas de convivencia se basan en el buen trato, el afecto, la contención socioemocional, la formación de hábitos a través del juego y las orientaciones de la Subsecretaría de Educación Parvularia. Todo desacuerdo o dificultad de conducta se aborda de forma formativa mediante el diálogo con el apoderado y el equipo pedagógico del nivel.",
    keywords: ["parvularia", "parvulo", "kinder", "prekinder", "nt1", "nt2", "buen trato", "afecto", "juego", "sin sanciones", "no punitivo"]
  },
  {
    id: "RICE-PAR-002",
    titulo: "PROTOCOLO DE ACTUACIÓN EN EDUCACIÓN PARVULARIA (PRIMERA INFANCIA)",
    seccion: "EDUCACIÓN PARVULARIA — PROTOCOLOS DE ACOMPAÑAMIENTO",
    contenido: "PROTOCOLO DE EDUCACIÓN PARVULARIA: Ante crisis de llanto, desregulación emocional o dificultades de adaptación en parvulario (NT1 y NT2), la educadora y asistente técnico aplican contención afectiva física y verbal respetuosa, ambiente seguro y aviso inmediato al apoderado. Queda estrictamente prohibida la expulsión, suspensión o retiro forzado en este nivel educacional (Circular 482 y Ley 21.430).",
    keywords: ["parvularia", "llanto", "desregulacion", "adaptacion", "educadora", "primera infancia", "resguardo"]
  },
  {
    id: "RICE-PROT-001",
    titulo: "PROTOCOLO N° 1: ATRASOS E INASISTENCIAS REITERADAS",
    seccion: "PROTOCOLOS DE CONVIVENCIA ESCOLAR",
    contenido: "PROTOCOLO DE ATRASOS E INASISTENCIAS: Todo estudiante tiene derecho a ingresar al establecimiento y a su sala de clases independientemente de la hora de llegada o si viste uniforme incompleto. Queda estrictamente prohibido devolver alumnos a sus casas (Circular 482 Mineduc). Ante atrasos reiterados, el equipo de Convivencia Educativa indaga causas (ej: transporte escolar rural) y coordina apoyos formativos sin sanciones expulsoras.",
    keywords: ["atrasos", "atraso", "llegar tarde", "inasistencia", "inasistencias", "ausencias", "falta", "uniforme", "porteria", "circular 482"]
  },
  {
    id: "RICE-PROT-002",
    titulo: "PROTOCOLO N° 2: PELEAS, RIÑAS Y VIOLENCIA FÍSICA ENTRE ESTUDIANTES",
    seccion: "PROTOCOLOS DE CONVIVENCIA ESCOLAR",
    contenido: "PROTOCOLO ANTE PELEAS Y RIÑAS: Ante una agresión física o pelea entre estudiantes, los docentes e inspectores separan de inmediato a los involucrados con serenidad sin usar fuerza excesiva. Se brinda atención médica en enfermería si hay lesiones, se traslada a los estudiantes a un espacio de calma y se cita a los apoderados para aplicar la resolución restaurativa del conflicto y medidas de reparación.",
    keywords: ["pelea", "peleas", "rina", "rinas", "golpes", "pegan", "agresion", "violencia", "lesiones", "enfermeria", "apoderados"]
  },
  {
    id: "RICE-PROT-003",
    titulo: "PROTOCOLO N° 3: PREVENCIÓN Y ACTUACIÓN ANTE MALTRATO, ACOSO ESCOLAR O BULLYING",
    seccion: "PROTOCOLOS DE CONVIVENCIA ESCOLAR",
    contenido: "PROTOCOLO DE ACOSO ESCOLAR Y BULLYING: El Liceo de Huara protege categóricamente a todo estudiante que sufra molestia, burlas, intimidación o acoso por parte de un compañero u otra persona. Ningún estudiante es culpable de sufrir acoso. Acciones inmediatas: 1) Escucha protegida y confidencial con el Profesor Jefe y la Dupla Psicosocial; 2) Medidas de resguardo de seguridad en sala y recreos; 3) Prohibición absoluta de revictimización; 4) Plan de apoyo socioemocional y citación a apoderados bajo resguardo de identidad.",
    keywords: ["acoso", "acosa", "acosan", "acosando", "bullying", "ciberacoso", "burlas", "burlan", "molestan", "molestando", "intimidacion", "maltrato", "no estas solo", "confidencial", "dupla psicosocial", "profesor jefe"]
  },
  {
    id: "RICE-PROT-004",
    titulo: "PROTOCOLO N° 4: SOSPECHA O DETECCIÓN DE MALTRATO INFANTIL EN EL HOGAR",
    seccion: "PROTECCIÓN Y RESGUARDO DE DERECHOS (LEY 21.430)",
    contenido: "PROTOCOLO DE MALTRATO INFANTIL EN EL HOGAR: Si un estudiante manifiesta o muestra signos de maltrato o vulneración grave en su entono familiar, el equipo directivo y la dupla psicosocial realizan un informe de derivación confidencial a los organismos de protección (Oficina de Protección de Derechos OPD / Juzgado de Familia) resguardando el interés superior del niño, niña o adolescente.",
    keywords: ["maltrato infantil", "vulneracion", "casa", "hogar", "familia", "padres", "opd", "tribunal", "derechos"]
  },
  {
    id: "RICE-PROT-005",
    titulo: "PROTOCOLO N° 5: ACTUACIÓN ANTE SITUACIONES DE CONNOTACIÓN SEXUAL O ABUSO",
    seccion: "PROTECCIÓN Y RESGUARDO DE DERECHOS",
    contenido: "PROTOCOLO ANTE DELITOS SEXUALES: Ante cualquier relato, sospecha o hecho de connotación sexual, tocaciones indebidas o abuso, el establecimiento activa la denuncia obligatoria ante el Ministerio Público o Carabineros dentro de las 24 horas (Art. 175 Código Procesal Penal). Se brinda acogida inmediata al estudiante, protección total, resguardo de su identidad y contención psicosocial sin interrogarlo ni revictimizarlo.",
    keywords: ["sexual", "abuso", "tocacion", "tocaciones", "manoseo", "delito", "denuncia", "carabineros", "fiscalia", "resguardo"]
  },
  {
    id: "RICE-PROT-006",
    titulo: "PROTOCOLO N° 6: PREVENCIÓN Y ABORDAJE DE DROGAS Y ALCOHOL",
    seccion: "PROTOCOLOS FORMATIVOS Y PREVENTIVOS",
    contenido: "PROTOCOLO DE DROGAS Y ALCOHOL: Ante la sospecha o consumo de sustancias psicoactivas o alcohol en el entorno escolar, el Liceo prioriza la contención de salud y el acompañamiento formativo a través del programa SENDA Previene y la dupla psicosocial. Si se detecta porte o comercialización dentro del liceo, se aplica la normativa de denuncias en Carabineros resguardando la integridad del estudiante.",
    keywords: ["drogas", "droga", "alcohol", "marihuana", "sustancias", "senda", "prevencion", "salud", "apoyo"]
  },
  {
    id: "RICE-PROT-007",
    titulo: "PROTOCOLO N° 7: PORTE DE ARMAS U OBJETOS PELIGROSOS",
    seccion: "SEGURIDAD ESCOLAR",
    contenido: "PROTOCOLO DE ARMAS U OBJETOS PELIGROSOS: Queda estrictamente prohibido el ingreso de armas blancas, de fuego o elementos punzocortantes. Ante la presencia de un objeto peligroso, el adulto responsable aísla la zona con calma, solicita la entrega voluntaria del objeto sin exponer al alumnado y llama a Carabineros de Huara y apoderados.",
    keywords: ["arma", "armas", "cuchillo", "objeto peligroso", "seguridad", "carabineros", "aislamiento"]
  },
  {
    id: "RICE-PROT-008",
    titulo: "PROTOCOLO N° 8: EMBARAZO, MATERNIDAD Y PATERNIDAD ADOLESCENTE",
    seccion: "INCLUSIÓN Y PROTECCIÓN SOCIAL",
    contenido: "PROTOCOLO DE MATERNIDAD Y PATERNIDAD: Las estudiantes embarazadas o madres, y los estudiantes padres, tienen derecho a la continuidad de estudios, calendarios de evaluación flexibles, permisos para controles de salud prenatal y lactancia materna, conforme a la Ley 20.370 y disposiciones del Mineduc.",
    keywords: ["embarazo", "embarazada", "embarazado", "polola", "pololo", "maternidad", "paternidad", "controles", "lactancia", "flexibilidad", "evaluacion", "ley 20370", "gestacion", "padre", "madre", "bebe"]
  },
  {
    id: "RICE-COND-001",
    titulo: "CONDUCTO REGULAR Y CANALES OFICIALES DE ATENCIÓN E INQUIETUDES (ART. 31)",
    seccion: "CANALES DE COMUNICACIÓN Y DEBIDO PROCESO",
    contenido: "CONDUCTO REGULAR DEL LICEO DE HUARA: El procedimiento jerárquico para consultas, reclamos o solicitudes de la comunidad educativa sigue los siguientes pasos: 1° Profesor/a Jefe o Docente de Asignatura (instancia inicial de aula); 2° Equipo de Convivencia Educativa / Inspectoría General / UTP (para temas socioemocionales, faltas RICE o requerimientos no resueltos en 48 hrs); 3° Dirección del Liceo de Huara (instancia superior de apelación y casos complejos); 4° Sostenedor (SLEP Tamarugal) / Superintendencia de Educación (instancia fiscalizadora externa). Todo apoderado y estudiante tiene derecho a ser atendido con respeto, escucha protegida y confidencialidad (Circular 482 Mineduc).",
    keywords: ["conducto regular", "conductos regulares", "canales de atencion", "reclamo", "reclamos", "atencion a apoderados", "profesor jefe", "convivencia educativa", "convivencia escolar", "direccion", "solicitud", "jerarquia"]
  },
  {
    id: "RICE-PROT-011",
    titulo: "PROTOCOLO N° 11: CIBERACOSO Y USO RESPONSABLE DE REDES SOCIALES",
    seccion: "CONVIVENCIA DIGITAL",
    contenido: "PROTOCOLO DE CIBERACOSO: El ciberbullying (hostigamiento en redes sociales, WhatsApp, Instagram o TikTok) que afecte la convivencia educativa del Liceo de Huara se aborda como una falta grave o gravísima. Se solicita el resguardo de evidencias digitales (capturas de pantalla) y se activan mediaciones digitales y planes de apoyo psicológico.",
    keywords: ["ciberacoso", "ciberbullying", "redes sociales", "whatsapp", "instagram", "tiktok", "fotos", "capturas", "internet"]
  },
  {
    id: "RICE-PROT-012",
    titulo: "PROTOCOLO N° 12: DIVERSIDAD, IDENTIDAD DE GÉNERO E INCLUSIÓN (LEY 21.120)",
    seccion: "DIVERSIDAD Y DERECHOS HUMANOS",
    contenido: "PROTOCOLO DE IDENTIDAD DE GÉNERO Y DIVERSIDAD: Respeto absoluto al nombre social, uso de vestimenta y baños según la identidad de género manifestada por el estudiante o su familia, garantizando un trato digno y libre de discriminación arbitraria conforme a la Ley 21.120 y la Circular 815 Mineduc.",
    keywords: ["diversidad", "identidad", "genero", "nombre social", "trans", "lgbti", "inclusion", "respeto", "ley 21120"]
  },
  {
    id: "RICE-PROT-014",
    titulo: "PROTOCOLO N° 14: ACOMPAÑAMIENTO A ESTUDIANTES CON TEA (LEY 21.545)",
    seccion: "INCLUSIÓN Y NEURODIVERSIDAD (LEY DE AUTISMO)",
    contenido: "PROTOCOLO LEY TEA (LEY N° 21.545): Garantiza la inclusión formativa, adaptaciones curriculares y libertad de tiempo de autorregulación en el Espacio de Calma ante desregulación emocional o sobreestimulación sensorial. Se prohíbe todo trato punitivo o sancionador ante conductas derivadas del espectro autista.",
    keywords: ["tea", "autismo", "espectro", "sensorial", "desregulacion", "calma", "ley 21545", "pie", "adaptaciones"]
  },
  {
    id: "RICE-REG-001",
    titulo: "REGULACIÓN DEL USO DE TELÉFONOS CELULARES EN AULA",
    seccion: "CONVIVENCIA Y ATENCIÓN EN AULA",
    contenido: "REGULACIÓN DE CELULARES: Durante el horario de clases pedagógicas (8:30 a 13:30), los dispositivos móviles deben estar guardados en la mochila y en silencio para cuidar la atención del curso. Se permite su uso en recreos (10:00-10:15 / 11:45-12:00) y horario de almuerzo. El seguimiento en la app MiRice es voluntario y formativo, orientado al bienestar digital.",
    keywords: ["celular", "celulares", "telefono", "telefonos", "pantallas", "clases", "recreo", "almuerzo", "autorregulacion", "bienestar digital"]
  },
  {
    id: "RICE-FALTAS-LEVES",
    titulo: "CLASIFICACIÓN Y TIPIFICACIÓN DE FALTAS LEVES (ART. 15)",
    seccion: "DEBERES Y REGLAMENTO DISCIPLINARIO FORMATIVO",
    contenido: "FALTAS LEVES (Art. 15): Atrasos injustificados reiterados, no vestir el uniforme oficial, uso no autorizado de celular en clases. Consecuencias: Amonestación verbal privada, registro en hoja de vida y diálogo de compromiso formativo con la familia.",
    keywords: ["faltas leves", "art 15", "atraso", "uniforme", "celular", "amonestacion", "compromiso"]
  },
  {
    id: "RICE-FALTAS-GRAVES",
    titulo: "CLASIFICACIÓN Y TIPIFICACIÓN DE FALTAS GRAVES (ART. 16)",
    seccion: "DEBERES Y REGLAMENTO DISCIPLINARIO FORMATIVO",
    contenido: "FALTAS GRAVES (Art. 16): Uso de lenguaje descalificador u ofensivo reiterado, ciberacoso moderado, daño a la infraestructura del liceo, salir de la sala sin autorización. Consecuencias: Citación al apoderado, firma de acta de compromiso y plan de trabajo socioemocional.",
    keywords: ["faltas graves", "art 16", "insultos", "ciberacoso", "daño", "citacion apoderado", "acta"]
  },
  {
    id: "RICE-FALTAS-GRAVISIMAS",
    titulo: "CLASIFICACIÓN Y TIPIFICACIÓN DE FALTAS GRAVÍSIMAS (ART. 17)",
    seccion: "DEBERES Y REGLAMENTO DISCIPLINARIO FORMATIVO",
    contenido: "FALTAS GRAVÍSIMAS (Art. 17): Agresión física grave, acoso escolar o bullying sistemático, porte de armas u objetos peligrosos, porte o comercialización de drogas/alcohol, violencia de género o discriminación arbitraria. Consecuencias: Derivación a Dupla Psicosocial, citación urgente a apoderados, eventual suspensión preventiva (máx. 5 días) y denuncia obligatoria si reviste carácter de delito.",
    keywords: ["faltas gravisimas", "art 17", "agresion", "acoso escolar", "bullying", "armas", "drogas", "suspension", "delito"]
  }
];