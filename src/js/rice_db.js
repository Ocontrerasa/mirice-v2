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
    contenido: "PROTOCOLO DE EDUCACIÓN PARVULARIA: Ante crisis de llanto, desregulación emocional o dificultades de adaptación en parvulario (NT1 y NT2), la educadora y asistente técnico aplican contención afectiva física y verbal respetuosa, ambiente seguro y aviso inmediato al apoderado. Queda estrictamente prohibida la expulsión, suspensión o retiro forzado en este nivel educacional (Circular 781 y Ley 21.430).",
    keywords: ["parvularia", "llanto", "desregulacion", "adaptacion", "educadora", "primera infancia", "resguardo"]
  },
  {
    id: "RICE-PROT-001",
    titulo: "PROTOCOLO DE ATRASOS (ARTÍCULO 18)",
    seccion: "TÍTULO VIII — NORMAS DE FUNCIONAMIENTO",
    contenido: "PROTOCOLO DE ATRASOS: El Liceo Huara no utiliza el atraso como motivo de exclusión del aula — el docente no puede impedir el ingreso, pero debe registrar la incidencia. El estudiante atrasado solicita un comprobante en Inspectoría para ingresar a su sala. Escala de intervención por atrasos al inicio de la jornada: 3er atraso mensual → constancia negativa en Lirmi; 5to atraso mensual → citación al apoderado por el Profesor Jefe para firmar compromiso de puntualidad; 10mo atraso mensual/acumulado → entrevista con el Coordinador de Convivencia Educativa para indagar factores de riesgo (ej. transporte rural) y aplicar apoyo socioemocional o familiar. El atraso entre bloques o después de un recreo se considera falta leve. La jornada abre sus puertas a las 07:45 horas; el inicio de clases es a las 08:30 horas.",
    keywords: ["atrasos", "atraso", "llegar tarde", "inasistencia", "inasistencias", "ausencias", "falta", "uniforme", "porteria", "circular 482", "lirmi", "hora de entrada"]
  },
  {
    id: "RICE-PROT-N01",
    titulo: "PROTOCOLO N°1 (RICE 2026): MALTRATO ESCOLAR, ACOSO (BULLYING) Y CIBERACOSO",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "MALTRATO, ACOSO Y CIBERACOSO ENTRE ESTUDIANTES: Se distingue el maltrato aislado (falta grave: hecho puntual y esporádico, sin persecución previa) del acoso escolar o bullying (falta gravísima: requiere intencionalidad, reiteración sostenida y asimetría de poder que deja a la víctima en indefensión) y del ciberacoso (falta gravísima: hostigamiento por redes sociales, WhatsApp u otras plataformas digitales). Procedimiento: el funcionario que recibe el reporte registra el hito en la bitácora dentro de 24 horas hábiles; se aplican medidas de resguardo inmediatas (separación de espacios en recreos, casino y transporte rural; contención con el Equipo de Convivencia Educativa); la investigación dura hasta 5 días hábiles y la resolución se dicta en un máximo de 10 días hábiles (prorrogable por 5). Si el estudiante investigado pertenece al PIE o tiene diagnóstico Ley TEA, la Mesa Multidisciplinaria evalúa el caso antes de sancionar, prohibiéndose sanciones punitivas si la conducta se vincula a su condición. Sanciones: maltrato aislado → registro y talleres formativos; bullying o ciberacoso sostenido → suspensión interna de 3 a 5 días hábiles y condicionalidad extrema de matrícula, pudiendo escalar a expulsión bajo la Ley Aula Segura en casos de daño severo a la salud mental de la víctima.",
    keywords: ["acoso", "bullying", "ciberacoso", "maltrato escolar", "hostigamiento", "burlas", "molestan", "excluyen", "grupo whatsapp", "funa", "no estas solo", "equipo de convivencia educativa"]
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
    contenido: "PROTOCOLO DE MALTRATO INFANTIL EN EL HOGAR: Si un estudiante manifiesta o muestra signos de maltrato o vulneración grave en su entono familiar, el equipo directivo y el equipo de convivencia educativa realizan un informe de derivación confidencial a los organismos de protección (Oficina de Protección de Derechos OPD / Juzgado de Familia) resguardando el interés superior del niño, niña o adolescente.",
    keywords: ["maltrato infantil", "vulneracion", "casa", "hogar", "familia", "padres", "opd", "tribunal", "derechos"]
  },
  {
    id: "RICE-PROT-N05",
    titulo: "PROTOCOLO N°5 (RICE 2026): ABUSO SEXUAL INFANTIL, ACOSO SEXUAL O CONDUCTAS DE CONNOTACIÓN SEXUAL (ASI)",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "ABUSO SEXUAL, ACOSO SEXUAL O CONNOTACIÓN SEXUAL: Cubre las conductas de connotación sexual entre estudiantes (falta gravísima: tocaciones, exhibicionismo, gestos sexuales no consentidos), el acoso sexual digital entre pares (falta gravísima: sexting forzado, grooming, extorsión con material íntimo), y la presunta vulneración sexual por parte de adultos —funcionarios, familiares o terceros— (máxima gravedad, con activación penal inmediata). El liceo NUNCA investiga la veracidad del relato ni realiza careos o interrogatorios repetidos: ante cualquier revelación o sospecha fundada, la Directora tiene la obligación legal de denunciar ante Carabineros, la PDI o el Ministerio Público dentro de 24 horas (Art. 175 Código Procesal Penal), en paralelo a una Medida de Protección ante el Tribunal de Familia. Medidas de resguardo inmediatas: separación física absoluta del presunto agresor (aplicando cambio de funciones si es adulto), contención urgente con el Equipo de Convivencia Educativa, y plan de reparación integral con terapia externa (CESFAM o Centro de Atención a Víctimas en Iquique). La vía penal corre siempre en paralelo e independiente de cualquier proceso interno del liceo.",
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
    id: "RICE-PROT-N09",
    titulo: "PROTOCOLO N°9 (RICE 2026): RETENCIÓN ESCOLAR PARA ESTUDIANTES EMBARAZADAS, MADRES Y PADRES",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "EMBARAZO, MATERNIDAD Y PATERNIDAD ADOLESCENTE: Garantía absoluta de matrícula — prohibido cualquier medida que restrinja el ingreso, condicione la matrícula o sugiera el retiro por embarazo o maternidad/paternidad. Medidas de resguardo: permisos de baño sin restricción, exención del uniforme institucional (autoriza buzo u ropa holgada), espacio protegido de lactancia habilitado por Inspectoría, adecuación en Educación Física (sin ejercicios de alto impacto), asientos prioritarios en el transporte rural. Procedimiento: registro en 24 horas al informarse el estado; citación al apoderado en 48 horas para un Plan de Acompañamiento Individual (PAI) con calendario flexible de evaluaciones y justificación automática de inasistencias por controles médicos; derivación a Chile Crece Contigo (CESFAM Huara). No se aplican sanciones por esta condición; en caso de inasistencias prolongadas por el postparto, se autorizan tutorías a distancia y recalificación de promedios.",
    keywords: ["embarazo", "embarazada", "embarazado", "maternidad", "paternidad", "controles", "lactancia", "gestacion", "padre adolescente", "madre adolescente", "bebe", "guagua"]
  },
  {
    id: "RICE-PROT-N10",
    titulo: "PROTOCOLO N°10 (RICE 2026): OPERACIÓN SEGURA EN SALIDAS PEDAGÓGICAS Y GIRAS DE ESTUDIO",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "SALIDAS PEDAGÓGICAS, GIRAS Y TRANSPORTE INSTITUCIONAL: Ningún estudiante puede abordar un bus de salida sin la Autorización Escrita y Firmada de Puño y Letra de su apoderado — no se aceptan autorizaciones verbales ni telefónicas de última hora. Ante un incidente conductual en la salida (fumar en el bus, destrozar butacas, agredir a un tercero): registro en 24 horas, y es falta grave o gravísima según el RICE. Ante una contingencia vial (pana, bloqueo de ruta): conteo nominal de estudiantes, primeros auxilios, contacto con Carabineros/Posta más cercana, prohibido el trasbordo en vehículos particulares no autorizados. Filtro TEA/PIE obligatorio por el riesgo de sobrecarga sensorial en ciudades grandes. Sanciones por falta acreditada: suspensión de participar en futuras actividades extracurriculares el resto del semestre, con opción de conmutar por Servicio a la Comunidad Educativa.",
    keywords: ["salida pedagogica", "gira de estudio", "excursion", "paseo de curso", "bus de la salida", "autorizacion firmada", "actividad extraprogramatica"]
  },
  {
    id: "RICE-PROT-N11",
    titulo: "PROTOCOLO N°11 (RICE 2026): INASISTENCIA CRÍTICA, AUSENTISMO Y ALERTA DE DESERCIÓN ESCOLAR",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "INASISTENCIA CRÍTICA Y AUSENTISMO: Se activa automáticamente cada viernes si un estudiante acumula 3 inasistencias consecutivas sin justificar o baja del 85% de asistencia mensual. Garantía absoluta de permanencia: prohibido borrar registros, desvincular unilateralmente o \"cerrar por inasistencia\" el año escolar de un estudiante. Procedimiento: llamado al apoderado y notificación por Lirmi Familia en 24 horas; si no responde, citación presencial en 48 horas con Acta de Compromiso de Asistencia; si persiste con 5+ días sin justificar, Visita Domiciliaria en Terreno de el Equipo de Convivencia Educativa; si la negligencia parental persiste tras la visita, denuncia al Tribunal de Familia u OLN en 48 horas (vía paralela e independiente). No se aplican sanciones punitivas al estudiante por sus faltas de asistencia — en su lugar, un Plan de Apoyo Pedagógico de Retención (PAR) con tutorías y calendario flexible.",
    keywords: ["inasistencia", "ausentismo", "faltar al liceo", "deserta", "abandono escolar", "no viene al liceo", "falta mucho"]
  },
  {
    id: "RICE-PROT-N12",
    titulo: "PROTOCOLO N°12 (RICE 2026): VIOLENCIA DE GÉNERO Y DISCRIMINACIÓN (LEY 21.675)",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "VIOLENCIA DE GÉNERO Y DISCRIMINACIÓN (LEY 21.675): Distingue la violencia de género (falta gravísima: violencia física/sexual/psicológica basada en normas y prejuicios de género) de las prácticas discriminatorias por estereotipos (falta grave: comentarios o tratos diferenciados que reproducen roles tradicionales) y de la exposición a violencia intrafamiliar en el hogar (dimensión de resguardo, el estudiante es víctima por exposición). Procedimiento: registro en 24 horas, distanciamiento físico inmediato entre presunta víctima y denunciado, cambio de puesto o de sección, separación en el transporte rural, contención psicosocial urgente. Citación a los apoderados por separado en 48 horas. Filtro TEA/PIE antes de sancionar. Si el hecho es delito (lesiones, abuso sexual, amenazas): denuncia obligatoria a Carabineros/Fiscalía en 24 horas, entrega de información sobre redes de protección (Fono 1455, Centros de la Mujer, SernameG). Resolución en 10 días hábiles (+5 prórroga). Sanciones: discriminación → amonestación grave + talleres; violencia de género acreditada → suspensión de 3 a 5 días + condicionalidad extrema, pudiendo escalar a expulsión bajo la Ley Aula Segura.",
    keywords: ["violencia de genero", "discriminacion", "estereotipos", "sexismo", "machismo", "ley 21675", "trato diferenciado por sexo"]
  },
  {
    id: "RICE-PROT-N13",
    titulo: "PROTOCOLO N°13 (RICE 2026): RESGUARDO DE DERECHOS E IDENTIDAD LGBTIQA+ (LEY JOSÉ MATÍAS)",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "IDENTIDAD DE GÉNERO Y NO DISCRIMINACIÓN LGBTIQA+ (LEY JOSÉ MATÍAS): Es falta gravísima negar el uso del nombre social a un estudiante trans, cuestionar públicamente su identidad, o el hostigamiento/transfobia sostenida entre pares (crear grupos digitales despectivos, sobrenombres humillantes, aislamiento social organizado). Es falta grave que un funcionario se niegue de forma sistemática a usar el nombre social o pronombres solicitados. Medidas de resguardo inmediatas (24 horas): uso obligatorio del nombre social en el pase de asistencia y evaluaciones; acceso a baños/camarines según la identidad del estudiante, resguardando su privacidad sin que sea un aislamiento o castigo; se autoriza el uso de las prendas del uniforme (de damas o varones) coherentes con su identidad de género. Citación a apoderados por separado en 48 horas. Filtro TEA/PIE. Si hay amenazas o agresión física, denuncia penal obligatoria en 24 horas. Resolución en 10 días hábiles. Sanciones ante hostigamiento acreditado: amonestación escrita grave, condicionalidad de matrícula, talleres de diversidad y buen trato.",
    keywords: ["lgbtiqa", "trans", "transgenero", "identidad de genero", "nombre social", "diversidad sexual", "ley jose matias", "pronombres"]
  },
  {
    id: "RICE-PROT-N14",
    titulo: "PROTOCOLO N°14 (RICE 2026): DESREGULACIÓN EMOCIONAL Y CONDUCTUAL (LEY TEA N°21.545)",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "DESREGULACIÓN EMOCIONAL Y CONDUCTUAL (LEY TEA): Una crisis de un estudiante con Trastorno del Espectro Autista u otra condición neurodivergente NUNCA se tipifica como falta disciplinaria ni da lugar a sanciones, castigos, suspensiones, condicionalidad o expulsión — es una manifestación de su variabilidad neurocognitiva. Medidas inmediatas: retirar al estudiante de la fuente de sobrecarga (ruido, aglomeración) hacia la Sala de Recursos o Espacio de Calma, de forma calmada y pausada; prohibido forcejear, zamarrear o contener físicamente de forma invasiva, salvo riesgo inminente de autolesión (y solo por personal capacitado, cesando en cuanto se estabilice). Se prohíbe también exponer públicamente al estudiante o recriminarlo frente al curso (esto último es en sí mismo una falta del adulto). Contacto con el apoderado inmediato, reunión presencial en 48 horas. La Mesa Multidisciplinaria (Coordinación PIE + Equipo de Convivencia Educativa) evalúa el caso en 3 días hábiles y actualiza el Plan de Adecuaciones Curriculares Individualizadas (PACI). Si la crisis excede el alcance del liceo, derivación a CESFAM/COSAM/SENDA.",
    keywords: ["tea", "autismo", "espectro autista", "desregulacion", "crisis sensorial", "sobrecarga sensorial", "asperger", "ley 21545", "pie", "espacio de calma", "neurodivergente"]
  },
  {
    id: "RICE-PROT-N15",
    titulo: "PROTOCOLO N°15 (RICE 2026): ROBO, HURTO O SUSTRACCIÓN DE ESPECIES",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "ROBO, HURTO O SUSTRACCIÓN: Se distingue el hurto (apropiación sin fuerza ni violencia — se aborda formativamente) del robo por fuerza en las cosas (apertura o rotura de mochilas/casilleros — falta gravísima automática) y del robo con violencia o intimidación (rompe la esfera educativa y entra a la justicia penal, activando la Ley Aula Segura). Está estrictamente prohibido realizar registros corporales forzados, revisiones masivas de mochilas sin sospecha fundada, o careos públicos entre estudiantes. Procedimiento: registro en 24 horas, revisión de cámaras y entrevistas privadas por separado; citación a las familias en 48 horas. Si hay violencia/intimidación o rotura intencional que constituya delito: denuncia penal obligatoria en 24 horas y suspensión cautelar bajo Ley Aula Segura. En hurto/robo menor sin violencia: Acta de Reparación de Daños (devolución o compensación) y una medida formativa (Servicio a la Comunidad Educativa o suspensión de 1 a 5 días), con continuidad pedagógica garantizada por UTP.",
    keywords: ["robo", "hurto", "me robaron", "sustraccion", "me quitaron", "desaparecio mi", "mochila robada"]
  },
  {
    id: "RICE-PROT-N16",
    titulo: "PROTOCOLO N°16 (RICE 2026): IDEACIÓN SUICIDA, INTENTOS DE SUICIDIO O AUTOLESIONES",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "IDEACIÓN SUICIDA, AUTOLESIONES O INTENTO DE SUICIDIO (EMERGENCIA DE SALUD MENTAL): Ante una autolesión o intento en curso, el funcionario interviene de inmediato para proteger la vida, retira cualquier objeto de peligro con calma, y NUNCA deja solo al estudiante. Registro en 24 horas bajo la categoría \"Emergencia Salud Mental\". Evaluación inmediata por el Equipo de Convivencia Educativa (riesgo leve/moderado/grave). Si hay heridas físicas o ingesta, traslado inmediato al CESFAM Huara (seguro escolar). Citación de urgencia al apoderado, con extrema reserva. Se entrega una Ficha de Derivación Oficial a la red de salud mental (CESFAM, COSAM Pozo Almonte), y el apoderado firma un Compromiso de Atención de Salud Mental. El liceo NO es un centro de tratamiento psiquiátrico — la responsabilidad de tratamiento es de la red de salud externa; si el apoderado se niega a llevarlo a tratamiento, se notifica al Tribunal de Familia/OLN. Se prohíbe tajantemente aplicar sanciones disciplinarias por estas conductas, al ser hitos de salud mental, no faltas.",
    keywords: ["suicidio", "autolesion", "cortarme", "quiero morir", "no quiero vivir", "me quiero hacer dano", "ideacion suicida", "crisis de salud mental"]
  },
  {
    id: "RICE-PROT-N17",
    titulo: "PROTOCOLO N°17 (RICE 2026): SOSPECHA DE VULNERACIÓN DE DERECHOS EN EL ENTORNO FAMILIAR",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "NEGLIGENCIA, MALTRATO O ABANDONO EN EL HOGAR: Cubre la negligencia grave (omisión constante de alimentación, higiene, vestimenta o salud) y el maltrato físico o psicológico intrafamiliar (lesiones, hematomas, amedrentamiento severo). El adulto que detecta indicadores o recibe la confidencia acoge con empatía y sin juicios, derivando de inmediato al Equipo de Convivencia Educativa, y registra en 24 horas bajo \"Sospecha Vulneración Familiar\". El Equipo de Convivencia Educativa evalúa el nivel de riesgo en un espacio protegido. Si hay riesgo inminente al término de la jornada, el liceo NO entrega al estudiante a un adulto agresor. Derivación a la Oficina Local de la Niñez (OLN) o Medida de Protección al Tribunal de Familia en 5 días hábiles; si hay delito flagrante (lesiones graves), denuncia penal obligatoria en 24 horas. Queda estrictamente prohibido que el liceo intente mediar o realizar careos entre el estudiante y los padres ante sospecha de maltrato físico.",
    keywords: ["maltrato en la casa", "negligencia", "abandono", "maltrato familiar", "me pegan en mi casa", "violencia intrafamiliar", "vulneracion de derechos en el hogar"]
  },
  {
    id: "RICE-PROT-N18",
    titulo: "PROTOCOLO N°18 (RICE 2026): FUGA O SALIDA NO AUTORIZADA DE ESTUDIANTES",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "FUGA O SALIDA NO AUTORIZADA (FALTA GRAVE): Egreso de un estudiante fuera del perímetro del liceo durante la jornada sin autorización escrita del apoderado. Detectada la ausencia, Inspectoría busca primero dentro del recinto; confirmada la fuga, llama de urgencia al apoderado. Si se divisa al estudiante, se le persuade verbalmente a regresar — está prohibido el forcejeo físico o la persecución que exponga a accidentes de tránsito. Si tras 2 horas no hay información de su paradero ni contacto con la familia, la Directora interpone denuncia por Presunta Desgracia ante Carabineros de Huara. Al retornar: citación obligatoria al apoderado, amonestación escrita, y derivación al Equipo de Convivencia Educativa para indagar las causas (acoso escolar, problemas en el aula, crisis socioemocional).",
    keywords: ["fuga", "se arranco", "salio sin permiso", "se escapo del liceo", "salida no autorizada", "cimarra"]
  },
  {
    id: "RICE-PROT-N19",
    titulo: "PROTOCOLO N°19 (RICE 2026): CATÁSTROFES NATURALES Y EVENTOS CLIMÁTICOS EN HUARA",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "SISMOS, TORMENTAS DE ARENA Y LLUVIAS ESTIVALES: Ante un sismo, se activa el Plan PISE con autoprotección y evacuación a las Zonas de Seguridad. Ante tormentas de arena: suspensión inmediata de recreos, ingreso a salas, sellado de puertas/ventanas y uso de mascarillas. Ante lluvias/crecidas: monitoreo de techumbres y accesos. Si al término de la jornada las rutas rurales (Bajo Soga, Pisagua, Quebrada) están cortadas, los estudiantes de esas zonas son albergados dentro del liceo bajo supervisión — prohibida la salida de buses rurales sin autorización de Vialidad, Carabineros o el Comité de Emergencia Municipal. Comunicación oficial por Lirmi Familia, mensajería, y radio local si hay corte de comunicaciones. No se reanudan clases presenciales hasta certificación de infraestructura segura por el SLEP; si el aislamiento rural se prolonga, se activa modalidad remota sin sanciones por ausentismo.",
    keywords: ["sismo", "terremoto", "tormenta de arena", "emergencia climatica", "lluvia", "temporal", "evacuacion", "pise"]
  },
  {
    id: "RICE-PROT-N20",
    titulo: "PROTOCOLO N°20 (RICE 2026): NORMAS DE SEGURIDAD Y CONVIVENCIA EN EL TRANSPORTE ESCOLAR RURAL",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "TRANSPORTE ESCOLAR RURAL: El bus, los paraderos y los tiempos de traslado son una extensión directa del liceo — todas las faltas y sanciones del RICE aplican igual durante el trayecto. Obligaciones del estudiante: cinturón de seguridad abrochado todo el viaje, respetar la fila en el paradero, no asomarse ni lanzar objetos, sin burlas ni acoso a bordo. El apoderado es responsable de la seguridad en el paradero (el liceo no asume custodia antes de subir ni después de bajar); si no hay apoderado esperando a un estudiante de Parvularia/Básica, el auxiliar lo lleva de vuelta a Huara y se entrega en la Subcomisaría de Carabineros. Ante una falta a bordo: registro en el Formulario de Incidencias del auxiliar, ingreso a Lirmi en 24 horas, y en riñas/agresiones se fijan asientos separados para el trayecto de retorno esa misma tarde. Faltas gravísimas a bordo (agresión con lesiones, drogas, armas) activan de inmediato los protocolos específicos correspondientes (N°2, N°6, N°7). Sanción por falta grave reiterada o gravísima: suspensión del beneficio de transporte de 3 a 10 días (hasta el resto del año en casos extremos) — el traslado durante la sanción es responsabilidad del apoderado, y UTP garantiza igual la continuidad pedagógica por Lirmi.",
    keywords: ["bus rural", "transporte escolar", "furgon", "paradero", "bajo soga", "pisagua", "quebrada", "conductor del bus", "auxiliar de ruta"]
  },
  {
    id: "RICE-PROT-N21",
    titulo: "PROTOCOLO N°21 (RICE 2026): MEDIACIÓN ESCOLAR Y GESTIÓN COLABORATIVA DE CONFLICTOS",
    seccion: "PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN (RICE 2026)",
    contenido: "MEDIACIÓN ESCOLAR: Es un recurso voluntario, alternativo y restaurativo — cualquiera de las partes puede negarse a participar en cualquier momento, sin que eso configure una falta. NO es admisible la mediación en: acoso escolar sistemático o agresiones físicas unilaterales con lesiones, hechos que sean delito (abuso sexual, armas de fuego, microtráfico), ni conflictos de Ley Karin entre adultos (que se rigen por la Dirección del Trabajo). El mediador varía según el estamento (Profesor Jefe/Coordinador de Convivencia para estudiantes; Inspectoría o mediador externo del SLEP para funcionarios). Procedimiento en 4 fases: registro y filtro de admisibilidad en 24 horas; citación de las partes en 48 horas con medidas preventivas de separación si corresponde; audiencia de mediación con reglas de trato digno y escucha activa (con filtro TEA/PIE si aplica); Acta de Acuerdo Reparatorio ratificada por Dirección en 3 días, con monitoreo de 15 días hábiles. Si una parte incumple el acuerdo o hay hostilidad reiterada, se declara el quiebre del proceso y se reclasifica como falta Grave o Gravísima según el RICE, con el escalamiento disciplinario ordinario.",
    keywords: ["mediacion escolar", "resolver el conflicto", "conversar el problema", "mediador", "acuerdo reparatorio", "gestion colaborativa"]
  },
  {
    id: "RICE-FLAGRANCIA-001",
    titulo: "PROTOCOLO ANTE FLAGRANCIA DE DROGAS Y ARMAS (ARTÍCULOS 62-63)",
    seccion: "TÍTULO XVI — FLAGRANCIA PENAL",
    contenido: "FLAGRANCIA DE DROGAS Y ARMAS (Art. 62-63, Ley 20.000, Ley 17.798, Art. 175 CPP): Ante detección en flagrancia, se ordena de forma pacífica la entrega del elemento, trasladando al estudiante a una oficina segura acompañado siempre de al menos dos adultos (nunca queda solo con un único funcionario). Se notifica de urgencia al apoderado y a Carabineros. La evidencia se resguarda en el Formulario de Cadena de Custodia (Formato H), sin manipulación excesiva. Denuncia formal en 24 horas. Excepción para Educación Parvularia (NT1 y NT2): los párvulos son penalmente inimputables — nunca se suspende, expulsa ni denuncia como infractor a un párvulo; el procedimiento se limita al resguardo físico, retiro del elemento, citación al apoderado y derivación a la Oficina Local de Niñez (OLN). En Educación Básica y Media, en paralelo a la denuncia penal se activa el debido proceso RICE (Ley Aula Segura) con suspensión preventiva cautelar; está estrictamente prohibido someter al estudiante a interrogatorios policiales informales o forzarlo a autoincriminarse.",
    keywords: ["flagrancia", "encontraron droga", "encontraron arma", "sorprendido con", "cadena de custodia", "formato h"]
  },
  {
    id: "RICE-PARVULARIA-MARCO",
    titulo: "MARCO GENERAL DE CONVIVENCIA EN EDUCACIÓN PARVULARIA (ARTÍCULOS 64-72)",
    seccion: "TÍTULO XVII — EDUCACIÓN PARVULARIA 2026",
    contenido: "PRINCIPIOS Y DERECHOS DE LOS PÁRVULOS (NT1 y NT2): Los párvulos son sujetos de derecho, con enfoque preventivo, formativo y de buen trato (Circular 860, Ley 21.430, Ley TEA 21.545). Está ESTRICTAMENTE PROHIBIDO aplicar suspensión, expulsión, no renovación de matrícula, sanción disciplinaria, amonestación acumulativa o denuncia policial ordinaria a estudiantes de NT1 y NT2 — las regulaciones de faltas y sanciones del RICE NO aplican a los párvulos; su abordaje es siempre formativo y de contención emocional. El uniforme NO es obligatorio en este ciclo (se sugiere ropa cómoda/buzo), con adaptaciones sensoriales para hipersensibilidad táctil o auditiva (Ley TEA). El no tener control de esfínter desarrollado nunca es impedimento para la matrícula o asistencia. Los medicamentos solo se administran con receta médica escrita vigente, entregada por el apoderado con registro de consentimiento. Jornada: ingreso 08:30, salida 15:15 hrs.",
    keywords: ["parvulo", "parvularia", "kinder", "prekinder", "nt1", "nt2", "jardin infantil", "educacion inicial"]
  },
  {
    id: "RICE-PARVULARIA-PROTOCOLOS",
    titulo: "PROTOCOLOS ESPECÍFICOS DE EDUCACIÓN PARVULARIA (PROTOCOLOS 22 A 26)",
    seccion: "TÍTULO XVII — EDUCACIÓN PARVULARIA 2026",
    contenido: "PROTOCOLOS 22-26 PARA PÁRVULOS: (22) Vulneración de derechos: contención inmediata a la altura de los ojos del menor, sin interrogatorio ni careos; registro literal de sus palabras textuales; reporte a Convivencia en 2 horas; denuncia penal en 24 horas si es delito. (23) Desregulación emocional/conductual (Ley TEA): traslado guiado al Espacio de Calma, apoyos sensoriales (orejeras, objetos táctiles); prohibida la contención física forzada o el encierro; el abrazo de contención excepcional solo ante riesgo vital inminente, por personal capacitado. (24) Conflictos entre párvulos (mordidas, empujones): separación afectiva sin gritos ni tirones, contención primero a quien fue agredido, luego al que agredió; mediación lúdica con pictogramas ARASAAC ('puedo/no puedo'); si se repite más de 3 veces al mes, Plan de Acompañamiento Individual. (25) Ausentismo temprano: llamado el mismo día de la inasistencia; tras 15 días consecutivos sin justificar, se agotan 3 llamadas + 1 carta certificada + 1 visita domiciliaria antes de evaluar la vacante — nunca como sanción, siempre buscando el reintegro. (26) Accidentes escolares: primeros auxilios in situ, prohibido mover al párvulo con sospecha de trauma cervical, traslado acompañado de un funcionario al CESFAM, Declaración Individual de Accidente Escolar (Ley 16.744) en 24 horas.",
    keywords: ["parvulo se golpeo", "mordio a otro nino", "parvulo no asiste", "crisis del parvulo", "accidente en el jardin", "parvulo agredido"]
  },
  {
    id: "RICE-DERECHOS-001",
    titulo: "DERECHOS Y DEBERES DE LA COMUNIDAD EDUCATIVA (ARTÍCULOS 3-14)",
    seccion: "TÍTULO VII — DERECHOS, DEBERES Y OBLIGACIONES",
    contenido: "DERECHOS DE LOS ESTUDIANTES (Art. 5): educación integral e inclusiva; trato digno y respetuoso; no discriminación arbitraria (identidad Aymara, orientación sexual, identidad de género, NEE); debido proceso (ser escuchado, presunción de inocencia); protección de la trayectoria (no se puede impedir el ingreso por rendimiento o vulnerabilidad); protección de la maternidad y paternidad; seguridad y Seguro Escolar; evaluación diferenciada (PIE); acceso a JUNAEB/becas; privacidad de sus datos. DEBERES DE LOS ESTUDIANTES (Art. 9): responsabilidad académica sin plagio; convivencia democrática; trato digno (prohibido maltrato, ciberacoso, discriminación); autogestión de información por canales oficiales; uso responsable de tecnología (celular solo con fin pedagógico autorizado, prohibido grabar sin consentimiento); cuidado del entorno. DERECHOS DE APODERADOS (Art. 6): información periódica; trato deferente; participación en el Centro de Padres; apelación ante Dirección/SLEP. DEBERES DE APODERADOS (Art. 10): acompañamiento en la trayectoria; informarse proactivamente del RICE; ciudadanía digital responsable en WhatsApp (prohibida la difamación de funcionarios); acatar las medidas formativas. Todo adulto del liceo tiene el deber ineludible de denunciar de inmediato cualquier sospecha de vulneración, acoso, violencia o abuso sexual contra un estudiante (Art. 14).",
    keywords: ["derechos del estudiante", "deberes del estudiante", "derechos del apoderado", "deberes del apoderado", "derecho a la educacion", "no discriminacion", "trato digno", "privacidad de datos", "articulo 3", "articulo 5", "articulo 9"]
  },
  {
    id: "RICE-COND-001",
    titulo: "CONDUCTO REGULAR: LOS 4 CANALES OFICIALES (ARTÍCULOS 1-2)",
    seccion: "TÍTULO VI — DEL CONDUCTO REGULAR INSTITUCIONAL",
    contenido: "CONDUCTO REGULAR DEL LICEO DE HUARA: Existen 4 canales distintos según la naturaleza de la situación, cada uno con su propia ruta. (a) Canal Académico-Pedagógico (notas, evaluaciones, aprendizaje): Estudiante/Apoderado → Docente de Asignatura → Profesor Jefe → UTP → Dirección. (b) Canal de Convivencia y Relacional (conflictos interpersonales leves o medianos): Estudiante/Apoderado → Profesor Jefe → Inspectoría → Convivencia Educativa → Dirección. (c) Canal Administrativo y de Servicios (infraestructura, bus rural, casino): Apoderado o Funcionario → Inspector General → Dirección → Sostenedor (SLEP Tamarugal). (d) Canal de Alta Complejidad y Legal (vulneraciones graves de derechos o delitos: armas, abuso, microtráfico): Apoderado, Estudiante o Funcionario → Convivencia Educativa → Dirección → Denuncia Obligatoria (24 horas). Todo integrante tiene derecho a ser atendido con respeto, escucha protegida y confidencialidad (Circular 781 Mineduc).",
    keywords: ["conducto regular", "conductos regulares", "canales de atencion", "reclamo", "reclamos", "atencion a apoderados", "profesor jefe", "convivencia educativa", "convivencia escolar", "direccion", "solicitud", "jerarquia", "canal academico", "canal legal"]
  },
  {
    id: "RICE-REG-001",
    titulo: "REGULACIÓN DE DISPOSITIVOS MÓVILES (ARTÍCULOS 25-30, LEY N°21.801)",
    seccion: "TÍTULO X — REGULACIÓN DE DISPOSITIVOS MÓVILES",
    contenido: "DISPOSITIVOS MÓVILES POR NIVEL (Ley N°21.801): Educación Parvularia (NT1/NT2): prohibición absoluta de porte — no se pueden aplicar sanciones disciplinarias en este nivel, solo medidas pedagógicas. Enseñanza Básica 1° a 4°: restricción total, apagado y guardado en la mochila toda la jornada. Básica 5° y 6°: misma restricción, con excepción de uso pedagógico expreso autorizado por UTP. De 7° básico a IV° Medio: el dispositivo permanece guardado durante clases; solo se habilita en los recreos (10:00-10:15, 11:45-12:00, 13:30-14:00, 15:30-15:45) y únicamente en los espacios físicos señalizados para ello — prohibido en salas durante el recreo, casino JUNAEB y baños. Modalidad EPJA (adultos): se permite el porte, uso según normas pedagógicas. Excepción legal: dispositivo como ayuda técnica indispensable para un estudiante con Necesidades Educativas Especiales (PIE). El personal del liceo también está regulado por la Ley N°21.801. Consecuencias por incumplimiento: manipular o tener a la vista el celular sin autorización es falta leve (Código L-03): advertencia y retiro temporal; usar audífonos en clase también es falta leve (L-04); acumular 3 registros en el mes escala a falta grave (G-13): citación al apoderado y prohibición de ingreso del equipo por 15 días; usarlo durante una evaluación es falta grave (G-08): retiro del dispositivo, término de la evaluación, custodia en Inspectoría con entrega solo al apoderado.",
    keywords: ["celular", "celulares", "telefono", "telefonos", "pantallas", "clases", "audifonos", "uso de celular en prueba", "ley 21801", "reloj inteligente", "tablet"]
  },
  {
    id: "RICE-FALTAS-LEVES",
    titulo: "CLASIFICACIÓN DE FALTAS LEVES — CATEGORÍA L (ARTÍCULOS 39 Y 43)",
    seccion: "DEBERES Y REGLAMENTO DISCIPLINARIO FORMATIVO",
    contenido: "FALTAS LEVES (Art. 39/43): conductas que alteran el normal desarrollo educativo sin comprometer la integridad de terceros. Ejemplos con código: atraso al ingreso (L-01) o entre bloques (L-02), celular o audífonos en clase (L-03/L-04), conversación disruptiva (L-06), lanzar objetos menores sin intención de dañar (L-07), deambular sin permiso (L-08), ruidos molestos (L-09), falta de cuadernos o útiles (L-10/L-11), ensuciar el aula o patios (L-12/L-13), descuido de higiene (L-15), asistir sin uniforme sin justificación (L-16). Medidas: diálogo reflexivo inmediato, amonestación verbal privada, registro en la Hoja de Vida Digital; acumular 5 faltas leves en un semestre escala a un Plan de Acompañamiento y Mitigación de Conducta.",
    keywords: ["faltas leves", "art 39", "art 43", "atraso", "uniforme", "celular en clases", "amonestacion verbal", "hoja de vida"]
  },
  {
    id: "RICE-FALTAS-GRAVES",
    titulo: "CLASIFICACIÓN DE FALTAS GRAVES — CATEGORÍA G (ARTÍCULOS 40 Y 44)",
    seccion: "DEBERES Y REGLAMENTO DISCIPLINARIO FORMATIVO",
    contenido: "FALTAS GRAVES (Art. 40/44): afectan directamente el bienestar de otros, dañan el entorno/patrimonio, o son reincidencia sistemática de faltas leves. Ejemplos con código: insultos entre pares (G-01), apodos humillantes (G-02), comentarios racistas/xenófobos (G-03), hurto simple sin fuerza ni violencia (G-04), esconder maliciosamente pertenencias de un compañero (G-05), copiar en una evaluación (G-06/G-07), usar el celular en una prueba (G-08), plagio con IA o de internet (G-09), salir del aula sin permiso (G-10), cimarra o fuga (G-11), desobediencia abierta a una autoridad (G-12), daño a bienes del liceo o del transporte rural (G-14/G-16). Medidas: citación formal al apoderado, Acta de Compromiso, Servicio a la Comunidad Educativa (SCE) o suspensión de 1 a 2 días hábiles.",
    keywords: ["faltas graves", "art 40", "art 44", "insultos", "hurto", "copiar en prueba", "citacion apoderado", "acta de compromiso"]
  },
  {
    id: "RICE-FALTAS-GRAVISIMAS",
    titulo: "CLASIFICACIÓN DE FALTAS GRAVÍSIMAS — CATEGORÍA GG (ARTÍCULOS 41 Y 45)",
    seccion: "DEBERES Y REGLAMENTO DISCIPLINARIO FORMATIVO",
    contenido: "FALTAS GRAVÍSIMAS (Art. 41/45): atentan contra la vida, salud o integridad física/psicológica, o son delito. Ejemplos con código: agresión física entre pares (GG-01), incitar o filmar una riña (GG-02), agresión verbal grave a un docente activando Ley Karin (GG-03), amenazas a funcionarios (GG-04), agresión física a personal del liceo (GG-05, activa expulsión bajo Ley Aula Segura). También: acoso escolar sistemático, porte/consumo/distribución de drogas o alcohol, porte de armas, abuso sexual, e incendios o destrozos mayores. Sanciones: suspensión inmediata como medida cautelar (1 a 5 días), condicionalidad de matrícula, no renovación o expulsión inmediata siguiendo el debido proceso (con reubicación coordinada por el MINEDUC), y denuncia obligatoria ante Carabineros o el Ministerio Público en 24 horas si el hecho reviste delito.",
    keywords: ["faltas gravisimas", "art 41", "art 45", "agresion", "acoso escolar sistematico", "armas", "drogas", "expulsion", "ley aula segura", "delito"]
  },
  {
    id: "RICE-MOCHILAS-001",
    titulo: "PROHIBICIÓN DE INSPECCIÓN DE MOCHILAS Y PERTENENCIAS (ARTÍCULO 46)",
    seccion: "TÍTULO XII — EL JUSTO Y RACIONAL PROCEDIMIENTO",
    contenido: "MOCHILAS Y PERTENENCIAS: Mochilas, bolsos, casilleros, prendas y dispositivos son propiedad privada e intimidad del estudiante. Ningún funcionario puede registrar, abrir o revisar de manera forzada estas pertenencias. Ante sospecha fundada de un elemento prohibido o peligroso (armas, drogas), el funcionario solo puede solicitar al estudiante que exhiba voluntariamente el contenido, en un espacio privado, en presencia de su apoderado y de Convivencia Educativa. Si el estudiante se niega y persiste la sospecha de peligro inminente, el liceo aísla preventivamente y llama a Carabineros de Chile — únicos facultados por ley para realizar registros de pertenencias.",
    keywords: ["revisar mochila", "revision de mochilas", "registro de pertenencias", "me revisaron la mochila", "casillero"]
  },
  {
    id: "RICE-SCE-001",
    titulo: "SERVICIO A LA COMUNIDAD EDUCATIVA — SCE (ARTÍCULOS 47 Y TÍTULO XIV)",
    seccion: "TÍTULO XII / TÍTULO XIV — MEDIDAS FORMATIVAS",
    contenido: "SERVICIO A LA COMUNIDAD EDUCATIVA (SCE): Máxima expresión de justicia restaurativa — el estudiante repara el daño causado mediante acciones concretas en vez de ser apartado del aula. Requiere aceptación voluntaria y por escrito del estudiante y su apoderado (Acta de Acuerdo Reparatorio); si la familia rechaza el SCE, se aplica la suspensión tradicional. Ejemplos permitidos: apoyo en biblioteca, mantención de áreas verdes/huertos, tutorías de lectura a cursos menores, diseño de afiches preventivos, apoyo en el orden del casino. Prohibido: aseo pesado o de baños, o cualquier tarea que humille públicamente al estudiante. Equivalencia: 2 horas pedagógicas de SCE conmutan 1 día de suspensión, con tope de 10 horas por incidente, siempre fuera de la jornada de clases. Supervisado por Inspectoría General o un tutor designado, quien firma un acta de cumplimiento registrada en Lirmi. Entra en vigencia el 1 de agosto de 2026.",
    keywords: ["servicio a la comunidad", "sce", "conmutar suspension", "reparar el dano", "justicia restaurativa", "acta de acuerdo reparatorio"]
  },
  {
    id: "RICE-DEBIDOPROCESO-001",
    titulo: "PRINCIPIOS DEL DEBIDO PROCESO (ARTÍCULOS 48-52)",
    seccion: "TÍTULO XII — EL JUSTO Y RACIONAL PROCEDIMIENTO",
    contenido: "PRINCIPIOS DEL DEBIDO PROCESO: Todo procedimiento indagatorio debe respetar: (a) Idoneidad e imparcialidad del investigador; (b) Presunción de inocencia — el estudiante no es culpable mientras no haya una resolución formal, aunque el liceo sí puede decretar medidas de resguardo inmediatas (separación de espacios) sin que eso implique responsabilidad anticipada; (c) Absoluta reserva y confidencialidad de toda declaración; (d) Derecho a ser escuchado y presentar descargos, de forma presencial o escrita. Órganos: la Unidad de Convivencia Educativa instruye el proceso; Inspectoría General o UTP resuelve faltas leves y graves; SOLO la Directora puede resolver faltas gravísimas (expulsión o cancelación de matrícula), previo informe de Convivencia Educativa. Citaciones: correo institucional, carta timbrada y firmada, o llamado telefónico registrado. Si la falta es además delito (tráfico, lesiones graves, abuso sexual, amenazas de muerte, arma de fuego), el liceo denuncia a Carabineros/PDI/Ministerio Público en 24 horas — esta vía penal es independiente y no detiene las medidas internas del liceo.",
    keywords: ["debido proceso", "presuncion de inocencia", "investigacion", "descargos", "derecho a ser escuchado", "quien puede expulsar", "confidencialidad del proceso"]
  },
  {
    id: "RICE-CONDICIONALIDAD-001",
    titulo: "CONDICIONALIDAD Y NO RENOVACIÓN DE MATRÍCULA (ARTÍCULOS 53-59)",
    seccion: "TÍTULO XIII — CONDICIONALIDAD Y NO RENOVACIÓN DE MATRÍCULA",
    contenido: "CONDICIONALIDAD DE MATRÍCULA: Medida excepcional que condiciona la permanencia futura del estudiante. Solo la Dirección puede decretarla, nunca de forma discrecional. Condicionalidad Simple: por reiteración de faltas graves pese a apoyo previo. Condicionalidad Extrema: por una falta gravísima, cuando la Dirección decide no aplicar la expulsión directamente. Nunca se aplica a estudiantes recién matriculados (Ley 20.845). Procedimiento: informe técnico fundado (Inspectoría + Coordinador de Convivencia + equipo psicosocial) constatando que hubo un Plan de Acompañamiento Individual previo sin resultado; audiencia de descargos con 3 días hábiles para responder; resolución fundada de Dirección; firma de un Acuerdo y Compromiso de Convivencia. Vigencia máxima de un semestre (prorrogable a un año), con seguimiento quincenal del equipo psicosocial. Una nueva falta durante la condicionalidad NO habilita expulsión automática — exige un nuevo proceso independiente. NO RENOVACIÓN DE MATRÍCULA: solo tras agotar todo apoyo pedagógico/psicosocial; se notifica por escrito con 30 días hábiles de anticipación; el apoderado tiene 5 días hábiles para apelar por escrito ante Dirección, que debe resolver en 5 días hábiles.",
    keywords: ["condicionalidad", "no renovacion de matricula", "cancelacion de matricula", "expulsion", "apelacion", "recurso de apelacion", "acuerdo y compromiso de convivencia"]
  },
  {
    id: "RICE-INST-001",
    titulo: "PROYECTO EDUCATIVO: MISIÓN, VISIÓN Y SELLOS INSTITUCIONALES (TÍTULO III)",
    seccion: "TÍTULO III — FUNDAMENTOS ESTRATÉGICOS (Proyecto Educativo, Misión, Visión y Sellos)",
    contenido: "MISIÓN INSTITUCIONAL: Formar estudiantes integrales, con sólidos valores éticos y académicos, capaces de insertarse constructivamente en la sociedad. A través de una educación inclusiva y de calidad, el Liceo Huara busca potenciar las habilidades y talentos de cada alumno y alumna, respetando su diversidad y promoviendo el compromiso con su entorno social y cultural. VISIÓN INSTITUCIONAL: Ser una institución educativa líder en la región, reconocida por su excelencia académica, su clima de convivencia armónica y su capacidad para formar ciudadanos responsables, críticos y comprometidos con el desarrollo sostenible de su comunidad. Aspiramos a que nuestros egresados y egresadas de la modalidad Científico-Humanista y Técnico-Profesional cuenten con las herramientas necesarias para enfrentar con éxito los desafíos del siglo veintiuno. SELLOS EDUCATIVOS: Inclusión Educativa (reconocimiento y valoración de la diversidad como una oportunidad de aprendizaje); Identidad Territorial (rescate y promoción de la cultura local y el patrimonio de la comuna de Huara); Excelencia y Rigor (compromiso con la calidad de los aprendizajes y el desarrollo máximo de las potencialidades); Convivencia Democrática (fomento de relaciones basadas en el respeto, la participación y la resolución pacífica de conflictos).",
    keywords: ["mision", "vision", "mision institucional", "vision institucional", "sellos educativos", "proyecto educativo", "pei", "fundamentos estrategicos", "identidad institucional", "que es el liceo de huara", "valores del liceo", "para que existe el liceo", "sello educativo"]
  }
,
  // === ARTÍCULOS DEL RICE COMPLETO (72 artículos, Títulos VI-XVII) ===
  // Agregados automáticamente el 02-ago-2026 a partir del PDF del RICE
  // para que el chatbot pueda responder sobre cualquier artículo, no solo
  // los protocolos que ya estaban cubiertos.
  {
    id: "RICE-ART-001",
    titulo: "ARTÍCULO 1: DEFINICIÓN E IMPORTANCIA DEL CONDUCTO REGULAR",
    seccion: "TÍTULO VI — Conducto Regular Institucional",
    contenido: "DEFINICIÓN E IMPORTANCIA DEL CONDUCTO REGULAR. El Conducto Regular constituye el orden jerárquico obligatorio establecido por el Liceo de Huara para canalizar consultas, inquietudes, reclamos, dificultades pedagógicas o situaciones de Convivencia. Su cumplimiento resguarda el debido proceso, garantiza que las problemáticas se resuelvan en la instancia más cercana al hito, promueve el respeto profesional y evita el colapso administrativo de las unidades de liderazgo. Para la comprensión de los gráficos se establece la siguiente leyenda visual: Inicio de Si no hay respuesta Si hay respuesta favorable consulta favorable",
    keywords: ["articulo 1", "conducto", "definición", "importancia", "regular"]
  },
  {
    id: "RICE-ART-002",
    titulo: "ARTÍCULO 2: ESTRUCTURACIÓN DE LOS CANALES DE COMUNICACIÓN",
    seccion: "TÍTULO VI — Conducto Regular Institucional",
    contenido: "ESTRUCTURACIÓN DE LOS CANALES DE COMUNICACIÓN. Se definen cuatro conductos regulares específicos según la naturaleza de la situación: a) Canal Académico - Pedagógico: Regula controversias sobre calificaciones, evaluaciones o aprendizaje en aula. Ruta obligatoria: Estudiante Docente de Profesor UTP Dirección apoderado asignatura Jefe Solución b) Canal de Convivencia y Relacional: Aborda conflictos interpersonales leves o medianos. Ruta obligatoria: Estudiante Profesor Inspectoría Convivencia Dirección apoderado Jefe Educativa Solución 22 UNIDAD DE CONVIVENCIA EDUCATIVA c) Canal Administrativo y de Servicios: Canaliza requerimientos de infraestructura, bus rural o casino. Ruta obligatoria: Apoderado o Inspector Dirección Sostenedor (SLEP Tamarugal Funcionario General Solución d) Canal de Alta Complejidad y Legal: Aplica ante presuntas vulneraciones graves de derechos o delitos (armas, abuso, microtráfico). Ruta: Apoderado, Convivencia Estudiante o Dirección Denuncia Obligatoria (24 horas) Educativa Funcionario 23 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 2", "canales", "comunicación", "estructuración"]
  },
  {
    id: "RICE-ART-003",
    titulo: "ARTÍCULO 3: DERECHOS UNIVERSALES FUNDAMENTALES",
    seccion: "TÍTULO VII — Derechos, Deberes y Obligaciones",
    contenido: "DERECHOS UNIVERSALES FUNDAMENTALES. a) Derecho al Respeto y Trato Digno: Todo integrante tiene derecho a ser tratado con respeto, dignidad y sin violencia. Se prohíbe el uso de lenguaje soez, gestos amenazantes o cualquier forma de maltrato físico o psicológico. b) Derecho a la Integridad y Seguridad: Derecho a desarrollarse en un entorno seguro y saludable que proteja la vida y la integridad física y moral de las personas. c) Derecho a la No Discriminación Arbitraria: Nadie podrá ser discriminado por su origen étnico (identidad Aymara), religión, orientación sexual, identidad de género, condición socioeconómica o necesidades educativas (Ley TEA). d) Derecho a la Libertad de Expresión: Derecho a manifestar ideas y opiniones de forma respetuosa y fundamentada, promoviendo el pensamiento crítico y la participación democrática. e) Derecho al Debido Proceso: Derecho a que cualquier conflicto o medida sea abordada mediante un procedimiento justo, racional y transparente, con derecho a ser escuchado.",
    keywords: ["articulo 3", "derechos", "fundamentales", "universales"]
  },
  {
    id: "RICE-ART-004",
    titulo: "ARTÍCULO 4: DEBERES UNIVERSALES FUNDAMENTALES",
    seccion: "TÍTULO VII — Derechos, Deberes y Obligaciones",
    contenido: "DEBERES UNIVERSALES FUNDAMENTALES. a) Deber de Buen Trato: Utilizar permanentemente un lenguaje cordial y conductas de cortesía hacia todos los miembros de la comunidad, modelando el respeto mutuo. b) Deber de Resguardo del RICE: Es obligación de todos conocer, respetar y cumplir las normas establecidas en este Reglamento. El desconocimiento de la norma no exime de responsabilidad. c) Deber de Cuidado Patrimonial: Velar por el aseo, orden y mantenimiento de la infraestructura, mobiliario y recursos tecnológicos, entendiéndolos como bienes públicos al servicio del aprendizaje. d) Deber de Resolución Pacífica: Agotar siempre las instancias de diálogo y mediación frente a desacuerdos, rechazando la violencia en todas sus formas como método de resolución de conflictos. e) Deber de Proactividad Informativa: Consultar activamente los canales de comunicación oficiales para asegurar un flujo de información efectivo y transparente entre los estamentos. 24 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 4", "deberes", "fundamentales", "universales"]
  },
  {
    id: "RICE-ART-005",
    titulo: "ARTÍCULO 5: DERECHOS DE ESTUDIANTES.",
    seccion: "TÍTULO VII — Derechos, Deberes y Obligaciones",
    contenido: "DERECHOS DE ESTUDIANTES.. En el marco del Servicio Local de Educación Pública Tamarugal, el estudiante es el centro del quehacer pedagógico, garantizándosele un entorno seguro y de excelencia para el despliegue de su proyecto de vida, resguardado por los siguientes derechos inalien ables: a) Educación Integral e Inclusiva: Recibir una formación de calidad que promueva el máximo desarrollo de sus capacidades, bajo los principios de la Educación Pública. b) Trato Digno y Respetuoso: Ser respetados en su integridad física y psicológica, libres de tratos vejatorios o maltrato. c) No Discriminación Arbitraria: Resguardo de su identidad cultural Aymara, orientación sexual, identidad de género y condiciones de salud o NEE (Ley TEA). d) Debido Proceso : Derecho a ser escuchado, a la presunción de inocencia y a una resolución justa ante cualquier medida. e) Protección de la Trayectoria: No podrá impedirse el ingreso o permanencia por rendimiento académico o vulnerabilidad. f) Protección de la Maternidad y Paternidad: Facilidades académicas para compatibilizar la crianza con sus estudios (Ley 19.688). g) Seguridad y Salud Escolar: Contar con un recinto seguro y aplicación inmediata del Seguro Escolar. h) Evaluación y Apoyos : Recibir evaluación diferenciada y apoyos especializados (PIE) según diagnóstico. i) Acceso a Beneficios: Participar en programas de apoyo (JUNAEB, becas) según criterios de focalización. j) Privacidad: Resguardo estricto de sus datos personales y antecedentes escolares.",
    keywords: ["articulo 5", "derechos", "estudiantes"]
  },
  {
    id: "RICE-ART-006",
    titulo: "ARTÍCULO 6: DERECHOS DE MADRES, PADRES Y APODERADOS",
    seccion: "TÍTULO VII — Derechos, Deberes y Obligaciones",
    contenido: "DERECHOS DE MADRES, PADRES Y APODERADOS. El establecimiento reconoce a los apoderados como colaboradores esenciales del proceso educativo: a) Derecho a la Información : Ser informados periódicamente sobre la asistencia, el rendimiento y el comportamiento de sus pupilos. b) Derecho al Respeto Institucional : Recibir un trato deferente y profesional de parte de todo el personal del liceo. c) Derecho a la Participación: Integrar el Centro General de Padres y participar en el Consejo Escolar. d) Derecho de Apelación: Interponer recursos ante la Dirección o el SLEP frente a medidas consideradas injustas.",
    keywords: ["apoderados", "articulo 6", "derechos", "madres", "padres"]
  },
  {
    id: "RICE-ART-007",
    titulo: "ARTÍCULO 7: DERECHOS DE DOCENTES Y ASISTENTES DE LA EDUCACIÓN",
    seccion: "TÍTULO VII — Derechos, Deberes y Obligaciones",
    contenido: "DERECHOS DE DOCENTES Y ASISTENTES DE LA EDUCACIÓN. a) Derecho al Respeto a su Integridad: Trabajar en un ambiente libre de violencia, acoso sexual o laboral (Ley Karin). b) Derecho a la Autonomía Profesional: Ejercer funciones pedagógicas conforme al PEI y la libertad de cátedra. 25 UNIDAD DE CONVIVENCIA EDUCATIVA c) Derecho a ser Escuchados: Participar en la toma de decisiones técnico - pedagógicas y de convivencia. d) Protección contra Denuncias Infundadas: Contar con procedimientos de investigación justos y objetivos.",
    keywords: ["articulo 7", "asistentes", "derechos", "docentes", "educación"]
  },
  {
    id: "RICE-ART-008",
    titulo: "ARTÍCULO 8: DERECHOS DEL EGE (DIRECTIVOS Y COORDINADORES):",
    seccion: "TÍTULO VII — Derechos, Deberes y Obligaciones",
    contenido: "DERECHOS DEL EGE (DIRECTIVOS Y COORDINADORES):. a) Autoridad Pedagógica: Derecho a ser validados en su toma de decisiones técnicas por todos los estamentos del liceo. b) Protección Legal: Resguardo ante agresiones o acoso por parte de terceros en el ejercicio de sus funciones (Art. 354 del Código Penal y Ley Karin). c) Autonomía Profesional: Facultad para diseñar e implementar estrategias de mejora dentro del marco del PEI y la normativa del SLEP.",
    keywords: ["articulo 8", "coordinadores", "derechos", "directivos"]
  },
  {
    id: "RICE-ART-009",
    titulo: "ARTÍCULO 9: DEBERES DE LOS ESTUDIANTES",
    seccion: "TÍTULO VII — Derechos, Deberes y Obligaciones",
    contenido: "DEBERES DE LOS ESTUDIANTES. El estudiante del Liceo Huara ejerce su libertad a través de la responsabilidad ciudadana: a) Responsabilidad Académica y Autogestión: Estudiar y esforzarse por alcanzar el máximo desarrollo de sus talentos. Debe organizar sus tiempos, materiales y cumplir con sus deberes escolares con honestidad ética (evitando el plagio). b) Convivencia Democrática y Ciudadana: Ejercer la libertad de expresión de manera respetuosa y fundamentada, aceptando la discrepancia y participando en instancias estudiantiles. c) Trato Digno y Transversal: Brindar respeto a todos los miembros de la comunidad, prohibiéndose el maltrato, ciberacoso y cualquier discriminación (cultural, TEA o género). d) Deber de Autogestión de la Información: Consultar proactivamente los canales oficiales (diarios murales, plataformas) para estar al día con sus responsabilidades y normativas. e) Uso Responsable de Tecnología: Utilizar celulares solo con fines pedagógicos autorizados, prohibiéndose grabaciones o capturas de imagen sin consentimiento. f) Cuidado del Entorno: Mantener el aseo y la integridad del mobiliario y patrimonio del liceo, entendiéndolos como bienes públicos.",
    keywords: ["articulo 9", "deberes", "estudiantes"]
  },
  {
    id: "RICE-ART-010",
    titulo: "ARTÍCULO 10: DEBERES DE LOS PADRES Y APODERADOS",
    seccion: "TÍTULO VII — Derechos, Deberes y Obligaciones",
    contenido: "DEBERES DE LOS PADRES Y APODERADOS. Como primeros educadores y colaboradores estratégicos: a) Acompañamiento en la Trayectoria : Establecer hábitos de estudio en el hogar, supervisar el bienestar emocional y asegurar la asistencia regular y puntual de su pupilo. b) Búsqueda Activa de Información: A pesar de que el desconocimiento de la norma no exime de responsabilidades, el apoderado debe informarse proactivamente sobre el RICE y las comunicaciones institucionales. El establecimiento mantendrá una política permanente de inducción y socialización del presente reglamento para facilitar su comprensión y el compromiso de co - responsabilidad del apoderado. 26 UNIDAD DE CONVIVENCIA EDUCATIVA c) Ciudadanía Digital: Utilizar redes sociales y grupos de WhatsApp solo para fines de colaboración, evitando la difamación o crítica destructiva hacia funcionarios. d) Respeto Transversal al RICE: Acatar las medidas formativas y disciplinarias cuando se ajusten al reglamento, colaborando en la reparación conductual de su pupilo.",
    keywords: ["apoderados", "articulo 10", "deberes", "padres"]
  },
  {
    id: "RICE-ART-011",
    titulo: "ARTÍCULO 11: DEBERES DE DOCENTES Y ASISTENTES DE LA EDUCACIÓN",
    seccion: "TÍTULO VII — Derechos, Deberes y Obligaciones",
    contenido: "DEBERES DE DOCENTES Y ASISTENTES DE LA EDUCACIÓN. Como autoridades pedagógicas y garantes de la seguridad ciudadana dentro del plantel: a) Gestión Transversal de la Convivencia: Intervenir proactivamente ante cualquier falta observada, sin delegar la resolución de conflictos menores, aplicando mediación y registro objetivo. b) Planificación y Diseño Universal (DUA): Obligación de planificar clases diversificadas y realizar los Adecuamientos Curriculares (PACI) necesarios para estudiantes con NEE. c) Registro, Trazabilidad y Debido Proceso: Mantener al día el Libro de Clases con evidencias de las intervenciones pedagógicas antes de escalar a sanciones. d) Presencia Activa y Supervigilancia: Cumplir rigurosamente con los turnos de patio y recreo, actuando preventivamente ante riesgos físicos o sociales. e) Autoridad Pedagógica Ética: Ejercer el rol docente sin recurrir al sarcasmo, el grito o la exposición pública del estudiante, modelando en todo momento el buen trato. f) Actualización Normativa Permanente: Estudiar y aplicar íntegramente el RICE y protocolos de la SUPEREDUC, participando en capacitaciones obligatorias sobre Ley Karin, TEA e Inclusión.",
    keywords: ["articulo 11", "asistentes", "deberes", "docentes", "educación"]
  },
  {
    id: "RICE-ART-012",
    titulo: "ARTÍCULO 12: DEBERES DEL EQUIPO DIRECTIVO SUPERIOR (DIRECTOR,",
    seccion: "TÍTULO VII — Derechos, Deberes y Obligaciones",
    contenido: "DEBERES DEL EQUIPO DIRECTIVO SUPERIOR (DIRECTOR,. INSPECTORÍA, UTP) a) Garantes de Derechos: Asegurar que cada acción del liceo proteja la trayectoria educativa y la dignidad de los estudiantes. b) Transparencia: Mantener informada a la comunidad y al SLEP sobre el uso de recursos y resultados académicos. c) Probidad Administrativa: Actuar con objetividad e imparcialidad en la resolución de conflictos laborales y estudiantiles.",
    keywords: ["articulo 12", "deberes", "directivo", "director", "equipo", "superior"]
  },
  {
    id: "RICE-ART-013",
    titulo: "ARTÍCULO 13: DEBERES DE LOS COORDINADORES (CONVIVENCIA Y PIE):",
    seccion: "TÍTULO VII — Derechos, Deberes y Obligaciones",
    contenido: "DEBERES DE LOS COORDINADORES (CONVIVENCIA Y PIE):. a) Asesoría Especializada: Proveer al Equipo Directivo de diagnósticos técnicos sobre el estado de la convivencia y la inclusión. b) Activación de Protocolos: Asegurar la correcta y oportuna aplicación de los protocolos ante situaciones de maltrato o vulneración de derechos. c) Acompañamiento Docente: Entregar herramientas prácticas a los profesores para manejar la diversidad en el aula y los conflictos de convivencia. 27 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 13", "convivencia", "coordinadores", "deberes"]
  },
  {
    id: "RICE-ART-014",
    titulo: "ARTÍCULO 14: RESPONSABILIDADES COMUNES DE TODO ADULTO EN EL",
    seccion: "TÍTULO VII — Derechos, Deberes y Obligaciones",
    contenido: "RESPONSABILIDADES COMUNES DE TODO ADULTO EN EL. LICEO Todo adulto que desempeñe funciones o se vincule con el establecimiento tiene el deber ineludible de: a) Garantizar el Buen Trato: Dirigirse a todos los miembros de la comunidad con respeto, utilizando un lenguaje verbal y no verbal adecuado, libre de descalificaciones, gritos o gestos despectivos. b) Deber de Denuncia y Reporte: Activar de inmediato los protocolos del RICE ante cualquier sospecha o evidencia de vulneración de derechos, acoso, violencia o abuso sexual contra estudiantes, conforme a la legislación vigente. c) Modelamiento de Resolución de Conflictos: Resolver sus diferencias de opinión de manera profesional, constructiva y respetando los conductos regulares, evitando ventilar discrepancias laborales o personales frente a las y los estudiantes. d) Coherencia con el Enfoque Formativo: Promover activamente medidas formativas y restaurativas en sus interacciones, evitando dinámicas de poder arbitrarias o punitivas que contradigan el sello institucional. e) Responsabilidades Específicas por Estamento : Estamento Responsabilidad Clave en Convivencia Liderar la implementación del Plan de Gestión de la Convivencia, Equipo Directivo y asegurar los recursos para la prevención y garantizar el debido proceso de Gestión en la aplicación de medidas de resolución de conflictos. Implementar estrategias de Aprendizaje Socioemocional (SEL) en el Docentes y aula, mantener un control de grupo basado en el respeto mutuo, aplicar Profesionales de ajustes razonables (PIE) y registrar las intervenciones oportunamente en Apoyo los sistemas de seguimiento. Resguardar la sana convivencia en espacios comunes (patios, Asistentes de la comedores, accesos), actuar como primera contención ante situaciones Educación de crisis y modelar conductas de respeto y autocuidado. Adheri...",
    keywords: ["adulto", "articulo 14", "comunes", "responsabilidades"]
  },
  {
    id: "RICE-ART-015",
    titulo: "ARTÍCULO 15: INICIO DE LA JORNADA",
    seccion: "TÍTULO VIII — Normas de Funcionamiento",
    contenido: "INICIO DE LA JORNADA. El Liceo garantiza la apertura de puertas a las 07:45 horas para la recepción de estudiantes, bajo supervisión del personal de turno. APERTURA 07:45 HORAS INICIO 08:30 HORAS",
    keywords: ["articulo 15", "inicio", "jornada"]
  },
  {
    id: "RICE-ART-016",
    titulo: "ARTÍCULO 16: RÉGIMEN DE RECREOS Y DESCANSOS",
    seccion: "TÍTULO VIII — Normas de Funcionamiento",
    contenido: "RÉGIMEN DE RECREOS Y DESCANSOS. Todos los niveles desde 1° Básico hasta 4° Medio comparten una estructura unificada de pausas pedagógicas para facilitar la supervisión y la convivencia en patios: Ciclo / Nivel Horario de salida Horario de salida Pausas pedagógicas Almuerzo Educativo lunes a jueves viernes (recreos) centralizado (PAE) Primer Ciclo 1er 10:00 a 10:15 hrs. Básico 15:30 hrs. 13:30 hrs. 13:30 a 14:00 hrs. (1° a 4° Básico) 2do 11:45 a 12:00 hrs. Segundo Ciclo Básico 1er 10:00 a 10:15 hrs. 15:30 hrs. 13:30 hrs. 13:30 a 14:00 hrs. (5° a 8° Básico) 2do 11:45 a 12:00 hrs. Enseñanza Lu – Ma : 17:15hrs. 1er 10:00 a 10:15 hrs. Media C - H 13:30 hrs. 2do 11:45 a 12:00 hrs. 13:30 a 14:00 hrs. (1° y 2° Medio) Mi – Ju : 15:30 hrs. 3er 15:30 a 15:45 hrs. Enseñanza 1er 10:00 a 10:15 hrs. Lu - Ma : 17:15hrs. Media T - P 13:30 hrs. 2do 11:45 a 12:00 hrs. 13:30 a 14:00 hrs. (3° y 4° Mi – Ju : 15:30 hrs. medio ) 3er 15:30 a 15:45 hrs. 29 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 16", "descansos", "recreos", "régimen"]
  },
  {
    id: "RICE-ART-017",
    titulo: "ARTÍCULO 17: DEFINICIONES DE ASISTENCIA, PUNTUALIDAD Y",
    seccion: "TÍTULO VIII — Normas de Funcionamiento",
    contenido: "DEFINICIONES DE ASISTENCIA, PUNTUALIDAD Y. JUSTIFICACIONES El Liceo Huara establece que la presencia del estudiante en las actividades académicas es el requisito básico para el ejercicio del derecho a la educación y el cumplimiento de los planes de estudio vigentes. a) Obligatoriedad de la Asistencia: La asistencia a clases y a todas las actividades programadas por el establecimiento es obligatoria para todos los estudiantes matriculados. Se considera que el estudiante está presente cuando se encuentra físicamente en el aula o lugar asignado para la actividad pedagógica al momento del registro. b) Definición de Inasistencia: Se considerará inasistencia cuando el estudiante no se presente a la jornada diaria o a un bloque de clase específico sin que exista una justificación previa autorizada. Toda inasistencia debe ser registrada de manera inmediata en el Libro de Clases Digital por el docente a cargo del bloque correspondiente. c) Definición y Tipos de Atraso: Se entiende por atraso la llegada del estudiante una vez iniciado el periodo de clases según el horario oficial. Estos se clasifican en: i. Atraso de Entrada: Corresponde a la llegada del estudiante posterior al inicio de la primera hora pedagógica del día (08:30 horas). Todo estudiante en esta condición debe registrarse en Inspectoría General antes de ingresar al aula para que su ingreso sea consignado en el s istema digital. ii. Atraso entre Clases: Es la demora en la llegada al aula o taller una vez finalizados los recreos pedagógicos o en el cambio de bloque horario dentro del establecimiento. d) Registro de Puntualidad: Todo atraso, ya sea de entrada o entre clases, debe ser registrado obligatoriamente en el Libro de Clases Digital . Este registro constituye la evidencia oficial para la trazabilidad de la trayectoria educativa del estudiante y la c...",
    keywords: ["articulo 17", "asistencia", "definiciones", "puntualidad"]
  },
  {
    id: "RICE-ART-018",
    titulo: "ARTÍCULO 18: PROTOCOLO DE ATRASOS",
    seccion: "TÍTULO VIII — Normas de Funcionamiento",
    contenido: "PROTOCOLO DE ATRASOS. a) El Liceo Huara no utiliza el atraso como motivo de exclusión del aula, priorizando siempre el Derecho a la Educación . b) Ingreso al Aula: El estudiante atrasado deberá solicitar un comprobante en Inspectoría para ingresar a su sala. El docente no puede impedir el ingreso , pero debe registrar la incidencia. c) Escala de Intervención por Atrasos al inicio de la jornada : i. 3° Atraso mensual: Constancia negativa en LIRMI ii. 5° Atraso mensual: Citación al apoderado por parte del Profesor Jefe para firmar compromiso de puntualidad. d) 10° Atraso mensual/acumulado: Entrevista con el Coordinador de Convivencia Educativa para indagar factores de riesgo y aplicar medidas de apoyo socioemocional o familiar. e) Atrasos entre bloques: El atraso entre clases o recreos dentro de la jornada escolar será considerado como una falta leve, aplicando las medidas dispuestas en este RICE.",
    keywords: ["articulo 18", "atrasos", "protocolo"]
  },
  {
    id: "RICE-ART-019",
    titulo: "ARTÍCULO 19: DEL RECREO Y EL PROCESO DE ALIMENTACIÓN",
    seccion: "TÍTULO VIII — Normas de Funcionamiento",
    contenido: "DEL RECREO Y EL PROCESO DE ALIMENTACIÓN. a) El Recreo como Espacio de Bienestar: Los recreos son tiempos de descanso protegidos. Salvo algún hecho relacionado con la seguridad , los docentes u otros funcionarios no pueden retener a estudiantes en sala durante el recreo . b) Uso de Comedores (JUNAEB y Externos): c) El uso del comedor es obligatorio para el consumo de almuerzos. No se permite comer en salas, bibliotecas o laboratorios por razones de higiene. d) Los estudiantes deben respetar los turnos asignados para el almuerzo por nivel para evitar hacinamiento. e) Almuerzo fuera del Liceo: El liceo es responsable de la seguridad de los estudiantes durante toda la jornada JEC. f) Solo podrán salir a almorzar fuera del establecimiento aquellos estudiantes cuyos apoderados firmen un \\\"Consentimiento Expreso de Salida\\\", asumiendo la responsabilidad civil del trayecto. Sin este documento, ningún estudiante podrá abandonar el recinto has ta el fin de su jornada.",
    keywords: ["alimentación", "articulo 19", "proceso", "recreo"]
  },
  {
    id: "RICE-ART-020",
    titulo: "ARTÍCULO 20: SALIDAS ANTICIPADAS Y RETIROS",
    seccion: "TÍTULO VIII — Normas de Funcionamiento",
    contenido: "SALIDAS ANTICIPADAS Y RETIROS. a) Retiro de Menores: Solo el Apoderado Titular o Suplente registrado en la ficha de matrícula podrá retirar a un estudiante antes del término de la jornada. Deberá presentarse con su cédula de identidad y firmar el \\\"Libro de Salidas\\\". b) Emergencias Médicas: En caso de accidente o malestar súbito, el liceo contactará de inmediato al apoderado. Si la situación lo requiere y no se logra contacto, se activará el Seguro Escolar trasladando al estudiante al centro asistencial más cercano (Huara o Iquique), informa ndo posteriormente al apoderado. 31 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["anticipadas", "articulo 20", "retiros", "salidas"]
  },
  {
    id: "RICE-ART-021",
    titulo: "ARTÍCULO 21: DE LOS ACCESOS, INGRESOS Y SALIDAS DEL",
    seccion: "TÍTULO VIII — Normas de Funcionamiento",
    contenido: "DE LOS ACCESOS, INGRESOS Y SALIDAS DEL. ESTABLECIMIENTO Para garantizar un flujo ordenado y resguardar la integridad física de los estudiantes, especialmente de aquellos que utilizan el transporte escolar rural, se establecen los siguientes puntos de control y acceso: Definición de Accesos: El Liceo Huara cuenta con dos vías oficiales de tránsito: Acceso Ubicado por la calle Arturo Prat . Es la puerta oficial Principal: para público general, visitas y apoderados. Acceso Ubicado por la calle Rafael Sotomayor . Es de uso Secundario: exclusivo para estudiantes que utilizan el transporte escolar y servicios autorizados. Asimismo , la salida de segundo ciclo y enseñanza media.",
    keywords: ["accesos", "articulo 21", "ingresos", "salidas"]
  },
  {
    id: "RICE-ART-022",
    titulo: "ARTÍCULO 22: PROTOCOLO DE INGRESO Y SALIDA SEGÚN PROCEDENCIA:",
    seccion: "TÍTULO VIII — Normas de Funcionamiento",
    contenido: "PROTOCOLO DE INGRESO Y SALIDA SEGÚN PROCEDENCIA:. a) Los e studiantes usuarios del Transporte Escolar deberán realizar su ingreso y retiro del establecimiento de manera exclusiva por el acceso de la calle Rafael Sotomayor . (salvo que sean retirados por su apoderado o una instancia similar) b) Estudi antes de educación parvularia, y primer ciclo : deberán utilizar la Puerta Principal de la calle Arturo Prat para el ingreso y salida oficial. c) Restricción de Acceso para Apoderados y Visitas Externas: i. Prohibición de Ingreso por Sotomayor: Bajo ninguna circunstancia se permitirá el ingreso de padres, madres, apoderados o visitas externas por el acceso de la calle Rafael Sotomayor. Este acceso es tá estrictamente habilitado para el transporte escolar de estudiantes , carga, descarga y salida de emergencia . ii. Obligatoriedad de Registro: Todo apoderado o visita debe ingresar exclusivamente por la Puerta Principal (Arturo Prat) . Es obligatorio presentarse en portería, identificarse y quedar registrado en el libro de visitas del establecimiento antes de avanzar a cualquier dependencia. El incumplimiento de esta norma será considerado una falta a los protocolos de seguridad del Li ceo. d) Cualquier persona que no sea funcionario o estudiant e, al ingresar al establecimiento deberá portar una credencial de visita. Esta se le será entregada en portería. 32 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 22", "ingreso", "procedencia", "protocolo", "salida", "según"]
  },
  {
    id: "RICE-ART-023",
    titulo: "ARTÍCULO 23: DEL UNIFORME ESCOLAR",
    seccion: "TÍTULO IX — Presentación Personal",
    contenido: "DEL UNIFORME ESCOLAR. a) El uniforme del Liceo Huara es un elemento que fomenta la equidad, la identidad y la seguridad, al permitir la rápida identificación de nuestros estudiantes. Se sugiere el uso del uniforme oficial en todas las actividades escolares. b) No obstante, en concordancia con la Ley de Inclusión, no se prohibirá el ingreso ni se aplicarán sanciones que priven del derecho a la educación a aquellos estudiantes que no cuenten con él por razones justificadas (socioeconómicas, de salud o fuerza mayor ). c) Descripción del Uniforme: Educación Buzo institucional del liceo, polera de piqué y Parvularia: delantal/cotona según nivel. MUJERES HOMBRES Enseñanza Básica Polera institucional, Polera institucional, y Media: falda con tablas color pantalón de tela color gris y chaleco o polerón gris y chaleco o polerón institucional. institucional. Buzo del liceo y polera de recambio obligatoria por Educación Física: higiene personal. d) Ropa de Color: En días autorizados para el uso de ropa de color o actividades especiales, los estudiantes deberán vestir prendas adecuadas al contexto pedagógico, evitando elementos que promuevan la discriminación, violencia o consumo de sustancias. e) Independientemente del tipo de vestimenta utilizado (sea uniforme oficial, ropa de deporte o de color), los estudiantes deberán presentarse con prendas que sean coherentes con el contexto pedagógico y las actividades propias del establecimiento . f) En este sentido, se requiere el uso de vestimenta que resguarde el decoro y la funcionalidad académica, evitando el uso de prendas excesivamente cortas, tales como minifaldas o petos, así como cualquier elemento que no sea acorde a un entorno de aprendizaj e formal o que represente un riesgo para la seguridad en las dinámicas escolares. g) El Liceo velará siempr...",
    keywords: ["articulo 23", "escolar", "uniforme"]
  },
  {
    id: "RICE-ART-024",
    titulo: "ARTÍCULO 24: DE LA HIGIENE Y PRESENTACIÓN GENERAL",
    seccion: "TÍTULO IX — Presentación Personal",
    contenido: "DE LA HIGIENE Y PRESENTACIÓN GENERAL. a) Hábitos de Higiene: Como parte de la formación integral, se promueve el aseo personal diario. En el caso de los niveles de Educación Física y Talleres TP, se otorgarán tiempos breves para el cambio de vestimenta y aseo básico. b) Identidad y Expresión: El Liceo Huara respeta la libertad de expresión y la identidad de género de sus estudiantes. Se permite el uso de accesorios, cortes de pelo o tintes, siempre que no interfieran con la visibilidad, la seguridad en talleres (especialmente en el área Técnic o- Profesional por riesgo de accidentes) o el normal desarrollo de las clases. c) Estudiantes EPJA: Para la jornada nocturna, no se exige uniforme escolar, fomentando una vestimenta cómoda y acorde a la madurez de los estudiantes adultos, resguardando siempre el decoro en el entorno educativo. 34 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 24", "general", "higiene", "presentación"]
  },
  {
    id: "RICE-ART-025",
    titulo: "ARTÍCULO 25: ALCANCE RESPECTO DE ESTUDIANTES",
    seccion: "TÍTULO X — Regulación de Dispositivos Móviles",
    contenido: "ALCANCE RESPECTO DE ESTUDIANTES. a) Las disposiciones de este protocolo se aplican a todos los estudiantes del establecimiento, considerando sus distintos niveles, modalidades de enseñanza y situaciones excepcionales debidamente autorizadas. b) El alcance específico de la regulación para este estamento comprende el porte, uso, resguardo, restricción, autorización excepcional y eventuales medidas formativas asociadas al uso de dispositivos móviles dentro de la jornada escolar y de las actividades institucionales. c) Esta regulación rige en toda la infraestructura y dependencias del establecimiento, incluyendo salas de clases, laboratorios, talleres, patios, comedores, multicanchas, oficinas y demás espacios institucionales, así como también en actividades oficiales, c omplementarias, extracurriculares o de representación institucional organizadas, coordinadas o supervisadas por el liceo. Su aplicación se extiende durante toda la jornada escolar o laboral, según corresponda, y en cualquier instancia en que exista vínculo funcional con el establecimiento.",
    keywords: ["alcance", "articulo 25", "estudiantes", "respecto"]
  },
  {
    id: "RICE-ART-026",
    titulo: "ARTÍCULO 26: ALCANCE RESPECTO DE DOCENTES, ASISTENTES DE LA",
    seccion: "TÍTULO X — Regulación de Dispositivos Móviles",
    contenido: "ALCANCE RESPECTO DE DOCENTES, ASISTENTES DE LA. EDUCACIÓN Y DEMÁS FUNCIONARIOS a) En virtud de la Ley N°21.801, respecto del personal docente, asistentes de la educación, profesionales de apoyo, equipo directivo y demás funcionarios del establecimiento, este protocolo regula el uso de dispositivos móviles personales o institucionales en contextos pedagógicos, administrativos, formativos y de atención de estudiantes o familias. b) En estos casos, el uso de las y los adultos deberá ajustarse estrictamente a criterios de necesidad funcional, modelaje formativo, resguardo de la privacidad, protección de datos, continuidad del servicio educativo y respeto por la convivencia escolar.",
    keywords: ["alcance", "articulo 26", "asistentes", "docentes", "respecto"]
  },
  {
    id: "RICE-ART-027",
    titulo: "ARTÍCULO 27: REGULACIÓN OPERATIVA PARA ESTUDIANTES POR NIVELES",
    seccion: "TÍTULO X — Regulación de Dispositivos Móviles",
    contenido: "REGULACIÓN OPERATIVA PARA ESTUDIANTES POR NIVELES. EDUCATIVOS (ED. PARVULARIA Y BÁSICA) Nivel educativo Regulación de uso y porte Espacio de excepción Prohibición absoluta de porte, tenencia y manipulación de dispositivos móviles. No se No se contemplan excepciones de uso Educación podrán establecer sanciones disciplinarias ordinario. La comunicación con las Parvularia (NT1 por incumplimientos en este nivel, familias se realizará exclusivamente por y NT2) aplicando exclusivamente medidas canales oficiales. pedagógicas o formativas. Restricción total de uso durante la jornada No se contemplan excepciones de uso Enseñanza escolar. El dispositivo deberá permanecer ordinario. La comunicación con las Básica (1° a 4° apagado y guardado en la mochila del familias se realizará exclusivamente por básico) estudiante. canales oficiales. Restricción de uso durante la jornada Solo podrá utilizarse cuando exista Enseñanza escolar. El dispositivo deberá permanecer indicación pedagógica expresa, Básica (5° y 6° apagado y guardado en la mochila del previamente planificada y autorizada básico) estudiante. por la jefatura técnico - pedagógica. 36 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 27", "estudiantes", "niveles", "operativa", "regulación"]
  },
  {
    id: "RICE-ART-028",
    titulo: "ARTÍCULO 28: REGULACIÓN OPERATIVA PARA ESTUDIANTES DE",
    seccion: "TÍTULO X — Regulación de Dispositivos Móviles",
    contenido: "REGULACIÓN OPERATIVA PARA ESTUDIANTES DE. ENSEÑANZA MEDIA (DE 7° BÁSICO A IV° MEDIO) Este artículo determina el uso de los dispositivos móviles durante clases , demás tiempos y espacios formativos. a) Durante clases y demás espacios formativos. El dispositivo deberá permanecer guardado mientras se desarrollen actividades pedagógicas. b) El dispositivo deberá permanecer guardado mientras se desarrollen actividades pedagógicas. Su uso podrá habilitarse únicamente durante los recreos: i. De 10:00 a 10:15 horas . ii. De 11:45 a 12:00 horas . iii. De 13:30 a 14:00 horas iv. De 15:30 a 15:45 horas c) En los horarios descritos en la letra “b” de este artículo , los dispositivos regulados s ólo podrán usarse en los espacios físicos especialmente habilitados y debidamente señalizados por la unidad de convivencia Educativa. d) Se prohíbe el uso de dispositivos en zonas declaradas libres de tecnologías, tales como salas de clases durante el tiempo de recreación, casino JUNAEB, servicios higiénicos (baños y duchas ) y otros espacios determinados y señalizados por unidad de convivencia Educativa. e) En clases, solo podrá utilizarse cuando exista indicación pedagógica expresa, previamente planificada y autorizada por la jefatura técnico - pedagógica.",
    keywords: ["articulo 28", "estudiantes", "operativa", "regulación"]
  },
  {
    id: "RICE-ART-029",
    titulo: "ARTÍCULO 29: REGULACIÓN OPERATIVA PARA ESTUDIANTES LA",
    seccion: "TÍTULO X — Regulación de Dispositivos Móviles",
    contenido: "REGULACIÓN OPERATIVA PARA ESTUDIANTES LA. MODALIDAD EPJA a) Se permite el porte del dispositivo. Su utilización en aula deberá ajustarse al respeto de las dinámicas pedagógicas, las orientaciones docentes y la buena convivencia. b) Se autoriza su uso en situaciones laborales, familiares o de emergencia debidamente justificadas, siempre que no interrumpan el desarrollo de la clase.",
    keywords: ["articulo 29", "estudiantes", "operativa", "regulación"]
  },
  {
    id: "RICE-ART-030",
    titulo: "ARTÍCULO 30: EXCEPCIONES LEGALES E INSTITUCIONALES PARA",
    seccion: "TÍTULO X — Regulación de Dispositivos Móviles",
    contenido: "EXCEPCIONES LEGALES E INSTITUCIONALES PARA. ESTUDIANTES La Dirección del establecimiento autoriza, el uso excepcional de dispositivos móviles por estudiantes en los siguientes casos debidamente acreditados: a) Cuando el dispositivo constituya una ayuda técnica indispensable para un estudiante con Necesidades Educativas Especiales, debidamente respaldada por un profesional competente y articulada con el Programa de Integración Escolar, si correspondiere. Esta nec esidad deberá estar claramente definida en el plan de apoyo correspondiente. b) Cuando exista una condición de salud, una necesidad de monitoreo médico o un requerimiento de autorregulación asociado a una condición de neurodivergencia, especialmente en el marco de la Ley N°21.545, dicha situación deberá estar 37 UNIDAD DE CONVIVENCIA EDUCATIVA debidamente acreditada por un profesional competente mediante certificado médico y registrada en los instrumentos de apoyo pertinentes. c) Uso ante una situación de emergencia, desastre o catástrofe. d) Uso solicitado fundadamente y de forma temporal por el padre, madre o apoderado, por razones de seguridad personal o familiar del estudiante. Procedimiento formal de solicitud de excepciones por necesidad 1. La solicitud de excepción la puede realizar un apoderado o un funcionario. Marco para la gestión de solicitudes 2. La solicitud se realiza ante la unidad correspondiente, según la necesidad. excepcionales 3. Plazo de respuesta por parte de la Dirección (máximo 5 días hábiles).",
    keywords: ["articulo 30", "excepciones", "institucionales", "legales"]
  },
  {
    id: "RICE-ART-031",
    titulo: "ARTÍCULO 31: EXCEPCIONES LEGALES E INSTITUCIONALES PARA",
    seccion: "TÍTULO X — Regulación de Dispositivos Móviles",
    contenido: "EXCEPCIONES LEGALES E INSTITUCIONALES PARA. DOCENTES Respecto del personal docente, directivo y asistentes de la educación, y en concordancia con el principio ministerial de modelaje formativo, el uso de dispositivos personales dentro del aula o en contextos de supervisión de estudiantes, como turnos de pati o o comedores, quedará restringido y deberá limitarse única y exclusivamente a las siguientes funciones institucionales o de seguridad: a) Registro digital de asistencia y firmas en la plataforma oficial del liceo. b) Acceso a recursos didácticos previamente planificados, incluyendo búsqueda de información, traducción u otros apoyos pedagógicos pertinentes. Así como la obtención de medios de verificación (fotografías, videos, audios) de actividades pedagógicas, educativ as y extracurriculares. c) Proyección de material autorizado. d) Conectividad de apoyo tecnológico institucional, incluyendo compartir red cuando sea estrictamente necesario. e) Activación de procedimientos asociados al Plan Integral de Seguridad Escolar.",
    keywords: ["articulo 31", "excepciones", "institucionales", "legales"]
  },
  {
    id: "RICE-ART-032",
    titulo: "ARTÍCULO 32: CANALES OFICIALES DE COMUNICACIÓN DE EMERGENCIA",
    seccion: "TÍTULO X — Regulación de Dispositivos Móviles",
    contenido: "CANALES OFICIALES DE COMUNICACIÓN DE EMERGENCIA. a) Con el fin de resguardar el derecho de madres, padres y apoderados a comunicarse con el establecimiento ante situaciones urgentes o contingencias relevantes, el liceo mantendrá habilitados canales oficiales de contacto institucional, entre ellos Inspectorí a General, la mensajería oficial definida por el establecimiento y la portería o punto formal de recepción de recados. b) La existencia de restricciones al uso de dispositivos móviles por parte de estudiantes no limita, en ningún caso, el derecho de las familias a establecer comunicación oportuna frente a una emergencia real. 38 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 32", "canales", "comunicación", "emergencia", "oficiales"]
  },
  {
    id: "RICE-ART-033",
    titulo: "ARTÍCULO 33: ANTE INCUMPLIMIENTO Y CADENA DE CUSTODIA",
    seccion: "TÍTULO X — Regulación de Dispositivos Móviles",
    contenido: "ANTE INCUMPLIMIENTO Y CADENA DE CUSTODIA. (PROTOCOLO) a) El funcionario responsable deberá realizar una advertencia individual o grupal al curso o grupo de estudiantes, indicando que el uso del dispositivo en esa clase no está permitido. b) La utilización no autorizada de dispositivos móviles dentro de los espacios regulados por este protocolo será abordada de manera gradual, formativa y proporcional, resguardando siempre la dignidad del estudiante, su derecho a la intimidad y el debido proce so. c) Retiro temporal y custodia segura. Si un estudiante no cumple con la medida, se solicitará la entrega voluntaria del dispositivo, el cual deberá ser apagado por el propio estudiante antes de su resguardo. El equipo será identificado, custodiado en un sobre y derivado a Inspectoría General hasta el término de la jornada. d) Entrega al apoderado. Inspectoría se contactará con el apoderado para coordinar su devolución. e) El dispositivo será restituido exclusivamente a madre, padre o apoderado registrado, dejando constancia formal de la devolución. f) Bajo ninguna circunstancia los funcionarios del establecimiento podrán registrar forzosamente mochilas, vestimentas o pertenencias personales con el fin de buscar dispositivos móviles, debiendo ajustarse siempre al resguardo de los derechos fundamentales d e estudiantes. g) En situaciones que impliquen riesgo inminente para la vida, integridad o seguridad de las personas, se activarán los protocolos institucionales y las denuncias que correspondan ante la autoridad competente.",
    keywords: ["articulo 33", "cadena", "custodia", "incumplimiento"]
  },
  {
    id: "RICE-ART-034",
    titulo: "ARTÍCULO 34: ACUMULACIÓN CONDUCTUAL, ESCALAMIENTO",
    seccion: "TÍTULO X — Regulación de Dispositivos Móviles",
    contenido: "ACUMULACIÓN CONDUCTUAL, ESCALAMIENTO. FORMATIVO Y APLICACIÓN DE MEDIDAS Respecto de estudiantes, cuando exista reiteración de conductas contrarias a este protocolo, el establecimiento aplicará las medidas contempladas en el Reglamento Interno de Convivencia Escolar, privilegiando acciones formativas, entrevistas con apoderados , compromisos de mejora y apoyos especializados cuando corresponda. a) Si un estudiante acumula 3 registros por uso no autorizado dentro de un mismo período mensual, la situación podrá escalar a una falta de mayor gravedad conforme a la clasificación vigente del reglamento interno. b) Si el dispositivo móvil fuese utilizado para grabar, fotografiar, difundir contenido, acosar, hostigar, humillar, vulnerar la privacidad de otras personas o ejecutar conductas de ciberacoso o maltrato escolar, se dejará sin efecto la aplicación ordinaria d e este protocolo y se activarán de inmediato los procedimientos institucionales específicos sobre maltrato, violencia escolar o ciberbullying, además de las denuncias legales que resulten procedentes. 39 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["acumulación", "articulo 34", "conductual", "escalamiento"]
  },
  {
    id: "RICE-ART-035",
    titulo: "ARTÍCULO 35: REGULACIÓN DE CANALES OFICIALES Y USO DE",
    seccion: "TÍTULO X — Regulación de Dispositivos Móviles",
    contenido: "REGULACIÓN DE CANALES OFICIALES Y USO DE. DISPOSITIVOS MÓVILES PARA PROFESIONALES DE APOYO, ASISTENTES Y EQUIPOS DE AULA CO - DOCENTE a) Principio de canalización oficial obligatoria: Queda estrictamente prohibido, salvo las excepciones legales de este título que los docentes de aula, co - docentes, profesionales y técnicos de apoyo del Programa de Integración Escolar (PIE), duplas psicosociales o asistentes de la educación utilicen sus dispositivos móviles personales para emitir reportes conductuales, bitácoras de avance o alertas de desregulación en tiempo real a los apoderados durante el transcurso de las horas pedagógicas o periodos lectivos. Para ello existe un protocolo de conducto regular. b) Resguardo de trazabilidad e información protegida: Toda información relativa al estado emocional, biomédico, de socialización o conductual de un estudiante con Necesidades Educativas Especiales (NEE) o amparado por la Ley TEA (21.545) constituye un dato sensible y protegido. Por lo tanto, cualquier comuni cación o reporte hacia el hogar deberá canalizarse de manera formal y cronológica exclusivamente a través de los siguientes medios institucionales: 1. El módulo de convivencia o bitácora de la plataforma digital Lirmi (Lirmi Familia). 2. Entrevistas presenciales programadas. 3. Los canales telefónicos de la Inspectoría General y la Coordinación PIE. 4. Los correos electrónicos institucionales. Dimensión formativa y preventiva El Liceo de Huara dispondrá de actividades programadas que fomenten la interacción social y el encuentro comunitario durante los recreos, tales como juegos dirigidos, ejercicios grupales y talleres recreativos, entre otros, con el fin de desincentivar el u so de dispositivos electrónicos mediante el fortalecimiento de la convivencia presencial. Asimismo, el establecimiento promoverá instanc...",
    keywords: ["articulo 35", "canales", "oficiales", "regulación"]
  },
  {
    id: "RICE-ART-036",
    titulo: "ARTÍCULO 36: REGULACIÓN DE USO Y RESTRICCIÓN DE DISPOSITIVOS",
    seccion: "TÍTULO X — Regulación de Dispositivos Móviles",
    contenido: "REGULACIÓN DE USO Y RESTRICCIÓN DE DISPOSITIVOS. MÓVILES PARA MADRES, PADRES Y APODERADOS EN EL ESTABLECIMIENTO a) Uso responsable y respetuoso en la permanencia general: Se establece que las madres, padres, apoderados y visitas externas que permanezcan en las dependencias del Liceo de Huara deberán utilizar sus dispositivos móviles bajo una norma de uso silencioso y respetuoso. b) Se autoriza y garantiza el libre uso de estos equipos en patios abiertos, accesos y zonas de tránsito común, procurando no interferir con las actividades pedagógicas del recinto. c) En espacios cerrados o áreas de atención de público, los dispositivos deberán mantenerse en modo de silencio o vibración por deferencia a la comunidad educativa. 40 UNIDAD DE CONVIVENCIA EDUCATIVA d) Uso de dispositivos móviles en entrevistas individuales: Al ingresar a una oficina, sala de reuniones o de atención para sostener una entrevista con cualquier funcionario, docente o directivo, el apoderado deberá mantener su dispositivo móvil en modo silencioso o vibración, como muestra de deferencia y respeto por el acto pedagógico. e) Se permite mantener el equipo de forma visible sobre la mesa de trabajo, solicitando evitar su manipulación o interrupción innecesaria durante el transcurso de la reunión para resguardar el clima de colaboración mutua y la formalidad de la instancia. f) Regulación de grabaciones y registro audiovisual consentido: Queda estrictamente prohibido que las madres, padres, apoderados o visitas externas utilicen teléfonos celulares o cualquier dispositivo electrónico para registrar audio, video o capturar imágenes durante el transcurso de reuniones de curso, asambleas o e ntrevistas individuales con funcionarios, sin el consentimiento explícito y por escrito de las partes. g) Excepción para acta digital y transcripción: Sin perjuicio de l...",
    keywords: ["articulo 36", "dispositivos", "regulación", "restricción"]
  },
  {
    id: "RICE-ART-037",
    titulo: "ARTÍCULO 37: ENFOQUE FORMATIVO DE LAS MEDIDAS Y DISCIPLINA",
    seccion: "TÍTULO XI — Regulación de la Convivencia",
    contenido: "ENFOQUE FORMATIVO DE LAS MEDIDAS Y DISCIPLINA. En conformidad con la Circular N° 0782 de la Superintendencia de Educación, el Liceo de Huara establece que toda consecuencia ante una infracción reglamentaria debe poseer un carácter eminentemente pedagógico y formativo. Las sanciones disciplinarias punitivas se consideran el último recur so y siempre irán acompañadas de una medida de acompañamiento u orientación. Se prohíbe cualquier medida que vulnere la dignidad, la integridad física o psicológica, o que implique la exclusión arbitraria del sistema escolar.",
    keywords: ["articulo 37", "disciplina", "enfoque", "formativo", "medidas"]
  },
  {
    id: "RICE-ART-038",
    titulo: "ARTÍCULO 38: DIFERENCIACIÓN POR NIVELES EDUCATIVOS",
    seccion: "TÍTULO XI — Regulación de la Convivencia",
    contenido: "DIFERENCIACIÓN POR NIVELES EDUCATIVOS. a) Educación Parvularia: Queda estrictamente prohibida la aplicación de sanciones disciplinarias. Ante conductas disruptivas, solo se aplicarán medidas formativas orientadas a la comprensión progresiva de las normas y límites. b) E nseñanza Básica: Se prioriza el modelamiento conductual y las acciones reparatorias en el entorno escolar, involucrando activamente a la familia en la restauración del clima de aula. c) Enseñanza Media y EPJA: Las medidas combinan la responsabilidad civil y formativa, incorporando la Justicia Restaurativa mediante el Servicio a la Comunidad Educativa, considerando además el marco de la Responsabilidad Penal Adolescente para mayores de 14 años. TIPIFICACIÓN DE FALTAS Y GRADUACIÓN DE CONSECUENCIAS",
    keywords: ["articulo 38", "diferenciación", "educativos", "niveles"]
  },
  {
    id: "RICE-ART-039",
    titulo: "ARTÍCULO 39: FALTAS LEVES",
    seccion: "TÍTULO XI — Regulación de la Convivencia",
    contenido: "FALTAS LEVES. Son conductas que alteran el normal desarrollo del proceso educativo o el funcionamiento operativo diario del liceo, pero que no comprometen la integridad física o psicológica de los miembros de la comunidad. a) Definiciones específicas: Atrasos reiterados en el ingreso (08:30hrs.) o al inicio de cada bloque horario; desatención de instrucciones del docente; uso no autorizado de dispositivos móviles en el aula; no portar los materiales de estudio obligatorios; mantener en mal estado los cuadernos o libros de clases; descuidar el aseo y la presentación personal o el uniforme institucional sin justificación , entre otras. b) Medidas Formativas Aplicables: Diálogo reflexivo inmediato con el estudiante; amonestación verbal privada; registro técnico en la Hoja de Vida Digital; compromisos conductuales de aula firmados por el alumno. 43 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 39", "faltas", "leves"]
  },
  {
    id: "RICE-ART-040",
    titulo: "ARTÍCULO 40: FALTAS GRAVES",
    seccion: "TÍTULO XI — Regulación de la Convivencia",
    contenido: "FALTAS GRAVES. C onductas que afectan de manera directa el bienestar de otros miembros de la comunidad, dañan el entorno o patrimonio del establecimiento, o constituyen una reincidencia sistemática de faltas leves. a) Definiciones específicas: Trato irrespetuoso, burlas o uso de lenguaje grosero hacia compañeros o funcionarios; incidentes menores de acoso o exclusión entre pares (etapas iniciales de bullying); reincidencia reiterada en el uso de celulares en el aula tras retiro temporal; daños materiales menores a la infraestructura escolar o al transporte escolar rural (rutas Bajo Soga, Pisagua, Quebrada de Tarapacá ); abandonar el establecimiento sin autorización o no presentarse al colegio habiendo salido de casa para ello (\\\"cimarra\\\" o fuga); copiar o plagiar en instrumentos de evaluación , respuestas de evaluaciones o cualquier material que no sea de autoría. b) Medidas Formativas y Sanciones Disciplinarias: Citación formal al apoderado; firma de un Acta de Compromiso y Acompañamiento; aplicación de Medidas de Servicio a la Comunidad Educativa (SCE) como alternativa restaurativa; suspensión de asistencia de 1 a 2 días hábiles .",
    keywords: ["articulo 40", "faltas", "graves"]
  },
  {
    id: "RICE-ART-041",
    titulo: "ARTÍCULO 41: FALTAS GRAVÍSIMAS",
    seccion: "TÍTULO XI — Regulación de la Convivencia",
    contenido: "FALTAS GRAVÍSIMAS. Son aquellas acciones que atentan directamente contra la seguridad, la vida, la salud o la integridad física o psicológica de cualquier integrante del liceo, así como los delitos tipificados por la legislación nacional. a) Definiciones específicas: Agresiones físicas que causen lesiones; acoso escolar sistemático (bullying y ciberbullying mediante \\\"funas\\\" en redes sociales); agresiones verbales, amenazas o maltrato psicológico directo a docentes o asistentes (activación Ley Karin); porte, consumo o distribución de drogas, alcohol o sustancias ilícitas; porte de armas blancas o de fuego; abuso sexual o agresiones de connotación sexual; provocar incendios o destrozos mayores en la infraestructura (Ley Aula Segura). b) Sanciones Disciplinarias y Legales: Suspensión inmediata como medida cautelar ( 1 a 5 días); condicionalidad de la matrícula; no renovación de la matrícula para el año académico siguiente; expulsión inmediata del establecimiento (siguiendo estrictamente el debido proceso y con reubicación coordinada por el MINEDUC); denuncia obligatori a ante el Ministerio Público o Carabineros dentro de las 24 horas si el hecho reviste carácter de delito.",
    keywords: ["articulo 41", "faltas", "gravísimas"]
  },
  {
    id: "RICE-ART-042",
    titulo: "ARTÍCULO 42: COMPORTAMIENTOS Y RESPONSABILIDADES",
    seccion: "TÍTULO XI — Regulación de la Convivencia",
    contenido: "COMPORTAMIENTOS Y RESPONSABILIDADES. GRAVEDAD MEDIDA A APLICAR FUNCIONARIO RESPONSABLE Amonestación verbal, registro digital y Docente de aula, Asistente de la Leve diálogo formativo inmediato. Educación, Inspector de Patio. Citación al apoderado, Servicio Profesor Jefe, Inspector General, Grave Comunitario (SCE) o Suspensión (1 -2 Coordinador de Convivencia Educativa. días). Suspensión (3 - 5 días), Condicionalidad, Dirección, bajo consejo de equipo de Gravísima Expulsión y/o Denuncia Judicial. gestión. 44 UNIDAD DE CONVIVENCIA EDUCATIVA Detalle de falta a la norma y a la sana convivencia Nota de Aplicación Operativa: Est a tabla constituye el instrumento oficial de tipificación de falta a la norma y a la sana convivencia del Liceo de Huara (Bajo una mirada objetiva y aplicativa) . Cada conducta está indexada de forma independiente para eliminar la ambigüedad interpretativa y facilitar el registro exacto en el libro de clases digital.",
    keywords: ["articulo 42", "comportamientos", "responsabilidades"]
  },
  {
    id: "RICE-ART-043",
    titulo: "ARTÍCULO 43: APARTADO DE FALTAS LEVES (CATEGORÍA L)",
    seccion: "TÍTULO XI — Regulación de la Convivencia",
    contenido: "APARTADO DE FALTAS LEVES (CATEGORÍA L). Conductas que entorpecen el orden administrativo, operativo o pedagógico, sin comprometer la integridad de terceros. Conducta Cód. Descripción Detallada del Hecho Medida Formativa Obligatoria Infraccional Traspasar la portería del Diálogo reflexivo inicial, registro Atraso en establecimiento después de las en Hoja de Vida. Al 3er atraso, L - 01 ingreso 08:35hrs. sin un justificativo médico o citación telefónica al matutino de fuerza mayor del apoderado. apoderado. Amonestación verbal del Ingresar a la sala de clases tarde al Atraso entre docente de asignatura, registro L - 02 término de los recreos o en los cambios bloques digital y pérdida del inicio de la de hora, estando ya dentro del liceo. actividad. Manipular o mantener a la vista el Advertencia verbal y exigencia teléfono celular durante el periodo de de guardado inmediato. En caso L - 03 Celular en aula clases sin indicación pedagógica de persistir, se aplica el expresa del docente. protocolo de retiro temporal. Utilizar audífonos (de cable o Exigencia de retiro inmediato Audífonos en inalámbricos) puestos en los oídos del accesorio, guardado en la L - 04 aula durante la explicación del profesor o mochila y registro en la Hoja de desarrollo de tareas. Vida Digital. Portar o manipular consolas portátiles Solicitud de guardado Dispositivos de de videojuegos u otros aparatos inmediato. Registro técnico en L - 05 juego electrónicos de entretenimiento en el libro digital como distractor medio de la clase. del aprendizaje. Hablar sistemáticamente con Reubicación de asiento dentro Conversación compañeros sobre temas ajenos a la del aula por el docente y L - 06 disruptiva materia, interrumpiendo la explicación amonestación verbal privada al del docente. finalizar el bloque. Tirar objetos menores (gomas, lápices, Llam...",
    keywords: ["apartado", "articulo 43", "categoría", "faltas", "leves"]
  },
  {
    id: "RICE-ART-044",
    titulo: "ARTÍCULO 44: APARTADO DE FALTAS GRAVES (CATEGORÍA G)",
    seccion: "TÍTULO XI — Regulación de la Convivencia",
    contenido: "APARTADO DE FALTAS GRAVES (CATEGORÍA G). Conductas que menoscaban el respeto comunitario, dañan la propiedad del liceo o de terceros sin violencia directa, o configuran la reiteración constante de faltas leves. Conducta Cód. Descripción Detallada del Hecho Medida Formativa / Sanción Infraccional Utilizar groserías, garabatos o Citación escrita al apoderado, insultos verbales directos Insultos amonestación en el libro de clases y G - 01 dirigidos hacia un compañero o entre pares derivación obligatoria a talleres de compañera dentro del Convivencia. establecimiento. Utilizar sobrenombres Amonestación escrita grave. Entrevista despectivos, burlas basadas en Apodos conjunta con el Profesor Jefe y G - 02 características físicas o apodos humillantes compromiso de cese de la conducta bajo que causen evidente menoscabo firma. a un par. Emitir comentarios discriminatorios aislados Comentario Activación del protocolo de no respecto al origen étnico (ej. G - 03 racista/xen discriminación, entrevista psicosocial y identidad Aymara) o la ófobo amonestación escrita de carácter grave. nacionalidad de un miembro del liceo. Sustraer pertenencias, dinero, colaciones o útiles de sus Citación urgente al apoderado. Restitución Hurto G - 04 compañeros o del liceo, sin obligatoria del bien o costo equivalente. simple aplicar fuerza en las cosas ni Aplicación de SCE en biblioteca. violencia en las personas. Esconder de forma maliciosa la Registro técnico grave, citación al Ocultamient mochila, estuche, ropa de cambio G - 05 apoderado y obligación de disculpa formal o de bienes o materiales de un compañero, guiada ante el estudiante afectado. simulando una pérdida o \\\"broma\\\". Retiro del instrumento. Registro negativo Utilizar apuntes ocultos, papeles en LIRMI y d erivación a la Unidad Técnico - con información (\\\"torpedos\\\") o Ped...",
    keywords: ["apartado", "articulo 44", "categoría", "faltas", "graves"]
  },
  {
    id: "RICE-ART-045",
    titulo: "ARTÍCULO 45: APARTADO DE FALTAS GRAVÍSIMAS (CATEGORÍA GG)",
    seccion: "TÍTULO XI — Regulación de la Convivencia",
    contenido: "APARTADO DE FALTAS GRAVÍSIMAS (CATEGORÍA GG). Acciones de extrema gravedad que vulneran la vida, salud, o configuran faltas legales graves (Ley Karin, Ley Aula Segura). Conducta Cód. Descripción Detallada del Hecho Sanción Disciplinaria y Legal Infraccionan Dar golpes de puño, patadas, Agresión tirones de pelo, empujones Suspensión inmediata como medida GG - 01 física entre violentos o usar objetos para cautelar (3 a 5 días). Condicionalidad. pares agredir físicamente a otro Denuncia a Carabineros por lesiones. estudiante. Organizar, incitar a viva voz, Suspensión de 3 días a todos los Incitación a grabar con el celular o convocar GG - 02 involucrados y filmadores. Plan de riña peleas masivas dentro del liceo o intervención psicosocial obligatorio. en las inmediaciones del recinto. Activación de las medidas de resguardo y protección laboral del funcionario por el empleador (bajo Proferir gritos, groserías de alto Ley Karin), y paralelamente, inicio por Agresión calibre, insultos directos o la Dirección del debido proceso GG - 03 verbal a menoscabo psicológico a un disciplinario escolar regulado por la docente profesor o asistente de la LGE (Art. 6 letra d, modificado por la educación. Ley Aula Segura - Ley 21.128). Suspensión inmediata como medida cautelar, apertura de expediente de Expulsión y denuncia en Fiscalía. Verbalizar o enviar mensajes Medida de protección inmediata: escritos con amenazas de daño Suspensión del alumno, prohibición Amenazas a GG - 04 físico, familiar o material dirigidas de acercamiento y denuncia penal en funcionarios a cualquier trabajador del Carabineros ( Subcomisaria de establecimiento. Carabineros de Huara). 49 UNIDAD DE CONVIVENCIA EDUCATIVA Lanzar golpes de puño, objetos Expulsión inmediata del Agresión contundentes o agredir establecimiento bajo los términos de GG - 05 física a ...",
    keywords: ["apartado", "articulo 45", "categoría", "faltas", "gravísimas"]
  },
  {
    id: "RICE-ART-046",
    titulo: "ARTÍCULO 46: PROHIBICIÓN ABSOLUTA DE INSPECCIÓN DE MOCHILAS Y",
    seccion: "TÍTULO XI — Regulación de la Convivencia",
    contenido: "PROHIBICIÓN ABSOLUTA DE INSPECCIÓN DE MOCHILAS Y. PERTENENCIAS Las mochilas, bolsos, carteras, casilleros, prendas de vestir y dispositivos tecnológicos de los estudiantes constituyen propiedad privada y parte de su intimidad. Ningún funcionario del Liceo de Huara podrá, bajo ningún pretexto o concepto, registrar, abr ir o revisar de manera forzada dichas pertenencias de forma directa. Ante sospecha fundada de porte de elementos prohibidos o peligrosos (armas, drogas), el funcionario solicitará al estudiante que exhiba voluntariamente el contenido en un espacio privado en presencia de su apoderado y d e la unidad de convivencia . Si el estudiante se niega y persiste la sospecha de peligro inminente, el liceo aislará preventivamente al estudiante para garantizar la seguridad común y llamará de inmediato a Carabineros de Chile, únicos facultados por ley para realizar registros de p ertenencias.",
    keywords: ["absoluta", "articulo 46", "inspección", "mochilas", "prohibición"]
  },
  {
    id: "RICE-ART-047",
    titulo: "ARTÍCULO 47: SOBRE LAS MEDIDAS DE SERVICIO A LA COMUNIDAD",
    seccion: "TÍTULO XI — Regulación de la Convivencia",
    contenido: "SOBRE LAS MEDIDAS DE SERVICIO A LA COMUNIDAD. EDUCATIVA S e establece como la máxima expresión de la justicia restaurativa en el Liceo de Huara, permitiendo que el estudiante de enseñanza básica o media enmiende el daño causado mediante acciones concretas de apoyo institucional, en lugar de ser apartado temporalm ente del aula. a) Condición de Aplicación: Debe contar con la aceptación voluntaria y por escrito del estudiante y de su madre, padre o apoderado mediante un Acta de Acuerdo Reparatorio. Si la familia rechaza el SCE, se aplicará la sanción disciplinaria tradicional de suspensión. b) Tipos de Acciones Permitidas (Ejemplos): Colaboración en el orden y catalogación de la biblioteca escolar; apoyo en la mantención de áreas verdes o huertos escolares; tutorías de lectura a estudiantes de cursos menores; diseño de afiches preventivos; colaboración con el personal de comedores en el orden del casino. c) Límites del SCE: Bajo ninguna circunstancia el SCE podrá implicar tareas que pongan en riesgo la salud del estudiante, labores de aseo pesado o de baños (que corresponden al personal auxiliar contratado), ni actividades que humillen públicamente al menor. El proceso será supervisado de manera constante por la Inspectoría General o la unidad de convivencia . d) El servicio escolar comunitario SCE, entra en vigencia el 01 de agosto de 2026 52 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 47", "comunidad", "medidas", "servicio"]
  },
  {
    id: "RICE-ART-048",
    titulo: "ARTÍCULO 48: MARCO REGULATORIO Y PRINCIPIOS RECTORES",
    seccion: "TÍTULO XII — Justo y Racional Procedimiento",
    contenido: "MARCO REGULATORIO Y PRINCIPIOS RECTORES. Todo procedimiento de carácter indagatorio o disciplinario que se instruya en el Liceo de Huara deberá garantizar el respeto irrestricto a los derechos de los estudiantes, en conformidad con la Constitución Política de la República, la Ley General de Educa ción, la Ley de Inclusión Escolar y las exigencias de la Superintendencia de Educación. Las actuaciones del establecimiento se fundarán obligatoriamente en los siguientes principios rectores: a) Principio de Idoneidad e Imparcialidad del investigador : La persona designada para liderar la investigación técnica debe contar con las competencias profesionales, la probidad y el criterio necesario para el cargo. Asimismo, actuará de manera neutral, objetiva y sin prejuicios, garantizando que su criterio no s e vea afectado por relaciones personales o presiones externas. b) Presunción de Inocencia y Medidas de Resguardo: Todo estudiante bajo un proceso indagatorio no será considerado culpable o responsable mientras no se determine lo contrario mediante una resolución formal y fundada. Sin perjuicio de esto, el liceo podrá decretar medidas de resguardo inmediatas (formativas o de separación de espacios) destinadas a proteger a los involucrados. Estas medidas preventivas bajo ningún caso implican responsabilidad anticipada, castigo o mala práctica del alumno. c) Absoluta Reserva y Discreción: Toda denuncia, declaración, revisión de antecedentes o resolución se manejará bajo estricta confidencialidad. Los funcionarios que participen en el proceso tienen la obligación legal y ética de resguardar la identidad de las partes para proteger la honra, la intimidad y evitar la estigmatización de los estudiantes y sus familias. d) Justicia, Equidad y Bien Común: Toda decisión, investigación o medida adoptada por las autoridades del ...",
    keywords: ["articulo 48", "marco", "principios", "rectores", "regulatorio"]
  },
  {
    id: "RICE-ART-049",
    titulo: "ARTÍCULO 49: ÓRGANOS DE INVESTIGACIÓN Y RESOLUCIÓN",
    seccion: "TÍTULO XII — Justo y Racional Procedimiento",
    contenido: "ÓRGANOS DE INVESTIGACIÓN Y RESOLUCIÓN. a) La conducción y tramitación técnica del procedimiento investigativo estará a cargo exclusivamente de la Unidad de Convivencia Educativa en su calidad de órgano instructor idóneo. b) La aplicación de las medidas y sanciones finales se distribuye según la competencia del cargo: i. Faltas Leves y Graves: Serán resueltas y aplicadas por la Inspectoría General o la Jefatura de UTP según corresponda a la naturaleza del hecho. ii. Faltas Gravísimas: La aplicación de medidas de extrema gravedad (como la separación del establecimiento o la cancelación de matrícula) es una atribución exclusiva y privativa de la Directora del Establecimiento , quien resolverá previo informe de Convivencia Educativa.",
    keywords: ["articulo 49", "investigación", "resolución", "órganos"]
  },
  {
    id: "RICE-ART-050",
    titulo: "ARTÍCULO 50: CANALES OFICIALES DE COMUNICACIÓN Y MECANISMOS",
    seccion: "TÍTULO XII — Justo y Racional Procedimiento",
    contenido: "CANALES OFICIALES DE COMUNICACIÓN Y MECANISMOS. DE DIÁLOGO Para asegurar la validez legal y el correct o envío de información hacia las familias durante el proceso, se establecen los siguientes mecanismos obligatorios: a) Mecanismo de Contacto y Citación: Las citaciones a entrevistas formales se realizarán mediante las siguientes vías institucionales: b) Correo electrónico institucional del apoderado. c) Comunicación escrita , timbrada y firmada . d) Llamado telefónico al número indicado en la ficha del estudiante (análoga o digital) , registrando día, hora en los mecanismos internos de cada unidad. e) Mecanismo de Diálogo: Las audiencias se desarrollarán en un espacio físico que garantice la privacidad dentro del liceo. Se fomentará un diálogo respetuoso, de escucha activa y con un llamado explícito a la sana convivencia educativa , recordando que el fin último del proceso es formativo y reparatorio. f) Mecanismo de Envío de Información: Las resoluciones y actas de cierre se entregarán personalmente al apoderado en una reunión de notificación. Si por razones de fuerza mayor o distancia geográfica el apoderado no puede asistir, el documento firmado se enviará mediante carta certificada al domicilio registrado en la matrícula o /y a través del correo electrónico institucional con acuse de recibo. También se podrá realizar mediante una videoconferencia, siempre y cuando ésta sea grabada como respaldo. 54 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 50", "canales", "comunicación", "mecanismos", "oficiales"]
  },
  {
    id: "RICE-ART-051",
    titulo: "ARTÍCULO 51: DE LOS PLAZOS DEL PROCEDIMIENTO INVESTIGATIVO",
    seccion: "TÍTULO XII — Justo y Racional Procedimiento",
    contenido: "DE LOS PLAZOS DEL PROCEDIMIENTO INVESTIGATIVO. a) El procedimiento ordinario completo, desde el registro de la denuncia hasta la notificación de la primera resolución, no podrá exceder los 10 días hábiles . (Se habla de primera resolución ya que podría eventualmente haber una apelación) i. Fase 1: Inicio y Registro (Plazo: 24 Horas): Recibida una denuncia o detectada una presunta infracción en flagrancia, el Coordinador de Convivencia Educativa registrará los hechos en el expediente confidencial en un plazo máximo de 24 horas hábiles. En este mismo acto, se evaluará la necesidad de aplicar medidas de resguardo provisorias para la protección de la víctima o del propio investigado. ii. Fase 2: Investigación y Recopilación (Plazo: 5 Días): El instructor dispondrá de un plazo máximo de 5 días hábiles para citar a los involucrados, tomar declaraciones individuales, revisar registros oficiales y recopilar informes pedagógicos o psicosociales. Todo testimonio quedará registrado en actas individ uales firmadas por el declarante y el instructor. iii. Fase 3: Audiencia de Descargos (Plazo: 48 Horas): El estudiante investigado, acompañado obligatoriamente por su madre, padre o apoderado, será citado a una audiencia formal de descargos. En esta instancia se le informarán los cargos y las normas del RICE infringidas. El apoderado tendrá un plazo de 48 ho ras hábiles (2 días) posteriores a la reunión para presentar de forma escrita cualquier documento, prueba o antecedente adicional que estime conveniente para su defensa. iv. Fase 4: Resolución y Fundamentación (Plazo: 3 Días): Una vez presentados los descargos (o vencido el plazo para ello), el instructor elevará el informe técnico a la autoridad resolutiva. Esta dictará una Resolución Interna Fundada en un plazo máximo de 3 días hábiles. v. Fase 5: Recurso de Apelación (Plaz...",
    keywords: ["articulo 51", "investigativo", "plazos", "procedimiento"]
  },
  {
    id: "RICE-ART-052",
    titulo: "ARTÍCULO 52: FALTAS CONSTITUTIVAS DE DELITO Y RELACIÓN CON LA",
    seccion: "TÍTULO XII — Justo y Racional Procedimiento",
    contenido: "FALTAS CONSTITUTIVAS DE DELITO Y RELACIÓN CON LA. VÍA JUDICIAL a) Límite de la Competencia Escolar: Cuando una falta grave o gravísima sea además constitutiva de delito (como tráfico de sustancias ilícitas, agresiones con lesiones graves, abuso sexual, amenazas de muerte o porte de armas de fuego), el Liceo de Huara cumplirá estrictamente con su obligac ión legal de denunciar ante Carabineros de Chile, Policía de Investigaciones (PDI) o el Ministerio Público, dentro de las 24 horas siguientes al conocimiento del hecho. b) Alcance de la Investigación Interna: Frente a estos casos penales, el liceo solo realizará las acciones investigativas y de resguardo que estén dentro de su alcance logístico y legal. La determinación de la responsabilidad penal de los hechos será resuelta exclusivamente por el Ministerio Pú blico, los Tribunales de Justicia o los programas especializados de la red protectora del Estado. c) Independencia de las Vías Sancionatorias: Las posibles medidas formativas o sanciones disciplinarias internas que determine el liceo (basadas exclusivamente en la infracción a este RICE) corren por una vía completamente independiente y separada de las sanciones judiciales o penales que determine la justicia ordinaria. d) El establecimiento no suspenderá la aplicación de sus medidas internas a la espera de un fallo judicial, puesto que el RICE busca resguardar la seguridad inmediata de la comunidad escolar y el clima de aula, objetivos distintos a los de la persecución pena l del Estado. 56 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 52", "constitutivas", "delito", "faltas", "relación"]
  },
  {
    id: "RICE-ART-053",
    titulo: "ARTÍCULO 53: REGULACIÓN Y PROCEDIMIENTO DE LA CONDICIONALIDAD",
    seccion: "TÍTULO XIII — Condicionalidad y No Renovación de Matrícula",
    contenido: "REGULACIÓN Y PROCEDIMIENTO DE LA CONDICIONALIDAD. DE MATRÍCULA La condicionalidad de matrícula es un acto administrativo de carácter disciplinario y formativo, de aplicación estrictamente excepcional, por el cual el establecimiento condiciona la permanencia futura del estudiante para el período académico siguiente o s u continuidad en el año en curso. Esta medida se regula bajo los siguientes términos de derecho, validados en conformidad con las directrices del Ministerio de Educación (MINEDUC) y la Superintendencia de Educación (SUPEREDUC):",
    keywords: ["articulo 53", "condicionalidad", "procedimiento", "regulación"]
  },
  {
    id: "RICE-ART-054",
    titulo: "ARTÍCULO 54: MARCO NORMATIVO DE REFERENCIA SOBRE",
    seccion: "TÍTULO XIII — Condicionalidad y No Renovación de Matrícula",
    contenido: "MARCO NORMATIVO DE REFERENCIA SOBRE. CONDICIONALIDAD DE MATRICULA Esta medida se sustenta y rige por el marco legal chileno vigente: a) La Ley General de Educación (LGE - DFL 2 de 2009 del MINEDUC), artículos 10 y 46, que consagran el deber del establecimiento de asegurar la continuidad del servicio educativo y de regular las sanciones bajo el principio del debido proceso. b) La Ley N° 20.536 sobre Violencia Escolar, que exige resguardar un ambiente de sana convivencia escolar y la existencia de procedimientos justos y racionales. c) La Ley N° 21.430 sobre Garantías y Protección Integral de los Derechos de la Niñez y la Adolescencia (particularmente en sus principios de Interés Superior de la Niñez, Autonomía Progresiva y Derecho a ser Oído). d) La Circular N° 781 de la Superintendencia de Educación (que deroga y reemplaza a la antigua Circular N° 482), que fija las directrices obligatorias para la confección del RICE, prohibiendo expresamente la automaticidad de las sanciones, la exclusión arbitraria de estudiantes y la aplicación de condicionalidades a estudiantes recién matriculados.",
    keywords: ["articulo 54", "marco", "normativo", "referencia"]
  },
  {
    id: "RICE-ART-055",
    titulo: "ARTÍCULO 55: POTESTAD Y ATRIBUCIÓN ADMINISTRATIVA",
    seccion: "TÍTULO XIII — Condicionalidad y No Renovación de Matrícula",
    contenido: "POTESTAD Y ATRIBUCIÓN ADMINISTRATIVA. a) La facultad de decretar la condicionalidad de matrícula reside de manera privativa y exclusiva en la Dirección del Liceo de Huara, como máxima autoridad conductora del establecimiento en virtud de sus potestades delegadas por el sostenedor (Servicio Local de Educación Pública - SLEP Tamarugal) y la LGE (Art. 6 letra d). Esta potestad no es discrecional y solo podrá ser ejercida tras la sustanciación de un procedimiento disciplinario regular y fundado. 57 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["administrativa", "articulo 55", "atribución", "potestad"]
  },
  {
    id: "RICE-ART-056",
    titulo: "ARTÍCULO 56: PRINCIPIOS PROCESALES RECTORES DE LA",
    seccion: "TÍTULO XIII — Condicionalidad y No Renovación de Matrícula",
    contenido: "PRINCIPIOS PROCESALES RECTORES DE LA. CONDICIONALIDAD DE MATRÍCULA Todo procedimiento de condicionalidad deberá observar de forma obligatoria los siguientes principios: a) Enfoque Formativo : La condicionalidad no constituye una sanción de castigo definitivo o estigmatizante, sino un plan de intervención destinado a la reorientación conductual y apoyo psicosocial del estudiante. b) Bilateralidad de la Información (Derecho a Defensa) : Tanto el estudiante como su apoderado tendrán derecho a conocer formalmente los cargos que se le imputan, a presentar descargos, aportar pruebas y ser escuchados con anterioridad al pronunciamiento de la Dirección. c) Proporcionalidad y Gradualidad : La medida solo es aplicable frente a conductas debidamente tipificadas como Graves o Gravísimas en este reglamento, y cuando los esfuerzos previos de intervención no hayan resultado efectivos. d) No Discriminación y No Selección : Queda estrictamente prohibido aplicar medidas de condicionalidad a estudiantes nuevos en su proceso de admisión o matrícula, resguardando la Ley N° 20.845 (Ley de Inclusión Escolar).",
    keywords: ["articulo 56", "principios", "procesales", "rectores"]
  },
  {
    id: "RICE-ART-057",
    titulo: "ARTÍCULO 57: DEFINICIÓN Y DIFERENCIACIÓN DE NIVELES Y CAUSALES DE",
    seccion: "TÍTULO XIII — Condicionalidad y No Renovación de Matrícula",
    contenido: "DEFINICIÓN Y DIFERENCIACIÓN DE NIVELES Y CAUSALES DE. LA CONDICIONALIDAD: a) Condicionalidad Simple : Se aplicará ante la reiteración acreditada de faltas Graves o el incumplimiento reiterado de los compromisos de convivencia previos. Requiere un historial de registro objetivo en la bitácora digital de Lirmi y el agotamiento acreditado de medidas pedagóg ico - formativas intermedias. b) Condicionalidad Extrema : Se aplicará de forma directa frente a una falta de extrema gravedad (Falta Gravísima), tipificada en el Título IX de este reglamento, que ponga en riesgo la integridad física o psíquica de miembros de la comunidad escolar, pero que, por considerarse el contexto y atenuantes del caso, la Dirección determine no aplicar la medida de expulsión.",
    keywords: ["articulo 57", "causales", "definición", "diferenciación", "niveles"]
  },
  {
    id: "RICE-ART-058",
    titulo: "ARTÍCULO 58: PROCEDIMIENTO ADMINISTRATIVO DE APLICACIÓN DE LA",
    seccion: "TÍTULO XIII — Condicionalidad y No Renovación de Matrícula",
    contenido: "PROCEDIMIENTO ADMINISTRATIVO DE APLICACIÓN DE LA. CONDICIONALIDAD ( DEBIDO PROCESO) a) La aplicación de la medida deberá ceñirse estrictamente a las siguientes fases procesales: 1. Fase de Instrucción y Propuesta Técnica: La Inspectoría General, en conjunto con el Coordinador de Convivencia Educativa y el Equipo Psicosocial, elaborará un Informe Técnico Fundado. Este informe detallará los hechos de indisciplina, el historial del alumno, y dejará constancia acreditada de que el establecimiento implementó previamente medidas de apoyo (Plan de Acompañamiento Individual - PAI) sin obtener la rectificación conductual esperada. 2. Audiencia de Descargos : Citación presencial y por escrito al apoderado y al estudiante. Se les informará de la propuesta técnica de condicionalidad, otorgándoles un plazo de 3 días hábiles para presentar descargos o 58 UNIDAD DE CONVIVENCIA EDUCATIVA antecedentes adicionales. Se redactará un Acta de Audiencia firmada por los asistentes. 3. Resolución de Dirección : Analizados los descargos, la Dirección emitirá un Acto Administrativo formal (Resolución Exenta Interna) debidamente fundado en hechos objetivos, antecedentes normativos y en la proporcionalidad de la medida. 4. Notificación y Firma de Compromiso : La resolución se notificará presencialmente al apoderado. En dicho acto, se suscribirá un \\\"Acuerdo y Compromiso de Convivencia\\\", el cual establecerá las obligaciones de apoyo conductual de la familia y el Plan de Acompañamiento Psicosocial que el liceo brindará al alumno. 5. Vigencia, Acompañamiento y Revisión Semestral : La condicionalidad tendrá una vigencia máxima de un semestre académico, prorrogable a un año escolar previa evaluación fundada. Durante su vigencia, el Equipo Psicosocial del Liceo realizará un seguimiento quincenal y evaluaciones periódicas bimestrales del comportamien...",
    keywords: ["administrativo", "aplicación", "articulo 58", "procedimiento"]
  },
  {
    id: "RICE-ART-059",
    titulo: "ARTÍCULO 59: SOBRE LA NO RENOVACIÓN DE MATRÍCULA",
    seccion: "TÍTULO XIII — Condicionalidad y No Renovación de Matrícula",
    contenido: "SOBRE LA NO RENOVACIÓN DE MATRÍCULA. La no renovación de matrícula para el año académico siguiente es una medida extrema que solo se adoptará tras haber agotado todos los recursos de apoyo pedagógico y psicosocial del establecimiento. Debe cumplir con los siguientes requisitos y plazos: a) Notificación y Plazos Legales: La decisión de no renovación debe ser notificada de forma presencial y por escrito al apoderado titular con al menos 30 días hábiles de anticipación al inicio del periodo regular de matrícula del año siguiente (o antes del término del primer semestre en c aso de causales acumulativas graves), detallando los fundamentos de la medida. b) Sustento Técnico Obligatorio: Se requerirá un informe de convivencia y psicosocial emitido por el Unidad de Convivencia y un informe pedagógico de la Jefatura de UTP que acredite de forma fehaciente que el liceo implementó de forma íntegra un Plan de Acompañamiento Individual (PAI) si n obtener cambios positivos en la conducta del estudiante. c) Recurso de Apelación: El apoderado tendrá un plazo de 5 días hábiles desde la notificación formal para interponer un recurso de apelación por escrito ante la Dirección del Liceo. La Dirección tendrá un plazo máximo de 5 días hábiles para resolver la apelación mediante resoluci ón escrita definitiva. 59 UNIDAD DE CONVIVENCIA EDUCATIVA",
    keywords: ["articulo 59", "matrícula", "renovación"]
  },
  {
    id: "RICE-ART-060",
    titulo: "ARTÍCULO 60: DERECHO A RÉPLICA DIGITAL Y PRESCRIPCIÓN DE",
    seccion: "TÍTULO XIV — Medidas Formativas y Reconocimientos",
    contenido: "DERECHO A RÉPLICA DIGITAL Y PRESCRIPCIÓN DE. ANOTACIONES EN LIRMI Para garantizar la bilateralidad de la información y la protección de la honra de los estudiantes en los entornos digitales (plataforma Lirmi), se establece: a) Derecho a Réplica Digital: El estudiante y su apoderado tienen derecho a dejar constancia escrita de sus descargos o versiones de los hechos en la misma bitácora de Lirmi o sección de entrevistas para del caso respectivo, dentro de un plazo de 5 días hábiles desde el registro de la anotación por el docente. 60 UNIDAD DE CONVIVENCIA EDUCATIVA b) Prescripción de Anotaciones: Las anotaciones de carácter negativo prescribirán automáticamente al término del año escolar en curso. Está estrictamente prohibido arrastrar o utilizar anotaciones del año anterior para fundamentar medidas de condicionalidad o no renovación de matrícula p ara periodos futuros. Salvo que el estudiante sea matriculado bajo condicionalidad por resolución del consejo de profesores del año anterior",
    keywords: ["articulo 60", "derecho", "digital", "prescripción", "réplica"]
  },
  {
    id: "RICE-ART-061",
    titulo: "ARTÍCULO 61: SOPORTE PEDAGÓGICO DURANTE LA SUSPENSIÓN PREVENTIVA",
    seccion: "TÍTULO XIV — Medidas Formativas y Reconocimientos",
    contenido: "SOPORTE PEDAGÓGICO DURANTE LA SUSPENSIÓN PREVENTIVA. Título XV PROTOCOLOS INSTITUCIONALES DE ACTUACIÓN ............................................................................................................... 62 15.1 INTRODUCCIÓN GENERAL Y MARCO DE OPERACIÓN FORMATIVA ............................................................................................................ 62 15.2 CRITERIOS COMUNES DE ACTIVACIÓN Y EJECUCIÓN....................................................................................................................................... 62 FASES SECUENCIALES DE LA GESTIÓN INTERNA ......................................................................................................................................... 64 PROTOCOLO N°1 Maltrato Escolar, Acoso (Bullying) y Ciberacoso ..........................................................................................65 PROTOCOLO N°2 Agresiones Escolares, Violencia Física o Riñas .............................................................................................69 PROTOCOLO N°3 Maltrato, Acoso o Agresión de Adultos a Estudiantes (Vulneración de Derechos) ...............73 PROTOCOLO N°4 Acoso, Hostigamiento, Maltrato o Agresión de Estudiantes a Funcionarios ..............................77 PROTOCOLO N°5 Abuso Sexual Infantil, Acoso Sexual o Conductas de Connotación Sexual (ASI) ..................81 PROTOCOLO N°6 Presencia, Consumo o Tráfico de Drogas, Alcohol, Tabaco y Dispositivos de Vapeo .......85 PROTOCOLO N°7 Detección, Porte o Tenencia de Armas o Elementos Peligrosos .......................................................89 PROTOCOLO N°8 Accidentes Escolares y Emergencias Médicas ..............................................................................................93 4 UNIDAD DE CONVIVENCIA EDUCATIVA PROTOCOLO N°9 Rete...",
    keywords: ["articulo 61", "durante", "pedagógico", "preventiva", "soporte", "suspensión"]
  },
  {
    id: "RICE-ART-062",
    titulo: "ARTÍCULO 62: ARTICULO 68: PROTOCOLO DE SOSPECHA, PORTACIÓN O",
    seccion: "TÍTULO XIV — Medidas Formativas y Reconocimientos",
    contenido: "ARTICULO 68: PROTOCOLO DE SOSPECHA, PORTACIÓN O. MICROTRÁFICO DE DROGAS Y ARMAS (RUTA DE FLAGRANCIA PENAL) En cumplimiento de la legislación penal (Ley N° 20.000 de drogas, Ley N° 17.798 de control de armas y Art. 175 del Código Procesal Penal), ante la detección de porte, consumo o distribución de elementos ilícitos o peligrosos en estado de flagrancia: a) Medida de Resguardo Inmediato: El docente o funcionario ordenará de forma pacífica la entrega de la sustancia o arma, trasladando de inmediato al estudiante a una oficina segura de Inspectoría o Dirección. Si existe resistencia, no se empleará fuerza física innecesaria, aislando al est udiante y limitando el contacto físico. b) Presencia de Testigos Adultos: El estudiante aislado estar á acompañado permanentemente por al menos dos profesionales adultos para resguardar su integridad y garantizar la transparencia de todo el procedimiento. c) Llamado de Emergencia: Se notificará telefónicamente y de urgencia al apoderado y a Carabineros de forma inmediata para el abordaje intersectorial del hecho. d) Cadena de Custodia de Evidencias: Si el elemento es entregado o recolectado por el personal, se registrará en el Formulario de Cadena de Custodia (Formato H) dentro de un sobre o contenedor sellado, evitando su manipulación excesiva para no alterar o contaminar la evidencia que será entre gada a la policía. e) Denuncia Formal: La Dirección presentará la denuncia formal ante la policía o fiscalía en el plazo legal improrrogable de 24 horas, adjuntando la respectiva acta descriptiva.",
    keywords: ["articulo", "articulo 62", "portación", "protocolo", "sospecha"]
  },
  {
    id: "RICE-ART-063",
    titulo: "ARTÍCULO 63: RUTA DISCIPLINARIA ESCOLAR Y EXCEPCIONES POR NIVEL",
    seccion: "TÍTULO XIV — Medidas Formativas y Reconocimientos",
    contenido: "RUTA DISCIPLINARIA ESCOLAR Y EXCEPCIONES POR NIVEL. EDUCATIVO EN CASO DE FLAGRANCIA El debido proceso escolar por faltas gravísimas asociadas a drogas o armas procederá según las siguientes regulaciones específicas: a) Educación Parvularia (NT1 y NT2): Conforme a la Circular N°860 y la Resolución Exenta N°0202, los párvulos son penalmente inimputables y no pueden ser suspendidos, expulsados ni denunciados como infractores. Ante flagrancia, el procedimiento se limitará al resguardo físico inmediato, reti ro de la sustancia por el adulto, citación de urgencia al apoderado y derivación obligatoria a la Oficina Local de Niñez (OLN) para medidas de protección de derechos por presunta vulneración. b) Educación Básica y Media: En paralelo a la denuncia penal, se iniciará el debido proceso del RICE (Aula Segura), decretando la suspensión preventiva cautelar y asegurando la entrega de material pedagógico por UTP. Queda estrictamente prohibido someter al estudiante a interrogatorio s policiales informales por parte del personal del liceo o forzarlo a confesar o auto incriminarse . 143 UNIDAD DE CONVIVENCIA EDUCATIVA 144",
    keywords: ["articulo 63", "disciplinaria", "escolar", "excepciones", "nivel", "ruta"]
  },
  {
    id: "RICE-ART-064",
    titulo: "ARTÍCULO 64: PRINCIPIOS FUNDAMENTALES DE LA EDUCACIÓN",
    seccion: "TÍTULO XVII — Reglamento Interno Educación Parvularia",
    contenido: "PRINCIPIOS FUNDAMENTALES DE LA EDUCACIÓN. PARVULARIA: Soporte del Programa de Integración Escolar (PIE): El Liceo de Huara cuenta con un equipo multidisciplinario del PIE (psicopedagogas, educadoras diferenciales, fonoaudiólogos y psicólogos) que participa activamente en el diseño de adecuaciones de acceso y acompañamiento de los párvulos con Necesidades Edu cativas Especiales (NEE), permanentes o transitorias. a) Dignidad del Ser Humano: Todo párvulo tiene derecho a ser respetado en su integridad física y psicológica. Las interacciones de los adultos con los párvulos deben estar exentas de cualquier forma de violencia, gritos o tratos denigrantes. b) Interés Superior del Niño y la Niña: En cada decisión tomada en el establecimiento que involucre a un párvulo, se priorizará la garantía y resguardo de sus derechos fundamentales. c) Autonomía Progresiva: Reconocemos la capacidad gradual de los párvulos para expresar sus opiniones, necesidades e inquietudes de acuerdo con su nivel de madurez y desarrollo. Sus relatos e inquietudes siempre serán escuchados con seriedad y empatía. d) Inclusión y No Discriminación: Se prohíbe cualquier forma de discriminación arbitraria por motivos de género, etnia, procedencia, neurodivergencia, situación económica u otras. e) Trato Digno y Accesibilidad Cognitiva (Ley TEA): Aseguramos que las personas con trastorno del espectro autista y otras necesidades especiales cuenten con apoyos visuales (pictogramas), comunicación aumentativa y adaptaciones sensoriales en el aula para facilitar su comprensión de las normas y la conviv encia. f) Enfoque de Género y Prevención de la Violencia (Ley 21.675): Promovemos un ambiente libre de estereotipos de género, educando en la corresponsabilidad y el respeto mutuo, identificando precozmente conductas de violencia que afecten a las madres o c...",
    keywords: ["articulo 64", "educación", "fundamentales", "principios"]
  },
  {
    id: "RICE-ART-065",
    titulo: "ARTÍCULO 65: DERECHOS DE LOS PÁRVULOS:",
    seccion: "TÍTULO XVII — Reglamento Interno Educación Parvularia",
    contenido: "DERECHOS DE LOS PÁRVULOS:. a) Recibir educación parvularia de calidad basada en el juego como estrategia central. b) Ser acogidos en ambientes seguros, limpios, sanos e higiénicos. c) Recibir contención emocional inmediata en momentos de crisis o desregulación conductual. d) Derecho a Apoyo Especializado (PIE): Los párvulos con Necesidades Educativas Especiales (NEE) o la condición de espectro autista (TEA) tienen derecho a recibir apoyo y adecuaciones de acceso lideradas por el equipo PIE dentro y fuera del aula, garantizando una educación inclusiva. e) Está estrictamente prohibida la aplicación de medidas de suspensión, expulsión, no renovación de matrícula o cualquier tipo de sanción disciplinaria o amonestación acumulativa a estudiantes de los niveles NT1 y NT2, así como también los procedimientos de d enuncia policial ordinarios (salvo las de protección y derivación obligatoria ante la Oficina Local de Niñez - OLN, o tribunales de familia en caso de grave vulneración de derechos). Las regulaciones del RICE relativas a sanciones y procedimientos discipli narios conductuales no aplican a los párvulos.",
    keywords: ["articulo 65", "derechos", "párvulos"]
  },
  {
    id: "RICE-ART-066",
    titulo: "ARTÍCULO 66: DEBERES FORMATIVOS DE LOS PÁRVULOS:",
    seccion: "TÍTULO XVII — Reglamento Interno Educación Parvularia",
    contenido: "DEBERES FORMATIVOS DE LOS PÁRVULOS:. a) Aprender paulatinamente a relacionarse de forma respetuosa y no violenta con sus compañeros y docentes. b) Participar en actividades de juego y aprendizaje diseñadas para su nivel. c) Aprender a cuidar de forma guiada los materiales del aula y los espacios comunes. d) Compromisos de los Padres y Apoderados: e) Asistir de forma obligatoria a las entrevistas de orientación familiar y citaciones del equipo de aula o Convivencia Escolar. f) Alinear en el hogar las pautas de coexistencia y crianza respetuosa promovidas por el Liceo. g) Mantener relaciones de respeto mutuo y comunicación fluida con el personal del Liceo, siendo modelos de buen trato para las niñas y niños. Las responsabilidades derivadas de toda falta a la norma y a la sana convivencia educativa en educación parvularia se regirán por un enfoque formativo de contención emocional, estrategias de co - regulación basadas en la Ley TEA y planes de acompañamiento socio emocional con enfoque lúdico. 147 NORMAS DE FUNCIONAMIENTO",
    keywords: ["articulo 66", "deberes", "formativos", "párvulos"]
  },
  {
    id: "RICE-ART-067",
    titulo: "ARTÍCULO 67: HORARIOS Y RETIROS",
    seccion: "TÍTULO XVII — Reglamento Interno Educación Parvularia",
    contenido: "HORARIOS Y RETIROS. a) Jornada de Clases: El ingreso se realiza a las 08:30 hrs . y la salida a las 15:15hrs. b) Atrasos y Retiros Anticipados: Se registrarán formalmente en la planilla de control diaria. c) El retiro anticipado solo podrá ser realizado por el apoderado titular o un tercero autorizado por escrito, previa presentación de cédula de identidad. d) Ausencias: Toda inasistencia debe ser justificada oportunamente por el apoderado a través de la libreta de comunicaciones o llamada telefónica.",
    keywords: ["articulo 67", "horarios", "retiros"]
  },
  {
    id: "RICE-ART-068",
    titulo: "ARTÍCULO 68: CANALES DE COMUNICACIÓN",
    seccion: "TÍTULO XVII — Reglamento Interno Educación Parvularia",
    contenido: "CANALES DE COMUNICACIÓN. a) El canal oficial es el mismo institucional (LIRMI, CORREO INSTITUCIONAL, TELÉFONO) b) Se habilitan correos institucionales de las educadoras de párvulos y una pizarra informativa en el acceso al ciclo preescolar.",
    keywords: ["articulo 68", "canales", "comunicación"]
  },
  {
    id: "RICE-ART-069",
    titulo: "ARTÍCULO 69: MATERIALES Y UNIFORME ESCOLAR",
    seccion: "TÍTULO XVII — Reglamento Interno Educación Parvularia",
    contenido: "MATERIALES Y UNIFORME ESCOLAR. a) Materiales: Se solicitarán solo materiales pedagógicos pertinentes para el uso directo de los párvulos. Queda estrictamente prohibida la exigencia de marcas o proveedores específicos. b) Uniforme Flexible: El uniforme oficial no es obligatorio para asistir a clases. Se sugiere ropa cómoda (buzo institucional o ropa deportiva neutra) que facilite el movimiento y el juego. c) Adaptaciones Sensoriales (Ley TEA): Se autoriza el uso de prendas alternativas si el párvulo presenta hipersensibilidad táctil a etiquetas, costuras o texturas específicas. Se permite el uso de protectores auditivos en el aula o recreo ante hipersensibilidad acústica. 148",
    keywords: ["articulo 69", "escolar", "materiales", "uniforme"]
  },
  {
    id: "RICE-ART-070",
    titulo: "ARTÍCULO 70: ALIMENTACIÓN Y COLACIONES SALUDABLES",
    seccion: "TÍTULO XVII — Reglamento Interno Educación Parvularia",
    contenido: "ALIMENTACIÓN Y COLACIONES SALUDABLES. Para los párvulos que reciben el servicio del Programa de Alimentación Escolar (PAE - JUNAEB) o que traen colaciones provistas desde el hogar, el equipo pedagógico aplicará adecuaciones inclusivas basadas en los requerimientos del espectro autista u otras ne cesidades alimentarias: Dimensión de Responsable Inclusión Estrategias Operativas Directo de Adecuación Alimentaria Flexibilidad de Respeto estricto a los tiempos Educadora y Ritmos individuales de ingesta de cada párvulo, Asistente de Aula evitando presiones ambientales o ruidos estridentes en el casino. Adecuación Permiso para modificar texturas, Equipo de Aula / Sensorial viscosidad, sabores, separación de Nutricionista alimentos en el plato o control de aromas JUNAEB según las necesidades del párvulo. Anticipación y Uso obligatorio de tableros de Especialista PIE / Apoyo comunicación aumentativa/alternativa Educadora (pictogramas) para estructurar visualmente el menú del día. 149 NORMAS DE HIGIENE Y SALUD",
    keywords: ["alimentación", "articulo 70", "colaciones", "saludables"]
  },
  {
    id: "RICE-ART-071",
    titulo: "ARTÍCULO 71: PROTOCOLO DE MUDA E HIGIENE EN PÁRVULOS",
    seccion: "TÍTULO XVII — Reglamento Interno Educación Parvularia",
    contenido: "PROTOCOLO DE MUDA E HIGIENE EN PÁRVULOS. a) Muda: Para los niveles que lo requieran (o en caso de accidentes biológicos esfinterianos), la muda se realizará en un espacio habilitado que garantice la privacidad y dignidad del párvulo. El proceso lo ejecutará siempre personal del ciclo (educadora o asistent e de párvulos) siguiendo estrictas normas de higiene (uso de guantes, lavado de manos y desinfección del mudador). b) Control de Esfínter: El no tener control de esfínter desarrollado nunca será un impedimento para la matrícula o asistencia del párvulo. c) El equipo pedagógico, en conjunto con los profesionales del Programa de Integración Escolar (PIE), colaborará activamente con la familia en el proceso formativo de adquisición de hábitos de higiene, desarrollando planes individuales de control de esfínter cuando existan dificultades madurativas o del desarrollo. d) Desinfección y Ventilación de Aulas: Las salas de clases se ventilarán de forma cruzada durante los recreos y se desinfectarán diariamente al término de la jornada. e) Resguardo TEA: Para evitar crisis sensoriales, se prohíbe el uso de desinfectantes o aromatizantes con fragancias fuertes e invasivas dentro de las salas del ciclo preescolar.",
    keywords: ["articulo 71", "higiene", "muda", "protocolo", "párvulos"]
  },
  {
    id: "RICE-ART-072",
    titulo: "ARTÍCULO 72: ADMINISTRACIÓN DE MEDICAMENTOS EN EL ESTABLECIMIENTO",
    seccion: "TÍTULO XVII — Reglamento Interno Educación Parvularia",
    contenido: "ADMINISTRACIÓN DE MEDICAMENTOS EN EL ESTABLECIMIENTO. 17.1 SECCIÓN V: NORMAS DE SEGURIDAD Y PLAN INTEGRAL (PISE) .............................................................................................................. 151 17.2 PROTOCOLOS DE ACTUACIÓN DE EDUCACIÓN PARVULARIA .................................................................................................................... 151 PROTOCOLO N°22 Actuación ante Sospecha o Detección de Vulneración de Derechos .......................................... 152 PROTOCOLO N°23 Abordaje de Desregulaciones Emocionales y Conductuales (Ley TEA) .................................... 155 PROTOCOLO N°24 Gestión de Conflictos y Agresiones entre Párvulos ................................................................................. 157 PROTOCOLO N°25 Prevención y Gestión del Absentismo Escolar Temprano ................................................................... 159 PROTOCOLO N°26 Actuación ante Accidentes Escolares en la Educación Parvularia ................................................ 161 Título XVIII DE LAS INTERFACES DIGITALES Y FORMATOS DE REGISTRO ................................................................................. 163 18.1 FORMATOS OFICIALES DE ATENCIÓN y registro ............................................................................................................................................. 163 18.2 CANALES DIGITALES Y PORTALES DE ACCESO QR ......................................................................................................................................... 164 18.3 DOCUMENTACIÓN ANEXA COMPLEMENTARIA ............................................................................................................................................... 165 5 UNIDAD DE CONVIVENCIA EDUCATIVA Glosario, Siglas y Concepto...",
    keywords: ["administración", "articulo 72", "establecimiento", "medicamentos"]
  },
  {
    id: "RICE-PERFIL-EST",
    titulo: "PERFIL DEL ESTUDIANTE DEL LICEO DE HUARA (TÍTULO V, SECCIÓN 5.1)",
    seccion: "TÍTULO V — Perfil de la Comunidad Educativa",
    contenido: "Se define como Estudiante del Liceo Huara a todo niño, niña, adolescente o adulto que, habiendo formalizado su matrícula, se integra a esta comunidad educativa pública como un sujeto de derechos, protagonista de su propio aprendizaje y portador de una identidad territorial única. Ser estudiante de nuestro Liceo trasciende la mera asistencia al aula; implica el compromiso de habitar un espacio de respeto mutuo, donde la diversidad cultural y generacional es el motor del desarrollo integral. Su perfil se caracteriza por: Autonomía Progresiva (capaz de conducir su propio proceso de formación de manera autónoma, comprometiéndose con su aprendizaje según su etapa de desarrollo); Sujeto de Derechos (se reconoce como titular de derechos, dignidad y responsabilidades dentro de la comunidad educativa); Protagonista del Aprendizaje (participa activamente en su proceso educativo, asumiendo un rol comprometido, reflexivo y responsable); Identidad Territorial (valora su cultura, historia local y pertenencia al territorio de Huara, reconociendo la diversidad cultural como parte de su formación integral); Convivencia Respetuosa (habita el espacio escolar desde el respeto mutuo, el buen trato, la empatía y la resolución pacífica de los conflictos); Valoración de la Diversidad (reconoce y respeta las diferencias culturales, generacionales, sociales y personales); Compromiso Comunitario (participa en la vida escolar con sentido de pertenencia, contribuyendo al bienestar común).",
    keywords: ["perfil", "perfil del estudiante", "que significa ser estudiante", "como debe ser un estudiante", "autonomia", "sujeto de derechos", "protagonista", "identidad territorial", "convivencia respetuosa", "diversidad", "compromiso comunitario", "titulo v", "comunidad educativa"]
  },
  {
    id: "RICE-CEAL",
    titulo: "CENTRO DE ESTUDIANTES / CENTRO DE ALUMNOS (CEAL)",
    seccion: "TÍTULO V — Perfil de la Comunidad Educativa / Glosario Institucional",
    contenido: "CEAL (Centro de Estudiantes o Centro de Alumnos): Organización estudiantil representativa y democrática que canaliza las inquietudes, propuestas y la participación ciudadana de las y los alumnos del Liceo de Huara. El CEAL participa junto con la Dirección, Sostenedor, Docentes, Asistentes y CGPA en el Consejo Escolar, donde se validan enmiendas reglamentarias con participación firmada de todos los estamentos. Es el canal oficial para que los estudiantes hagan llegar sus propuestas, reclamos y sugerencias de mejora a la Dirección y al Equipo de Gestión del establecimiento.",
    keywords: ["centro de alumnos", "centro de estudiantes", "ceal", "organizacion estudiantil", "participacion estudiantil", "consejo escolar", "representantes", "delegados", "democracia escolar", "propuestas estudiantes"]
  }
];