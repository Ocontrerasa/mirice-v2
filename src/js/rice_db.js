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
    id: "RICE-PROT-N01",
    titulo: "PROTOCOLO N°1 (RICE 2026): MALTRATO ESCOLAR, ACOSO (BULLYING) Y CIBERACOSO",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "MALTRATO, ACOSO Y CIBERACOSO ENTRE ESTUDIANTES: Se distingue el maltrato aislado (falta grave: hecho puntual y esporádico, sin persecución previa) del acoso escolar o bullying (falta gravísima: requiere intencionalidad, reiteración sostenida y asimetría de poder que deja a la víctima en indefensión) y del ciberacoso (falta gravísima: hostigamiento por redes sociales, WhatsApp u otras plataformas digitales). Procedimiento: el funcionario que recibe el reporte registra el hito en la bitácora dentro de 24 horas hábiles; se aplican medidas de resguardo inmediatas (separación de espacios en recreos, casino y transporte rural; contención con la Dupla Psicosocial); la investigación dura hasta 5 días hábiles y la resolución se dicta en un máximo de 10 días hábiles (prorrogable por 5). Si el estudiante investigado pertenece al PIE o tiene diagnóstico Ley TEA, la Mesa Multidisciplinaria evalúa el caso antes de sancionar, prohibiéndose sanciones punitivas si la conducta se vincula a su condición. Sanciones: maltrato aislado → registro y talleres formativos; bullying o ciberacoso sostenido → suspensión interna de 3 a 5 días hábiles y condicionalidad extrema de matrícula, pudiendo escalar a expulsión bajo la Ley Aula Segura en casos de daño severo a la salud mental de la víctima.",
    keywords: ["acoso", "bullying", "ciberacoso", "maltrato escolar", "hostigamiento", "burlas", "molestan", "excluyen", "grupo whatsapp", "funa", "no estas solo", "dupla psicosocial"]
  },
  {
    id: "RICE-PROT-N02",
    titulo: "PROTOCOLO N°2 (RICE 2026): AGRESIONES ESCOLARES, VIOLENCIA FÍSICA O RIÑAS",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "AGRESIONES FÍSICAS Y RIÑAS ENTRE ESTUDIANTES: Se distingue la agresión física (falta gravísima: ataque unilateral a una víctima que no responde) de la riña (falta gravísima: enfrentamiento recíproco de golpes), la incitación o el registro audiovisual de la violencia (falta grave), y la agresión o riña con armas u objetos peligrosos (máxima gravedad, con activación penal directa). Procedimiento: contención física inmediata por cualquier funcionario presente, traslado a enfermería o al CESFAM Huara si hay lesiones (activando el Seguro Escolar Ley 16.744), registro del hito en la bitácora dentro de 24 horas, separación preventiva de espacios y del transporte escolar rural, y denuncia obligatoria a Carabineros o Fiscalía dentro de 24 horas si hay lesiones constatadas o uso de armas. Filtro TEA/PIE obligatorio antes de sancionar. Sanciones: participación secundaria o incitación → falta grave (amonestación y talleres de mediación); agresión principal o riña activa → suspensión interna de 3 a 5 días hábiles y condicionalidad de matrícula, pudiendo escalar a expulsión bajo la Ley Aula Segura en agresiones de extrema gravedad o con armas.",
    keywords: ["pelea", "peleas", "rina", "rinas", "golpes", "pegan", "agresion fisica", "violencia", "lesiones", "enfermeria", "filmar pelea"]
  },
  {
    id: "RICE-PROT-N03",
    titulo: "PROTOCOLO N°3 (RICE 2026): MALTRATO, ACOSO O AGRESIÓN DE ADULTOS A ESTUDIANTES (VULNERACIÓN DE DERECHOS)",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "MALTRATO DE UN ADULTO DEL LICEO HACIA UN ESTUDIANTE: Cubre el maltrato verbal, psicológico o físico de cualquier adulto de la comunidad educativa (docente, asistente, directivo, auxiliar o conductor) hacia un estudiante (falta gravísima / vulneración de derechos), las prácticas pedagógicas discriminatorias o excluyentes (falta grave a gravísima según reiteración), y las conductas de connotación sexual de un adulto hacia un estudiante (máxima gravedad, con activación penal inmediata). Procedimiento: separación física inmediata del funcionario denunciado de todo contacto con el estudiante (cambio de funciones o reubicación, nunca como sanción anticipada), contención psicoemocional urgente del estudiante afectado, y citación al apoderado dentro de 24 horas. Si los hechos revisten caracteres de delito, la Directora tiene la obligación legal de denunciar ante Carabineros, la PDI o el Ministerio Público dentro de 24 horas, derivando en paralelo al SLEP Tamarugal para un eventual sumario administrativo contra el funcionario. Este protocolo NUNCA se investiga solo puertas adentro cuando hay indicios de delito: la vía penal es obligatoria y corre en paralelo a cualquier proceso interno.",
    keywords: ["profesor maltrata", "funcionario abusa", "adulto agrede", "docente insulta", "vulneracion de derechos", "denuncia contra profesor", "maltrato de un adulto"]
  },
  {
    id: "RICE-PROT-N04",
    titulo: "PROTOCOLO N°4 (RICE 2026): ACOSO, HOSTIGAMIENTO, MALTRATO O AGRESIÓN DE ESTUDIANTES A FUNCIONARIOS (LEY KARIN Y LEY AULA SEGURA)",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "MALTRATO DE UN ESTUDIANTE HACIA UN FUNCIONARIO: Se distingue la falta de respeto puntual (falta grave) del hostigamiento sostenido que activa la Ley Karin (falta gravísima), el ciberacoso contra un funcionario (falta gravísima), y la agresión física o amenaza de muerte contra un funcionario (máxima gravedad, activa la Ley Aula Segura). Procedimiento: reubicación del estudiante fuera del espacio del funcionario afectado, y en casos graves, suspensión preventiva cautelar de hasta 5 días hábiles mientras se tramita la resolución. Se deriva al funcionario afectado a apoyo de la ACHS o del SLEP Tamarugal. Filtro TEA/PIE obligatorio antes de sancionar (no se sanciona si la conducta se vincula a una crisis por desregulación). Denuncia penal obligatoria dentro de 24 horas si hay lesiones constatadas, porte de armas o amenazas de muerte explícitas. Sanciones: falta de respeto aislada → registro y talleres de control de impulsos; hostigamiento, ciberacoso sostenido o agresión física → suspensión de 5 a 10 días hábiles y condicionalidad extrema, pudiendo escalar a expulsión inmediata bajo la Ley Aula Segura ante violencia física grave o amenazas con armas.",
    keywords: ["estudiante agrede profesor", "falta el respeto", "amenaza al profesor", "ley karin", "ataca a un funcionario", "insulta al profesor"]
  },
  {
    id: "RICE-PROT-004",
    titulo: "PROTOCOLO N° 4: SOSPECHA O DETECCIÓN DE MALTRATO INFANTIL EN EL HOGAR",
    seccion: "PROTECCIÓN Y RESGUARDO DE DERECHOS (LEY 21.430)",
    contenido: "PROTOCOLO DE MALTRATO INFANTIL EN EL HOGAR: Si un estudiante manifiesta o muestra signos de maltrato o vulneración grave en su entono familiar, el equipo directivo y la dupla psicosocial realizan un informe de derivación confidencial a los organismos de protección (Oficina de Protección de Derechos OPD / Juzgado de Familia) resguardando el interés superior del niño, niña o adolescente.",
    keywords: ["maltrato infantil", "vulneracion", "casa", "hogar", "familia", "padres", "opd", "tribunal", "derechos"]
  },
  {
    id: "RICE-PROT-N05",
    titulo: "PROTOCOLO N°5 (RICE 2026): ABUSO SEXUAL INFANTIL, ACOSO SEXUAL O CONDUCTAS DE CONNOTACIÓN SEXUAL (ASI)",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "ABUSO SEXUAL, ACOSO SEXUAL O CONNOTACIÓN SEXUAL: Cubre las conductas de connotación sexual entre estudiantes (falta gravísima: tocaciones, exhibicionismo, gestos sexuales no consentidos), el acoso sexual digital entre pares (falta gravísima: sexting forzado, grooming, extorsión con material íntimo), y la presunta vulneración sexual por parte de adultos —funcionarios, familiares o terceros— (máxima gravedad, con activación penal inmediata). El liceo NUNCA investiga la veracidad del relato ni realiza careos o interrogatorios repetidos: ante cualquier revelación o sospecha fundada, la Directora tiene la obligación legal de denunciar ante Carabineros, la PDI o el Ministerio Público dentro de 24 horas (Art. 175 Código Procesal Penal), en paralelo a una Medida de Protección ante el Tribunal de Familia. Medidas de resguardo inmediatas: separación física absoluta del presunto agresor (aplicando cambio de funciones si es adulto), contención urgente con la Dupla Psicosocial, y plan de reparación integral con terapia externa (CESFAM o Centro de Atención a Víctimas en Iquique). La vía penal corre siempre en paralelo e independiente de cualquier proceso interno del liceo.",
    keywords: ["abuso sexual", "acoso sexual", "tocaciones", "connotacion sexual", "sexting", "denuncia abuso", "grooming", "manoseo"]
  },
  {
    id: "RICE-PROT-N06",
    titulo: "PROTOCOLO N°6 (RICE 2026): PRESENCIA, CONSUMO O TRÁFICO DE DROGAS, ALCOHOL, TABACO Y VAPEADORES",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "DROGAS, ALCOHOL, TABACO Y VAPEADORES (LEY 20.000): Se distingue el consumo o intoxicación por sustancias (falta gravísima), el porte o tenencia de sustancias o parafernalia (falta gravísima), el porte o consumo de cigarrillos, tabaco o vapeadores (falta grave), y la sospecha fundada de microtráfico o facilitación a terceros (falta gravísima / delito penal). Procedimiento: custodia protegida del estudiante sin interrogatorios hostiles, atención médica urgente en el CESFAM Huara si hay signos de intoxicación (pérdida de conciencia, taquicardia, vómitos), resguardo de cualquier evidencia entregada voluntariamente en bolsa sellada solo para Carabineros, y denuncia obligatoria a Carabineros o Fiscalía dentro de 24 horas. Filtro TEA/PIE obligatorio antes de sancionar. Sanciones: cigarrillos o vapeadores → falta grave (talleres de prevención); consumo o porte por primera vez → suspensión de 1 a 3 días hábiles y condicionalidad; tráfico, venta organizada o reincidencia crítica → hasta expulsión bajo la Ley Aula Segura. Para mantener la matrícula, el apoderado debe acreditar en 30 días la incorporación del estudiante a tratamiento en la red de salud (CESFAM, SENDA o COSAM).",
    keywords: ["drogas", "droga", "marihuana", "alcohol", "fumar", "vapeador", "vape", "pito", "trafico", "consumo sustancias", "senda"]
  },
  {
    id: "RICE-PROT-N07",
    titulo: "PROTOCOLO N°7 (RICE 2026): DETECCIÓN, PORTE O TENENCIA DE ARMAS O ELEMENTOS PELIGROSOS",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "ARMAS Y ELEMENTOS PELIGROSOS (LEY 17.798 DE CONTROL DE ARMAS): Cubre el porte de armas blancas o cortopunzantes (falta gravísima), el porte o exhibición de armas de fuego o réplicas (máxima gravedad, delito flagrante), y los elementos de ataque o defensa restringidos como manoplas, gas pimienta o electrochoques (falta gravísima). Regla crítica de seguridad: el funcionario NUNCA forcejea para quitar el arma; si hay riesgo activo se evacúa el sector y se llama de inmediato a Carabineros de Huara; si el estudiante la entrega voluntariamente, se resguarda como evidencia con cadena de custodia hasta la llegada de la fuerza pública. La Directora decreta suspensión preventiva de hasta 5 días hábiles mientras se tramita el caso, y tiene la obligación legal de denunciar a Carabineros o Fiscalía dentro de 24 horas. Filtro TEA/PIE obligatorio antes de sancionar. Sanciones: objeto cortopunzante escolar sin intención de ataque → falta grave; armas de fuego o elementos de ataque → hasta expulsión bajo la Ley Aula Segura, con reubicación coordinada por el SLEP Tamarugal.",
    keywords: ["arma", "armas", "cuchillo", "pistola", "cortaplumas", "arma de fuego", "porte de arma", "objeto peligroso"]
  },
  {
    id: "RICE-PROT-N08",
    titulo: "PROTOCOLO N°8 (RICE 2026): ACCIDENTES ESCOLARES Y EMERGENCIAS MÉDICAS",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "ACCIDENTES ESCOLARES Y EMERGENCIAS MÉDICAS: Se distingue el accidente escolar leve o moderado (torceduras, cortes menores, contusiones) de la emergencia médica de riesgo vital (convulsiones prolongadas, shock anafiláctico, paro cardiorrespiratorio, fractura expuesta). Ante cualquier accidente, se prohíbe mover a un estudiante con sospecha de trauma cervical o pérdida de conciencia; se activa el Seguro Escolar (Ley 16.744) y se traslada al CESFAM Huara con acompañamiento de un funcionario. Inspectoría General notifica telefónicamente al apoderado de inmediato, y se sostiene una reunión presencial dentro de 48 horas dejando constancia escrita. Si el estudiante pertenece al PIE o tiene diagnóstico Ley TEA, la Mesa Multidisciplinaria evalúa si el accidente se relaciona con dificultades motoras o una crisis de desregulación. Posteriormente se firma un Plan de Acompañamiento Escolar con adecuaciones de movilidad y flexibilidad de evaluaciones si corresponde.",
    keywords: ["accidente escolar", "emergencia medica", "se cayo", "convulsion", "alergia", "seguro escolar", "lesion", "desmayo"]
  },
  {
    id: "RICE-PROT-008",
    titulo: "PROTOCOLO N° 8: EMBARAZO, MATERNIDAD Y PATERNIDAD ADOLESCENTE",
    seccion: "INCLUSIÓN Y PROTECCIÓN SOCIAL",
    contenido: "PROTOCOLO DE MATERNIDAD Y PATERNIDAD: Las estudiantes embarazadas o madres, y los estudiantes padres, tienen derecho a la continuidad de estudios, calendarios de evaluación flexibles, permisos para controles de salud prenatal y lactancia materna, conforme a la Ley 20.370 y disposiciones del Mineduc. [NOTA INTERNA: revisar contra el nuevo Protocolo N°9 del RICE 2026 — pendiente de la próxima tanda de actualización.]",
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