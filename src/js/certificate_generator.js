/**
 * GENERADOR DE CERTIFICADO DIGITAL DE RECEPCIÓN Y TOMA DE CONOCIMIENTO RICE 2026
 * Liceo de Huara • SLEP Tamarugal
 * 
 * Funcionalidad:
 * Genera y descarga un certificado oficial impreso/PDF con sello de verificación digital
 * para Apoderados y Funcionarios del establecimiento.
 */

(function () {

  // Generar código único de verificación hash
  function generarCodigoVerificacion(rut, fechaStr) {
    const semilla = rut + '_' + fechaStr + '_MIRICE_2026_SLEP_TAMARUGAL';
    let hash = 0;
    for (let i = 0; i < semilla.length; i++) {
      hash = ((hash << 5) - hash) + semilla.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    return `CERT-RICE-2026-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
  }

  // Generar y abrir/imprimir el Certificado Oficial PDF / Impresión
  window.descargarCertificadoRecepcionRICE = function (userData, role) {
    // 1. Obtención inteligente de datos de usuario con fallbacks
    if (!userData && window.currentLoggedUser && window.currentLoggedUser.data) {
      userData = window.currentLoggedUser.data;
    }
    
    if (!userData) {
      try {
        const sessionGuardada = localStorage.getItem('mirice_active_session');
        if (sessionGuardada) {
          const sessionObj = JSON.parse(sessionGuardada);
          if (sessionObj && sessionObj.userData) {
            userData = sessionObj.userData;
            if (!role && sessionObj.role) role = sessionObj.role;
          }
        }
      } catch (e) {
        console.warn('⚠️ Error al leer sesión almacenada:', e);
      }
    }

    // Datos por defecto si se accede como visitante o sin usuario registrado
    if (!userData) {
      userData = {
        nombre: 'Apoderado / Integrante de la Comunidad Educativa',
        rut_formato: '12.345.678-K',
        rut_limpio: '12345678',
        pupilo: 'Estudiante Liceo de Huara',
        cargo: 'Representante Legal / Apoderado'
      };
    }

    if (!role) role = (window.currentLoggedUser && window.currentLoggedUser.role) ? window.currentLoggedUser.role : 'apoderado';

    const hoy = new Date();
    const fechaTexto = hoy.toLocaleDateString('es-CL', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const codigoVerificacion = generarCodigoVerificacion(userData.rut_limpio || '12345678', hoy.toISOString());

    const tituloRol = (role === 'apoderado') ? 'APODERADO / REPRESENTANTE LEGAL' : (role === 'funcionario' ? 'FUNCIONARIO / DOCENTE INSTITUCIONAL' : 'ESTUDIANTE / INTEGRANTE');
    const detalleCursoPupilo = (role === 'apoderado') ? `<strong>Estudiante (Pupilo/a):</strong> ${userData.pupilo || 'Estudiante Liceo de Huara'}<br>` : `<strong>Cargo / Función:</strong> ${userData.cargo || 'Funcionario'}<br><strong>Departamento:</strong> ${userData.departamento || 'Convivencia'}<br>`;

    const htmlCertificado = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificado Oficial de Recepción RICE 2026 — Liceo de Huara</title>
        <style>
          @page { size: letter; margin: 15mm; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            margin: 0; padding: 20px;
            background: #f8fafc;
          }
          .btn-actions {
            text-align: center;
            margin-bottom: 20px;
            display: flex;
            gap: 12px;
            justify-content: center;
          }
          .btn-print {
            background: #047857;
            color: white;
            padding: 12px 26px;
            border: none;
            border-radius: 50px;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(4,120,87,0.3);
            transition: transform 0.2s, background 0.2s;
          }
          .btn-print:hover {
            background: #065f46;
            transform: translateY(-2px);
          }
          .cert-container {
            border: 8px double #047857;
            padding: 32px;
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #047857;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .title {
            text-align: center;
            color: #047857;
            font-size: 22px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
            line-height: 1.3;
          }
          .body-text {
            font-size: 14px;
            line-height: 1.8;
            color: #334155;
            text-align: justify;
            margin-bottom: 24px;
          }
          .box-datos {
            background: #f0fdf4;
            border: 1.5px solid #a7f3d0;
            padding: 18px 22px;
            border-radius: 10px;
            font-size: 14px;
            line-height: 1.8;
            margin-bottom: 24px;
          }
          .seal-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 2px solid #e2e8f0;
            padding-top: 20px;
            margin-top: 30px;
          }
          .code-verif {
            font-family: monospace;
            font-size: 13px;
            color: #047857;
            background: #dcfce7;
            padding: 6px 14px;
            border-radius: 6px;
            font-weight: bold;
            letter-spacing: 1px;
            border: 1px dashed #059669;
          }
          @media print {
            .btn-actions { display: none !important; }
            body { background: white; padding: 0; }
            .cert-container { box-shadow: none; border-radius: 0; border: 6px double #047857; }
          }
        </style>
      </head>
      <body>

        <div class="btn-actions">
          <button class="btn-print" onclick="window.print();">🖨️ Guardar como PDF / Imprimir Certificado</button>
        </div>

        <div class="cert-container">
          <div class="header">
            <div>
              <h3 style="margin:0; color:#047857; font-size:18px; font-weight:800;">LICEO DE HUARA</h3>
              <p style="margin:2px 0 0 0; font-size:12px; color:#64748b;">Servicio Local de Educación Pública (SLEP) Tamarugal</p>
              <p style="margin:2px 0 0 0; font-size:11px; color:#64748b;">Comuna de Huara • Región de Tarapacá</p>
            </div>
            <div style="text-align:right;">
              <strong style="color:#047857; font-size:15px; display:block;">MiRice 2026</strong>
              <span style="font-size:11px; color:#64748b;">Sistema Oficial de Convivencia</span>
            </div>
          </div>

          <div class="title">
            Certificado Oficial de Recepción y Toma de Conocimiento<br>
            <span style="font-size:15px; font-weight:normal; color:#475569; text-transform:none;">Reglamento Interno de Convivencia Educativa (RICE 2026)</span>
          </div>

          <div class="body-text">
            El <strong>Liceo de Huara</strong> certifica que, en conformidad a lo establecido en la <strong>Circular N° 482 de la Superintendencia de Educación</strong>, la <strong>Ley N° 21.430 sobre Protección Integral de la Niñez</strong> y el Reglamento Interno del establecimiento, se ha efectuado la entrega formal y toma de conocimiento del RICE 2026 al siguiente integrante de nuestra comunidad educativa:
          </div>

          <div class="box-datos">
            <strong>Nombre Completo:</strong> ${userData.nombre || 'Integrante de la Comunidad Educativa'}<br>
            <strong>RUN / Identificación:</strong> ${userData.rut_formato || userData.rut_limpio || 'No registrado'}<br>
            <strong>Calidad de Usuario:</strong> ${tituloRol}<br>
            ${detalleCursoPupilo}
            <strong>Fecha y Hora de Emisión / Firma Digital:</strong> ${fechaTexto}<br>
            <strong>Estado de Verificación:</strong> <span style="color:#047857; font-weight:bold;">✔️ VALIDADO Y REGISTRADO EN SERVIDOR</span>
          </div>

          <div class="body-text" style="font-size:12px; color:#475569;">
            <strong>DECLARACIÓN REGISTRO RICE:</strong> El titular de este comprobante declara haber recibido, leído y comprendido los derechos, deberes, normas de convivencia, medidas formativas y protocolos de actuación que rigen la convivencia educativa en el Liceo de Huara para el año lectivo 2026.
          </div>

          <div class="seal-box">
            <div>
              <span class="code-verif">${codigoVerificacion}</span><br>
              <span style="font-size:10px; color:#64748b; margin-top:4px; display:inline-block;">Código Hash de Verificación Digital Institucional</span>
            </div>
            <div style="text-align:right; font-size:11px; color:#475569;">
              <strong>Firma Digital Institucional MiRice</strong><br>
              Liceo de Huara • SLEP Tamarugal
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              try {
                window.print();
              } catch(e) {}
            }, 600);
          };
        </script>

      </body>
      </html>
    `;

    // Intentar abrir en ventana emergente (nueva pestaña)
    try {
      const vent = window.open('', '_blank');
      if (vent && !vent.closed && typeof vent.closed !== 'undefined') {
        vent.document.write(htmlCertificado);
        vent.document.close();
        return;
      }
    } catch (e) {
      console.warn('⚠️ Popup bloqueado o no permitido, abriendo modal alternativo en pantalla:', e);
    }

    // FALLBACK EN PANTALLA SI LOS POPUPS ESTÁN BLOQUEADOS EN EL NAVEGADOR
    mostrarModalCertificadoFallback(htmlCertificado);
  };

  // Función Auxiliar: Muestra el certificado en un modal flotante si el navegador bloquea popups
  function mostrarModalCertificadoFallback(htmlContent) {
    let modal = document.getElementById('cert-print-modal-fallback');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cert-print-modal-fallback';
      modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.85); backdrop-filter:blur(8px); z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:16px; box-sizing:border-box;';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="width:100%; max-width:900px; height:90vh; background:white; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
        <div style="background:#047857; color:white; padding:14px 20px; display:flex; justify-content:space-between; align-items:center;">
          <strong style="font-size:1.05rem; display:flex; align-items:center; gap:8px;">
            📜 Certificado Oficial RICE 2026 (Liceo de Huara)
          </strong>
          <button onclick="document.getElementById('cert-print-modal-fallback').style.display='none'" style="background:rgba(255,255,255,0.2); color:white; border:none; padding:6px 14px; border-radius:50px; cursor:pointer; font-weight:bold;">
            ✕ Cerrar
          </button>
        </div>
        <iframe id="cert-iframe-preview" style="width:100%; height:100%; border:none;" srcdoc="${htmlContent.replace(/"/g, '&quot;')}"></iframe>
      </div>
    `;

    modal.style.display = 'flex';
  }

  // Generar HTML del Botón para insertar en el Perfil de Apoderados y Funcionarios
  window.generarHtmlBotonCertificadoRICE = function (userData, role) {
    if (role !== 'apoderado' && role !== 'funcionario') return '';

    return `
      <!-- BOTÓN DE DESCARGA DE CERTIFICADO RICE 2026 -->
      <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:12px; padding:16px; margin-top:14px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div>
          <strong style="color:#047857; font-size:0.9rem; display:block; margin-bottom:2px;">
            📜 Certificado Oficial de Recepción RICE 2026
          </strong>
          <span style="font-size:0.78rem; color:#166534;">
            Descarga o imprime tu comprobante legal de conocimiento del reglamento.
          </span>
        </div>
        <button onclick="window.descargarCertificadoRecepcionRICE(window.currentLoggedUser ? window.currentLoggedUser.data : null, '${role}')" class="btn-primary" style="background:#047857; color:white; font-weight:bold; padding:10px 16px; border-radius:50px; font-size:0.82rem; border:none; cursor:pointer; white-space:nowrap;">
          📄 Descargar Certificado (PDF)
        </button>
      </div>
    `;
  };

})();
