/**
 * MÓDULO DE EXPORTACIÓN INSTITUCIONAL, FILTROS Y FICHAS IMPRIMIBLES — MIRICE 2026
 * Liceo de Huara • SLEP Tamarugal
 * 
 * Funcionalidad:
 * 1. Acceso RESTRICTO exclusivamente al Coordinador de Convivencia Educativa.
 * 2. Buscador y Filtros Avanzados (por Gravedad, Curso, Estado del caso y Búsqueda libre).
 * 3. Gestor de Estado del Caso (Life-Cycle Tracker: En Mediación, Derivado, Cerrado).
 * 4. Generador de Fichas Resumen Imprimibles de 1 Página para Consejos de Curso.
 * 5. Sincronización en la Nube con Cloud Adapter.
 */

(function () {

  // Lista de RUTs Oficiales Autorizados (Coordinador y Equipo Directivo)
  const RUTS_AUTORIZADOS_CONVIVENCIA = [
    '333333333',       // Profesor Omar Contreras Ayala (Coordinador Convivencia Educativa)
    '33.333.333-3',
    '999999999',       // Carmen Barrera Hennings (Directora Liceo de Huara)
    '99.999.999-9'
  ];

  // Comprobar si el usuario logueado es el Coordinador de Convivencia o Autorizado
  window.esCoordinadorConvivenciaAutorizado = function (userData) {
    if (!userData) return false;

    const rutSinPuntos = (userData.rut_limpio || '').replace(/[^0-9kK]/g, '').toUpperCase();
    const cargo = (userData.cargo || '').toLowerCase();
    const depto = (userData.departamento || '').toLowerCase();

    // 1. Verificación por Lista Oficial de RUTs Autorizados
    if (RUTS_AUTORIZADOS_CONVIVENCIA.includes(rutSinPuntos) || RUTS_AUTORIZADOS_CONVIVENCIA.includes(userData.rut_limpio)) {
      return true;
    }

    // 2. Verificación por Cargo Oficial
    if (cargo.includes('coordinador') && cargo.includes('convivencia')) return true;
    if (cargo.includes('director') || depto.includes('directivo')) return true;

    return false;
  };

  // Cambiar Estado del Caso en la Bitácora (Coordinador)
  window.cambiarEstadoCasoBitacora = function (idRegistro, nuevoEstado) {
    let bitacoras = [];
    try {
      bitacoras = JSON.parse(localStorage.getItem('mirice_bitacoras_db')) || [];
    } catch (e) {
      bitacoras = [];
    }

    const index = bitacoras.findIndex(b => b.id === idRegistro);
    if (index !== -1) {
      bitacoras[index].estado_caso = nuevoEstado;
      
      // Guardar localmente y sincronizar en la nube
      if (typeof window.guardarEnNube === 'function') {
        window.guardarEnNube('mirice_bitacoras_db', bitacoras);
      } else {
        localStorage.setItem('mirice_bitacoras_db', JSON.stringify(bitacoras));
      }

      alert(`✅ Estado del caso actualizado a: "${nuevoEstado}"`);
      window.location.reload();
    }
  };

  // Exportar Bitácora a Formato CSV / Excel
  window.exportarBitacoraExcelCSV = function () {
    let bitacoras = [];
    try {
      bitacoras = (typeof window.obtenerDeNube === 'function') 
        ? window.obtenerDeNube('mirice_bitacoras_db')
        : (JSON.parse(localStorage.getItem('mirice_bitacoras_db')) || []);
    } catch (e) {
      bitacoras = [];
    }

    if (bitacoras.length === 0) {
      alert('ℹ️ No hay registros guardados en la bitácora para exportar.');
      return;
    }

    let csvContent = "\uFEFF"; // BOM UTF-8
    csvContent += "ID;Fecha;Estudiante Involucrado;Curso;Gravedad Falta;Tipo Protocolo;Estado Caso;Descripción Hechos;Medidas Formativas;Registrado Por\n";

    bitacoras.forEach(b => {
      const fecha = (b.fecha || '').replace(/;/g, ',');
      const alumno = (b.alumno || '').replace(/;/g, ',');
      const curso = (b.curso || '').replace(/;/g, ',');
      const falta = (b.falta || '').replace(/;/g, ',');
      const protocolo = (b.protocolo || '').replace(/;/g, ',');
      const estado = (b.estado_caso || 'En Seguimiento').replace(/;/g, ',');
      const hechos = (b.hechos || '').replace(/;/g, ',').replace(/\n/g, ' ');
      const medidas = (b.medidas || '').replace(/;/g, ',').replace(/\n/g, ' ');
      const autor = (b.registrado_por || '').replace(/;/g, ',');

      csvContent += `${b.id || ''};${fecha};${alumno};${curso};${falta};${protocolo};${estado};${hechos};${medidas};${autor}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bitacora_Convivencia_Liceo_Huara_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('✅ Exportación a Excel/CSV completada con éxito.');
  };

  // Imprimir Ficha Resumen de 1 Página para Consejos de Curso (Restringido a Personal Autorizado)
  window.imprimirFichaResumenProtocolo = function (tituloProtocolo, norma, resumen, pasos) {
    // Verificar si el usuario actual tiene permisos de Coordinación / Equipo Autorizado
    const userActual = (typeof currentLoggedUser !== 'undefined' && currentLoggedUser) ? currentLoggedUser.data : null;
    if (!window.esCoordinadorConvivenciaAutorizado(userActual)) {
      alert('🔒 Acceso Restringido: La descarga e impresión de Fichas Resumen Orientadoras está reservada exclusivamente al Coordinador de Convivencia y Personal Autorizado.');
      return;
    }

    const htmlFicha = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Ficha Resumen Convivencia — ${tituloProtocolo}</title>
        <style>
          @page { size: letter; margin: 15mm; }
          body { font-family: sans-serif; color: #0f172a; margin: 0; padding: 20px; line-height: 1.5; }
          .header { border-bottom: 3px solid #047857; padding-bottom: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
          h2 { color: #047857; margin: 0; font-size: 18px; }
          .badge { background: #e6f4ea; color: #047857; padding: 4px 10px; border-radius: 50px; font-weight: bold; font-size: 12px; }
          .box-summary { background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #047857; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; }
          .steps-list { background: #ffffff; border: 1px solid #e2e8f0; padding: 14px 20px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; }
          .steps-list li { margin-bottom: 8px; }
          .footer { text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 10px; margin-top: 20px; }
          .btn-print { background: #047857; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-bottom: 16px; }
          @media print { .btn-print { display: none; } }
        </style>
      </head>
      <body>
        <button class="btn-print" onclick="window.print();">🖨️ Imprimir Ficha 1 Página (Consejo de Curso / Taller)</button>

        <div class="header">
          <div>
            <h2>LICEO DE HUARA — FICHA RESUMEN RICE 2026</h2>
            <span style="font-size:12px; color:#64748b;">Material Orientador para Docentes y Consejos de Curso</span>
          </div>
          <span class="badge">${norma}</span>
        </div>

        <h3 style="color:#047857; font-size:16px; margin-bottom:8px;">📌 ${tituloProtocolo}</h3>

        <div class="box-summary">
          <strong>Síntesis Formativa:</strong> ${resumen}
        </div>

        <h4 style="color:#0f172a; font-size:14px; margin-bottom:8px;">📋 Pasos de Actuación Institucional:</h4>
        <ol class="steps-list">
          ${pasos.map(p => `<li><strong>${p.paso}:</strong> ${p.desc}</li>`).join('')}
        </ol>

        <div class="footer">
          Liceo de Huara • Servicio Local de Educación Pública Tamarugal • Resguardo de Derechos Circular 781 Mineduc
        </div>
      </body>
      </html>
    `;

    const vent = window.open('', '_blank');
    vent.document.write(htmlFicha);
    vent.document.close();
  };

  // Generar HTML del Panel del Coordinador de Convivencia
  window.generarHtmlExportacionCoordinador = function (userData) {
    if (!window.esCoordinadorConvivenciaAutorizado(userData)) {
      return ''; // Oculto para usuarios normales
    }

    return `
      <!-- PANEL RESTRINGIDO EXCLUSIVO PARA COORDINADOR DE CONVIVENCIA CON CLOUD SYNC -->
      <div style="background:#ecfdf5; border:1.5px solid #a7f3d0; border-radius:12px; padding:16px; margin-bottom:16px; box-shadow:0 4px 14px rgba(4,120,87,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
          <div>
            <strong style="color:#047857; font-size:0.95rem; display:block; margin-bottom:2px;">
              👑 PANEL EXCLUSIVO: Coordinador de Convivencia Educativa
            </strong>
            <span style="font-size:0.78rem; color:#166534;">
              Profesor Omar Contreras Ayala • Sincronización en la Nube ☁️ Activa
            </span>
          </div>

          <button onclick="window.exportarBitacoraExcelCSV()" class="btn-primary" style="background:#047857; color:white; font-weight:bold; padding:10px 18px; border-radius:50px; font-size:0.82rem; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:6px; white-space:nowrap;">
            📊 Exportar Bitácora Consolidada (Excel / CSV)
          </button>
        </div>
      </div>
    `;
  };

})();
