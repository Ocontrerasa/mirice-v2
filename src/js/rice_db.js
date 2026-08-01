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
    id: "RICE-COND-001",
    titulo: "CONDUCTO REGULAR Y CANALES OFICIALES DE ATENCIÓN E INQUIETUDES (ARTS. 1-2)",
    seccion: "CANALES DE COMUNICACIÓN Y DEBIDO PROCESO",
    contenido: "CONDUCTO REGULAR DEL LICEO DE HUARA: El procedimiento jerárquico para consultas, reclamos o solicitudes de la comunidad educativa sigue los siguientes pasos: 1° Profesor/a Jefe o Docente de Asignatura (instancia inicial de aula); 2° Equipo de Convivencia Educativa / Inspectoría General / UTP (para temas socioemocionales, faltas RICE o requerimientos no resueltos en 48 hrs); 3° Dirección del Liceo de Huara (instancia superior de apelación y casos complejos); 4° Sostenedor (SLEP Tamarugal) / Superintendencia de Educación (instancia fiscalizadora externa). Todo apoderado y estudiante tiene derecho a ser atendido con respeto, escucha protegida y confidencialidad (Circular 482 Mineduc).",
    keywords: ["conducto regular", "conductos regulares", "canales de atencion", "reclamo", "reclamos", "atencion a apoderados", "profesor jefe", "convivencia educativa", "convivencia escolar", "direccion", "solicitud", "jerarquia"]
  },
  {
    id: "RICE-REG-001",
    titulo: "REGULACIÓN DEL USO DE TELÉFONOS CELULARES EN AULA (FALTAS L-03, L-04, G-08, G-13)",
    seccion: "DEBERES Y REGLAMENTO DISCIPLINARIO FORMATIVO",
    contenido: "REGULACIÓN DE CELULARES: Manipular o mantener a la vista el celular en clases sin indicación pedagógica es falta leve (Código L-03): advertencia verbal y retiro temporal. Usar audífonos durante la explicación también es falta leve (L-04). Acumular 3 registros de celular en el mismo mes escala automáticamente a falta grave (G-13): citación al apoderado y prohibición de ingreso del equipo al liceo por 15 días. Usar el celular durante una evaluación para buscar respuestas es falta grave (G-08): retiro del dispositivo, término de la evaluación para ese estudiante, custodia del equipo en Inspectoría con entrega exclusiva al apoderado, y reprogramación del instrumento por UTP.",
    keywords: ["celular", "celulares", "telefono", "telefonos", "pantallas", "clases", "audifonos", "uso de celular en prueba"]
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
  }
];