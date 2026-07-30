/**
 * MOTOR DE BÚSQUEDA SEMÁNTICA LOCAL (RAG - Context Retrieval)
 * Realiza un análisis lingüístico de la consulta del usuario, remueve stop-words,
 * pondera la relevancia sobre los campos del RICE y extrae los fragmentos óptimos.
 */

const RICE_SearchEngine = {
  // Lista de palabras vacías comunes en español a ignorar en la búsqueda
  stopWords: new Set([
    "de", "la", "que", "el", "en", "y", "a", "los", "del", "se", "las", "un", "para", 
    "con", "no", "una", "su", "al", "lo", "como", "más", "pero", "sus", "le", "ya", 
    "o", "este", "sí", "porque", "esta", "entre", "cuando", "muy", "sin", "sobre", 
    "también", "me", "hasta", "desde", "nos", "durante", "uno", "ni", "contra", 
    "ese", "eso", "mí", "qué", "cómo", "dónde", "quién"
  ]),

  // Normalizar texto: minúsculas, remoción de acentos y puntuación
  normalizarTexto: function(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remueve tildes/acentos
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\¿¡!]/g, " ") // Remueve signos
      .replace(/\s+/g, " ") // Colapsa múltiples espacios
      .trim();
  },

  // Corrección ortográfica y tolernacia a errores de tipeo de estudiantes
  corregirOrtografiaEstudiante: function(texto) {
    let t = this.normalizarTexto(texto);
    return t
      .replace(/\bakos\w*/g, 'acoso')
      .replace(/\bacos\w*/g, 'acoso')
      .replace(/\bembaraz\w*/g, 'embarazo')
      .replace(/\bpolol\w*/g, 'pololeo')
      .replace(/\bparej\w*/g, 'pololeo')
      .replace(/\bnovi[ao]\w*/g, 'pololeo')
      .replace(/\bbulying\b/g, 'acoso')
      .replace(/\bbulin\b/g, 'acoso')
      .replace(/\bbuli\b/g, 'acoso')
      .replace(/\bwea\b/g, 'problema')
      .replace(/\bweba\w*/g, 'molestar')
      .replace(/\bcagao\b/g, 'asustado')
      .replace(/\bpalomilla\w*/g, 'estudiante')
      .replace(/\bcabr[ao]\w*/g, 'estudiante')
      .replace(/\bchiquill[ao]\w*/g, 'estudiante')
      .replace(/\bdupla\b/g, 'psicosocial')
      .replace(/\bpsicologo\w*/g, 'psicosocial')
      .replace(/\basistsocial\w*/g, 'psicosocial')
      .replace(/\borientador\w*/g, 'psicosocial')
      .replace(/\bpjefe\b/g, 'profesor')
      .replace(/\bprofjefe\b/g, 'profesor')
      .replace(/\binspector\w*/g, 'directivo')
      .replace(/\budi\b/g, 'directivo')
      .replace(/\butp\b/g, 'directivo')
      .replace(/\bfenatarse\w*/g, 'esfuerzo')
      .replace(/\bmatear\w*/g, 'esfuerzo')
      .replace(/\bcampana\b/g, 'copia')
      .replace(/\bpasarse\b/g, 'copia')
      .replace(/\bklas\w*/g, 'clases')
      .replace(/\bkero\b/g, 'quiero')
      .replace(/\bkiere\b/g, 'quiere')
      .replace(/\bmoles\w*/g, 'maltrato')
      .replace(/\bburl\w*/g, 'maltrato')
      .replace(/\bpeg\w*/g, 'agresion')
      .replace(/\bgolp\w*/g, 'agresion')
      .replace(/\binsul\w*/g, 'maltrato')
      .replace(/\bprofe\b/g, 'profesor')
      .replace(/\bkolegio\b/g, 'colegio')
      .replace(/\bliseo\b/g, 'liceo')
      .replace(/\batras\w*/g, 'atrasos')
      .replace(/\bfalt\w*/g, 'inasistencia')
      .replace(/\bcelu\w*/g, 'celular')
      .replace(/\btelef\w*/g, 'celular');
  },

  // Tokenizar texto en palabras individuales filtrando stop-words y corrigiendo ortografía
  obtenerTokens: function(texto) {
    const textoCorregido = this.corregirOrtografiaEstudiante(texto);
    const palabras = textoCorregido.split(" ");
    return palabras.filter(palabra => palabra.length > 2 && !this.stopWords.has(palabra));
  },

  // Buscar fragmentos más relevantes de la base de datos RICE
  buscar: function(query, limite = 3) {
    const tokensQuery = this.obtenerTokens(query);
    console.log("Tokens de búsqueda extraídos:", tokensQuery);

    if (tokensQuery.length === 0) {
      return [];
    }

    // Conceptos de alerta por maltrato/acoso ordinario (incluyendo todas las formas verbales: acosa, acosan, acoso, molestan, burlan)
    const terminosAlarmaMalt = ["acosa", "acosan", "acosando", "acoso", "acosar", "molesta", "molestan", "pega", "pegan", "insulta", "insultan", "empuja", "burlan", "ciberacoso", "bullying", "maltrato", "papeles", "hacer", "ayuda", "miedo", "amenaza", "pelear", "violencia", "violento", "violentos", "violenta", "violentas", "agresion", "agresiones", "pololo", "polola", "pareja"];
    const tieneAlarmaMalt = tokensQuery.some(token => terminosAlarmaMalt.includes(token) || token.startsWith("acos") || token.startsWith("molest") || token.startsWith("burl"));

    // Conceptos de alerta por abuso o connotación sexual
    const terminosAlarmaSex = ["sexual", "sexuales", "toco", "tocaciones", "abuso", "abusar", "manoseo", "intimidad", "acosar", "sexo", "violar"];
    const tieneAlarmaSex = tokensQuery.some(token => terminosAlarmaSex.includes(token));

    // Conceptos de alerta por drogas o alcohol
    const terminosAlarmaDroga = ["marihuana", "droga", "drogas", "alcohol", "tomando", "tomar", "pastillas", "porro", "pito", "faso", "yerba", "hierba", "cocaina", "cocaína"];
    const tieneAlarmaDroga = tokensQuery.some(token => terminosAlarmaDroga.includes(token));

    // Conceptos de alerta por inasistencia o deserción escolar
    const terminosAlarmaAsistencia = ["falto", "falte", "inasistencia", "ausencia", "inasistencias", "consecutivas", "seguidas", "dias", "días", "falta"];
    const tieneAlarmaAsistencia = tokensQuery.some(token => terminosAlarmaAsistencia.includes(token));

    // Conceptos de alerta por desregulación emocional o autismo (TEA)
    const terminosAlarmaTEA = ["tea", "autismo", "desregulacion", "desregulación", "sensorial", "calma", "contencion", "contención"];
    const tieneAlarmaTEA = tokensQuery.some(token => terminosAlarmaTEA.includes(token));

    // Conceptos de alerta por debido proceso o procedimientos disciplinarios
    const terminosAlarmaProceso = ["proceso", "debido", "procedimiento", "apelacion", "apelación", "descargos", "defensa", "investigacion", "investigación", "resolucion", "resolución"];
    const tieneAlarmaProceso = tokensQuery.some(token => terminosAlarmaProceso.includes(token));

    const resultados = RICE_DATABASE.map(articulo => {
      let score = 0;

      // 1. Ponderación por Coincidencia en Palabras Clave (Peso Alto: 4pt por coincidencia)
      articulo.keywords.forEach(keyword => {
        const keywordNorm = this.normalizarTexto(keyword);
        tokensQuery.forEach(token => {
          // Si el token es corto (<= 4 letras), exigir coincidencia exacta para evitar falsos positivos
          if (token.length <= 4) {
            if (keywordNorm === token) score += 4;
          } else {
            if (keywordNorm.includes(token) || token.includes(keywordNorm)) score += 4;
          }
        });
      });

      // 2. Coincidencia en el Título del Artículo (Peso Medio: 2pt por coincidencia)
      const tituloNorm = this.normalizarTexto(articulo.titulo);
      tokensQuery.forEach(token => {
        if (token.length <= 4) {
          if (tituloNorm.split(" ").includes(token)) score += 2;
        } else {
          if (tituloNorm.includes(token)) score += 2;
        }
      });

      // 3. Coincidencia en el Contenido del Artículo (Peso Regular: 1pt por coincidencia)
      const contenidoNorm = this.normalizarTexto(articulo.contenido);
      tokensQuery.forEach(token => {
        if (token.length <= 4) {
          if (contenidoNorm.split(" ").includes(token)) score += 1;
        } else {
          if (contenidoNorm.includes(token)) score += 1;
        }
      });

      // 4. Reforzador Conceptual: Acoso/Maltrato Ordinario — IDs reales de la DB
      if (tieneAlarmaMalt) {
          if (articulo.id === "RICE-PROT-003") score += 25; // Protocolo de Acoso/Bullying
          if (articulo.id === "RICE-ART-30"  ) score += 25; // Alias legacy por compatibilidad
          if (articulo.id === "RICE-COND-001") score += 15; // Derechos y deberes
          if (articulo.id === "RICE-ART-01"  ) score += 15; // Alias legacy derechos
      }
      // 5. Reforzador Conceptual: Sospecha de Delito Sexual / Connotación Sexual
      if (tieneAlarmaSex) {
          if (articulo.id === "RICE-PROT-005") score += 35; // Protocolo delitos sexuales
          if (articulo.id === "RICE-ART-35"  ) score += 30; // Alias legacy
          if (articulo.id === "RICE-COND-001") score += 15;
          if (articulo.id === "RICE-ART-01"  ) score += 15;
      }
      // 6. Reforzador Conceptual: Porte o Consumo de Alcohol y Drogas
      if (tieneAlarmaDroga) {
          if (articulo.id === "RICE-PROT-006") score += 35; // Protocolo drogas y alcohol
          if (articulo.id === "RICE-ART-36"  ) score += 30; // Alias legacy
          if (articulo.id === "RICE-COND-001") score += 15;
          if (articulo.id === "RICE-ART-01"  ) score += 15;
      }
      // 7. Reforzador Conceptual: Inasistencias y Deserción Escolar
      if (tieneAlarmaAsistencia) {
          if (articulo.id === "RICE-PROT-001") score += 35; // Protocolo atrasos/inasistencias
          if (articulo.id === "RICE-ART-10"  ) score += 30; // Alias legacy
          if (articulo.id === "RICE-REG-001" ) score += 20; // Reglamento general
          if (articulo.id === "RICE-ART-09"  ) score += 20; // Alias legacy
      }
      // 8. Reforzador Conceptual: Desregulación Emocional, Autismo y NEE
      if (tieneAlarmaTEA) {
          if (articulo.id === "RICE-PROT-014") score += 35; // Protocolo TEA/Neurodiversidad
          if (articulo.id === "RICE-ART-32"  ) score += 30; // Alias legacy
      }
      // 9. Reforzador Conceptual: Debido Proceso y Procedimientos Disciplinarios
      if (tieneAlarmaProceso) {
          if (articulo.id === "RICE-COND-001") score += 35; // Conducto regular y debido proceso
          if (articulo.id === "RICE-ART-20"  ) score += 30; // Alias legacy
      }

      return {
        articulo: articulo,
        score: score
      };
    });

    // Filtrar aquellos artículos con coincidencia real (umbral mínimo de score >= 4 para evitar ruido)
    let resultadosFiltrados = resultados.filter(res => res.score >= 4);
    
    // Si nada supera el umbral pero hay coincidencias leves, respaldar con score > 0
    if (resultadosFiltrados.length === 0) {
      resultadosFiltrados = resultados.filter(res => res.score > 0);
    }

    const articulosFiltrados = resultadosFiltrados
      .sort((a, b) => b.score - a.score)
      .slice(0, limite)
      .map(res => res.articulo);

    console.log("Artículos recuperados de forma estricta por el buscador local:", articulosFiltrados);
    return articulosFiltrados;
  }
};
