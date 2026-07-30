/**
 * MÓDULO DE AUTORREGULACIÓN DIGITAL EN AULA — MIRICE 2026
 * Liceo de Huara • Formación de Bienestar y Gestión Consciente del Tiempo
 * 
 * Normativa y Principios:
 * 1. Estricto enfoque formativo y de autogestión para los estudiantes.
 * 2. Cero rastreo de contenidos, mensajes ni cámaras (Privacidad absoluta Ley N° 19.628).
 * 3. No punitivo: Proporciona métricas personales y reconocimientos de desconexión consciente.
 * 4. Horarios de clases oficiales de Huara y exención estricta en periodos de recreo/almuerzo.
 */

(function () {

  // Convertir hora HH:MM a minutos desde medianoche
  function aMinutos(horaStr) {
    const [h, m] = horaStr.split(':').map(Number);
    return h * 60 + m;
  }

  // Comprobar si el curso pertenece a Enseñanza Media (1° a 4° Medio)
  function esMedia(cursoStr) {
    if (!cursoStr) return true; // Default
    const c = cursoStr.toLowerCase();
    return c.includes('medio') || c.includes('media') || c.includes('tp') || c.includes('epja');
  }

  // Comprobar si en este momento el estudiante está en bloque pedagógico de clases (excluye recreos)
  window.esHorarioDeClaseHuara = function (cursoStr, fechaObj = new Date()) {
    const diaSemana = fechaObj.getDay(); // 0=Dom, 1=Lun, ..., 5=Vie, 6=Sáb
    if (diaSemana === 0 || diaSemana === 6) return false; // Fines de semana

    const horaActualMin = fechaObj.getHours() * 60 + fechaObj.getMinutes();
    const esEnsenanzaMedia = esMedia(cursoStr);

    // 1. Horario de inicio de jornada: 08:30 hrs (510 min)
    const inicioJornada = aMinutos('08:30');

    // 2. Horario de término de jornada según día y ciclo escolar
    let finJornada = aMinutos('15:30'); // Default Básica Lunes a Jueves

    if (diaSemana === 5) {
      // Viernes: Todos salen a las 13:30 hrs
      finJornada = aMinutos('13:30');
    } else if (esEnsenanzaMedia) {
      if (diaSemana === 1 || diaSemana === 2) {
        // Lunes y Martes Media: Salida a las 17:15 hrs
        finJornada = aMinutos('17:15');
      } else {
        // Miércoles y Jueves Media: Salida a las 15:30 hrs
        finJornada = aMinutos('15:30');
      }
    }

    // Fuera de la jornada escolar general
    if (horaActualMin < inicioJornada || horaActualMin >= finJornada) {
      return false;
    }

    // 3. Exención de Recreos y Almuerzo (USO LIBRE PERMITIDO)
    const recreos = [
      { inicio: aMinutos('10:00'), fin: aMinutos('10:15') }, // Recreo 1 Mañana
      { inicio: aMinutos('11:45'), fin: aMinutos('12:00') }, // Recreo 2 Mañana
      { inicio: aMinutos('13:30'), fin: aMinutos('14:10') }, // Horario de Almuerzo
      { inicio: aMinutos('15:30'), fin: aMinutos('15:45') }  // Recreo Tarde (Media Lun/Mar)
    ];

    for (let r of recreos) {
      if (horaActualMin >= r.inicio && horaActualMin < r.fin) {
        return false; // Está en recreo/almuerzo -> No se cuenta
      }
    }

    return true; // Está dentro de una clase pedagógica activa
  };

  // Claves de almacenamiento local por RUT
  function getStorageKey(rut) {
    return 'mirice_digital_wellness_' + (rut || 'anon');
  }

  // Registrar una consulta/acceso durante período de clase
  window.registrarAccesoDigitalEnClase = function (rut, cursoStr) {
    if (!rut) return;

    // Solo contar si efectivamente estamos en horario de clase activa
    if (!window.esHorarioDeClaseHuara(cursoStr)) return;

    const hoy = new Date();
    const fechaKey = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');
    
    // Evitar contar múltiples accesos seguidos dentro del mismo minuto
    const ultimoRegistroKey = 'mirice_last_usage_min_' + rut;
    const minutoActualStr = fechaKey + '_' + hoy.getHours() + ':' + hoy.getMinutes();
    if (localStorage.getItem(ultimoRegistroKey) === minutoActualStr) {
      return;
    }
    localStorage.setItem(ultimoRegistroKey, minutoActualStr);

    const storageKey = getStorageKey(rut);
    let historial = {};
    try {
      historial = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (e) {
      historial = {};
    }

    historial[fechaKey] = (historial[fechaKey] || 0) + 1;
    localStorage.setItem(storageKey, JSON.stringify(historial));

    console.log(`📱 MiRice Wellness: Registrado acceso en horario de clases (${fechaKey}): ${historial[fechaKey]} veces.`);
  };

  // Obtener estadísticas de la semana actual (Lunes a Viernes)
  window.obtenerEstadisticasSemanalesDigital = function (rut) {
    const storageKey = getStorageKey(rut);
    let historial = {};
    try {
      historial = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (e) {
      historial = {};
    }

    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 1=Lun, ..., 5=Vie
    const lunesDiff = (diaSemana === 0 ? -6 : 1 - diaSemana);
    
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const resumenSemanal = [];
    let totalSemanal = 0;

    for (let i = 0; i < 5; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + lunesDiff + i);
      const fechaKey = fecha.getFullYear() + '-' + String(fecha.getMonth() + 1).padStart(2, '0') + '-' + String(fecha.getDate()).padStart(2, '0');
      const conteo = historial[fechaKey] || 0;

      resumenSemanal.push({
        nombreDia: dias[i],
        fechaKey: fechaKey,
        conteo: conteo,
        esHoy: (i === (diaSemana - 1))
      });

      totalSemanal += conteo;
    }

    // Definición de Reconocimiento / Badge Formativo
    let medalla = {
      badge: "🥇 Líder de la Atención en Aula",
      color: "#047857",
      bg: "#ecfdf5",
      border: "#a7f3d0",
      mensaje: "¡Excelente autorregulación! Mantener tu atención en clases fortalece tu aprendizaje y respeta el clima escolar."
    };

    if (totalSemanal >= 3 && totalSemanal <= 7) {
      medalla = {
        badge: "🥈 Conciencia Digital Activa",
        color: "#b45309",
        bg: "#fffbebfb",
        border: "#fde68a",
        mensaje: "Buena gestión de tu tiempo. Mantienes un equilibrio consciente entre tecnología y tus actividades de aula."
      };
    } else if (totalSemanal > 7) {
      medalla = {
        badge: "💡 Enfoque Formativo: Desconexión Consciente",
        color: "#1e3a8a",
        bg: "#eff6ff",
        border: "#bfdbfe",
        mensaje: "Has consultado el celular varias veces durante clases esta semana. Recuerda que los recreos y almuerzo son los espacios libres para comunicarte."
      };
    }

    return {
      resumenSemanal: resumenSemanal,
      totalSemanal: totalSemanal,
      medalla: medalla
    };
  };

  // Generar HTML de la tarjeta de Autorregulación Digital para el Perfil
  window.generarHtmlAutorregulacionDigital = function (rut, cursoStr) {
    const stats = window.obtenerEstadisticasSemanalesDigital(rut);
    const estaEnClaseAhora = window.esHorarioDeClaseHuara(cursoStr);

    let estadoEstadoHtml = `
      <div style="font-size:0.78rem; font-weight:700; color:#047857; background:#e6f4ea; padding:4px 12px; border-radius:50px; display:inline-flex; align-items:center; gap:6px;">
        <span style="width:8px; height:8px; background:#10b981; border-radius:50%; display:inline-block;"></span>
        ☕ Tiempo de Recreo / Almuerzo / Fuera de Clases (Uso Libre)
      </div>
    `;

    if (estaEnClaseAhora) {
      estadoEstadoHtml = `
        <div style="font-size:0.78rem; font-weight:700; color:#b45309; background:#fffbebfb; border:1px solid #fde68a; padding:4px 12px; border-radius:50px; display:inline-flex; align-items:center; gap:6px;">
          <span style="width:8px; height:8px; background:#f59e0b; border-radius:50%; display:inline-block;"></span>
          📚 Bloque de Clases Activo (Tiempo Protegido de Aprendizaje)
        </div>
      `;
    }

    let barrasSemanaHtml = "";
    stats.resumenSemanal.forEach(d => {
      const porcentaje = Math.min(100, d.conteo * 20); // 5 usos = 100%
      const bgBarra = d.conteo === 0 ? "#10b981" : (d.conteo <= 2 ? "#3b82f6" : "#f59e0b");

      barrasSemanaHtml += `
        <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:4px;">
          <span style="font-size:0.72rem; font-weight:700; color:${d.esHoy ? '#047857' : '#475569'};">${d.nombreDia.slice(0,3)}</span>
          <div style="width:100%; height:48px; background:#e2e8f0; border-radius:6px; display:flex; align-items:flex-end; padding:2px; overflow:hidden; position:relative;">
            <div style="width:100%; height:${Math.max(12, porcentaje)}%; background:${bgBarra}; border-radius:4px; transition:height 0.3s ease;"></div>
          </div>
          <span style="font-size:0.72rem; font-weight:800; color:#0f172a;">${d.conteo} ${d.conteo === 1 ? 'uso' : 'usos'}</span>
        </div>
      `;
    });

    return `
      <!-- CARJA DE AUTORREGULACIÓN DIGITAL EN AULA -->
      <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; box-shadow:0 4px 16px rgba(0,0,0,0.04); margin-top:14px;">
        
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin:0; display:flex; align-items:center; gap:8px;">
            📱 Mi Autorregulación Digital en Aula
          </h4>
          ${estadoEstadoHtml}
        </div>

        <p style="font-size:0.82rem; color:#334155; line-height:1.45; margin-bottom:14px;">
          Espacio personal para monitorear el uso responsable de tu celular durante los periodos de clase. <strong>Información 100% privada y formativa (no se rastrea contenido ni se aplica sanción)</strong>.
        </p>

        <!-- Balance Semanal -->
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="font-size:0.8rem; font-weight:800; color:#0f172a;">📊 Usos registrados en clases esta semana:</span>
            <span style="font-size:0.85rem; font-weight:800; color:#047857; background:#e6f4ea; padding:2px 10px; border-radius:50px;">${stats.totalSemanal} total</span>
          </div>

          <div style="display:flex; gap:8px; justify-content:space-between;">
            ${barrasSemanaHtml}
          </div>
        </div>

        <!-- Reconocimiento y Mensaje Formativo -->
        <div style="background:${stats.medalla.bg}; border:1px solid ${stats.medalla.border}; border-radius:12px; padding:14px; display:flex; flex-direction:column; gap:6px;">
          <div style="font-size:0.85rem; font-weight:800; color:${stats.medalla.color}; display:flex; align-items:center; gap:6px;">
            <span>${stats.medalla.badge}</span>
          </div>
          <p style="font-size:0.8rem; color:#1e293b; line-height:1.45; margin:0;">
            ${stats.medalla.mensaje}
          </p>
        </div>

      </div>
    `;
  };

})();
