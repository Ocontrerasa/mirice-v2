/**
 * MÓDULO DE TERMÓMETRO DE CLIMA ESCOLAR SEMANAL — MIRICE 2026
 * Liceo de Huara • Enfoque Anónimo y Estadístico
 * 
 * Funcionalidad:
 * 1. Presenta una encuesta semanal adaptada según el rol (Estudiante, Apoderado, Funcionario).
 * 2. 100% Anónima: Guarda respuestas por semana y rol sin asociar el RUT del usuario.
 * 3. Muestra resultados consolidados en un termómetro visual de bienestar institucional.
 */

(function () {

  // Banco de Preguntas por Semana y por Rol
  const BANCO_ENCUESTAS_CLIMA = {
    // PREGUNTAS PARA ESTUDIANTES
    estudiante: [
      {
        semana: 1,
        titulo: "🌱 Termómetro de Clima Escolar: Bienestar y Seguridad",
        pregunta1: "¿Cómo te has sentido en tus espacios de recreo esta semana?",
        opciones1: ["😄 Muy seguro y bien acompañado", "🙂 Tranquilo en general", "😐 A veces incómodo", "😟 Inseguro o solo"],
        pregunta2: "¿Sientes que tus profesores y el Equipo de Convivencia Educativa te escuchan cuando lo necesitas?",
        opciones2: ["👍 Sí, siempre", "🙂 La mayoría de las veces", "😐 Rara vez", "👎 No siento apoyo"]
      },
      {
        semana: 2,
        titulo: "🤝 Termómetro de Clima Escolar: Respeto y Convivencia",
        pregunta1: "¿Has presenciado o vivido situaciones de agresión o burlas en el liceo esta semana?",
        opciones1: ["🟢 Ninguna, clima de respeto", "🟡 Muy pocas situaciones aisladas", "🟠 Algunas discusiones verbales", "🔴 Frecuentes peleas o burlas"],
        pregunta2: "¿Crees que en tu curso se respetan las diferencias y la diversidad de cada uno?",
        opciones2: ["🌟 Sí, hay mucha inclusión", "🙂 En general sí", "😐 Cuesta un poco", "👎 Hay mucha exclusión"]
      }
    ],

    // PREGUNTAS PARA APODERADOS
    apoderado: [
      {
        semana: 1,
        titulo: "🏡 Termómetro de Clima Escolar: Comunicación y Apoyo Familiar",
        pregunta1: "¿Cómo califica la atención y disponibilidad del liceo para resolver dudas sobre su pupilo/a?",
        opciones1: ["⭐ Excelente y oportuna", "🙂 Buena", "😐 Regular", "🙁 Insuficiente"],
        pregunta2: "¿Siente que su hijo/a asiste al Liceo de Huara en un entorno seguro y protegido?",
        opciones2: ["🛡️ Totalmente seguro", "🙂 Seguro en general", "😐 Con algunas inquietudes", "⚠️ Inseguro"]
      }
    ],

    // PREGUNTAS PARA FUNCIONARIOS Y DOCENTES
    funcionario: [
      {
        semana: 1,
        titulo: "🏫 Termómetro de Clima Escolar: Trabajo en Equipo y Protocolos",
        pregunta1: "¿Cómo evalúa la efectividad en la aplicación de los protocolos RICE en el establecimiento?",
        opciones1: ["🟢 Altamente efectiva y clara", "🙂 Adecuada", "😐 Requiere mayor coordinación", "🔴 Deficiente"],
        pregunta2: "¿Cómo percibe el ambiente de respeto y colaboración laboral esta semana?",
        opciones2: ["🌟 Muy positivo y colaborativo", "🙂 Bueno y respetuoso", "😐 Neutro", "⚠️ Tenso"]
      }
    ]
  };

  // Calcular número de semana lectiva del año (1 a 52)
  function obtenerNumeroSemana() {
    const hoy = new Date();
    const primerDiaAno = new Date(hoy.getFullYear(), 0, 1);
    const dias = Math.floor((hoy - primerDiaAno) / (24 * 60 * 60 * 1000));
    return Math.ceil((hoy.getDay() + 1 + dias) / 7);
  }

  // Generar HTML de la Encuesta Semanal
  window.generarHtmlTermometroClima = function (role, rut) {
    const numSemana = obtenerNumeroSemana();
    const preguntasRol = BANCO_ENCUESTAS_CLIMA[role] || BANCO_ENCUESTAS_CLIMA['estudiante'];
    const encuestaActual = preguntasRol[(numSemana % preguntasRol.length)] || preguntasRol[0];

    const storageKeyRespuesta = `mirice_survey_done_${role}_sem_${numSemana}_${rut}`;
    const yaRespondio = localStorage.getItem(storageKeyRespuesta) === 'true';

    if (yaRespondio) {
      return `
        <!-- TARJETA TERMÓMETRO RESPONDIDA -->
        <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; margin-top:14px; box-shadow:0 4px 14px rgba(0,0,0,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
            <span style="font-size:0.75rem; font-weight:800; color:#047857; background:#e6f4ea; padding:3px 10px; border-radius:50px;">📊 RESPUESTA REGISTRADA (SEMANA ${numSemana})</span>
            <span style="font-size:0.75rem; color:#64748b; font-weight:600;">🔒 100% Anónimo</span>
          </div>
          <h4 style="font-size:0.95rem; font-weight:800; color:#0f172a; margin-bottom:6px;">¡Gracias por participar en el Termómetro de Clima Escolar! 👋</h4>
          <p style="font-size:0.84rem; color:#334155; line-height:1.45; margin:0;">
            Tu opinión anónima ya fue incorporada a las estadísticas institucionales del Liceo de Huara. La próxima semana se abrirá una nueva consulta de bienestar.
          </p>
        </div>
      `;
    }

    return `
      <!-- TARJETA TERMÓMETRO CLIMA ESCOLAR SEMANAL -->
      <div id="card-termometro-clima" style="background:#ffffff; border:1.5px solid #cbd5e1; border-left:5px solid #047857; border-radius:16px; padding:18px; margin-top:14px; box-shadow:0 4px 16px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:10px;">
          <span style="font-size:0.75rem; font-weight:800; color:#047857; background:#e6f4ea; padding:3px 10px; border-radius:50px;">📊 ENCUESTA ANÓNIMA SEMANAL (SEMANA ${numSemana})</span>
          <span style="font-size:0.75rem; color:#047857; font-weight:700;">🔒 100% Anónimo y Estadístico</span>
        </div>

        <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin-bottom:6px;">
          ${encuestaActual.titulo}
        </h4>
        <p style="font-size:0.82rem; color:#334155; line-height:1.45; margin-bottom:14px;">
          Tu respuesta ayuda al Liceo de Huara a tomar decisiones para mejorar la convivencia y el bienestar comunitario. <strong>Las respuestas son completamente anónimas y no se asocian a tu nombre ni RUT.</strong>
        </p>

        <form id="form-clima-semanal" onsubmit="window.guardarRespuestaClima(event, '${role}', '${rut}', ${numSemana})">
          <div style="margin-bottom:12px;">
            <label style="font-size:0.85rem; font-weight:700; color:#0f172a; display:block; margin-bottom:6px;">
              1. ${encuestaActual.pregunta1}
            </label>
            <select id="clima-p1" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.85rem; background:#ffffff; color:#0f172a;">
              <option value="">-- Selecciona una opción --</option>
              ${encuestaActual.opciones1.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
          </div>

          <div style="margin-bottom:14px;">
            <label style="font-size:0.85rem; font-weight:700; color:#0f172a; display:block; margin-bottom:6px;">
              2. ${encuestaActual.pregunta2}
            </label>
            <select id="clima-p2" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.85rem; background:#ffffff; color:#0f172a;">
              <option value="">-- Selecciona una opción --</option>
              ${encuestaActual.opciones2.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
          </div>

          <button type="submit" class="btn-primary" style="background:linear-gradient(135deg, #047857 0%, #065f46 100%); color:white; font-weight:bold; padding:10px 18px; border-radius:50px; border:none; cursor:pointer; width:100%; font-size:0.85rem;">
            📩 Enviar Respuesta Anónima
          </button>
        </form>
      </div>
    `;
  };
  // Guardar Respuesta de Encuesta de Clima Semanal
  window.guardarRespuestaClima = function (event, role, rut, numSemana) {
    event.preventDefault();

    const p1 = document.getElementById('clima-p1');
    const p2 = document.getElementById('clima-p2');

    if (!p1 || !p2 || !p1.value || !p2.value) {
      alert('⚠️ Debes seleccionar ambas respuestas antes de enviar.');
      return;
    }

    // Guardar respuesta anónima en estadísticas semanales
    const storageKeyStats = `mirice_climate_stats_sem_${numSemana}`;
    let stats = [];
    try {
      stats = JSON.parse(localStorage.getItem(storageKeyStats)) || [];
    } catch (e) {
      stats = [];
    }

    stats.push({
      pregunta1: p1.value,
      pregunta2: p2.value,
      fecha: new Date().toISOString(),
      rol: role
    });

    localStorage.setItem(storageKeyStats, JSON.stringify(stats));

    // Marcar como respondida para este RUT y semana
    const storageKeyRespuesta = `mirice_survey_done_${role}_sem_${numSemana}_${rut}`;
    localStorage.setItem(storageKeyRespuesta, 'true');

    alert('✅ ¡Gracias! Tu opinión anónima fue registrada exitosamente para las estadísticas institucionales.');
    
    // Recargar vista o tarjeta
    const card = document.getElementById('card-termometro-clima');
    if (card) {
      card.outerHTML = window.generarHtmlTermometroClima(role, rut);
    }
  };

  // IDEA 1 APROBADA: TABLERO VISUAL DE TENDENCIAS DE CLIMA PARA LA DIRECCIÓN Y COORDINACIÓN
  window.generarHtmlTableroDireccionClima = function (userData) {
    if (typeof window.esCoordinadorConvivenciaAutorizado === 'function' && !window.esCoordinadorConvivenciaAutorizado(userData)) {
      return ''; // Oculto para usuarios normales
    }

    const numSemana = obtenerNumeroSemana();
    const storageKeyStats = `mirice_climate_stats_sem_${numSemana}`;
    let stats = [];
    try {
      stats = JSON.parse(localStorage.getItem(storageKeyStats)) || [];
    } catch (e) {
      stats = [];
    }

    const totalRespuestas = stats.length;
    let positivas = 0;
    let neutras = 0;

    stats.forEach(s => {
      const p1 = (s.pregunta1 || '').toLowerCase();
      if (p1.includes('muy') || p1.includes('excelente') || p1.includes('positivo') || p1.includes('si') || p1.includes('tranquilo') || p1.includes('bueno')) {
        positivas++;
      } else {
        neutras++;
      }
    });

    const porcentajePositivo = totalRespuestas > 0 ? Math.round((positivas / totalRespuestas) * 100) : 100;

    return `
      <!-- TABLERO VISUAL DE TENDENCIAS DE CLIMA ESCOLAR (IDEA 1 DIRECCIÓN) -->
      <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-left:5px solid #047857; border-radius:16px; padding:18px; margin-bottom:16px; box-shadow:0 4px 16px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin:0; display:flex; align-items:center; gap:8px;">
            📈 Tablero Institucional de Tendencias de Clima (Semana ${numSemana})
          </h4>
          <span style="font-size:0.75rem; font-weight:800; color:#047857; background:#e6f4ea; padding:3px 10px; border-radius:50px;">👑 Vista Exclusiva Dirección / Convivencia</span>
        </div>

        <p style="font-size:0.82rem; color:#334155; line-height:1.45; margin-bottom:14px;">
          Consolidado anónimo de percepciones de la comunidad educativa (Estudiantes, Apoderados y Funcionarios) recolectadas esta semana:
        </p>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:14px;">
          <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:10px; padding:12px; text-align:center;">
            <span style="font-size:0.75rem; font-weight:700; color:#15803d; display:block;">Índice de Clima Positivo</span>
            <strong style="font-size:1.4rem; color:#047857; font-weight:900;">${porcentajePositivo}%</strong>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px; text-align:center;">
            <span style="font-size:0.75rem; font-weight:700; color:#475569; display:block;">Total Respuestas Anónimas</span>
            <strong style="font-size:1.4rem; color:#0f172a; font-weight:900;">${totalRespuestas}</strong>
          </div>
        </div>

        <div style="background:#f1f5f9; border-radius:8px; height:12px; overflow:hidden; display:flex; margin-bottom:10px;">
          <div style="width:${porcentajePositivo}%; background:#10b981; height:100%; transition:width 0.5s ease;"></div>
          <div style="width:${100 - porcentajePositivo}%; background:#f59e0b; height:100%; transition:width 0.5s ease;"></div>
        </div>
      </div>
    `;
  };

})();
