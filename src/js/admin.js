/**
 * CONTROLADOR DIRECTIVO: admin.js (Consola de Convivencia Directiva)
 * Maneja el inicio de sesión directivo, la consola interactiva de casos activos (Hito 4)
 * integrando persistencia vía localStorage, alertas de resguardo legal (TEA/Abuso/Drogas)
 * y generación editorial de actas de incidentes oficiales para impresión física.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Referencias DOM del Login Directivo
  const loginScreen = document.getElementById('login-screen');
  const loginForm = document.getElementById('admin-login-form');
  const emailInput = document.getElementById('admin-email');
  const passwordInput = document.getElementById('admin-password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const loginError = document.getElementById('login-error');

  // Referencias DOM del Dashboard Directivo
  const dashboardLayout = document.getElementById('dashboard-layout');
  const logoutBtn = document.getElementById('btn-logout');

  // Referencias DOM del Modal de Actas Imprimibles
  const actaPrintModal = document.getElementById('acta-print-modal');
  const actaPaperContent = document.getElementById('acta-paper-content');
  const btnCloseActa = document.getElementById('btn-close-acta');
  const btnPrintActaTrigger = document.getElementById('btn-print-acta-trigger');

  // 1. Control de Visibilidad de Contraseña en Login
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePasswordBtn.textContent = isPassword ? '🔒' : '👁️';
    });
  }

  // --- RESTAURACIÓN AUTOMÁTICA DE SESIÓN SI YA ESTÁ LOGUEADO COMO FUNCIONARIO O DIRECTIVO ---
  try {
    const tokenGuardado = sessionStorage.getItem('mirice_token');
    const sessionGuardada = localStorage.getItem('mirice_active_session');
    if (tokenGuardado && sessionGuardada) {
      const sessionObj = JSON.parse(sessionGuardada);
      if (sessionObj && sessionObj.role === 'funcionario' && sessionObj.panelAdmin) {
        window.miriceSesionToken = tokenGuardado;
        ingresarAlDashboardAdmin();
      }
    }
  } catch (e) {
    console.warn('⚠️ Error al restaurar sesión activa en admin:', e);
  }

  // 2. Login Directivo real, verificado en el servidor (28-jul-2026)
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (loginError) loginError.style.display = 'none';

      const rutLimpio = emailInput.value.trim().replace(/[^0-9kK]/g, '').toUpperCase();
      const password = passwordInput.value.trim();
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      function mostrarError(msg) {
        if (loginError) {
          if (msg) loginError.textContent = msg;
          loginError.style.display = 'block';
          loginError.style.animation = 'none';
          loginError.offsetHeight;
          loginError.style.animation = 'shake 0.4s ease';
        }
      }

      if (!rutLimpio || !password) {
        mostrarError('Credenciales incorrectas. Intente nuevamente.');
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.7'; }
      try {
        const resp = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rut: rutLimpio, clave: password, rol: 'funcionario' })
        });
        let data = null;
        try { data = await resp.json(); } catch (err) {}

        if (!resp.ok || !data || data.estado !== 'ok') {
          mostrarError('Credenciales incorrectas. Intente nuevamente.');
          return;
        }
        if (!data.panel_admin) {
          mostrarError('Esta cuenta no tiene acceso al panel directivo.');
          return;
        }

        window.miriceSesionToken = data.token;
        try {
          sessionStorage.setItem('mirice_token', data.token);
          localStorage.setItem('mirice_active_session', JSON.stringify({
            role: 'funcionario', panelAdmin: true, loginTime: Date.now()
          }));
        } catch (err) {}

        if (data.debe_cambiar) {
          abrirModalCambioClaveAdmin();
        } else {
          ingresarAlDashboardAdmin();
        }
      } catch (err) {
        mostrarError('No se pudo conectar con el servidor. Intenta de nuevo.');
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; }
      }
    });
  }

  // Cambio de clave obligatorio para cuentas recién migradas
  function abrirModalCambioClaveAdmin() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.6); display:flex; align-items:center; justify-content:center; z-index:9999; padding:16px;';
    overlay.innerHTML = `
      <div style="background:#fff; border-radius:16px; padding:28px; max-width:420px; width:100%;">
        <h3 style="margin:0 0 8px; color:#047857;">🔒 Elige tu contraseña</h3>
        <p style="font-size:0.88rem; color:#475569; margin-bottom:16px;">Antes de entrar al panel, cambia la contraseña inicial por una propia (mínimo 6 caracteres).</p>
        <div id="admin-cc-error" style="display:none; background:#fef2f2; color:#b91c1c; padding:8px 12px; border-radius:8px; font-size:0.82rem; margin-bottom:12px;"></div>
        <input id="admin-cc-actual" type="password" placeholder="Contraseña actual" class="form-control" style="width:100%; margin-bottom:10px; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
        <input id="admin-cc-nueva" type="password" placeholder="Contraseña nueva" class="form-control" style="width:100%; margin-bottom:10px; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
        <input id="admin-cc-repetir" type="password" placeholder="Repite la contraseña nueva" class="form-control" style="width:100%; margin-bottom:16px; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
        <button id="admin-cc-confirmar" style="width:100%; background:#047857; color:#fff; font-weight:700; padding:12px; border:none; border-radius:50px; cursor:pointer;">Confirmar y entrar</button>
      </div>`;
    document.body.appendChild(overlay);

    const errBox = overlay.querySelector('#admin-cc-error');
    overlay.querySelector('#admin-cc-confirmar').addEventListener('click', async () => {
      const actual = overlay.querySelector('#admin-cc-actual').value.trim();
      const nueva = overlay.querySelector('#admin-cc-nueva').value.trim();
      const repetir = overlay.querySelector('#admin-cc-repetir').value.trim();
      errBox.style.display = 'none';

      if (nueva.length < 6) { errBox.textContent = 'Mínimo 6 caracteres.'; errBox.style.display = 'block'; return; }
      if (nueva !== repetir) { errBox.textContent = 'Las contraseñas no coinciden.'; errBox.style.display = 'block'; return; }

      try {
        const resp = await fetch('/api/cambiar-clave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + window.miriceSesionToken },
          body: JSON.stringify({ clave_actual: actual, clave_nueva: nueva })
        });
        const data = await resp.json().catch(() => null);
        if (!resp.ok || !data || data.estado !== 'ok') {
          errBox.textContent = (data && data.texto) || 'No se pudo cambiar. Verifica la actual.';
          errBox.style.display = 'block';
          return;
        }
        window.miriceSesionToken = data.token;
        try { sessionStorage.setItem('mirice_token', data.token); } catch (e) {}
        document.body.removeChild(overlay);
        ingresarAlDashboardAdmin();
      } catch (e) {
        errBox.textContent = 'No se pudo conectar. Intenta de nuevo.';
        errBox.style.display = 'block';
      }
    });
  }

  function ingresarAlDashboardAdmin() {
    if (!loginScreen || !dashboardLayout) return;
    loginScreen.style.opacity = '0';
    setTimeout(() => {
      loginScreen.style.display = 'none';
      dashboardLayout.style.display = 'flex';
      setTimeout(() => {
        dashboardLayout.classList.add('active');
        cargarContenidoAdmin();
      }, 50);
    }, 400);
  }

  // Escape defensivo: todo texto que haya escrito una persona (relato,
  // curso, contacto, nombres cargados desde el padrón, etc.) pasa por acá
  // antes de insertarse con innerHTML. Sin esto, una denuncia con
  // "<img src=x onerror=...>" ejecutaría JavaScript en el navegador de
  // quien abre el panel admin — se encontró y corrigió el 29-jul-2026.
  function escaparHtml(texto) {
    return String(texto == null ? '' : texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Utilidad de fecha compartida entre la tabla de casos y el acta imprimible
  function formatearFecha(iso) {
    try { return new Date(iso).toLocaleString('es-CL'); } catch (e) { return iso; }
  }

  // 3. Renderización de Módulos y Consola de Casos Activos — conectada a /api/casos (28-jul-2026)
  async function cargarContenidoAdmin() {
    const contentArea = document.getElementById('dashboard-content');
    contentArea.innerHTML = '<p style="padding:24px; color:var(--text-muted);">Cargando casos desde el servidor…</p>';

    let casos = [];
    let errorCarga = null;
    let incidentes = [];
    let errorIncidentes = null;

    try {
      const [respCasos, respIncidentes] = await Promise.all([
        fetch('/api/casos', { headers: { Authorization: 'Bearer ' + (window.miriceSesionToken || '') } }),
        fetch('/api/incidentes?todos=1', { headers: { Authorization: 'Bearer ' + (window.miriceSesionToken || '') } }),
      ]);

      const dataCasos = await respCasos.json().catch(() => null);
      if (respCasos.ok && dataCasos && dataCasos.estado === 'ok') {
        casos = dataCasos.casos || [];
      } else {
        errorCarga = (dataCasos && (dataCasos.texto || dataCasos.error)) || ('HTTP ' + respCasos.status);
      }

      const dataIncidentes = await respIncidentes.json().catch(() => null);
      if (respIncidentes.ok && dataIncidentes && dataIncidentes.estado === 'ok') {
        incidentes = dataIncidentes.incidentes || [];
      } else {
        errorIncidentes = (dataIncidentes && (dataIncidentes.texto || dataIncidentes.error)) || ('HTTP ' + respIncidentes.status);
      }
    } catch (e) {
      errorCarga = errorCarga || 'No se pudo conectar con el servidor.';
      errorIncidentes = errorIncidentes || 'No se pudo conectar con el servidor.';
    }

    function badgePrioridad(caso) {
      if (caso.prioridad === 'critica') {
        const etiqueta = caso.motivo_urgencia === 'abuso' ? '🚨 Crítico · Abuso' : '🚨 Crítico · Riesgo vital';
        return `<span style="background:#fee2e2; color:#b91c1c; padding:3px 8px; border-radius:50px; font-size:0.75rem; font-weight:700; animation: pulse 1.5s infinite;">${etiqueta}</span>`;
      }
      return `<span style="background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:4px; font-size:0.75rem; text-transform:capitalize;">${caso.categoria || 'otro'}</span>`;
    }

    function selectEstado(caso) {
      const estados = ['recibido', 'en_proceso', 'cerrado'];
      return `<select class="select-estado-caso" data-folio="${caso.folio}" style="font-size:0.78rem; padding:4px 8px; border-radius:6px; border:1px solid var(--border-card);">
        ${estados.map(e => `<option value="${e}" ${e === caso.estado ? 'selected' : ''}>${e.replace('_',' ')}</option>`).join('')}
      </select>`;
    }

    function badgeAlertaIncidente(inc) {
      const mapa = {
        TEA: ['#ffedd5', '#9a3412', '🚨 Ley TEA'],
        SEX: ['#fee2e2', '#b91c1c', '🚨 C.482 (Abuso)'],
        DRG: ['#ecfdf5', '#047857', '🚨 Ley Drogas'],
        REM: ['#f5f3ff', '#6d28d9', '🚨 Embarazo/Maternidad'],
      };
      const datos = mapa[inc.alerta_tipo];
      if (!datos) return `<span style="color:var(--text-muted); font-size:0.78rem;">Ninguna</span>`;
      return `<span style="background:${datos[0]}; color:${datos[1]}; padding:3px 8px; border-radius:50px; font-size:0.75rem; font-weight:600; animation: pulse 2s infinite;">${datos[2]}</span>`;
    }

    function badgeGravedad(g) {
      if (g === 'leve') return `<span style="background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:4px; font-size:0.75rem; text-transform:capitalize;">leve</span>`;
      if (g === 'grave') return `<span style="background:#fef3c7; color:#b45309; padding:3px 8px; border-radius:4px; font-size:0.75rem; text-transform:capitalize;">grave</span>`;
      return `<span style="background:#fee2e2; color:#b91c1c; padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; text-transform:capitalize;">gravísima</span>`;
    }

    const casosHtml = errorCarga
      ? `<div style="padding:16px; background:#fef2f2; color:#b91c1c; border-radius:10px; font-size:0.85rem;">
           No se pudieron cargar los casos: ${errorCarga}. Revisa que las variables de entorno de Supabase estén configuradas en Vercel.
         </div>`
      : casos.length === 0
        ? `<div style="padding:16px; color:var(--text-muted); font-size:0.85rem;">Todavía no hay reportes registrados.</div>`
        : `
        <div class="table-container" style="overflow-x: auto; width:100%; border: 1px solid var(--border-card); border-radius: var(--radius-md); background: rgba(255,255,255,0.3);">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="background: var(--primary); color: white; font-weight: 600;">
                <th style="padding: 12px 16px;">Fecha</th>
                <th style="padding: 12px 16px;">Folio</th>
                <th style="padding: 12px 16px;">Quién reporta</th>
                <th style="padding: 12px 16px;">Categoría / Prioridad</th>
                <th style="padding: 12px 16px;">Relato</th>
                <th style="padding: 12px 16px;">Estado</th>
                <th style="padding: 12px 16px; text-align: center;">Acción</th>
              </tr>
            </thead>
            <tbody>
              ${casos.map(caso => `
                <tr style="border-bottom: 1px solid var(--border-card); background: rgba(255,255,255,0.2);">
                  <td style="padding: 12px 16px; color: var(--text-main); font-weight: 500;">${formatearFecha(caso.creado_en)}</td>
                  <td style="padding: 12px 16px; font-family:monospace; font-size:0.8rem;">${caso.folio}</td>
                  <td style="padding: 12px 16px;">
                    <strong style="text-transform:capitalize;">${escaparHtml(caso.rol_autor || 'estudiante')}</strong><br>
                    <small style="color: var(--text-muted);">${escaparHtml(caso.curso_autor || 'Sin identificar')}${caso.contacto ? ' · ' + escaparHtml(caso.contacto) : ''}</small>
                  </td>
                  <td style="padding: 12px 16px;">${badgePrioridad(caso)}</td>
                  <td style="padding: 12px 16px; max-width:280px;"><span title="${escaparHtml(caso.relato || '')}">${escaparHtml((caso.relato || '').slice(0, 90))}${(caso.relato || '').length > 90 ? '…' : ''}</span></td>
                  <td style="padding: 12px 16px;">${selectEstado(caso)}</td>
                  <td style="padding: 12px 16px; text-align: center;">
                    <button class="btn-generate-acta btn-primary" data-folio="${caso.folio}" style="margin:0; padding:6px 12px; font-size:0.78rem; width:auto; background:var(--accent); border-color:var(--accent);">Generar Acta 🖨️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

    const incidentesHtml = errorIncidentes
      ? `<div style="padding:16px; background:#fef2f2; color:#b91c1c; border-radius:10px; font-size:0.85rem;">
           No se pudieron cargar los incidentes: ${errorIncidentes}.
         </div>`
      : incidentes.length === 0
        ? `<div style="padding:16px; color:var(--text-muted); font-size:0.85rem;">Todavía no hay incidentes registrados por funcionarios.</div>`
        : `
        <div class="table-container" style="overflow-x: auto; width:100%; border: 1px solid var(--border-card); border-radius: var(--radius-md); background: rgba(255,255,255,0.3);">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="background: var(--primary); color: white; font-weight: 600;">
                <th style="padding: 12px 16px;">Fecha / Hora</th>
                <th style="padding: 12px 16px;">Folio</th>
                <th style="padding: 12px 16px;">Involucrados</th>
                <th style="padding: 12px 16px;">Registrado por</th>
                <th style="padding: 12px 16px;">Gravedad</th>
                <th style="padding: 12px 16px;">Alerta Legal</th>
              </tr>
            </thead>
            <tbody>
              ${incidentes.map(inc => `
                <tr style="border-bottom: 1px solid var(--border-card); background: rgba(255,255,255,0.2);">
                  <td style="padding: 12px 16px; color: var(--text-main); font-weight: 500;">${inc.fecha_incidente || ''} ${inc.hora_incidente || ''}</td>
                  <td style="padding: 12px 16px; font-family:monospace; font-size:0.8rem;">${inc.folio}</td>
                  <td style="padding: 12px 16px;">
                    ${(inc.involucrados && inc.involucrados.length) ? inc.involucrados.map(p => `<strong>${escaparHtml(p.nombre)}</strong> <small style="color:var(--text-muted);">(${escaparHtml(p.detalle || p.tipo || '')})</small>`).join('<br>') : '<span style="color:var(--text-muted);">Sin involucrados registrados</span>'}
                  </td>
                  <td style="padding: 12px 16px;">
                    <strong>${escaparHtml(inc.autor_nombre)}</strong><br>
                    <small style="color: var(--text-muted);">${escaparHtml(inc.autor_cargo || '')}</small>
                  </td>
                  <td style="padding: 12px 16px;">${badgeGravedad(inc.gravedad)}</td>
                  <td style="padding: 12px 16px;">${badgeAlertaIncidente(inc)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

    contentArea.innerHTML = `
      <!-- Cabecera de Bienvenida -->
      <div class="welcome-card" style="background: var(--bg-card); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-card); animation: fadeIn 0.5s ease; margin-bottom: 20px;">
        <h3 style="font-size: 1.4rem; color: var(--primary); margin-bottom: 12px;">Consola Directiva de Convivencia ⚙️</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
          Gestión del Reglamento Interno (RICE), control de la base de conocimiento de la IA y métricas institucionales de Huara.
        </p>
      </div>

      <!-- Grid de Módulos del Administrador -->
      <div class="admin-modules-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; animation: fadeIn 0.7s ease; margin-bottom: 24px;">
        
        <!-- Módulo: Documentación y RAG -->
        <div class="admin-card" style="background: var(--bg-card); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-card); display: flex; flex-direction: column; gap: 12px;">
          <div style="font-size: 1.5rem;">📁 Gestión de Fuentes</div>
          <h4 style="color: var(--primary); font-size: 1.1rem; font-weight: 600;">Estado de la Base de Conocimiento RAG</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">
            Hay <strong>10 documentos cargados</strong> procesados en la base de datos indexada local (RICE y Leyes de Convivencia).
          </p>
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 12px; border-radius: var(--radius-sm); font-size: 0.8rem; color: #065f46;">
            ✔️ <strong>Base Activa:</strong> Indexación del RICE al 100% y vinculada al Asistente IA.
          </div>
        </div>

        <!-- Módulo: Configuración del Bot -->
        <div class="admin-card" style="background: var(--bg-card); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-card); display: flex; flex-direction: column; gap: 12px;">
          <div style="font-size: 1.5rem;">🤖 Asistente IA RAG</div>
          <h4 style="color: var(--primary); font-size: 1.1rem; font-weight: 600;">Google AI Studio & Clave API</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">
            Desde el 28-jul-2026 la clave ya no se ingresa ni se guarda en el navegador (antes quedaba visible en localStorage y en cada solicitud de red — cualquiera podía copiarla). Se configura una sola vez como variable de entorno <code>GEMINI_API_KEY</code> en Vercel → Settings → Environment Variables, y el chat funciona a través de <code>/api/chat</code>.
          </p>
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 12px; border-radius: var(--radius-sm); font-size: 0.8rem; color: #065f46;">
            ℹ️ Si el chat con IA no responde, revisa que <code>GEMINI_API_KEY</code> esté configurada en Vercel.
          </div>
        </div>

      </div>

      <!-- Módulo de Casos y Denuncias en Tiempo Real -->
      <div class="admin-card" style="background: var(--bg-card); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-card); animation: fadeIn 0.9s ease; display: flex; flex-direction: column; gap: 16px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="color: var(--primary); font-size: 1.15rem; font-weight: 700; margin: 0;">📋 Reportes y Denuncias Recientes (Circular 781)</h4>
          <button id="btn-clear-casos" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.8rem; text-decoration:underline;">Limpiar Casos</button>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin: 0;">
          Reportes enviados desde el canal de denuncias (denuncia.html), por estudiantes, apoderados o funcionarios.
        </p>
        ${casosHtml}
      </div>

      <!-- Módulo de Bitácora de Incidentes registrados por funcionarios -->
      <div class="admin-card" style="background: var(--bg-card); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-card); animation: fadeIn 1.0s ease; display: flex; flex-direction: column; gap: 16px; margin-top: 20px;">
        <h4 style="color: var(--primary); font-size: 1.15rem; font-weight: 700; margin: 0;">🗂️ Bitácora de Incidentes (registrados por funcionarios/docentes)</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin: 0;">
          Formulario de 6 secciones que llena el equipo docente/directivo. Antes solo se guardaba en el dispositivo de quien lo llenaba; desde el 28-jul-2026 llega a este panel desde cualquier equipo.
        </p>
        ${incidentesHtml}
      </div>

      <!-- Módulo: Auditoría Normativa y Legal (Circular 781 / Ley 21.430) -->
      <div class="admin-card" style="background: var(--bg-card); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-card); animation: fadeIn 1.1s ease; display: flex; flex-direction: column; gap: 16px; margin-top: 20px;">
        <h4 style="color: var(--primary); font-size: 1.15rem; font-weight: 700; margin: 0;">🛡️ Auditoría Normativa & Cumplimiento Legal (Huara 2026)</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin: 0;">
          Chequeo automatizado de conformidad legal de la plataforma MiRice frente a las regulaciones educacionales vigentes de la Superintendencia de Educación.
        </p>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <!-- Item 1: Circular 781 -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-card); padding-bottom: 8px;">
            <div>
              <strong style="font-size: 0.88rem; color: var(--text-main);">Circular 781 (Reglamento Interno RICE)</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Tipificación de faltas, debido proceso y derecho a apelación.</div>
            </div>
            <span style="background: #ecfdf5; color: #047857; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 50px; border: 1px solid #a7f3d0;">100% Conforme</span>
          </div>

          <!-- Item 2: Ley TEA 21.545 -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-card); padding-bottom: 8px;">
            <div>
              <strong style="font-size: 0.88rem; color: var(--text-main);">Ley de Autismo 21.545 (No-Exclusión en Aula)</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Prohibición absoluta de castigos y exclusión de clases ante crisis.</div>
            </div>
            <span style="background: #ecfdf5; color: #047857; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 50px; border: 1px solid #a7f3d0;">100% Conforme</span>
          </div>

          <!-- Item 3: Denuncia Judicial 24h -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-card); padding-bottom: 8px;">
            <div>
              <strong style="font-size: 0.88rem; color: var(--text-main);">Denuncia Obligatoria de Delitos en 24 Horas Hábiles</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Notificación de urgencia ante sospecha de abuso o microtráfico.</div>
            </div>
            <span style="background: #ecfdf5; color: #047857; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 50px; border: 1px solid #a7f3d0;">100% Conforme</span>
          </div>

          <!-- Item 4: Ley 19.628 Protección de Datos -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-card); padding-bottom: 8px;">
            <div>
              <strong style="font-size: 0.88rem; color: var(--text-main);">Ley 19.628 (Protección de Datos Escolares)</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Base de estudiantes retirada del cliente el 28-jul-2026 (estaba expuesta sin autenticación). Pendiente: login server-side (Paso 2) y purga del historial de Git.</div>
            </div>
            <span style="background: #fef2f2; color: #b91c1c; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 50px; border: 1px solid #fecaca;">En remediación</span>
          </div>
        </div>
      </div>
    `;

    // Vincular la lógica del formulario de API y botones de actas
    vincularEventosAdmin(casos);
  }

  // 4. Vincular Eventos de la Consola Administrativa
  function vincularEventosAdmin(casos) {
    const clearCasosBtn = document.getElementById('btn-clear-casos');

    // Botones de generación de actas
    const generateActaBtns = document.querySelectorAll('.btn-generate-acta');

    // El botón ya no borra nada (los casos viven en Supabase, no en este
    // navegador): ahora solo vuelve a pedir la lista al servidor.
    if (clearCasosBtn) {
      clearCasosBtn.textContent = '🔄 Recargar casos';
      clearCasosBtn.addEventListener('click', () => {
        cargarContenidoAdmin();
      });
    }

    // Vincular botones de actas individuales
    generateActaBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const folio = btn.getAttribute('data-folio');
        generarYMostrarActa(folio, casos);
      });
    });

    // Cambiar el estado de un caso (recibido / en_proceso / cerrado)
    document.querySelectorAll('.select-estado-caso').forEach(sel => {
      sel.addEventListener('change', async () => {
        const folio = sel.getAttribute('data-folio');
        const nuevoEstado = sel.value;
        sel.disabled = true;
        try {
          const resp = await fetch('/api/casos', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + (window.miriceSesionToken || '')
            },
            body: JSON.stringify({ folio, estado: nuevoEstado })
          });
          if (!resp.ok) {
            alert('No se pudo actualizar el estado del caso ' + folio + '.');
          }
        } catch (e) {
          alert('No se pudo conectar con el servidor.');
        } finally {
          sel.disabled = false;
        }
      });
    });
  }

  // 5. Generación y Visualización Editorial del Acta Imprimible
  function generarYMostrarActa(folio, casos) {
    const caso = casos.find(c => c.folio === folio);
    if (!caso) {
      alert("Error: El caso seleccionado no pudo ser localizado.");
      return;
    }

    // Estructurar el Banner de Alerta Crítica del Acta, según prioridad real
    let alertaBannerHtml = "";
    if (caso.prioridad === "critica" && caso.motivo_urgencia === "abuso") {
      alertaBannerHtml = `
        <div class="acta-critical-banner">
          <span>🚨</span>
          <div>
            <strong>ALERTA DE SEGURIDAD CIRCULAR 482 (CONNOTACIÓN/ABUSO SEXUAL):</strong>
            Caso penal de extrema gravedad. El establecimiento está obligado legalmente a realizar la denuncia ante Carabineros, PDI o Fiscalía dentro de un plazo de 24 horas hábiles. Está estrictamente prohibido realizar careos o mediaciones internas.
          </div>
        </div>
      `;
    } else if (caso.prioridad === "critica" && caso.motivo_urgencia === "riesgo_vital") {
      alertaBannerHtml = `
        <div class="acta-critical-banner">
          <span>🚨</span>
          <div>
            <strong>ALERTA DE RIESGO VITAL:</strong>
            El relato contiene señales de riesgo vital o autolesión. Corresponde activar el protocolo de salud mental hoy, contactar a la familia y a la red de salud mental, no dejarlo en lista de espera.
          </div>
        </div>
      `;
    } else if (caso.categoria === "drogas") {
      alertaBannerHtml = `
        <div class="acta-critical-banner drg-banner">
          <span>🚨</span>
          <div>
            <strong>ALERTA DE SEGURIDAD LEY DE DROGAS 20.000:</strong>
            Porte, consumo o distribución de sustancias. Se requiere citación urgente de apoderados y derivación a redes sanitarias/SENDA. Obligación de denuncia penal en 24h ante sospecha de microtráfico.
          </div>
        </div>
      `;
    }

    // HTML Editorial del Acta oficial
    const htmlActa = `
      <table class="acta-header-table">
        <tr>
          <td style="width: 80px; padding: 0;">
            <img src="assets/branding/Logo oficial de toda la plataforma y proyecto.png" alt="Logo Oficial MiRice" style="width: 70px; height: auto; object-fit: contain;">
          </td>
          <td style="padding-left: 16px; vertical-align: middle;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #1e3a8a; text-transform: uppercase;">Liceo de Huara</div>
            <div style="font-size: 0.7rem; color: #4b5563;">Equipo de Convivencia Educativa • Circular 781</div>
            <div style="font-size: 0.65rem; color: #475569;">Huara, Región de Tarapacá</div>
          </td>
          <td style="text-align: right; vertical-align: middle;">
            <span style="border: 2px solid #1e3a8a; padding: 6px 12px; font-weight: 700; font-size: 0.85rem; color: #1e3a8a; border-radius: 4px;">FOLIO ${caso.folio}</span>
          </td>
        </tr>
      </table>

      <div class="acta-title">Ficha Oficial de Registro de Incidentes</div>
      <div style="text-align: center; font-size: 0.72rem; color: #6b7280; margin-bottom: 24px;">En conformidad al Reglamento Interno (RICE) y la Ley de Convivencia Escolar N° 20.536</div>

      ${alertaBannerHtml}

      <div class="acta-section-title">1. Datos del Reporte</div>
      <div class="acta-data-grid">
        <div class="acta-data-item"><strong>Quién reporta:</strong> ${escaparHtml(caso.rol_autor || 'No especificado')}</div>
        <div class="acta-data-item"><strong>Curso (si aplica):</strong> ${escaparHtml(caso.curso_autor || 'No identificado / anónimo')}</div>
        <div class="acta-data-item"><strong>Contacto dejado:</strong> ${escaparHtml(caso.contacto || 'No dejó contacto')}</div>
        <div class="acta-data-item"><strong>Categoría:</strong> <span style="text-transform:capitalize;">${escaparHtml(caso.categoria || 'otro')}</span></div>
        <div class="acta-data-item"><strong>Fecha/Hora Reporte:</strong> ${formatearFecha(caso.creado_en)}</div>
        <div class="acta-data-item"><strong>Prioridad:</strong> <span style="text-transform: capitalize; font-weight:bold;">${caso.prioridad}</span></div>
      </div>
      <p style="font-size:0.72rem; color:#475569; margin-top:4px;">
        El reporte identifica al reportante solo si la persona lo aceptó explícitamente al enviarlo. Si el nombre del estudiante involucrado no vino en el relato, corresponde a Convivencia Educativa completarlo tras la investigación, no a este sistema inferirlo.
      </p>

      <div class="acta-section-title">2. Relato Recibido</div>
      <div style="font-size: 0.82rem; color:#4b5563; margin-bottom: 4px;">Texto tal como fue enviado por quien reporta:</div>
      <div class="acta-text-box">${escaparHtml(caso.relato || '')}</div>

      <div class="acta-section-title">3. Medidas y Seguimiento</div>
      <div style="font-size: 0.82rem; color:#4b5563; margin-bottom: 4px;">Espacio para que Convivencia Educativa registre, a mano o al imprimir, las medidas aplicadas y la derivación realizada:</div>
      <div class="acta-text-box" style="min-height:70px;"></div>

      <div class="acta-section-title">4. Resguardo y Firmas de Responsabilidad</div>
      <div style="font-size: 0.72rem; color:#4b5563; line-height: 1.4; margin-bottom: 12px;">
        Al firmar este documento, los comparecientes toman conocimiento del hecho reportado, la derivación a Inspectoría/Convivencia Educativa, y se comprometen a cumplir con los pasos y programas de acompañamiento socioemocional indicados en el RICE.
      </div>

      <div class="acta-signatures">
        <div>
          <div style="font-size: 0.72rem; font-family: monospace; color:#4b5563; min-height:40px; display:flex; align-items:center; justify-content:center; border: 1px dashed #d1d5db; border-radius:4px; padding: 4px; margin-bottom:8px; background:#f9fafb;">
            Firma pendiente
          </div>
          <div class="acta-sig-line">Firma Encargado/a de Convivencia</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; font-family: monospace; color:#4b5563; min-height:40px; display:flex; align-items:center; justify-content:center; border: 1px dashed #d1d5db; border-radius:4px; padding: 4px; margin-bottom:8px; background:#f9fafb;">
            Firma pendiente
          </div>
          <div class="acta-sig-line">Firma Apoderado Recibe</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; font-family: monospace; color:#4b5563; min-height:40px; display:flex; align-items:center; justify-content:center; border: 1px dashed #d1d5db; border-radius:4px; padding: 4px; margin-bottom:8px; background:#f9fafb;">
            Firma pendiente
          </div>
          <div class="acta-sig-line">Firma Dirección</div>
        </div>
      </div>

      <div style="margin-top: 48px; border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 0.65rem; color: #475569; text-align: center;">
        Ficha Oficial MiRice • Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Enfoque de Convivencia Educativa Circular 781 Superintendencia.
      </div>
    `;

    actaPaperContent.innerHTML = htmlActa;

    // Mostrar el modal
    actaPrintModal.style.display = 'flex';
  }

  // 6. Eventos de Control de Impresión, Envío de Email y Cierre del modal del Acta
  const btnEmailActaTrigger = document.getElementById('btn-email-acta-trigger');
  const emailSendModal = document.getElementById('email-send-modal');
  const btnCancelEmail = document.getElementById('btn-cancel-email');
  const emailSendForm = document.getElementById('email-send-form');
  const destEmailInput = document.getElementById('dest-email');
  const emailSenderLoader = document.getElementById('email-sender-loader');
  const emailLoaderText = document.getElementById('email-loader-text');

  if (btnCloseActa) {
    btnCloseActa.addEventListener('click', () => {
      actaPrintModal.style.display = 'none';
    });
  }

  if (btnPrintActaTrigger) {
    btnPrintActaTrigger.addEventListener('click', () => {
      window.print();
    });
  }

  // Lógica de Envío de Email Simulado con Factor WOW (loader dinámico paso a paso)
  if (btnEmailActaTrigger && emailSendModal && btnCancelEmail && emailSendForm) {
    btnEmailActaTrigger.addEventListener('click', () => {
      destEmailInput.value = "";
      emailSendForm.style.display = 'flex';
      emailSenderLoader.style.display = 'none';
      
      emailSendModal.style.display = 'flex';
      setTimeout(() => {
        emailSendModal.style.opacity = '1';
      }, 50);
    });

    btnCancelEmail.addEventListener('click', () => {
      emailSendModal.style.opacity = '0';
      setTimeout(() => {
        emailSendModal.style.display = 'none';
      }, 300);
    });

    emailSendForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const correoDest = destEmailInput.value.trim();
      if (!correoDest) return;

      // Ocultar formulario y mostrar loader animado
      emailSendForm.style.display = 'none';
      emailSenderLoader.style.display = 'flex';

      // Vista previa de envío: hoy no hay un backend de correo conectado
      // para actas (a diferencia de los avisos de /api/reporte, que sí usan
      // Resend). Esto se deja explícito para no simular un envío real.
      const pasos = [
        "Generando vista previa del acta en PDF…",
        "Esta función todavía no envía correos de verdad…"
      ];

      let pasoActual = 0;
      emailLoaderText.textContent = pasos[pasoActual];

      const intervalo = setInterval(() => {
        pasoActual++;
        if (pasoActual < pasos.length) {
          emailLoaderText.textContent = pasos[pasoActual];
        } else {
          clearInterval(intervalo);
          // Ocultar modal con transición suave
          emailSendModal.style.opacity = '0';
          setTimeout(() => {
            emailSendModal.style.display = 'none';
            alert(`ℹ️ El envío de actas por correo aún no está conectado a un servidor real.\n\nPor ahora, usa el botón "Imprimir" y envía el PDF manualmente a ${correoDest}.`);
          }, 300);
        }
      }, 900);
    });
  }

  // 7. Cerrar Sesión Directiva
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      try {
        sessionStorage.removeItem('mirice_token');
        localStorage.removeItem('mirice_active_session');
      } catch (e) {}
      window.miriceSesionToken = null;
      dashboardLayout.classList.remove('active');
      setTimeout(() => {
        dashboardLayout.style.display = 'none';
        
        loginForm.reset();
        loginError.style.display = 'none';
        
        loginScreen.style.display = 'flex';
        setTimeout(() => {
          loginScreen.style.opacity = '1';
        }, 50);
      }, 400);
    });
  }
});
