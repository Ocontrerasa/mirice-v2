/**
 * LÓGICA DE CONTROL Y RUTA: MiRice (Liceo de Huara)
 * Controla el ciclo de vida de la SPA, navegación de roles, transiciones de interfaz,
 * portal de login dinámico unificado y la integración del Chatbot RICE inteligente (Hito 3).
 */

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a pantallas principales del DOM
  const splashScreen = document.getElementById('splash-screen');
  const roleSelectionScreen = document.getElementById('role-selection-screen');
  const roleLoginScreen = document.getElementById('role-login-screen');
  const dashboardLayout = document.getElementById('dashboard-layout');
  const dashboardContent = document.getElementById('dashboard-content');
  
  // Menú Hamburguesa Header y Dropdown
  const btnHeaderMenu = document.getElementById('btn-header-menu');
  const headerDropdownMenu = document.getElementById('header-dropdown-menu');
  const menuUserName = document.getElementById('menu-user-name');
  const menuUserRole = document.getElementById('menu-user-role');
  const menuItemPerfil = document.getElementById('menu-item-perfil');
  const menuItemHistorial = document.getElementById('menu-item-historial');
  const menuItemReportes = document.getElementById('menu-item-reportes');
  const menuItemUpdate = document.getElementById('menu-item-update');
  const menuItemLogout = document.getElementById('menu-item-logout');
  
  // Botones de navegación
  const btnBackToRoles = document.getElementById('btn-back-to-roles');
  
  // Campos del Formulario de Login Unificado
  const roleLoginForm = document.getElementById('role-login-form');
  const roleRutInput = document.getElementById('role-rut');
  const rolePasswordInput = document.getElementById('role-password');
  const roleLoginError = document.getElementById('role-login-error');
  const toggleRolePasswordBtn = document.getElementById('toggle-role-password');
  
  // Textos Dinámicos de la pantalla de Login
  const loginRoleTitle = document.getElementById('login-role-title');
  const loginRoleSubtitle = document.getElementById('login-role-subtitle');
  const loginRutLabel = document.getElementById('login-rut-label');

  // Datos del usuario en cabecera del Dashboard
  const userAvatar = document.getElementById('current-user-avatar');
  const userRoleTitle = document.getElementById('current-user-role');
  const userSubtitle = document.getElementById('current-user-subtitle');

  // Estado global de sesión simulada
  let currentLoginRole = null; 
  let currentLoggedUser = null;

  // Lógica de Menú Desplegable (Dropdown Hamburguesa)
  if (btnHeaderMenu && headerDropdownMenu) {
    btnHeaderMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = headerDropdownMenu.style.display === 'flex';
      headerDropdownMenu.style.display = isVisible ? 'none' : 'flex';
    });

    document.addEventListener('click', (e) => {
      if (!headerDropdownMenu.contains(e.target) && e.target !== btnHeaderMenu) {
        headerDropdownMenu.style.display = 'none';
      }
    });
  }

  // Cierre de Sesión Completo (Limpia sesión activa)
  function cerrarSesionCompleta() {
    localStorage.removeItem('mirice_active_session');
    try { sessionStorage.removeItem('mirice_token'); } catch (e) {}
    window.miriceSesionToken = null;
    if (headerDropdownMenu) headerDropdownMenu.style.display = 'none';
    window.location.reload();
  }

  if (menuItemLogout) {
    menuItemLogout.addEventListener('click', cerrarSesionCompleta);
  }

  // Acciones del Menú Hamburguesa
  if (menuItemPerfil) {
    menuItemPerfil.addEventListener('click', () => {
      if (headerDropdownMenu) headerDropdownMenu.style.display = 'none';
      if (typeof window.mostrarModalEditarPerfil === 'function') {
        window.mostrarModalEditarPerfil();
      }
    });
  }

  if (menuItemHistorial) {
    menuItemHistorial.addEventListener('click', () => {
      if (headerDropdownMenu) headerDropdownMenu.style.display = 'none';
      if (typeof window.mostrarHistorialPreguntasModal === 'function') {
        window.mostrarHistorialPreguntasModal();
      }
    });
  }

  if (menuItemReportes) {
    menuItemReportes.addEventListener('click', () => {
      if (headerDropdownMenu) headerDropdownMenu.style.display = 'none';
      const bitacoraTab = dashboardContent.querySelector('[data-section*="bitacora"], [data-tab*="bitacora"], [id*="bitacora"]');
      if (bitacoraTab) {
        bitacoraTab.click();
      } else {
        window.location.href = 'denuncia.html';
      }
    });
  }

  const menuItemNotif = document.getElementById('menu-item-notif');
  const notifSettingsModal = document.getElementById('notif-settings-modal');
  const btnCloseNotifModal = document.getElementById('btn-close-notif-modal');
  const btnKeepNotif = document.getElementById('btn-keep-notif');
  const btnDisableNotif = document.getElementById('btn-disable-notif');

  if (menuItemNotif && notifSettingsModal) {
    menuItemNotif.addEventListener('click', () => {
      if (headerDropdownMenu) headerDropdownMenu.style.display = 'none';
      notifSettingsModal.style.display = 'flex';
    });
  }

  if (btnCloseNotifModal && notifSettingsModal) {
    btnCloseNotifModal.addEventListener('click', () => {
      notifSettingsModal.style.display = 'none';
    });
  }

  if (btnKeepNotif && notifSettingsModal) {
    btnKeepNotif.addEventListener('click', () => {
      localStorage.setItem('mirice_notifications_enabled', 'true');
      notifSettingsModal.style.display = 'none';
      alert('✅ Notificaciones diarias mantenidas activas. Recibirás tu mensaje de convivencia en cada día de clases.');
    });
  }

  if (btnDisableNotif && notifSettingsModal) {
    btnDisableNotif.addEventListener('click', () => {
      localStorage.setItem('mirice_notifications_enabled', 'false');
      notifSettingsModal.style.display = 'none';
      alert('🔕 Notificaciones diarias desactivadas. Puedes volver a activarlas cuando lo desees en este mismo menú.');
    });
  }

  if (menuItemUpdate) {
    menuItemUpdate.addEventListener('click', () => {
      if (headerDropdownMenu) headerDropdownMenu.style.display = 'none';
      if (typeof window.comprobarActualizacionesApp === 'function') {
        window.comprobarActualizacionesApp(true);
      } else {
        window.location.reload();
      }
    });
  }

  // --- RESTAURACIÓN AUTOMÁTICA DE SESIÓN PERSISTENTE AL INICIAR LA APP ---
  const sessionGuardada = localStorage.getItem('mirice_active_session');
  if (sessionGuardada) {
    try {
      const sessionObj = JSON.parse(sessionGuardada);
      if (sessionObj && sessionObj.role && sessionObj.userData) {
        currentLoginRole = sessionObj.role;
        currentLoggedUser = { role: sessionObj.role, data: sessionObj.userData };

        try { window.miriceSesionToken = sessionStorage.getItem('mirice_token') || null; } catch (e) { window.miriceSesionToken = null; }

        if (splashScreen) splashScreen.style.display = 'none';
        if (roleSelectionScreen) roleSelectionScreen.style.display = 'none';
        if (roleLoginScreen) roleLoginScreen.style.display = 'none';
        
        ingresarAlRol(sessionObj.role, sessionObj.userData);
        return; // Salir de la inicialización y mantener sesión activa sin volver al login
      }
    } catch (e) {
      console.error('⚠️ Error al restaurar sesión guardada:', e);
      localStorage.removeItem('mirice_active_session');
    }
  }

  // --- FUNCIONES AUXILIARES DEL CHATBOT RICE ---
  function formatMarkdownToHtml(text) {
    if (!text) return '';
    // Si el texto contiene HTML (etiquetas), no convertir \n dentro de atributos
    // Estrategia: reemplazar \n SOLO cuando no estamos dentro de una etiqueta HTML
    let out = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
    // Reemplazar \n con <br> solo si NO es parte de un atributo HTML (no dentro de < ... >)
    // Solución segura: colapsar espacios internos de atributos y luego convertir \n restantes
    out = out.replace(/(<[^>]*?)\n([^>]*?>)/g, '$1 $2'); // \n dentro de etiquetas → espacio
    out = out.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    return out;
  }

  function detectarVulneracion(query) {
    if (!query) return false;
    const q = query.toLowerCase();
    const palabrasClave = [
      'acosa', 'acosan', 'acosando', 'acosar', 'acoso',
      'molesta', 'molestan', 'molestando', 'molestar',
      'burla', 'burlan', 'burlando', 'burlar', 'burlas',
      'golpe', 'golpean', 'golpeando', 'golpear',
      'pega', 'pegan', 'pegando', 'pegar',
      'insulta', 'insultan', 'insultando', 'insultar',
      'empuja', 'empujan', 'empujando', 'empujar',
      'amenaza', 'amenazan', 'amenazando', 'amenazar',
      'maltrato', 'maltratan', 'maltratando', 'maltratar',
      'agredes', 'agrede', 'agreden', 'agrediendo', 'agresion',
      'abuso', 'abusar', 'tocacion', 'tocaciones', 'vulneracion',
      'bullying', 'ciberacoso', 'suicidio', 'autolesion', 'herida',
      'peligro', 'droga', 'drogas', 'arma', 'armas'
    ];
    return palabrasClave.some(p => q.includes(p));
  }

  function sugerirAsuntoAmable(query) {
    return "Orientación sobre situación de convivencia educativa y derechos del estudiante";
  }

  function sugerirAsunto(query) {
    return "Protocolo de Maltrato, Acoso Escolar o Vulneración de Derechos (RICE 2026)";
  }

  function agregarBurbujaEn(texto, tipo, container) {
    if (!container) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${tipo}-bubble`;
    
    if (tipo === 'user') {
      bubble.style.alignSelf = 'flex-end';
    } else if (tipo === 'bot') {
      bubble.style.alignSelf = 'flex-start';
    } else if (tipo === 'error') {
      bubble.style.alignSelf = 'center';
    }

    bubble.innerHTML = formatMarkdownToHtml(texto);
    container.appendChild(bubble);
  }

  function agregarChipsEn(articulosCados, container) {
    if (!container || !articulosCados || articulosCados.length === 0) return;
    const chipContainer = document.createElement('div');
    chipContainer.style.cssText = 'display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;';
    
    articulosCados.forEach(art => {
      const chip = document.createElement('span');
      chip.textContent = `📍 ${art.titulo ? art.titulo.split(':')[0] : 'Artículo RICE'}`;
      chip.style.cssText = 'font-size:0.72rem; background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.3); padding:4px 8px; border-radius:50px; color:white; cursor:pointer;';
      chip.title = art.contenido || '';
      
      chip.addEventListener('click', () => {
        if (typeof mostrarDetalleProtocoloModal === 'function') {
          mostrarDetalleProtocoloModal(art);
        } else {
          alert(`📖 ${art.seccion || ''} — ${art.titulo || ''}\n\n${art.contenido || ''}`);
        }
      });
      
      chipContainer.appendChild(chip);
    });
    
    const burbujas = container.querySelectorAll('.bot-bubble');
    if (burbujas.length > 0) {
      burbujas[burbujas.length - 1].appendChild(chipContainer);
    }
  }

  // Modal de Aceptación Legal en Primer Inicio por RUT
  function verificarEAbrirSesion(role, userData) {
    const rutKey = window.obtenerRutKeySeguro(userData);
    const termsAccepted = localStorage.getItem('mirice_terms_accepted_' + rutKey);

    if (termsAccepted) {
      // Ya aceptó en una sesión anterior -> ingresar directo al dashboard
      roleLoginScreen.classList.remove('active');
      setTimeout(() => {
        roleLoginScreen.style.display = 'none';
        ingresarAlRol(role, userData);
      }, 300);
    } else {
      // Primera vez iniciando sesión con este RUT -> desplegar modal con scroll obligatorio
      abrirModalPrimerInicio(role, userData);
    }
  }

  function abrirModalPrimerInicio(role, userData) {
    const lirmiModal = document.getElementById('lirmi-notice-modal');
    const scrollBox = document.getElementById('legal-scroll-box');
    const hintMsg = document.getElementById('scroll-hint-msg');
    const chkUnderstand = document.getElementById('chk-lirmi-understand');
    const chkContainer = document.getElementById('chk-container-label');
    const btnContinue = document.getElementById('btn-lirmi-continue');

    if (!lirmiModal || !scrollBox || !chkUnderstand || !btnContinue) {
      ingresarAlRol(role, userData);
      return;
    }

    roleLoginScreen.classList.remove('active');
    setTimeout(() => {
      roleLoginScreen.style.display = 'none';

      // Resetear scroll y deshabilitar controles inicialmente
      scrollBox.scrollTop = 0;
      chkUnderstand.checked = false;
      chkUnderstand.disabled = true;
      if (chkContainer) {
        chkContainer.style.opacity = '0.5';
        chkContainer.style.pointerEvents = 'none';
      }
      btnContinue.disabled = true;
      btnContinue.style.opacity = '0.5';

      if (hintMsg) {
        hintMsg.style.display = 'block';
        hintMsg.style.background = '#fffbebfb';
        hintMsg.style.color = '#b45309';
        hintMsg.style.borderColor = '#fde68a';
        hintMsg.innerHTML = '📜 Desplázate hasta el final del recuadro superior para habilitar la casilla de aceptación.';
      }

      // Handler para detectar scroll hasta el fondo
      function verificarScrollFondo() {
        const atBottom = (scrollBox.scrollHeight - scrollBox.scrollTop <= scrollBox.clientHeight + 15);
        if (atBottom) {
          chkUnderstand.disabled = false;
          if (chkContainer) {
            chkContainer.style.opacity = '1';
            chkContainer.style.pointerEvents = 'auto';
          }
          if (hintMsg) {
            hintMsg.style.background = '#ecfdf5';
            hintMsg.style.color = '#047857';
            hintMsg.style.borderColor = '#a7f3d0';
            hintMsg.innerHTML = '✅ Documento leído hasta el final. Ya puedes marcar la casilla y continuar.';
          }
        }
      }

      scrollBox.onscroll = verificarScrollFondo;

      // Checkbox event
      chkUnderstand.onchange = function() {
        btnContinue.disabled = !chkUnderstand.checked;
        btnContinue.style.opacity = chkUnderstand.checked ? '1' : '0.5';
      };

      // Button continue event
      btnContinue.onclick = function() {
        if (!chkUnderstand.checked) return;

        // Registrar la aceptación permanente para este RUT
        localStorage.setItem('mirice_terms_accepted_' + window.obtenerRutKeySeguro(userData), new Date().toISOString());

        lirmiModal.style.display = 'none';
        lirmiModal.classList.remove('visible');
        lirmiModal.classList.add('hidden');

        ingresarAlRol(role, userData);
      };

      // Mostrar modal
      lirmiModal.style.display = 'flex';
      lirmiModal.classList.remove('hidden');
      lirmiModal.classList.add('visible');
    }, 300);
  }


  // 1. Simulación de Splash Screen (Carga inicial)
  setTimeout(() => {
    splashScreen.style.opacity = '0';
    roleSelectionScreen.classList.add('active');
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 600);
  }, 2500);

  // 2. Control de Selección de Roles Principal
  const roleCards = document.querySelectorAll('.role-card');
  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedRole = card.getAttribute('data-role');
      currentLoginRole = selectedRole;
      configurarYAbrirLogin(selectedRole);
    });
  });

  // 3. Configuración y Apertura del Login Unificado
  function configurarYAbrirLogin(role) {
    roleLoginForm.reset();
    roleLoginError.style.display = 'none';
    rolePasswordInput.setAttribute('type', 'password');
    toggleRolePasswordBtn.textContent = '👁️';

    if (role === 'estudiante') {
      loginRoleTitle.innerHTML = 'Acceso <span>Estudiantes</span>';
      loginRoleSubtitle.textContent = 'Ingresa tu RUT y contraseña inicial (últimos 4 dígitos del RUT)';
      loginRutLabel.textContent = 'RUT del Estudiante';
    } else if (role === 'apoderado') {
      loginRoleTitle.innerHTML = 'Acceso <span>Apoderados</span>';
      loginRoleSubtitle.textContent = 'Ingresa tu RUT y contraseña inicial (últimos 4 dígitos del RUT)';
      loginRutLabel.textContent = 'RUT del Apoderado';
    } else if (role === 'funcionario') {
      loginRoleTitle.innerHTML = 'Acceso <span>Funcionarios</span>';
      loginRoleSubtitle.textContent = 'Ingresa tu RUT y contraseña inicial (últimos 4 dígitos del RUT)';
      loginRutLabel.textContent = 'RUT del Funcionario';
    }

    roleSelectionScreen.classList.remove('active');
    setTimeout(() => {
      roleSelectionScreen.style.display = 'none';
      roleLoginScreen.style.display = 'flex';
      setTimeout(() => {
        roleLoginScreen.classList.add('active');
      }, 50);
    }, 300);
  }

  // Lógica de formateo dinámico del RUT al perder el foco (blur)
  roleRutInput.addEventListener('blur', () => {
    roleRutInput.value = formatearRUTChileno(roleRutInput.value);
  });

  function formatearRUTChileno(rut) {
    let rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (rutLimpio.length < 2) return rutLimpio;
    
    let cuerpo = rutLimpio.slice(0, -1);
    let dv = rutLimpio.slice(-1);
    
    let cuerpoFormateado = '';
    let miles = 0;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      cuerpoFormateado = cuerpo.charAt(i) + cuerpoFormateado;
      miles++;
      if (miles === 3 && i !== 0) {
        cuerpoFormateado = '.' + cuerpoFormateado;
        miles = 0;
      }
    }
    return cuerpoFormateado + '-' + dv;
  }

  // Volver de Login al Selector de Roles
  btnBackToRoles.addEventListener('click', () => {
    roleLoginScreen.classList.remove('active');
    setTimeout(() => {
      roleLoginScreen.style.display = 'none';
      roleSelectionScreen.style.display = 'flex';
      setTimeout(() => {
        roleSelectionScreen.classList.add('active');
      }, 50);
    }, 300);
  });

  // Alternar visibilidad de contraseña
  toggleRolePasswordBtn.addEventListener('click', () => {
    const isPassword = rolePasswordInput.getAttribute('type') === 'password';
    rolePasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
    toggleRolePasswordBtn.textContent = isPassword ? '🔒' : '👁️';
    toggleRolePasswordBtn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });

  // Lógica de Submit del Login Unificado
  roleLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    roleLoginError.style.display = 'none';

    const rutIngresado = roleRutInput.value.trim();
    const claveIngresada = rolePasswordInput.value.trim();

    const rutLimpio = rutIngresado.replace(/[^0-9kK]/g, '').toUpperCase();

    // Cuentas de demostración (no son personas reales; se mantienen para
    // poder mostrar la app sin depender del backend).
    let usuarioEncontrado = null;
    if (rutLimpio === "111111112") {
      usuarioEncontrado = {
        rut_limpio: "111111112",
        rut_formato: "11.111.111-2",
        nombre: "Estudiante de Prueba",
        curso: "1er Año Medio A",
        email: "estudiante.prueba@liceodehuara.cl",
        telefono: "911111111",
        estado: "Regular",
        matricula: "2026-DEMO01"
      };
    } else if (rutLimpio === "222222222") {
      usuarioEncontrado = {
        rut_limpio: "222222222",
        rut_formato: "22.222.222-2",
        nombre: "Apoderado de Prueba",
        pupilo: "Estudiante de Prueba (1er Año Medio A)",
        email: "apoderado.prueba@liceodehuara.cl",
        telefono: "922222222",
        asistencia_reuniones: "100%"
      };
    } else if (rutLimpio === "333333333") {
      usuarioEncontrado = {
        rut_limpio: "333333333",
        rut_formato: "33.333.333-3",
        nombre: "Funcionario de Prueba",
        cargo: "Coordinador de Convivencia Educativa",
        departamento: "Equipo Directivo / Convivencia",
        email: "funcionario.prueba@liceodehuara.cl",
        registro_docente: "REG-2026-99"
      };
    }

    if (usuarioEncontrado) {
      const claveEsperada = rutLimpio.substring(rutLimpio.length - 4);
      if (claveIngresada === claveEsperada) {
        currentLoggedUser = { role: currentLoginRole, data: usuarioEncontrado };
        verificarEAbrirSesion(currentLoginRole, usuarioEncontrado);
      } else {
        mostrarErrorLogin();
      }
      return;
    }

    // Personas reales: la validación ya no ocurre en el navegador — se
    // verifica en /api/login contra la base encriptada (28-jul-2026).
    const btnSubmit = roleLoginForm.querySelector('button[type="submit"]');
    if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.style.opacity = '0.7'; }

    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut: rutLimpio, clave: claveIngresada, rol: currentLoginRole })
      });
      let data = null;
      try { data = await resp.json(); } catch (e) {}

      if (!resp.ok || !data || data.estado !== 'ok') {
        mostrarErrorLogin();
        return;
      }

      window.miriceSesionToken = data.token;
      window.miriceDebeCambiarClave = !!data.debe_cambiar;

      const perfil = Object.assign({}, data.perfil, {
        rut_limpio: rutLimpio,
        rut_formato: formatearRUTChileno(rutLimpio),
        // Ya lo valida el servidor contra la columna panel_admin de personas
        // (ver api/login.js) — se usa para mostrar u ocultar paneles de
        // Coordinación/Dirección, en vez de listas de RUT en el cliente.
        panel_admin: !!data.panel_admin
      });

      currentLoggedUser = { role: currentLoginRole, data: perfil };

      if (data.debe_cambiar) {
        abrirModalCambioClave(currentLoginRole, perfil);
      } else {
        verificarEAbrirSesion(currentLoginRole, perfil);
      }
    } catch (err) {
      console.error('Error de red en /api/login:', err);
      roleLoginError.textContent = 'No se pudo conectar. Revisa tu conexión a internet e intenta de nuevo.';
      mostrarErrorLogin();
    } finally {
      if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.style.opacity = '1'; }
    }
  });

  // Cambio de clave obligatorio (cuenta recién migrada / primer inicio de sesión)
  function abrirModalCambioClave(role, userData) {
    roleLoginScreen.classList.remove('active');
    setTimeout(() => { roleLoginScreen.style.display = 'none'; }, 300);

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.55); display:flex; align-items:center; justify-content:center; z-index:9999; padding:16px;';
    overlay.innerHTML = `
      <div style="background:#fff; border-radius:16px; padding:28px; max-width:420px; width:100%; box-shadow:0 20px 50px rgba(0,0,0,0.25);">
        <h3 style="margin:0 0 8px; color:#047857;">🔒 Elige tu contraseña</h3>
        <p style="font-size:0.88rem; color:#475569; line-height:1.5; margin-bottom:16px;">
          Por seguridad, antes de continuar debes cambiar la contraseña inicial (los últimos 4 dígitos de tu RUT) por una propia de al menos 6 caracteres.
        </p>
        <div id="cambio-clave-error" style="display:none; background:#fef2f2; color:#b91c1c; padding:8px 12px; border-radius:8px; font-size:0.82rem; margin-bottom:12px;"></div>
        <input id="cc-actual" type="password" placeholder="Contraseña actual (los 4 últimos dígitos de tu RUT)" class="form-control" style="width:100%; margin-bottom:10px; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
        <input id="cc-nueva" type="password" placeholder="Contraseña nueva (mínimo 6 caracteres)" class="form-control" style="width:100%; margin-bottom:10px; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
        <input id="cc-repetir" type="password" placeholder="Repite la contraseña nueva" class="form-control" style="width:100%; margin-bottom:16px; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
        <button id="cc-confirmar" style="width:100%; background:#047857; color:#fff; font-weight:700; padding:12px; border:none; border-radius:50px; cursor:pointer;">Confirmar y continuar</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const errBox = overlay.querySelector('#cambio-clave-error');
    overlay.querySelector('#cc-confirmar').addEventListener('click', async () => {
      const actual = overlay.querySelector('#cc-actual').value.trim();
      const nueva = overlay.querySelector('#cc-nueva').value.trim();
      const repetir = overlay.querySelector('#cc-repetir').value.trim();

      errBox.style.display = 'none';
      if (nueva.length < 6) {
        errBox.textContent = 'La contraseña nueva debe tener al menos 6 caracteres.';
        errBox.style.display = 'block';
        return;
      }
      if (nueva !== repetir) {
        errBox.textContent = 'Las dos contraseñas nuevas no coinciden.';
        errBox.style.display = 'block';
        return;
      }

      try {
        const resp = await fetch('/api/cambiar-clave', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + window.miriceSesionToken
          },
          body: JSON.stringify({ clave_actual: actual, clave_nueva: nueva })
        });
        const data = await resp.json().catch(() => null);
        if (!resp.ok || !data || data.estado !== 'ok') {
          errBox.textContent = (data && data.texto) || 'No se pudo cambiar la contraseña. Verifica la actual.';
          errBox.style.display = 'block';
          return;
        }
        window.miriceSesionToken = data.token;
        window.miriceDebeCambiarClave = false;
        document.body.removeChild(overlay);
        verificarEAbrirSesion(role, userData);
      } catch (e) {
        errBox.textContent = 'No se pudo conectar. Intenta de nuevo.';
        errBox.style.display = 'block';
      }
    });
  }

  function mostrarErrorLogin() {
    roleLoginError.style.display = 'block';
    roleLoginError.style.animation = 'none';
    roleLoginError.offsetHeight; 
    roleLoginError.style.animation = 'shake 0.4s ease';
  }

  // 4. Configurar e Ingresar al Dashboard de cada Rol
  function ingresarAlRol(role, userData) {
    // Garantizar que la variable de sesión esté expuesta globalmente
    currentLoggedUser = { role: role, data: userData };
    window.currentLoggedUser = currentLoggedUser;

    // Guardar sesión activa permanentemente en el navegador/dispositivo
    localStorage.setItem('mirice_active_session', JSON.stringify({
      role: role,
      userData: userData,
      loginTime: Date.now()
    }));

    // El token de servidor se guarda aparte, en sessionStorage (se borra al
    // cerrar la pestaña) — es lo que autoriza las llamadas a /api/reporte,
    // /api/cambiar-clave, etc. a nombre de esta persona.
    if (window.miriceSesionToken) {
      try { sessionStorage.setItem('mirice_token', window.miriceSesionToken); } catch (e) {}
    }

    // Desplegar Notificación Push Nativa del Día (Aleatoria por RUT y Fecha)
    if (typeof window.desplegarNotificacionDiariaConvivencia === 'function') {
      window.desplegarNotificacionDiariaConvivencia(userData ? userData.rut_limpio : null);
    }

    // Registrar autorregulación digital si es horario de clase activa
    if (typeof window.registrarAccesoDigitalEnClase === 'function' && userData) {
      window.registrarAccesoDigitalEnClase(userData.rut_limpio, userData.curso);
    }

    // Formatear Fecha Discreta en Español
    function obtenerFechaChileFormateada() {
      const fecha = new Date();
      const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      return `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]}, ${fecha.getFullYear()}`;
    }

    // Sistema de Consejos y Extractos RICE de Lunes a Viernes
    function obtenerConsejoDiarioConvivencia() {
      const fecha = new Date();
      const dia = fecha.getDay(); // 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes

      const consejosSemana = {
        1: {
          tag: "📌 LUNES DE BIENESTAR Y EMPATÍA",
          titulo: "El Respeto Mutuo es la Base del Liceo",
          frase: "💡 <strong>Comenzar la semana con amabilidad cambia el día de todos:</strong> Escuchar a tus compañeros sin juzgar crea un ambiente de confianza. Ante cualquier tensión, el diálogo es el primer paso.",
          norma: "📖 <strong>RICE 2026:</strong> Art. 1 - Derecho a la integridad física y moral. Todos tenemos derecho a ser tratados con dignidad."
        },
        2: {
          tag: "📌 MARTES DE DIÁLOGO Y CONVIVENCIALIDAD",
          titulo: "Expresarse con Calma Evita Malentendidos",
          frase: "💡 <strong>Hablar a tiempo resuelve diferencias:</strong> Si algo te molesta o sientes una injusticia, exprésalo con respeto o acércate a tu Profesor Jefe o al Equipo de Convivencia Educativa.",
          norma: "📖 <strong>RICE 2026:</strong> Art. 31 - Conducto Regular y Mediación Escolar. El liceo promueve acuerdos pacíficos antes que sanciones."
        },
        3: {
          tag: "📌 MIÉRCOLES DE INCLUSIÓN Y DIVERSIDAD",
          titulo: "La Diversidad nos Enriquece a Todos",
          frase: "💡 <strong>Nadie debe sentirse excluido:</strong> En el Liceo de Huara rechazamos toda forma de discriminación o acoso. Si ves que alguien está solo o es apartado, inclúyelo en tu grupo.",
          norma: "📖 <strong>RICE 2026:</strong> Protocolo N° 13 - Diversidad e Inclusión. Protección integral de los derechos de cada estudiante."
        },
        4: {
          tag: "📌 JUEVES DE DERECHOS Y NORMAS CLARAS",
          titulo: "Puntualidad con Resguardo del Derecho a Educar",
          frase: "💡 <strong>La puntualidad es respeto por el tiempo de todos:</strong> Recuerda ingresar a las 08:30 hrs. Si te atrasas, ingresarás a clases con pase sin exclusión pedagógica.",
          norma: "📖 <strong>Circular 781 Mineduc:</strong> Art. 8 - Ningún estudiante puede ser devuelto a su hogar ni privado de su jornada por atrasos."
        },
        5: {
          tag: "📌 VIERNES DE RECONOCIMIENTO Y BUEN TRATO",
          titulo: "Valorar el Esfuerzo Colectivo",
          frase: "💡 <strong>Reconoce el trabajo de tus compañeros y profesores:</strong> Un agradecimiento o un gesto amable fortalece el clima escolar y cierra la semana en armonía.",
          norma: "📖 <strong>RICE 2026:</strong> Principios Restaurativos y Aprendizaje Socioemocional (SEL)."
        }
      };

      const consejoFinDeSemana = {
        tag: "☀️ FIN DE SEMANA DE AUTOCUIDADO Y FAMILIA",
        titulo: "Tiempo para Recargar Energías",
        frase: "💡 <strong>El descanso y el autocuidado son fundamentales:</strong> Disfruta tiempo de calidad con tu familia y amigos para volver con entusiasmo la próxima semana.",
        norma: "📖 <strong>Liceo de Huara:</strong> Promoción de la salud mental y convivencia socioemocional."
      };

      return consejosSemana[dia] || consejoFinDeSemana;
    }

    const fechaTexto = obtenerFechaChileFormateada();
    const consejoDiarioObj = obtenerConsejoDiarioConvivencia();

    // Actualizar nombre, cargo y fecha discreta en la cabecera y en el Dropdown
    if (menuUserName) menuUserName.textContent = userData.nombre || 'Usuario';
    if (menuUserRole) menuUserRole.textContent = (userData.cargo || userData.curso || 'Comunidad Educativa') + ' • ' + fechaTexto;
    if (userSubtitle) userSubtitle.textContent = (userData.cargo || userData.curso || 'Liceo de Huara') + ' • ' + fechaTexto;
    if (menuItemReportes) menuItemReportes.style.display = (role === 'funcionario') ? 'flex' : 'none';

    // Distintivo de Avatar exclusivo para estudiantes (Oculto estrictamente para adultos)
    const headerAvatarBadge = document.getElementById('header-user-avatar-badge');
    if (headerAvatarBadge) {
      if (role === 'estudiante') {
        const rutKey = window.obtenerRutKeySeguro(userData);
        const savedAvatar = localStorage.getItem('mirice_avatar_' + rutKey) || '💻';
        headerAvatarBadge.textContent = savedAvatar;
        headerAvatarBadge.style.display = 'flex';
      } else {
        headerAvatarBadge.style.display = 'none';
      }
    }

    let navigationHtml = '';
    let bodyHtml = '';

    if (role === 'estudiante' && userData) {
      navigationHtml = `
        <div class="role-tabs">
          <button class="tab-btn active" data-tab="est-perfil"><span class="tab-icon">👤</span>Perfil</button>
          <button class="tab-btn" data-tab="est-rice"><span class="tab-icon">📖</span>El RICE</button>
          <button class="tab-btn" data-tab="est-chat"><span class="tab-icon">👨‍🏫</span>Orientador RICE</button>
        </div>
      `;

      bodyHtml = `
        <!-- SECCIÓN 1: Perfil Estudiante -->
        <div id="est-perfil" class="role-view-section active student-profile-grid">
          <div class="welcome-card" style="background: var(--bg-card); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-card); margin-bottom: 0;">
            <!-- Avatar del estudiante + bienvenida -->
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:14px;">
              <div id="est-perfil-avatar-display" style="font-size:2.8rem; background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%); width:68px; height:68px; border-radius:18px; border:2.5px solid #10b981; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(16,185,129,0.18); flex-shrink:0; cursor:pointer;" onclick="window.mostrarModalEditarPerfil()" title="Editar avatar">
                ${localStorage.getItem('mirice_avatar_' + (userData.rut_limpio || '').replace(/[^a-zA-Z0-9]/g,'')) || '💻'}
              </div>
              <div>
                <h3 style="font-size: 1.2rem; color: var(--primary); margin-bottom: 4px;">¡Bienvenido, ${userData.nombre}! 👋</h3>
                <span class="student-badge">${userData.curso}</span>
                <div style="font-size:0.75rem; color:#047857; margin-top:4px; font-weight:800; cursor:pointer;" onclick="window.mostrarModalEditarPerfil()">✏️ Cambiar mi Avatar Institucional</div>
              </div>
            </div>

            <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.5; margin-top: 10px; margin-bottom: 14px;">
              Información matriculada registrada en el Liceo de Huara para consultas normativas:
            </p>
            <div style="background: rgba(255,255,255,0.4); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-card); font-size: 0.85rem; line-height: 1.7; color: var(--text-main); margin-bottom: 14px;">
              <strong>RUN:</strong> ${userData.rut_formato}<br>
              <strong>Curso:</strong> ${userData.curso}<br>
              <strong>Matrícula:</strong> ${userData.matricula}<br>
              <strong>Correo Institucional:</strong> ${userData.email}<br>
              <strong>Estado de Matrícula:</strong> <span style="color:#10b981; font-weight:bold;">${userData.estado}</span>
            </div>
            
            <!-- DESCARGA DE RICE Y CERTIFICADO OFICIAL -->
            ${(typeof window.generarHtmlBotonCertificadoRICE === 'function') ? window.generarHtmlBotonCertificadoRICE(userData, 'estudiante') : ''}
          </div>
          <div class="student-info-sidebar">
            <!-- CONSEJO Y EXTRACTO RICE DEL DÍA (Lunes a Viernes) -->
            <div style="background: #ffffff; padding: 18px; border-radius: var(--radius-md); border: 1.5px solid #cbd5e1; border-left: 5px solid #047857; margin-bottom: 0; box-shadow: 0 4px 14px rgba(0,0,0,0.04);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:10px;">
                <span style="font-size:0.75rem; font-weight:800; color:#047857; background:#e6f4ea; padding:3px 10px; border-radius:50px;">${consejoDiarioObj.tag}</span>
                <span style="font-size:0.75rem; color:#475569; font-weight:600;">📅 ${fechaTexto}</span>
              </div>
              <h4 style="font-size:0.95rem; font-weight:800; color:#0f172a; margin-bottom:6px;">${consejoDiarioObj.titulo}</h4>
              <p style="font-size:0.85rem; color:#1e293b; line-height:1.5; margin-bottom:10px;">${consejoDiarioObj.frase}</p>
              <div style="background:#f1f5f9; padding:10px 12px; border-radius:8px; font-size:0.78rem; color:#047857; font-weight:700; border-left:3px solid #047857;">
                ${consejoDiarioObj.norma}
              </div>
            </div>

            <!-- MÓDULO DE AUTORREGULACIÓN DIGITAL EN AULA -->
            ${(typeof window.generarHtmlAutorregulacionDigital === 'function') ? window.generarHtmlAutorregulacionDigital(userData.rut_limpio, userData.curso) : ''}
            
            <!-- TERMÓMETRO DE CLIMA ESCOLAR SEMANAL (ANÓNIMO) -->
            ${(typeof window.generarHtmlTermometroClima === 'function') ? window.generarHtmlTermometroClima('estudiante', userData.rut_limpio) : ''}

            <div class="sabias-que-card" style="margin-top: 0;">
              <div class="sabias-que-icon">💡</div>
              <div class="sabias-que-content">
                <h4>¿Sabías que...? (Circular 781)</h4>
                <p>El Liceo de Huara no puede suspenderte, expulsarte ni prohibirte ingresar al aula por atrasos, uniforme o rendimiento. Tus derechos educativos están plenamente resguardados por la Superintendencia de Educación.</p>
              </div>
          </div>
        </div>
      </div>

        <!-- SECCIÓN 2: RICE -->
        <div id="est-rice" class="role-view-section">
          <div style="background: var(--bg-card); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-card); margin-bottom: 8px;">
            <h3 style="color: var(--primary); font-size: 1.25rem; font-weight: 700; margin-bottom: 6px;">📖 Conoce tu Reglamento (RICE 2026)</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.4;">
              El Reglamento Interno de Convivencia Educativa del Liceo de Huara establece tus derechos, deberes y la forma en que resolvemos los problemas para asegurar un espacio educativo respetuoso y centrado en las personas.
            </p>
          </div>

          <!-- 1. Tipificación de Faltas -->
          <div style="display:flex; flex-direction:column; gap:12px;">
            <h4 style="color: var(--primary); font-size: 1.05rem; font-weight: 600; margin-bottom: 4px;">⚠️ Clasificación y Tipificación de Faltas</h4>
            
            <div style="background: hsl(150, 40%, 97%); border-left: 4px solid #10b981; padding: 12px; border-radius: var(--radius-sm); font-size: 0.85rem; line-height: 1.4;">
              <strong style="color: hsl(150, 80%, 25%); font-size: 0.9rem;">Faltas Leves (Art. 15)</strong>
              <div style="margin-top: 4px;">• <strong>Acciones:</strong> Atrasos injustificados reiterados, no vestir el uniforme escolar oficial, uso de teléfonos móviles durante el desarrollo de clases sin autorización.</div>
              <div style="margin-top: 4px; color: var(--text-muted);">👉 <strong>Consecuencia:</strong> Amonestación verbal privada, registro en hoja de vida y citación al apoderado para firmar compromiso de mejora.</div>
            </div>

            <div style="background: hsl(35, 80%, 97%); border-left: 4px solid var(--accent); padding: 12px; border-radius: var(--radius-sm); font-size: 0.85rem; line-height: 1.4;">
              <strong style="color: hsl(35, 80%, 28%); font-size: 0.9rem;">Faltas Graves (Art. 16)</strong>
              <div style="margin-top: 4px;">• <strong>Acciones:</strong> Faltas de respeto o respuestas insolentes a docentes y funcionarios, daños intencionales al mobiliario o edificio del liceo, abandonar las clases o el recinto sin permiso, ciberacoso.</div>
              <div style="margin-top: 4px; color: var(--text-muted);">👉 <strong>Consecuencia:</strong> Citación formal a apoderado, acta de compromiso con el profesor jefe o Inspectoría y derivación a apoyo escolar interno.</div>
            </div>

            <div style="background: hsl(0, 75%, 97%); border-left: 4px solid #ef4444; padding: 12px; border-radius: var(--radius-sm); font-size: 0.85rem; line-height: 1.4;">
              <strong style="color: hsl(0, 80%, 35%); font-size: 0.9rem;">Faltas Gravísimas (Art. 17)</strong>
              <div style="margin-top: 4px;">• <strong>Acciones:</strong> Agresión física grave o acoso escolar sistemático (bullying), porte de armas u objetos peligrosos, porte, consumo o comercialización de drogas y alcohol, violencia de género o discriminación.</div>
              <div style="margin-top: 4px; color: var(--text-muted);">👉 <strong>Consecuencia:</strong> Suspensión de actividades (máx. 5 días), derivación a Equipo de Convivencia Educativa, y denuncia obligatoria ante tribunales si reviste carácter de delito.</div>
            </div>
          </div>

          <!-- 2. Protocolos Oficiales -->
          <div style="margin-top: 14px;">
            ${obtenerProtocolExplorerHtml('est')}
          </div>

          <!-- 3. Acordeón de Capítulos Adicionales -->
          <div style="margin-top: 8px;">
            <h4 style="color: var(--primary); font-size: 1.05rem; font-weight: 600; margin-bottom: 8px;">📋 Capítulos y Títulos Complementarios</h4>
            <div class="accordion">
              <div class="accordion-item">
                <button class="accordion-header">
                  <span>Capítulo I: Tus Derechos Principales 🌟</span>
                  <span class="accordion-icon">▼</span>
                </button>
                <div class="accordion-content">
                  <div class="accordion-content-inner">
                    El Liceo de Huara resguarda tu integridad física y emocional. Tienes derecho a estudiar en un clima de respeto mutuo, no ser discriminado, ser escuchado y recibir apoyo cuando tengas dificultades de aprendizaje o personales (Circular 781).
                  </div>
                </div>
              </div>

              <div class="accordion-item">
                <button class="accordion-header">
                  <span>Capítulo II: Deberes del Alumno 📚</span>
                  <span class="accordion-icon">▼</span>
                </button>
                <div class="accordion-content">
                  <div class="accordion-content-inner">
                    Tus deberes principales son asistir a todas las clases puntualmente, participar activamente en el aula, cuidar el edificio escolar y tratar con respeto y amabilidad a tus compañeros y profesores.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN 3: Chatbot RICE Inteligente -->
        <div id="est-chat" class="role-view-section">
          <div style="padding: 14px 16px 8px; flex-shrink:0;">
            <h3 style="color: var(--primary); font-size: 1.1rem; font-weight: 600; margin-bottom: 4px;">👨‍🏫 Orientador Virtual RICE</h3>
            <p style="color: var(--text-muted); font-size: 0.78rem; line-height:1.4;">
              Consulta rápida y orientación confinada estrictamente al reglamento institucional.
            </p>
          </div>
          <div class="chat-wrapper">
            <!-- Historial de Conversación -->
            <div id="chat-messages" aria-live="polite" style="flex:1; min-height:0; padding:16px; overflow-y:auto; display:flex; flex-direction:column; gap:12px; font-size:0.85rem;">
              <!-- Mensaje de bienvenida -->
              <div class="chat-bubble bot-bubble" style="align-self:flex-start; background:var(--primary); color:white; padding:10px 14px; border-radius:var(--radius-md) var(--radius-md) var(--radius-md) 0; max-width:85%; line-height:1.4;">
                ¡Hola, ${userData.nombre.split(' ')[0]}! Soy tu Orientador del RICE. ¿Tienes alguna duda sobre atrasos, inasistencias, faltas, Ley de Autismo, embarazo o protocolos del Liceo de Huara? Pregúntame e investigaré de inmediato.
              </div>
            </div>
            <!-- Indicador de Carga -->
            <div id="chat-typing-indicator" aria-live="assertive" style="display:none; padding:8px 14px; align-self:flex-start; background:rgba(0,0,0,0.06); border-radius:20px; font-size:0.8rem; color:var(--text-muted); margin-left:16px; margin-bottom:8px;">
              👨‍🏫 Consultando artículos del RICE...
            </div>
            <!-- Input -->
            <form id="chat-form" style="display:flex; border-top:1px solid var(--border-card); background:rgba(255,255,255,0.95); padding:10px 12px; gap:8px; flex-shrink:0;">
              <input type="text" id="chat-input" class="form-control" placeholder="Escribe tu pregunta aquí..." aria-label="Escribe tu consulta sobre el reglamento" aria-required="true" style="flex:1; border-radius:var(--radius-sm); border:1px solid var(--border-card); font-size:0.88rem; padding:8px 12px; background:white;" required autocomplete="off">
              <button type="submit" class="btn-primary" aria-label="Enviar pregunta al Orientador Virtual" style="margin-top:0; width:auto; padding:8px 16px; border-radius:var(--radius-sm);">Enviar</button>
            </form>
          </div>
          
          <!-- Marca e Insignia Inferior para Espaciado de Scroll -->
          <div class="chat-footer-brand" style="margin-top: 20px; margin-bottom: 90px; padding: 14px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; border-top: 1px dashed var(--border-card); width: 100%; max-width: 960px; margin-left: auto; margin-right: auto;">
            <img src="assets/branding/Logo oficial de toda la plataforma y proyecto.png" alt="Logo MiRice" style="height: 28px; width: auto; object-fit: contain;">
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">MiRice 2026 • Orientación de Convivencia Educativa Liceo de Huara</span>
          </div>
        </div>
      `;

      userRoleTitle.textContent = userData.nombre;
      userSubtitle.textContent = `${userData.curso} • Estudiante`;

    } else if (role === 'apoderado' && userData) {
      navigationHtml = `
        <div class="role-tabs">
          <button class="tab-btn active" data-tab="apo-inicio"><span class="tab-icon">🏠</span>Inicio</button>
          <button class="tab-btn" data-tab="apo-firma"><span class="tab-icon">🖋️</span>Firmar Actas</button>
          <button class="tab-btn" data-tab="apo-crianza"><span class="tab-icon">👨‍👩‍👧‍👦</span>Crianza Positiva</button>
          <button class="tab-btn" data-tab="apo-asistente"><span class="tab-icon">👨‍🏫</span>Orientador RICE</button>
        </div>
      `;

      bodyHtml = `
        <div id="apo-inicio" class="role-view-section active profile-main-grid">
          <!-- FRANJA VERDE DISTINTIVA EXCLUSIVA DEL PERFIL APODERADO -->
          <div style="grid-column: 1 / -1; background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: white; padding: 16px 20px; border-radius: var(--radius-md); box-shadow: 0 4px 14px rgba(4,120,87,0.18); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <span style="background:rgba(255,255,255,0.2); font-size:0.72rem; font-weight:700; padding:3px 8px; border-radius:12px; text-transform:uppercase; letter-spacing:0.5px;">🌱 Portal Familia & Escuela</span>
              <h3 style="font-size: 1.15rem; font-weight: 700; margin-top:4px; margin-bottom:2px;">Panel Oficial del Apoderado — Liceo de Huara</h3>
              <p style="font-size: 0.8rem; opacity:0.9; margin:0;">Reglamento RICE General y Orientaciones de Educación Parvularia 2026</p>
            </div>
            <a href="fuentes/RICE%20LICEO%20DE%20HUARA%202026.pdf" target="_blank" style="background:white; color:#047857; text-decoration:none; padding:8px 14px; font-size:0.8rem; font-weight:700; border-radius:var(--radius-sm); display:inline-flex; align-items:center; gap:6px;">
              📥 RICE Oficial (PDF)
            </a>
          </div>

          <div class="welcome-card" style="background: var(--bg-card); padding: 18px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-card); border-top: 4px solid #047857;">
            <h3 style="font-size: 1.15rem; color: #047857; margin-bottom: 6px;">Bienvenido/a, ${userData.nombre} 🤝</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.4; margin-bottom: 12px;">
              Información de su pupilo y regulaciones vigentes en el establecimiento:
            </p>
            <div style="background: #ecfdf5; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid #a7f3d0; font-size: 0.82rem; line-height: 1.6; color: #064e3b; margin-bottom: 14px;">
              👤 <strong>Apoderado Titular:</strong> ${userData.nombre}<br>
              🎒 <strong>Pupilo Asociado:</strong> ${userData.pupilo}<br>
              📬 <strong>Contacto:</strong> ${userData.email} | ${userData.telefono}<br>
              📊 <strong>Asistencia a Reuniones:</strong> ${userData.asistencia_reuniones}
            </div>

            <!-- DESCARGA DE RICE Y CERTIFICADO DE RECEPCIÓN 2026 -->
            ${(typeof window.generarHtmlBotonCertificadoRICE === 'function') ? window.generarHtmlBotonCertificadoRICE(userData, 'apoderado') : ''}

            <!-- COMPARATIVA NORMATIVA: RICE GENERAL vs RICE EDUCACIÓN PARVULARIA -->
            <div style="background: white; border: 1px solid var(--border-card); border-radius: var(--radius-sm); padding: 14px; margin-top:10px;">
              <h4 style="color:#047857; font-size:0.92rem; font-weight:700; margin-bottom:8px;">⚖️ Marco de Convivencia Educativa por Nivel Educativo</h4>
              
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:10px 12px; border-radius:6px;">
                  <span style="font-size:0.75rem; font-weight:700; color:#15803d;">👶 EDUCACIÓN PARVULARIA (NT1 Y NT2)</span>
                  <p style="font-size:0.78rem; color:#166534; margin-top:4px; line-height:1.4;">
                    <strong>Enfoque 100% No Punitivo:</strong> No existen medidas disciplinarias ni sanciones. Se promueve el buen trato, el aprendizaje mediante el juego, la contención afectiva y el aviso temprano al apoderado ante desregulaciones.
                  </p>
                </div>
                <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:10px 12px; border-radius:6px;">
                  <span style="font-size:0.75rem; font-weight:700; color:var(--primary);">🏫 EDUCACIÓN BÁSICA Y MEDIA</span>
                  <p style="font-size:0.78rem; color:var(--text-main); margin-top:4px; line-height:1.4;">
                    <strong>Enfoque Formativo y Restaurativo:</strong> Garantía del debido proceso (Circular 781), diálogo con apoderados, acuerdos de reparación y gradación de medidas ante faltas leves, graves o gravísimas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="profile-info-sidebar">
            <div class="sabias-que-card" style="margin-top: 0; border-left-color: #047857;">
              <div class="sabias-que-icon" style="color:#047857;">💡</div>
              <div class="sabias-que-content">
                <h4 style="color:#047857;">¿Sabías que...? (Debido Proceso)</h4>
                <p>Antes de aplicar cualquier medida a su pupilo, el RICE exige citarle formalmente para garantizar su derecho a ser escuchado (Bilateralidad). El apoderado es socio estratégico en la formación.</p>
              </div>
            </div>
            <div style="background: #ecfdf5; border-radius:var(--radius-md); padding:14px; border:1px solid #a7f3d0; border-left: 4px solid #047857;">
              <h4 style="color: #047857; font-size: 0.88rem; font-weight:600; margin-bottom:4px;">Derechos del Apoderado (Circular 781)</h4>
              <p style="font-size:0.8rem; color:#064e3b; line-height:1.4; margin:0;">
                Tiene derecho a ser informado oportunamente de la convivencia y desarrollo de su pupilo, así como a ser atendido con respeto y canalizar sus inquietudes por el conducto regular.
              </p>
            </div>
          </div>
        </div>

        <div id="apo-firma" class="role-view-section">
          <div style="background: var(--bg-card); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-card); margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 1.25rem; font-weight: 700; margin-bottom: 6px;">🖋️ Recepción y Firma de Circulares Oficiales</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.4; margin-bottom: 12px;">
              De acuerdo con la <strong>Circular N° 781 de la Superintendencia de Educación</strong>, todo apoderado debe ser instruido y notificado formalmente acerca de las normas y protocolos del establecimiento, firmando su recepción y compromiso.
            </p>
            
            <div style="background: hsl(var(--primary-hue), 60%, 96%); border-radius: var(--radius-sm); padding: 14px; border-left: 4px solid var(--primary); font-size: 0.82rem; line-height: 1.5; color: var(--primary); margin-bottom: 16px;">
              <strong>Resumen de Compromisos que Adquiere el Apoderado:</strong>
              <div style="margin-top: 6px;">• <strong>1. Corresponsabilidad de Asistencia (Circular 781):</strong> Asegurar la asistencia y puntualidad de su pupilo al establecimiento (ingreso 08:30 hrs).</div>
              <div style="margin-top: 4px;">• <strong>2. Respeto al Conducto Regular (Ley 20.536):</strong> Resolver cualquier duda o conflicto mediante los canales y personal del liceo (Profesor Jefe, Convivencia Educativa o Dirección), manteniendo un trato respetuoso.</div>
              <div style="margin-top: 4px;">• <strong>3. Convivencia Digital:</strong> Fomentar el uso ético y pacífico de las redes sociales y grupos de apoderados, evitando la difusión de información falsa o ciberacoso hacia miembros del liceo.</div>
            </div>
            
            <h4 style="font-size:0.95rem; margin-bottom:8px; color:var(--primary); font-weight: 700;">Acta de Compromiso de Convivencia Educativa (RICE 2026)</h4>
            <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:16px;">
              Declaro haber recibido, leído y aceptado el Reglamento Interno de Convivencia Educativa (RICE 2026) del Liceo de Huara correspondiente a mi pupilo <strong>${userData.pupilo}</strong>.
            </p>
            
            <div class="signature-box" id="sig-box" data-signer="${userData.nombre}" style="margin-bottom: 14px;">
              <span id="sig-text">👉 Haz clic aquí para estampar tu firma digital 👈</span>
            </div>

            <button class="btn-primary" id="btn-save-signature" disabled style="opacity: 0.5; background:var(--text-muted); margin-top: 4px;">
              Confirmar Envío de Compromiso a Inspectoría General
            </button>
          </div>

          <!-- Historial de Circulares/Actas Firmadas -->
          <div style="background: var(--bg-card); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-card);">
            <h4 style="color: var(--primary); font-size: 1.05rem; font-weight: 700; margin-bottom: 10px;">📋 Historial de Documentos Recibidos y Firmados</h4>
            <div style="overflow-x: auto;">
              <table class="firma-actas-table">
                <thead>
                  <tr>
                    <th>Documento Oficial</th>
                    <th>Fecha de Firma</th>
                    <th>Código de Verificación</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody id="firma-actas-tbody">
                  <tr>
                    <td><strong>Reglamento Interno RICE 2026</strong></td>
                    <td id="historial-rice-fecha">Pendiente de firma</td>
                    <td id="historial-rice-hash"><small style="color:var(--text-muted);">Sin registrar</small></td>
                    <td id="historial-rice-estado"><span style="background:hsl(0, 80%, 95%); color:hsl(0, 80%, 35%); padding:2px 8px; border-radius:4px; font-weight:600;">Pendiente</span></td>
                  </tr>
                  <tr>
                    <td><strong>Protocolo de Dispositivos Móviles (Ley 21.801)</strong></td>
                    <td>04/03/2026 09:14 hrs</td>
                    <td><code>sha256-4f9e1e2d...</code></td>
                    <td><span style="background:#ecfdf5; color:#047857; padding:2px 8px; border-radius:4px; font-weight:600;">Recibido</span></td>
                  </tr>
                  <tr>
                    <td><strong>Protocolo de Transporte Escolar Rural 2026</strong></td>
                    <td>04/03/2026 09:15 hrs</td>
                    <td><code>sha256-a7c3d2e1...</code></td>
                    <td><span style="background:#ecfdf5; color:#047857; padding:2px 8px; border-radius:4px; font-weight:600;">Recibido</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div id="apo-crianza" class="role-view-section">
          <h3 style="color: var(--primary); font-size: 1.2rem; font-weight: 600; margin-bottom: 4px;">👨‍👩‍👧‍👦 Consejos de Crianza Respetuosa</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 12px;">
            Material dinámico elaborado por el equipo psicopedagógico en base a los criterios de parentalidad positiva y convivencia educativa:
          </p>

          <!-- MÓDULO DE PICTOGRAMAS Y AUDIO NARRADO PARA EDUCACIÓN PARVULARIA (NT1 Y NT2) -->
          ${(typeof window.generarHtmlModuloParvularia === 'function') ? window.generarHtmlModuloParvularia() : ''}

          <div id="crianza-tips-container" style="display: flex; flex-direction: column; gap: 12px; margin-top:14px;">
            <!-- Se cargan dinámicamente -->
          </div>
          <div style="margin-top: 8px;">
            <button class="btn-primary" id="btn-shuffle-crianza" style="margin-top: 10px; width: auto; font-size: 0.85rem; padding: 8px 16px; display: inline-flex; align-items: center; gap: 6px;">
              🔄 Ver otros consejos
            </button>
          </div>
        </div>

        <div id="apo-asistente" class="role-view-section">
          <div style="padding: 14px 16px 8px; flex-shrink:0;">
            <h3 style="color: var(--primary); font-size: 1.2rem; font-weight: 600; margin-bottom: 4px;">👨‍🏫 Orientador de Convivencia — Apoderados</h3>
            <p style="color: var(--text-muted); font-size: 0.82rem; margin-bottom: 6px; line-height:1.4;">
              Consulte sus dudas sobre el RICE, protocolos, embarazo y derechos de su pupilo. Las respuestas citan el artículo o protocolo correspondiente.
            </p>
          </div>
          <div class="chat-wrapper">
            <div id="apo-chat-messages" aria-live="polite" style="flex:1; min-height:0; padding:16px; overflow-y:auto; display:flex; flex-direction:column; gap:12px; font-size:0.85rem;">
              <div class="chat-bubble bot-bubble" style="align-self:flex-start; background:var(--primary); color:white; padding:10px 14px; border-radius:var(--radius-md) var(--radius-md) var(--radius-md) 0; max-width:90%; line-height:1.5;">
                Hola, <strong>${userData.nombre.split(' ')[0]}</strong>. Soy el Orientador de Convivencia del Liceo de Huara. Estoy aquí para orientarle sobre el reglamento, protocolos y los pasos a seguir ante cualquier situación que afecte a su pupilo/a. ¿En qué le puedo ayudar hoy?
              </div>
            </div>
            <div id="apo-chat-typing" aria-live="assertive" style="display:none; padding:8px 14px; align-self:flex-start; background:rgba(0,0,0,0.06); border-radius:20px; font-size:0.8rem; color:var(--text-muted); margin-left:16px; margin-bottom:8px;">
              👨‍🏫 Consultando el RICE...
            </div>
            <form id="apo-chat-form" style="display:flex; border-top:1px solid var(--border-card); background:rgba(255,255,255,0.95); padding:10px 12px; gap:8px; flex-shrink:0;">
              <input type="text" id="apo-chat-input" class="form-control" placeholder="Escribe tu consulta como apoderado/a..." aria-label="Consulta del apoderado" style="flex:1; border-radius:var(--radius-sm); border:1px solid var(--border-card); font-size:0.88rem; padding:8px 12px; background:white;" required autocomplete="off">
              <button type="submit" class="btn-primary" style="margin-top:0; width:auto; padding:8px 16px; border-radius:var(--radius-sm);">Enviar</button>
            </form>
          </div>

          <!-- Marca e Insignia Inferior para Espaciado de Scroll -->
          <div class="chat-footer-brand" style="margin-top: 20px; margin-bottom: 90px; padding: 14px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; border-top: 1px dashed var(--border-card); width: 100%; max-width: 960px; margin-left: auto; margin-right: auto;">
            <img src="assets/branding/Logo oficial de toda la plataforma y proyecto.png" alt="Logo MiRice" style="height: 28px; width: auto; object-fit: contain;">
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">MiRice 2026 • Orientación de Convivencia Educativa Liceo de Huara</span>
          </div>
        </div>
      `;

      userRoleTitle.textContent = userData.nombre;
      userSubtitle.textContent = `Apoderado • Liceo de Huara`;

    } else if (role === 'funcionario' && userData) {
      const esCoordinadorODirectora = (userData.cargo.toLowerCase().includes('convivencia') || userData.cargo.toLowerCase().includes('directora'));
      
      let bandejaDenunciasHtml = "";
      if (esCoordinadorODirectora) {
        const denuncias = JSON.parse(localStorage.getItem("mirice_denuncias_estudiantes")) || [];
        let filasDenuncia = "";
        if (denuncias.length === 0) {
          filasDenuncia = `<tr><td colspan="4" style="padding:12px; text-align:center; color:var(--text-muted); font-size:0.8rem;">No hay reportes de vulneración ingresados por estudiantes.</td></tr>`;
        } else {
          denuncias.forEach(d => {
            filasDenuncia += `
              <tr style="border-bottom:1px solid var(--border-card);">
                <td style="padding:10px 12px; font-weight:500;">${d.fecha}</td>
                <td style="padding:10px 12px;">${d.informante_nombre}</td>
                <td style="padding:10px 12px; color:var(--accent); font-weight:600;">${d.asunto}</td>
                <td style="padding:10px 12px;"><button class="btn-primary" style="margin-top:0; padding:4px 8px; font-size:0.75rem; width:auto; display:inline-block;" onclick="alert('Relato Confidencial Estudiante:\\n\\n${d.descripcion.replace(/'/g, "\\'").replace(/"/g, '\\"')}\\n\\nRed de Apoyo: ${d.red_apoyo}')">Ver Detalles</button></td>
              </tr>
            `;
          });
        }
        
        bandejaDenunciasHtml = `
          <div class="welcome-card" style="background: hsl(0, 75%, 98%); border: 1px solid hsl(0, 80%, 90%); padding: 20px; border-radius: var(--radius-md); margin-top:20px;">
            <h4 style="color: hsl(0, 80%, 30%); font-size: 0.95rem; font-weight: 600; margin-bottom: 8px;">📩 Bandeja de Informaciones Confidenciales (Estudiantes)</h4>
            <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 12px; line-height: 1.4;">
              Esta sección es estrictamente confidencial y visible únicamente para el Coordinador de Convivencia Educativa y Dirección.
            </p>
            <div style="background:white; border-radius:var(--radius-sm); border:1px solid var(--border-card); overflow:hidden;">
              <table style="width:100%; border-collapse:collapse; font-size:0.8rem; text-align:left;">
                <thead>
                  <tr style="background:hsl(0, 75%, 95%); color:hsl(0, 80%, 25%); font-weight:600; border-bottom:1px solid var(--border-card);">
                    <th style="padding:8px 12px;">Fecha</th>
                    <th style="padding:8px 12px;">Estudiante</th>
                    <th style="padding:8px 12px;">Asunto</th>
                    <th style="padding:8px 12px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${filasDenuncia}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }

      navigationHtml = `
        <div class="role-tabs">
          <button class="tab-btn active" data-tab="fun-inicio"><span class="tab-icon">🏠</span>Inicio</button>
          <button class="tab-btn" data-tab="fun-reporte"><span class="tab-icon">📓</span>Bitácora de Incidentes</button>
          <button class="tab-btn" data-tab="fun-mis-bitacoras"><span class="tab-icon">📑</span>Mis Reportes</button>
          <button class="tab-btn" data-tab="fun-protocolos"><span class="tab-icon">⚖️</span>Protocolos</button>
          <button class="tab-btn" data-tab="fun-asistente"><span class="tab-icon">👨‍🏫</span>Orientador RICE</button>
        </div>
      `;

      bodyHtml = `
        <div id="fun-inicio" class="role-view-section active profile-main-grid">
          <div class="welcome-card" style="background: var(--bg-card); padding: 18px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-card);">
            <h3 style="font-size: 1.2rem; color: var(--primary); margin-bottom: 6px;">Hola, ${userData.nombre} 👋</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.4; margin-bottom: 12px;">
              Consola de funcionarios del Liceo de Huara. Ficha registrada:
            </p>
            <div style="background: rgba(255,255,255,0.4); padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-card); font-size: 0.82rem; line-height: 1.6; color: var(--text-main); margin-bottom: 12px;">
              👤 <strong>Funcionario:</strong> ${userData.nombre}<br>
              💼 <strong>Cargo Oficial:</strong> <span style="color:var(--accent); font-weight:bold;">${userData.cargo}</span><br>
              🏢 <strong>Departamento:</strong> ${userData.departamento}<br>
              📬 <strong>Email:</strong> ${userData.email}<br>
              📌 <strong>Registro Sostenedor:</strong> ${userData.registro_docente}
            </div>

            <!-- El panel de exportación de bitácora para el Coordinador de
                 Convivencia se retiró de acá el 02-ago-2026: usaba datos
                 locales del navegador, no los reales de Supabase. La versión
                 real (con sesión verificada en el servidor) está en
                 admin.html, enlazado desde la pantalla de inicio. -->

            <!-- TABLERO VISUAL DE TENDENCIAS DE CLIMA PARA DIRECCIÓN/COORDINACIÓN -->
            ${(typeof window.generarHtmlTableroDireccionClima === 'function') ? window.generarHtmlTableroDireccionClima(userData) : ''}

            <!-- BOTÓN OFICIAL DE DESCARGA CERTIFICADO DE RECEPCIÓN RICE 2026 -->
            ${(typeof window.generarHtmlBotonCertificadoRICE === 'function') ? window.generarHtmlBotonCertificadoRICE(userData, 'funcionario') : ''}

            <!-- TERMÓMETRO DE CLIMA ESCOLAR SEMANAL PARA FUNCIONARIOS -->
            ${(typeof window.generarHtmlTermometroClima === 'function') ? window.generarHtmlTermometroClima('funcionario', userData.rut_limpio) : ''}

            <div>
              <a href="fuentes/RICE%20LICEO%20DE%20HUARA%202026.pdf" download class="btn-primary" style="display:inline-flex; align-items:center; gap:8px; text-decoration:none; padding:8px 14px; font-size:0.8rem; font-weight:bold; border-radius:var(--radius-sm); width:auto; margin-top:10px;">
                📥 Descargar RICE Completo (PDF)
              </a>
            </div>
          </div>

          <div class="profile-info-sidebar">
            <div class="sabias-que-card" style="margin-top: 0;">
              <div class="sabias-que-icon">💡</div>
              <div class="sabias-que-content">
                <h4>¿Sabías que...? (Obligación Legal 24h)</h4>
                <p>Ante hechos de posible delito (sospecha de abuso, microtráfico o agresión grave), todo funcionario debe <strong>denunciar en máximo 24h hábiles</strong> (Art. 175 CPP).</p>
              </div>
            </div>

            <div style="background: hsl(210, 20%, 93%); border-radius:var(--radius-md); padding:14px; border:1px solid var(--border-card); border-left:4px solid var(--accent);">
              <h4 style="color: var(--primary); font-size: 0.88rem; font-weight: 600; margin-bottom:4px;">⚠️ Plazo de Derivación RICE</h4>
              <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4; margin:0;">
                Todo incidente tipificado como <strong>sospecha de maltrato escolar</strong> debe ser canalizado en la bitácora el mismo día del hecho.
              </p>
            </div>
          </div>

          ${bandejaDenunciasHtml}
        </div>

        <div id="fun-reporte" class="role-view-section">
          <div class="bitacora-success" id="bitacora-success-msg">
            ✔️ Incidente registrado en la Bitácora con éxito. Este reporte es de carácter <strong>estrictamente interno</strong>. No se han enviado alertas a estudiantes ni apoderados.
          </div>

          <form id="incident-form" novalidate>

            <!-- SECCIÓN 1: Datos del Reporte -->
            <div style="margin-bottom:16px;">
              <div class="form-section-header">
                <span class="section-num">1</span>
                📋 Datos del Reporte y Contexto
              </div>
              <div class="form-section-body">
                <div class="form-group">
                  <label for="inc-reporta">Funcionario que Reporta</label>
                  <input type="text" id="inc-reporta" class="form-control" value="${userData.nombre}" readonly style="background:rgba(0,0,0,0.03); color:var(--text-muted);">
                </div>
                <div class="form-group">
                  <label for="inc-estamento">Estamento</label>
                  <select id="inc-estamento" class="form-control select-control" required>
                    <option value="">Seleccione estamento...</option>
                    <option value="Docente">Docente</option>
                    <option value="Asistente de la Educación">Asistente de la Educación</option>
                    <option value="Directivo">Directivo</option>
                  </select>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                  <div class="form-group">
                    <label for="inc-fecha">Fecha del Incidente</label>
                    <input type="date" id="inc-fecha" class="form-control" required>
                  </div>
                  <div class="form-group">
                    <label for="inc-hora">Hora Aproximada</label>
                    <input type="time" id="inc-hora" class="form-control">
                  </div>
                </div>
                <div class="form-group">
                  <label for="inc-lugar">Lugar Específico del Incidente</label>
                  <select id="inc-lugar" class="form-control select-control" required>
                    <option value="">Seleccione lugar...</option>
                    <option>Aula de clases</option>
                    <option>Patio</option>
                    <option>Baños</option>
                    <option>Comedor / Casino</option>
                    <option>Pasillos</option>
                    <option>Entrada / Salida del Liceo</option>
                    <option>Transporte escolar / Recorrido</option>
                    <option>Actividad externa</option>
                    <option>Ciberespacio</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- SECCIÓN 2: Involucrados -->
            <div style="margin-bottom:16px;">
              <div class="form-section-header">
                <span class="section-num">2</span>
                👥 Involucrados (Estudiantes y/o Funcionarios)
              </div>
              <div class="form-section-body" style="position:relative;">
                <div class="form-group" style="position:relative;">
                  <label for="inc-search">Buscar Involucrado por Nombre</label>
                  <small style="color:var(--text-muted); font-size:0.75rem; display:block; margin-bottom:6px;">⚠️ Por privacidad, la búsqueda es exclusivamente por nombre. Prohibido el uso de RUT.</small>
                  <input type="text" id="inc-search" class="form-control" placeholder="Escriba un nombre para buscar..." autocomplete="off">
                  <div id="search-results-dropdown" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid var(--border-card); border-radius:var(--radius-sm); z-index:100; max-height:180px; overflow-y:auto; box-shadow:0 4px 12px rgba(0,0,0,0.1);"></div>
                </div>
                <div id="selected-involucrados" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
                <div class="form-group">
                  <label for="inc-roles">Nombre(s) y Rol en la Situación</label>
                  <small style="color:var(--text-muted); font-size:0.75rem; display:block; margin-bottom:6px;">Indique el nombre y su rol aparente (Ej: Protagonista, Afectado, Espectador activo).</small>
                  <textarea id="inc-roles" class="form-control" rows="2" placeholder="Ej: Sebastián Torres — Protagonista, María Paz González — Afectada"></textarea>
                </div>
              </div>
            </div>

            <!-- SECCIÓN 3: Tipificación -->
            <div style="margin-bottom:16px;">
              <div class="form-section-header">
                <span class="section-num">3</span>
                🏷️ Tipificación del Incidente (Alineado al RICE)
              </div>
              <div class="form-section-body">
                <div style="background:hsl(210,30%,97%); border-radius:var(--radius-sm); padding:10px 12px; margin-bottom:4px;">
                  <p style="font-size:0.8rem; font-weight:700; color:var(--primary); margin-bottom:6px;">A — Faltas a las Normas de Aula (Leves)</p>
                  <div class="checkbox-group">
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Interrupciones constantes"> Interrupciones constantes</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Uso de celular en clases"> Uso de celular en clases</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Negarse a trabajar"> Negarse a trabajar</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Vocabulario inadecuado"> Vocabulario inadecuado</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Atrasos reiterados"> Atrasos reiterados</label>
                  </div>
                </div>
                <div style="background:hsl(38,90%,97%); border-radius:var(--radius-sm); padding:10px 12px; margin-bottom:4px;">
                  <p style="font-size:0.8rem; font-weight:700; color:hsl(28,80%,30%); margin-bottom:6px;">B — Conflictos de Convivencia (Graves)</p>
                  <div class="checkbox-group">
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Insultos entre pares"> Insultos entre pares</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Burlas y rumores"> Burlas / rumores</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Agresión física leve (empujones)"> Agresión física leve (empujones)</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Daño a infraestructura o material ajeno"> Daño a infraestructura o material ajeno</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Discriminación"> Discriminación</label>
                  </div>
                </div>
                <div style="background:hsl(0,80%,97%); border-radius:var(--radius-sm); padding:10px 12px; margin-bottom:4px;">
                  <p style="font-size:0.8rem; font-weight:700; color:hsl(0,80%,30%); margin-bottom:6px;">C — Vulneraciones o Faltas Gravísimas</p>
                  <div class="checkbox-group">
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Agresión física con lesiones"> Agresión física con lesiones</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Sospecha de acoso escolar (Bullying)"> Sospecha de acoso escolar (Bullying)</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Ciberacoso"> Ciberacoso</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Porte de elementos peligrosos"> Porte de elementos peligrosos</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Connotación sexual"> Connotación sexual</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Consumo/porte de sustancias"> Consumo / porte de sustancias</label>
                  </div>
                </div>
                <div style="background:hsl(270,60%,97%); border-radius:var(--radius-sm); padding:10px 12px;">
                  <p style="font-size:0.8rem; font-weight:700; color:hsl(270,60%,30%); margin-bottom:6px;">D — Emergencias de Salud / Emocionales</p>
                  <div class="checkbox-group">
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Desregulación emocional severa"> Desregulación emocional severa</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Crisis de pánico"> Crisis de pánico</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Accidente escolar"> Accidente escolar</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Embarazo, maternidad o paternidad (Protocolo 9)"> Embarazo / Maternidad / Paternidad (Protocolo 9)</label>
                    <label class="checkbox-item"><input type="checkbox" name="tipificacion" value="Sospecha de vulneración de derechos (VIF, negligencia)"> Sospecha de vulneración de derechos (VIF, negligencia)</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- SECCIÓN 4: Descripción y Evidencia -->
            <div style="margin-bottom:16px;">
              <div class="form-section-header">
                <span class="section-num">4</span>
                📝 Descripción Objetiva y Evidencia
              </div>
              <div class="form-section-body">
                <div class="form-group">
                  <label for="inc-desc">Relato de los Hechos</label>
                  <small style="color:var(--text-muted); font-size:0.75rem; display:block; margin-bottom:6px;">Describa lo que usted vio y escuchó de manera objetiva, sin emitir juicios de valor ni diagnósticos. Mencione frases literales si es necesario.</small>
                  <textarea id="inc-desc" class="form-control" rows="4" placeholder="Describa los hechos observados de forma objetiva..." required></textarea>
                </div>
                <div class="form-group">
                  <label for="inc-files">Adjuntar Archivos / Evidencias (Peso total máximo: 10 MB)</label>
                  <input type="file" id="inc-files" class="form-control" multiple style="padding:6px 12px;">
                  <small id="inc-files-error" style="color:red; font-size:0.75rem; display:none; margin-top:4px;"></small>
                </div>
              </div>
            </div>

            <!-- SECCIÓN 5: Abordaje Inicial -->
            <div style="margin-bottom:16px;">
              <div class="form-section-header">
                <span class="section-num">5</span>
                🛡️ Abordaje Inicial (Acciones Formativas In Situ)
              </div>
              <div class="form-section-body">
                <div class="checkbox-group">
                  <label class="checkbox-item"><input type="checkbox" name="abordaje" value="Diálogo reflexivo / Llamado de atención verbal"> Diálogo reflexivo / Llamado de atención verbal</label>
                  <label class="checkbox-item"><input type="checkbox" name="abordaje" value="Contención emocional inicial"> Contención emocional inicial</label>
                  <label class="checkbox-item"><input type="checkbox" name="abordaje" value="Separación física preventiva de los involucrados"> Separación física preventiva de los involucrados</label>
                  <label class="checkbox-item"><input type="checkbox" name="abordaje" value="Mediación rápida entre pares"> Mediación rápida entre pares</label>
                  <label class="checkbox-item"><input type="checkbox" name="abordaje" value="Reubicación dentro del aula"> Reubicación dentro del aula</label>
                  <label class="checkbox-item"><input type="checkbox" name="abordaje" value="Retiro temporal de un objeto disruptivo"> Retiro temporal de un objeto disruptivo</label>
                  <label class="checkbox-item"><input type="checkbox" name="abordaje" value="No fue posible intervenir en el momento"> No fue posible intervenir en el momento</label>
                </div>
              </div>
            </div>

            <!-- SECCIÓN 6: Derivación -->
            <div style="margin-bottom:16px;">
              <div class="form-section-header">
                <span class="section-num">6</span>
                🔀 Derivación y Seguimiento
              </div>
              <div class="form-section-body">
                <div class="form-group">
                  <label>¿La situación requiere derivación o seguimiento especializado?</label>
                  <div style="display:flex; gap:16px; margin-top:8px;">
                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.88rem;">
                      <input type="radio" name="requiere-derivacion" value="si" style="accent-color:var(--primary); width:16px; height:16px;"> Sí
                    </label>
                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.88rem;">
                      <input type="radio" name="requiere-derivacion" value="no" style="accent-color:var(--primary); width:16px; height:16px;"> No (el formulario finaliza)
                    </label>
                  </div>
                </div>

                <!-- Panel condicional de derivación -->
                <div class="derivacion-panel" id="derivacion-panel">
                  <p style="font-size:0.82rem; font-weight:700; color:hsl(28,80%,30%); margin-bottom:10px;">¿A qué unidad o profesional deriva esta situación?</p>
                  <div class="checkbox-group" style="margin-bottom:14px;">
                    <label class="checkbox-item"><input type="checkbox" name="derivacion" value="Convivencia Educativa (Mediación, acoso, desregulación)"> Convivencia Educativa (Mediación, acoso, desregulación)</label>
                    <label class="checkbox-item"><input type="checkbox" name="derivacion" value="Inspectoría General (Medidas disciplinarias / asistencia)"> Inspectoría General (Medidas disciplinarias / asistencia)</label>
                    <label class="checkbox-item"><input type="checkbox" name="derivacion" value="Orientación / Psicología (Apoyo socioemocional, vocacional)"> Orientación / Psicología (Apoyo socioemocional, vocacional)</label>
                    <label class="checkbox-item"><input type="checkbox" name="derivacion" value="Programa PIE (Evaluación o seguimiento de estudiante PIE)"> Programa PIE (Evaluación o seguimiento de estudiante PIE)</label>
                    <label class="checkbox-item"><input type="checkbox" name="derivacion" value="UTP (Temas pedagógicos o evaluación)"> UTP (Temas pedagógicos o evaluación)</label>
                    <label class="checkbox-item"><input type="checkbox" name="derivacion" value="Dirección"> Dirección</label>
                  </div>
                  <div class="form-group">
                    <label for="inc-prioridad">Nivel de Prioridad Sugerido</label>
                    <select id="inc-prioridad" class="form-control select-control">
                      <option value="">Seleccione prioridad...</option>
                      <option value="Baja">🟢 Baja — Para monitoreo preventivo</option>
                      <option value="Media">🟡 Media — Requiere citación a apoderado en la semana</option>
                      <option value="Alta">🔴 Alta — Requiere intervención inmediata</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón de Envío -->
            <button type="submit" class="btn-primary" style="margin-top:4px;">
              📓 Registrar en Bitácora Oficial
            </button>
          </form>
        </div>

        <div id="fun-protocolos" class="role-view-section">
          ${obtenerProtocolExplorerHtml('fun')}
        </div>

        <div id="fun-asistente" class="role-view-section">
          <div style="padding: 14px 16px 8px; flex-shrink:0;">
            <h3 style="color: var(--primary); font-size: 1.2rem; font-weight: 600; margin-bottom: 4px;">👨‍🏫 Orientador de Convivencia — Funcionarios</h3>
            <p style="color: var(--text-muted); font-size: 0.82rem; margin-bottom: 6px; line-height:1.4;">
              Consulte protocols, conductos regulares, derivación de embarazo y obligaciones legales ante situaciones de convivencia educativa.
            </p>
            <div style="background: hsl(210, 30%, 96%); border-left: 4px solid var(--primary); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 0.78rem; color: var(--text-main); line-height: 1.5; flex-shrink:0;">
              ⚖️ <strong>Uso exclusivo docente:</strong> Las respuestas citan el conducto regular, obligaciones legales y los protocolos del RICE aplicables. No sustituye la asesoría jurídica formal.
            </div>
          </div>
          <div class="chat-wrapper">
            <div id="fun-chat-messages" aria-live="polite" style="flex:1; min-height:0; padding:16px; overflow-y:auto; display:flex; flex-direction:column; gap:12px; font-size:0.85rem;">
              <div class="chat-bubble bot-bubble" style="align-self:flex-start; background:var(--primary); color:white; padding:10px 14px; border-radius:var(--radius-md) var(--radius-md) var(--radius-md) 0; max-width:90%; line-height:1.5;">
                Buenos días, <strong>${userData.nombre.split(' ')[0]}</strong>. Soy el Orientador de Convivencia institucional. Puede consultarme sobre los protocolos de actuación, conducto regular, obligaciones legales, casos de embarazo/maternidad o cualquier duda relacionada con el RICE 2026. ¿En qué le puedo orientar?
              </div>
            </div>
            <div id="fun-chat-typing" aria-live="assertive" style="display:none; padding:8px 14px; align-self:flex-start; background:rgba(0,0,0,0.06); border-radius:20px; font-size:0.8rem; color:var(--text-muted); margin-left:16px; margin-bottom:8px;">
              👨‍🏫 Consultando los protocolos del RICE...
            </div>
            <form id="fun-chat-form" style="display:flex; border-top:1px solid var(--border-card); background:rgba(255,255,255,0.95); padding:10px 12px; gap:8px; flex-shrink:0;">
              <input type="text" id="fun-chat-input" class="form-control" placeholder="Consulta de protocolo o conducto regular..." aria-label="Consulta del funcionario" style="flex:1; border-radius:var(--radius-sm); border:1px solid var(--border-card); font-size:0.88rem; padding:8px 12px; background:white;" required autocomplete="off">
              <button type="submit" class="btn-primary" aria-label="Enviar consulta del funcionario" style="margin-top:0; width:auto; padding:8px 16px; border-radius:var(--radius-sm);">Enviar</button>
            </form>
          </div>

          <!-- Marca e Insignia Inferior para Espaciado de Scroll -->
          <div class="chat-footer-brand" style="margin-top: 20px; margin-bottom: 90px; padding: 14px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; border-top: 1px dashed var(--border-card); width: 100%; max-width: 960px; margin-left: auto; margin-right: auto;">
            <img src="assets/branding/Logo oficial de toda la plataforma y proyecto.png" alt="Logo MiRice" style="height: 28px; width: auto; object-fit: contain;">
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">MiRice 2026 • Orientación de Convivencia Educativa Liceo de Huara</span>
          </div>
        </div>
      `;

      userRoleTitle.textContent = userData.nombre;
      userSubtitle.textContent = `${userData.cargo}`;
    }

    // Inyectar HTML en el layout con espacio suficiente de desplazamiento inferior
    dashboardContent.innerHTML = `
      ${navigationHtml}
      <div class="dashboard-inner-content" style="padding-top: 16px; padding-bottom: 120px;">
        ${bodyHtml}
      </div>
    `;

    // Vincular eventos dinámicos creados
    vincularEventosInteractivos(role, userData);

    // Ocultar pantallas de origen y el modal legal, y desplegar el dashboard
    roleSelectionScreen.classList.remove('active');
    roleLoginScreen.classList.remove('active');
    const lirmiModal = document.getElementById('lirmi-notice-modal');
    if (lirmiModal) {
      lirmiModal.classList.remove('visible');
      lirmiModal.classList.add('hidden');
    }
    
    setTimeout(() => {
      roleSelectionScreen.style.display = 'none';
      roleLoginScreen.style.display = 'none';
      
      dashboardLayout.style.display = 'flex';
      setTimeout(() => {
        dashboardLayout.classList.add('active');

        // Onboarding de Avatar para Estudiantes en su primer inicio de sesión
        if (role === 'estudiante' && userData) {
          const rutKey = window.obtenerRutKeySeguro(userData);
          const onboardingDone = localStorage.getItem('mirice_avatar_selected_' + rutKey);
          if (!onboardingDone) {
            setTimeout(() => {
              if (typeof window.mostrarOnboardingAvatarModal === 'function') {
                window.mostrarOnboardingAvatarModal(userData);
              }
            }, 350);
          }
        }

        // Si se ingresó desde una Notificación Push Nativa diaria
        if (window.location.search.includes('notif=daily')) {
          setTimeout(() => {
            if (typeof window.mostrarModalNotificacionDiaria === 'function') {
              window.mostrarModalNotificacionDiaria(userData);
            }
          }, 600);
        }
      }, 50);
    }, 300);
  }

  // 5. Vincular Eventos Interactivos de las Vistas Dinámicas
  function vincularEventosInteractivos(role, userData) {
    // A. Lógica de Pestañas (Tabs)
    const tabButtons = dashboardContent.querySelectorAll('.tab-btn');
    const sections = dashboardContent.querySelectorAll('.role-view-section');

    const dashboardFooter = dashboardLayout.querySelector('.app-footer');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        sections.forEach(s => {
          s.classList.remove('active');
          s.classList.remove('chat-fullscreen');
          s.style.display = 'none'; // Forzar ocultamiento explícito
        });

        btn.classList.add('active');
        const targetSec = dashboardContent.querySelector(`#${targetTab}`);
        if (targetSec) {
          targetSec.style.display = ''; // Limpiar el display inline para dejar actuar al CSS
          targetSec.classList.add('active');

          // Chat fullscreen: cuando el tab activo es el chat de IA
          const chatTabs = ['est-chat', 'apo-asistente', 'fun-asistente'];
          if (chatTabs.includes(targetTab)) {
            targetSec.classList.add('chat-fullscreen');
            dashboardContent.classList.add('chat-mode');
            if (dashboardFooter) dashboardFooter.style.display = 'none';
          } else {
            dashboardContent.classList.remove('chat-mode');
            if (dashboardFooter) dashboardFooter.style.display = '';
          }
        }

        // Inicializar exploradores de protocolos al abrir
        if (targetTab === 'est-rice') {
          setTimeout(() => cambiarProtocoloVisualizado('atrasos', 'est'), 50);
        } else if (targetTab === 'fun-protocolos') {
          setTimeout(() => cambiarProtocoloVisualizado('atrasos', 'fun'), 50);
        }
      });
    });


    // B. Lógica de Acordeón y Chatbot (Estudiante)
    if (role === 'estudiante') {
      const headers = dashboardContent.querySelectorAll('.accordion-header');
      headers.forEach(header => {
        header.addEventListener('click', () => {
          const item = header.parentElement;
          const content = header.nextElementSibling;
          const isOpen = item.classList.contains('open');

          dashboardContent.querySelectorAll('.accordion-item').forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('open');
              otherItem.querySelector('.accordion-content').style.maxHeight = null;
            }
          });

          if (isOpen) {
            item.classList.remove('open');
            content.style.maxHeight = null;
          } else {
            item.classList.add('open');
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
      });

      // Lógica de Chatbot RICE Inteligente
      const chatForm = dashboardContent.querySelector('#chat-form');
      const chatInput = dashboardContent.querySelector('#chat-input');
      const chatMessages = dashboardContent.querySelector('#chat-messages');
      const typingIndicator = dashboardContent.querySelector('#chat-typing-indicator');

      if (chatForm && chatInput && chatMessages && typingIndicator) {
        chatForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const query = chatInput.value.trim();
          if (!query) return;

          chatInput.value = '';

          // 1. Burbuja Usuario
          agregarBurbuja(query, 'user');

          // El nuevo bot.js maneja inteligentemente todos los casos sensibles (acoso, drogas, armas, etc.)
          // con empatía y contexto — no se necesita interceptor previo

          // 2. Indicador Carga
          typingIndicator.style.display = 'block';
          chatMessages.scrollTop = chatMessages.scrollHeight;

          // 3. Consultar Gemini API RAG
          const respuesta = await RICE_Bot.preguntar(query, false, 'estudiante', userData);

          // 4. Ocultar Carga
          typingIndicator.style.display = 'none';

          // 5. Burbuja Bot
          if (respuesta.exito) {
            if (respuesta.esDuplicado) {
              agregarBurbuja(respuesta.mensaje, 'bot');
              
              // Renderizar botones de opción para duplicados
              const btnContainer = document.createElement('div');
              btnContainer.style.display = 'flex';
              btnContainer.style.gap = '10px';
              btnContainer.style.marginTop = '12px';
              
              const btnNoSolucion = document.createElement('button');
              btnNoSolucion.textContent = '❌ Aún no se soluciona';
              btnNoSolucion.style.background = 'hsl(0, 75%, 95%)';
              btnNoSolucion.style.color = 'hsl(0, 80%, 40%)';
              btnNoSolucion.style.border = '1px solid hsl(0, 80%, 90%)';
              btnNoSolucion.style.padding = '8px 12px';
              btnNoSolucion.style.borderRadius = 'var(--radius-sm)';
              btnNoSolucion.style.cursor = 'pointer';
              btnNoSolucion.style.fontSize = '0.8rem';
              btnNoSolucion.style.fontWeight = 'bold';
              
              const btnNuevo = document.createElement('button');
              btnNuevo.textContent = '🔄 Es algo nuevo';
              btnNuevo.style.background = 'hsl(150, 60%, 95%)';
              btnNuevo.style.color = 'hsl(150, 80%, 25%)';
              btnNuevo.style.border = '1px solid hsl(150, 80%, 90%)';
              btnNuevo.style.padding = '8px 12px';
              btnNuevo.style.borderRadius = 'var(--radius-sm)';
              btnNuevo.style.cursor = 'pointer';
              btnNuevo.style.fontSize = '0.8rem';
              btnNuevo.style.fontWeight = 'bold';
              
              btnNoSolucion.addEventListener('click', () => {
                btnNoSolucion.disabled = true;
                btnNuevo.disabled = true;
                agregarBurbuja('Elegiste: Aún no se soluciona', 'user');
                setTimeout(() => {
                  agregarBurbuja(`
                    🤖 Lamento que la situación persista.<br><br>
                    Dado que es un caso sin solucionar, el reglamento exige la intervención del equipo de Convivencia Educativa. Te recomendamos **acudir presencialmente a la brevedad** con:<br>
                    • El Coordinador de Convivencia Educativa (**don Omar Contreras**)<br>
                    • El Inspector General (**don Pedro Cáceres**)<br><br>
                    Ellos tomarán registro formal y activarán las derivaciones y apoyos correspondientes de forma confidencial y coordinada.
                  `, 'bot');
                  chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 400);
              });
              
              btnNuevo.addEventListener('click', async () => {
                btnNoSolucion.disabled = true;
                btnNuevo.disabled = true;
                agregarBurbuja('Elegiste: Es algo nuevo', 'user');
                
                // Mostrar indicador de carga
                typingIndicator.style.display = 'block';
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Forzar consulta al bot
                const respuestaForzada = await RICE_Bot.preguntar(query, true, 'estudiante', userData);
                
                typingIndicator.style.display = 'none';
                
                if (respuestaForzada.exito) {
                  agregarBurbuja(respuestaForzada.mensaje, 'bot');
                  
                  if (respuestaForzada.articulosCados && respuestaForzada.articulosCados.length > 0) {
                    renderizarChips(respuestaForzada.articulosCados);
                  }
                } else {
                  agregarBurbuja(respuestaForzada.mensaje, 'error');
                }
                chatMessages.scrollTop = chatMessages.scrollHeight;
              });
              
              btnContainer.appendChild(btnNoSolucion);
              btnContainer.appendChild(btnNuevo);
              
              const burbujas = chatMessages.querySelectorAll('.bot-bubble');
              if (burbujas.length > 0) {
                burbujas[burbujas.length - 1].appendChild(btnContainer);
              }
            } else {
              agregarBurbuja(respuesta.mensaje, 'bot');
            }
          } else {
            agregarBurbuja(respuesta.mensaje, 'error');
          }

          setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }, 50);
        });
      }

      function renderizarChips(articulosCados) {
        const chipContainer = document.createElement('div');
        chipContainer.style.display = 'flex';
        chipContainer.style.gap = '8px';
        chipContainer.style.flexWrap = 'wrap';
        chipContainer.style.marginTop = '8px';
        
        articulosCados.forEach(art => {
          const chip = document.createElement('span');
          chip.textContent = `📍 ${art.titulo.split(':')[0]}`;
          chip.style.fontSize = '0.72rem';
          chip.style.background = 'rgba(255,255,255,0.2)';
          chip.style.border = '1px solid rgba(255,255,255,0.3)';
          chip.style.padding = '4px 8px';
          chip.style.borderRadius = '50px';
          chip.style.color = 'white';
          chip.style.cursor = 'pointer';
          chip.title = art.contenido;
          
          chip.addEventListener('click', () => {
            mostrarDetalleProtocoloModal(art);
          });
          
          chipContainer.appendChild(chip);
        });
        
        const burbujas = chatMessages.querySelectorAll('.bot-bubble');
        if (burbujas.length > 0) {
          burbujas[burbujas.length - 1].appendChild(chipContainer);
        }
      }

      function agregarBurbuja(texto, tipo) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${tipo}-bubble`;
        
        // Alinear burbujas dentro del contenedor flex
        if (tipo === 'user') {
          bubble.style.alignSelf = 'flex-end';
        } else if (tipo === 'bot') {
          bubble.style.alignSelf = 'flex-start';
        } else if (tipo === 'error') {
          bubble.style.alignSelf = 'center';
        }

        bubble.innerHTML = formatMarkdownToHtml(texto);
        chatMessages.appendChild(bubble);
      }
    }

    // C. Lógica de Firma Digital Simulada (Apoderado) y Crianza Positiva
    if (role === 'apoderado') {
      const tipsContainer = dashboardContent.querySelector('#crianza-tips-container');
      const shuffleBtn = dashboardContent.querySelector('#btn-shuffle-crianza');
      
      const consejosCrianza = [
        {
          num: 1,
          titulo: "Validar las Emociones del Estudiante",
          contenido: "Escuche a su hijo/a cuando exprese frustraciones escolares. Evite juzgar de inmediato y diga: 'Entiendo que te sientas así, cuéntame qué pasó'.",
          color: "var(--accent)",
          bg: "hsl(28, 85%, 97%)"
        },
        {
          num: 2,
          titulo: "Establecer Límites Claros y Razonados",
          contenido: "Los límites entregan seguridad. Fije horarios de estudio and desconexión digital mediante acuerdos familiares, explicándoles cómo les beneficia para su descanso.",
          color: "#10b981",
          bg: "hsl(150, 60%, 97%)"
        },
        {
          num: 3,
          titulo: "Resolución Restaurativa de Conflictos",
          contenido: "Fomente la reparación en lugar del castigo. Ante un error en casa, pregunten juntos: '¿Cómo podemos solucionar esto y reparar el daño causado?'.",
          color: "var(--primary)",
          bg: "hsl(215, 60%, 97%)"
        },
        {
          num: 4,
          titulo: "Alianza Colaborativa Escuela-Familia",
          contenido: "Mantenga un trato respetuoso y fluido con el Profesor Jefe y el equipo de apoyo. Resolver dudas de forma pacífica previene malentendidos y cuida el clima escolar.",
          color: "hsl(280, 70%, 45%)",
          bg: "hsl(280, 50%, 97%)"
        },
        {
          num: 5,
          titulo: "Uso Responsable y Ético de Redes",
          contenido: "Utilice los grupos de WhatsApp de apoderados solo para fines informativos y de apoyo escolar. Evite propagar rumores que afecten la convivencia.",
          color: "hsl(340, 80%, 45%)",
          bg: "hsl(340, 60%, 97%)"
        },
        {
          num: 6,
          titulo: "Valorar el Proceso y el Esfuerzo",
          contenido: "Reconozca el esfuerzo diario de su hijo/a en lugar de enfocarse solo en la nota final. El aprendizaje real se da paso a paso y con constancia.",
          color: "var(--accent)",
          bg: "hsl(28, 85%, 97%)"
        },
        {
          num: 7,
          titulo: "Rutinas de Sueño y Concentración",
          contenido: "Dormir lo suficiente es vital para el aprendizaje. Promueva un apagado de pantallas digitales al menos 30 minutos antes de dormir para asegurar un descanso profundo.",
          color: "#10b981",
          bg: "hsl(150, 60%, 97%)"
        },
        {
          num: 8,
          titulo: "Fomentar la Participación Activa",
          contenido: "Incentive a su hijo/a a participar en las actividades extracurriculares del liceo (deportes, talleres, centros de alumnos). Esto mejora su sentido de pertenencia.",
          color: "var(--primary)",
          bg: "hsl(215, 60%, 97%)"
        }
      ];

      function renderizarConsejosCrianza() {
        if (!tipsContainer) return;
        const mezclados = [...consejosCrianza].sort(() => 0.5 - Math.random());
        const seleccionados = mezclados.slice(0, 3);
        
        tipsContainer.innerHTML = seleccionados.map(c => `
          <div style="background: ${c.bg}; padding: 16px; border-radius: var(--radius-md); border-left: 4px solid ${c.color}; transition: var(--transition); box-shadow: 0 4px 12px rgba(0,0,0,0.01);">
            <h4 style="color: ${c.color === 'var(--accent)' ? 'hsl(28, 80%, 30%)' : c.color === 'var(--primary)' ? 'var(--primary)' : c.color}; font-size:0.92rem; font-weight:700; margin-bottom:4px;">${c.titulo}</h4>
            <p style="font-size:0.82rem; color:var(--text-main); line-height:1.45;">${c.contenido}</p>
          </div>
        `).join('');
      }

      renderizarConsejosCrianza();

      if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
          renderizarConsejosCrianza();
          shuffleBtn.style.transform = 'scale(0.95)';
          setTimeout(() => { shuffleBtn.style.transform = 'scale(1)'; }, 100);
        });
      }

      const sigBox = dashboardContent.querySelector('#sig-box');
      const sigText = dashboardContent.querySelector('#sig-text');
      const confirmBtn = dashboardContent.querySelector('#btn-save-signature');
      const signerName = sigBox ? sigBox.getAttribute('data-signer') : userData.nombre;
      const firmaKey = `mirice_firma_apoderado_${userData.rut_limpio}`;
      
      // Comprobar si ya existe una firma guardada en localStorage para este apoderado
      const firmaGuardada = JSON.parse(localStorage.getItem(firmaKey) || 'null');
      let isSigned = !!firmaGuardada;

      if (sigBox && sigText && confirmBtn) {
        if (firmaGuardada) {
          // Restaurar estado de firma permanente
          sigBox.classList.add('signed');
          sigText.innerHTML = `🖋️ <em>${signerName}</em> - Firmado el ${firmaGuardada.fecha} ✔️`;
          confirmBtn.disabled = true;
          confirmBtn.style.opacity = '0.8';
          confirmBtn.style.background = '#047857';
          confirmBtn.textContent = '✔️ Compromiso Firmado y Registrado';

          const histFecha = dashboardContent.querySelector('#historial-rice-fecha');
          const histHash = dashboardContent.querySelector('#historial-rice-hash');
          const histEstado = dashboardContent.querySelector('#historial-rice-estado');
          if (histFecha && histHash && histEstado) {
            histFecha.textContent = firmaGuardada.fecha + ' hrs';
            histHash.innerHTML = `<code>${firmaGuardada.hash || 'sha256-7d8b9c2a...'}</code>`;
            histEstado.innerHTML = '<span style="background:#ecfdf5; color:#047857; padding:2px 8px; border-radius:4px; font-weight:600;">Recibido</span>';
          }
        }

        sigBox.addEventListener('click', () => {
          if (firmaGuardada) return; // Si ya fue registrada previamente, no permitir desmarcar
          if (!isSigned) {
            isSigned = true;
            sigBox.classList.add('signed');
            sigText.innerHTML = `🖋️ <em>${signerName}</em> - Listo para registrar el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ✔️`;
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
            confirmBtn.style.background = 'var(--primary)';
          } else {
            isSigned = false;
            sigBox.classList.remove('signed');
            sigText.innerHTML = `👉 Haz clic aquí para estampar tu firma digital 👈`;
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            confirmBtn.style.background = 'var(--text-muted)';
          }
        });

        confirmBtn.addEventListener('click', () => {
          if (firmaGuardada) return;

          const registroFirma = {
            rut: userData.rut_limpio,
            nombre: signerName,
            fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            hash: `sha256-${Math.random().toString(36).substring(2, 10)}...`
          };

          // Guardar permanentemente en localStorage
          localStorage.setItem(firmaKey, JSON.stringify(registroFirma));

          alert(`Compromiso firmado y registrado permanentemente para ${signerName}. Se ha archivado una copia en la inspectoría general del liceo.`);
          
          confirmBtn.disabled = true;
          confirmBtn.style.opacity = '0.8';
          confirmBtn.style.background = '#047857';
          confirmBtn.textContent = '✔️ Compromiso Firmado y Registrado';

          // Actualizar la tabla de historial en caliente
          const histFecha = dashboardContent.querySelector('#historial-rice-fecha');
          const histHash = dashboardContent.querySelector('#historial-rice-hash');
          const histEstado = dashboardContent.querySelector('#historial-rice-estado');
          if (histFecha && histHash && histEstado) {
            histFecha.textContent = registroFirma.fecha + ' hrs';
            histHash.innerHTML = `<code>${registroFirma.hash}</code>`;
            histEstado.innerHTML = '<span style="background:#ecfdf5; color:#047857; padding:2px 8px; border-radius:4px; font-weight:600;">Recibido</span>';
          }
        });
      }
    }

    // D. Lógica de Formulario de Incidentes (Funcionario) - Bitácora de Incidentes (6 secciones)
    if (role === 'funcionario') {
      const form = dashboardContent.querySelector('#incident-form');
      const successMsg = dashboardContent.querySelector('#bitacora-success-msg');
      const incSearch = form.querySelector('#inc-search');
      const dropdown = form.querySelector('#search-results-dropdown');
      const chipsContainer = form.querySelector('#selected-involucrados');
      const incFiles = form.querySelector('#inc-files');
      const filesError = form.querySelector('#inc-files-error');
      const derivacionPanel = form.querySelector('#derivacion-panel');

      let selectedInvolucrados = [];

      // ── Derivación condicional (radio buttons) ──
      form.querySelectorAll('input[name="requiere-derivacion"]').forEach(radio => {
        radio.addEventListener('change', () => {
          if (radio.value === 'si') {
            derivacionPanel.classList.add('visible');
          } else {
            derivacionPanel.classList.remove('visible');
          }
        });
      });

      // ── Autocompletado con soporte de acentos — ahora busca en el
      //    servidor (28-jul-2026): antes filtraba `estudiantesData` /
      //    `funcionariosData`, cargados enteros en el navegador. ──
      let incSearchDebounce = null;
      incSearch.addEventListener('input', () => {
        const queryOriginal = incSearch.value.trim();
        clearTimeout(incSearchDebounce);

        if (queryOriginal.length < 2) {
          dropdown.style.display = 'none';
          dropdown.innerHTML = '';
          return;
        }

        incSearchDebounce = setTimeout(async () => {
          let resultados = [];
          try {
            const resp = await fetch('/api/buscar-personas?q=' + encodeURIComponent(queryOriginal), {
              headers: { Authorization: 'Bearer ' + (window.miriceSesionToken || '') }
            });
            const data = await resp.json().catch(() => null);
            if (resp.ok && data && data.estado === 'ok') {
              resultados = (data.resultados || []).map(p => ({
                id: p.id,
                nombre: p.nombre,
                detalle: p.rol === 'estudiante' ? p.curso : p.cargo,
                tipo: p.rol === 'estudiante' ? 'Estudiante' : 'Funcionario',
                label: `${p.nombre} - ${p.rol === 'estudiante' ? p.curso : p.cargo}`
              }));
            }
          } catch (e) {
            console.warn('No se pudo buscar en /api/buscar-personas:', e);
          }

          dropdown.innerHTML = '';
          if (resultados.length === 0) {
            dropdown.innerHTML = '<div style="padding:10px; font-size:0.85rem; color:var(--text-muted);">No se encontraron coincidencias</div>';
            dropdown.style.display = 'block';
            return;
          }

          resultados.forEach(res => {
            const item = document.createElement('div');
            item.style.cssText = 'padding:10px 14px; font-size:0.82rem; cursor:pointer; border-bottom:1px solid rgba(0,0,0,0.05); transition:background 0.2s;';
            item.textContent = res.label;
            item.addEventListener('mouseenter', () => { item.style.background = 'rgba(0,0,0,0.04)'; });
            item.addEventListener('mouseleave', () => { item.style.background = 'white'; });
            item.addEventListener('click', () => {
              if (!selectedInvolucrados.some(p => p.id === res.id)) {
                selectedInvolucrados.push(res);
                renderChips();
              }
              incSearch.value = '';
              dropdown.style.display = 'none';
            });
            dropdown.appendChild(item);
          });
          dropdown.style.display = 'block';
        }, 300);
      });

      document.addEventListener('click', (e) => {
        if (e.target !== incSearch && e.target !== dropdown) {
          dropdown.style.display = 'none';
        }
      });

      function renderChips() {
        chipsContainer.innerHTML = '';
        selectedInvolucrados.forEach(p => {
          const chip = document.createElement('span');
          chip.style.cssText = 'display:inline-flex; align-items:center; gap:6px; font-size:0.8rem; background:var(--primary); color:white; padding:4px 10px; border-radius:50px;';
          const text = document.createElement('span');
          text.textContent = `${p.nombre} (${p.tipo})`;
          const closeBtn = document.createElement('span');
          closeBtn.textContent = '✕';
          closeBtn.style.cssText = 'cursor:pointer; font-weight:bold; font-size:0.75rem; opacity:0.8;';
          closeBtn.addEventListener('click', () => {
            selectedInvolucrados = selectedInvolucrados.filter(i => i.id !== p.id);
            renderChips();
          });
          chip.appendChild(text);
          chip.appendChild(closeBtn);
          chipsContainer.appendChild(chip);
        });
      }

      // ── Validar peso máximo de archivos (10MB) ──
      incFiles.addEventListener('change', () => {
        filesError.style.display = 'none';
        let totalSize = 0;
        for (let i = 0; i < incFiles.files.length; i++) { totalSize += incFiles.files[i].size; }
        if (totalSize > 10 * 1024 * 1024) {
          filesError.textContent = `❌ El peso total excede los 10MB permitidos (actual: ${(totalSize / (1024 * 1024)).toFixed(2)}MB).`;
          filesError.style.display = 'block';
          incFiles.value = '';
        }
      });

      // ── Submit del formulario de 6 secciones — ahora se guarda en el
      //    servidor (28-jul-2026), visible para Convivencia desde
      //    cualquier dispositivo, no solo en el de quien lo llena. ──
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (successMsg) successMsg.classList.remove('visible');

        const estamento = form.querySelector('#inc-estamento').value;
        const fecha     = form.querySelector('#inc-fecha').value;
        const lugar     = form.querySelector('#inc-lugar').value;
        const desc      = form.querySelector('#inc-desc').value.trim();

        if (!estamento || !fecha || !lugar || !desc) {
          alert('Por favor complete los campos obligatorios: Estamento, Fecha, Lugar y Relato de los Hechos.');
          return;
        }

        // Recopilar checkboxes
        const tipificacion = [...form.querySelectorAll('input[name="tipificacion"]:checked')].map(c => c.value);
        const abordaje     = [...form.querySelectorAll('input[name="abordaje"]:checked')].map(c => c.value);
        const derivacion   = [...form.querySelectorAll('input[name="derivacion"]:checked')].map(c => c.value);
        const requiereDer  = form.querySelector('input[name="requiere-derivacion"]:checked')?.value || 'no';
        const hora         = form.querySelector('#inc-hora')?.value || '';

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.7'; }

        try {
          const resp = await fetch('/api/incidentes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + (window.miriceSesionToken || '')
            },
            body: JSON.stringify({
              fecha, hora, lugar, estamento,
              involucrados: selectedInvolucrados.map(p => ({ nombre: p.nombre, detalle: p.detalle, tipo: p.tipo })),
              roles_situacion: form.querySelector('#inc-roles')?.value.trim() || '',
              tipificacion,
              descripcion: desc,
              abordaje,
              requiere_derivacion: requiereDer === 'si',
              derivacion_unidades: derivacion,
              autor_nombre: userData.nombre,
              autor_cargo: userData.cargo
            })
          });
          const data = await resp.json().catch(() => null);

          if (!resp.ok || !data || data.estado !== 'ok') {
            alert((data && data.texto) || 'No se pudo registrar el incidente. Intenta de nuevo o avisa directamente a Convivencia Educativa.');
            return;
          }

          console.log('[incidentes] Registrado en el servidor con folio', data.folio);

          // Actualizar tabla de mis bitácoras
          renderizarMisBitacoras();

          // UI de éxito
          if (successMsg) {
            successMsg.classList.add('visible');
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          form.reset();
          selectedInvolucrados = [];
          renderChips();
          if (derivacionPanel) derivacionPanel.classList.remove('visible');
        } catch (err) {
          console.error('Error de red en /api/incidentes:', err);
          alert('No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.');
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; }
        }
      });

      // ── Función para renderizar la tabla Mis Bitácoras y Reportes Enviados
      //    — ahora lee de /api/incidentes (28-jul-2026) ──
      async function renderizarMisBitacoras() {
        const tbody = dashboardContent.querySelector('#tabla-mis-bitacoras-body');
        if (!tbody) return;

        tbody.innerHTML = `<tr><td colspan="6" style="padding:16px; text-align:center; color:var(--text-muted);">Cargando…</td></tr>`;

        let misCasos = [];
        try {
          const resp = await fetch('/api/incidentes', {
            headers: { Authorization: 'Bearer ' + (window.miriceSesionToken || '') }
          });
          const data = await resp.json().catch(() => null);
          if (resp.ok && data && data.estado === 'ok') {
            misCasos = data.incidentes || [];
          }
        } catch (e) {
          console.error('Error al cargar mis bitácoras desde el servidor:', e);
        }

        if (misCasos.length === 0) {
          tbody.innerHTML = `<tr><td colspan="6" style="padding:16px; text-align:center; color:var(--text-muted);">No hay reportes registrados en tu perfil aún.</td></tr>`;
          return;
        }

        tbody.innerHTML = misCasos.map((c, i) => {
          const fechaCaso = c.fecha_incidente || 'Reciente';
          const lugarCaso = c.lugar || 'Liceo de Huara';
          const involucradosStr = c.involucrados && c.involucrados.length > 0
            ? c.involucrados.map(inv => `<strong>${inv.nombre}</strong>`).join(', ')
            : (c.roles_situacion || 'Registrado');
          const tipifStr = (c.tipificacion && c.tipificacion.length) ? c.tipificacion.join(', ') : 'Incidente RICE';
          const derivStr = (c.derivacion_unidades && c.derivacion_unidades.length) ? c.derivacion_unidades.join(', ') : 'Registrado en Consola Admin';

          const bgClass = i % 2 === 0 ? 'white' : 'rgba(0,0,0,0.02)';
          return `
            <tr style="background:${bgClass}; border-bottom:1px solid var(--border-card);">
              <td style="padding:10px;">
                <strong style="color:var(--primary); font-size:0.78rem;">${c.folio}</strong><br>
                <span style="color:var(--text-muted); font-size:0.72rem;">📅 ${fechaCaso}</span>
              </td>
              <td style="padding:10px;">📍 ${lugarCaso}</td>
              <td style="padding:10px;">${involucradosStr}</td>
              <td style="padding:10px;"><span style="background:hsl(210,50%,95%); color:var(--primary); padding:2px 6px; border-radius:4px; font-size:0.75rem;">${tipifStr}</span></td>
              <td style="padding:10px;">${derivStr}</td>
              <td style="padding:10px;">
                <span style="background:#ecfdf5; color:#047857; padding:3px 8px; border-radius:12px; font-weight:700; font-size:0.72rem; display:inline-block;">✔️ Registrado en el servidor</span>
              </td>
            </tr>
          `;
        }).join('');
      }

      // Conectar botón refrescar y ejecución inicial
      const btnRefresh = dashboardContent.querySelector('#btn-refresh-mis-bitacoras');
      if (btnRefresh) btnRefresh.addEventListener('click', renderizarMisBitacoras);
      renderizarMisBitacoras();
    }

    // E. Chatbot Apoderado

    if (role === 'apoderado') {
      const apoForm     = dashboardContent.querySelector('#apo-chat-form');
      const apoInput    = dashboardContent.querySelector('#apo-chat-input');
      const apoMessages = dashboardContent.querySelector('#apo-chat-messages');
      const apoTyping   = dashboardContent.querySelector('#apo-chat-typing');

      if (apoForm && apoInput && apoMessages && apoTyping) {
        apoForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const query = apoInput.value.trim();
          if (!query) return;
          apoInput.value = '';

          agregarBurbujaEn(query, 'user', apoMessages);

          // El nuevo bot.js maneja inteligentemente todos los casos sensibles con empatía y contexto

          apoTyping.style.display = 'block';
          apoMessages.scrollTop = apoMessages.scrollHeight;

          const respuesta = await RICE_Bot.preguntar(query, false, 'apoderado', userData);
          apoTyping.style.display = 'none';

          if (respuesta.exito) {
            const texto = respuesta.mensaje.replace(/\n/g, '<br>');
            agregarBurbujaEn(texto, 'bot', apoMessages);
          } else {
            agregarBurbujaEn(respuesta.mensaje, 'error', apoMessages);
          }
          setTimeout(() => { apoMessages.scrollTop = apoMessages.scrollHeight; }, 50);
        });
      }
    }

    // F. Chatbot Funcionario
    if (role === 'funcionario') {
      const funForm     = dashboardContent.querySelector('#fun-chat-form');
      const funInput    = dashboardContent.querySelector('#fun-chat-input');
      const funMessages = dashboardContent.querySelector('#fun-chat-messages');
      const funTyping   = dashboardContent.querySelector('#fun-chat-typing');

      if (funForm && funInput && funMessages && funTyping) {
        funForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const query = funInput.value.trim();
          if (!query) return;
          funInput.value = '';

          agregarBurbujaEn(query, 'user', funMessages);
          funTyping.style.display = 'block';
          funMessages.scrollTop = funMessages.scrollHeight;

          const respuesta = await RICE_Bot.preguntar(query, false, 'funcionario', userData);
          funTyping.style.display = 'none';

          if (respuesta.exito) {
            const texto = respuesta.mensaje.replace(/\n/g, '<br>');
            agregarBurbujaEn(texto, 'bot', funMessages);
          } else {
            agregarBurbujaEn(respuesta.mensaje, 'error', funMessages);
          }
          setTimeout(() => { funMessages.scrollTop = funMessages.scrollHeight; }, 50);
        });
      }
    }
  }

  // Helpers reutilizables de UI de chat (fuera del scope de rol)
  function agregarBurbujaEn(texto, tipo, container) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${tipo}-bubble`;
    if (tipo === 'user')       bubble.style.alignSelf = 'flex-end';
    else if (tipo === 'bot')   bubble.style.alignSelf = 'flex-start';
    else if (tipo === 'error') bubble.style.alignSelf = 'center';
    bubble.innerHTML = formatMarkdownToHtml(texto);
    container.appendChild(bubble);
  }

  function agregarChipsEn(articulos, container) {
    const chipContainer = document.createElement('div');
    chipContainer.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;';
    articulos.forEach(art => {
      const chip = document.createElement('span');
      chip.textContent = `📍 ${art.titulo.split(':')[0]}`;
      chip.style.cssText = 'font-size:0.72rem;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);padding:4px 8px;border-radius:50px;color:white;cursor:pointer;';
      chip.title = art.contenido;
      chip.addEventListener('click', () => mostrarDetalleProtocoloModal(art));
      chipContainer.appendChild(chip);
    });
    const burbujas = container.querySelectorAll('.bot-bubble');
    if (burbujas.length > 0) burbujas[burbujas.length - 1].appendChild(chipContainer);
  }

  // 6. Cerrar Sesión y Volver al Selector
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      dashboardLayout.classList.remove('active');
      // Ocultar el modal LIRMI si estuviera visible
      if (lirmiModal) {
        lirmiModal.classList.remove('visible');
        lirmiModal.classList.add('hidden');
      }
      setTimeout(() => {
        dashboardLayout.style.display = 'none';
        currentLoggedUser = null;
        
        // Limpiar historial de preguntas del bot al cerrar sesión
        if (typeof RICE_Bot !== 'undefined') RICE_Bot.historialPreguntas = [];
        
        roleSelectionScreen.style.display = 'flex';
        setTimeout(() => {
          roleSelectionScreen.classList.add('active');
        }, 50);
      }, 300);
    });
  }
});

// Helper de detección de vulneraciones en base a palabras clave del RICE 2026
function detectarVulneracion(query) {
  if (!query) return false;
  const q = query.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // 1. Detección por Raíz Semántica (Abarca acosa, acosan, acosando, acoso, burlan, molestan, etc.)
  const raicesVulneracion = [
    'acos', 'burl', 'molest', 'pega', 'golp', 'insult', 'empuj', 'amenaz',
    'maltrat', 'agred', 'violenc', 'agres', 'abus', 'tocac', 'manose',
    'bullying', 'ciberacoso', 'suicid', 'autoles', 'herid', 'peligr', 'drog', 'arm'
  ];

  if (raicesVulneracion.some(raiz => q.includes(raiz))) {
    return true;
  }

  // 2. Protocolos Temáticos Específicos
  const p1 = ['maltrato', 'acoso', 'acosa', 'acosan', 'bullying', 'ciberacoso', 'ciberbullying', 'hostigamiento', 'intimidacion', 'exclusion', 'me molestan', 'me insultan', 'me discriminan', 'me pegan'];
  const p2 = ['golpes', 'pegan', 'golpeo', 'pego', 'agresion', 'agresivo', 'pelea', 'rina', 'amenaza', 'amenazas', 'lesion', 'violencia', 'violento', 'violenta'];
  const p3 = ['funcionario', 'profesor', 'profe', 'inspector', 'adulto', 'trabajador', 'abusa', 'abusaron', 'abuso un adulto'];
  const p4 = ['en casa', 'en el hogar', 'mi papa', 'mi mama', 'mis padres', 'familiar', 'padrastro', 'madrastra', 'pareja de mi mama', 'pareja de mi papa', 'me pegan en casa', 'me gritan', 'me amenazan en casa'];
  // Protocolo 5 — Connotación sexual / abuso sexual
  const p5 = ['abuso sexual', 'abuso', 'sexual', 'tocacion', 'toco', 'me toco', 'me manosearon', 'connotacion sexual', 'acoso sexual', 'exhibicionismo', 'pornografia', 'me obligo'];
  // Protocolo 6 — Drogas y alcohol
  const p6 = ['droga', 'drogas', 'marihuana', 'porro', 'pito', 'pasta base', 'cocaina', 'alcohol', 'tomando', 'borracho', 'pastilla', 'consumo', 'trafico', 'dealer', 'vendiendo'];
  // Protocolo 7 — Armas
  const p7 = ['arma', 'cuchillo', 'navaja', 'pistola', 'revolver', 'arma de fuego', 'punyal', 'hacha', 'cortaplumas'];
  // Protocolo 9 — Embarazo / retención escolar
  const p9 = ['embarazada', 'embarazo', 'estoy esperando', 'voy a tener un bebe', 'bebe', 'mama', 'papa estudiante', 'lactancia', 'retencion escolar', 'me quede embarazada'];
  // Protocolo 14 — TEA / crisis de desregulación emocional
  const p14 = ['tea', 'autismo', 'asperger', 'desregulacion', 'crisis emocional', 'meltdown', 'no puedo controlarme', 'explosion emocional'];
  // Riesgo vital
  const vital = ['suicidio', 'suicidarme', 'matarme', 'matar', 'morir', 'quiero morir', 'cortarme', 'hacerme dano', 'hacerme daño', 'no quiero vivir', 'quitarme la vida', 'pastillas para morir'];

  const todasLasPalabras = [...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7, ...p9, ...p14, ...vital];
  return todasLasPalabras.some(kw => q.includes(kw));
}

// Sugiere el asunto dinámicamente según el protocolo más probable del RICE 2026
function sugerirAsunto(query) {
  if (!query) return 'Otra causa';
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Riesgo vital — prioridad máxima
  if (['suicid', 'matarme', 'morir', 'cortarme', 'quitarme la vida', 'no quiero vivir', 'pastillas para morir'].some(k => q.includes(k))) {
    return 'Riesgo vital — Derivación urgente a equipo de convivencia educativa';
  }
  // Protocolo 5 — Abuso sexual
  if (['abuso sexual', 'abuso', 'tocacion', 'toco', 'connotacion sexual', 'acoso sexual', 'me obligo', 'me manosearon'].some(k => q.includes(k))) {
    return 'Sospecha de abuso o connotación sexual (Protocolo 5)';
  }
  // Protocolo 6 — Drogas
  if (['droga', 'marihuana', 'porro', 'pito', 'pasta base', 'cocaina', 'trafico', 'dealer', 'pastilla', 'alcohol', 'borracho'].some(k => q.includes(k))) {
    return 'Consumo o porte de drogas/alcohol (Protocolo 6)';
  }
  // Protocolo 7 — Armas
  if (['arma', 'cuchillo', 'navaja', 'pistola', 'punyal', 'hacha'].some(k => q.includes(k))) {
    return 'Porte de armas (Protocolo 7)';
  }
  // Protocolo 1 — Bullying/ciberacoso
  if (['acoso', 'bullying', 'ciberacoso', 'hostigamiento', 'intimidacion', 'exclusion'].some(k => q.includes(k))) {
    return 'Acoso escolar o ciberacoso (Protocolo 1)';
  }
  // Protocolo 2 — Agresión física
  if (['golpes', 'pegan', 'agresion', 'pelea', 'rina', 'violencia', 'lesion'].some(k => q.includes(k))) {
    return 'Agresión o riña física (Protocolo 2)';
  }
  // Protocolo 4 — Maltrato en el hogar
  if (['en casa', 'en el hogar', 'familiar', 'padrastro', 'madrastra', 'me pegan en casa'].some(k => q.includes(k))) {
    return 'Sospecha de maltrato en el hogar (Protocolo 4)';
  }
  // Protocolo 9 — Embarazo
  if (['embarazada', 'embarazo', 'voy a tener', 'lactancia'].some(k => q.includes(k))) {
    return 'Situación de embarazo o maternidad/paternidad (Protocolo 9)';
  }
  // Protocolo 14 — TEA
  if (['tea', 'autismo', 'asperger', 'desregulacion', 'crisis emocional'].some(k => q.includes(k))) {
    return 'Crisis de estudiante con TEA (Protocolo 14)';
  }
  return 'Situación de convivencia — otra causa';
}

// Versión empática para el estudiante — SIN diagnósticos ni etiquetas clínicas
// Coincide exactamente con las opciones del formulario denuncia.html
function sugerirAsuntoAmable(query) {
  if (!query) return 'Otra causa';
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Armas / Elementos peligrosos (Protocolo 7)
  if (['arma', 'cuchillo', 'navaja', 'pistola', 'hacha', 'cortaplumas', 'punyal', 'mochila'].some(k => q.includes(k))) {
    return 'Posible Presencia o porte de elementos peligrosos o armas';
  }
  // Drogas y alcohol (Protocolo 6)
  if (['droga', 'marihuana', 'porro', 'pito', 'pasta base', 'cocaina', 'trafico', 'dealer', 'alcohol', 'borracho'].some(k => q.includes(k))) {
    return 'Posible Presencia, consumo o venta de drogas o alcohol';
  }
  // Riesgo vital / Apoyo emocional
  if (['suicid', 'matarme', 'morir', 'cortarme', 'quitarme la vida', 'no quiero vivir'].some(k => q.includes(k))) {
    return 'Necesidad de apoyo emocional o salud mental';
  }
  // Sexual (Protocolo 5)
  if (['abuso', 'sexual', 'tocacion', 'toco', 'me toco', 'me manosearon', 'me obligo'].some(k => q.includes(k))) {
    return 'Situación incómoda o agresión de connotación sexual';
  }
  // Acoso/bullying (Protocolo 1)
  if (['acoso', 'bullying', 'ciberacoso', 'hostigamiento', 'me insultan', 'me molestan', 'me excluyen'].some(k => q.includes(k))) {
    return 'Sospecha de acoso escolar (Bullying o Ciberacoso)';
  }
  // Agresión física (Protocolo 2)
  if (['golpes', 'pegan', 'agresion', 'pelea', 'violencia', 'amenazas'].some(k => q.includes(k))) {
    return 'Posible maltrato o pelea entre pares';
  }
  // Hogar (Protocolo 4)
  if (['en casa', 'en el hogar', 'familiar', 'padrastro', 'madrastra', 'me pegan en casa'].some(k => q.includes(k))) {
    return 'Vulneración de derechos o dificultades en el hogar';
  }
  // Embarazo (Protocolo 9)
  if (['embarazada', 'embarazo', 'lactancia', 'voy a tener'].some(k => q.includes(k))) {
    return 'Situación de embarazo, maternidad o paternidad';
  }
  // TEA / emocional
  if (['tea', 'autismo', 'desregulacion', 'crisis emocional', 'no puedo controlarme'].some(k => q.includes(k))) {
    return 'Necesidad de apoyo emocional o salud mental';
  }
  return 'Otra causa';
}

// Normalizar texto quitando acentos y mayúsculas
function normalizarTexto(str) {
  if (!str) return "";
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Convertir formato básico Markdown a HTML
function formatMarkdownToHtml(text) {
  if (!text) return "";
  let out = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.05); padding:2px 4px; border-radius:3px; font-family:monospace; font-size:0.9em;">$1</code>');
  // Colapsar saltos de línea DENTRO de atributos HTML (entre < ... >) para no romperlos
  out = out.replace(/(<[^>]*?)\n([^>]*?>)/g, '$1 $2');
  out = out.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
  return out;
}

// Obtener estructura HTML del explorador interactivo
function obtenerProtocolExplorerHtml(rol) {
  return `
    <div style="background:var(--bg-card); padding:20px; border-radius:var(--radius-md); border:1px solid var(--border-card); margin-bottom:16px;">
      <h3 style="color:var(--primary); font-size:1.1rem; font-weight:700; margin-bottom:6px;">⚖️ Explorador Interactivo de Protocolos RICE</h3>
      <p style="color:var(--text-muted); font-size:0.82rem; line-height:1.4; margin-bottom:14px;">
        Seleccione un protocolo oficial del Liceo de Huara para visualizar sus pasos secuenciales y el flujograma de acción reglamentario.
      </p>
      
      <!-- Botones de Selección -->
      <div class="protocol-tabs-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:8px; margin-bottom:16px;">
        <button class="btn-proto" onclick="cambiarProtocoloVisualizado('atrasos', '${rol}')" data-proto-btn="${rol}-atrasos" style="padding:8px; font-size:0.75rem; font-weight:bold; border-radius:var(--radius-sm); border:1px solid var(--border-card); cursor:pointer; background:white; color:var(--text-main);">Atrasos</button>
        <button class="btn-proto" onclick="cambiarProtocoloVisualizado('rinas', '${rol}')" data-proto-btn="${rol}-rinas" style="padding:8px; font-size:0.75rem; font-weight:bold; border-radius:var(--radius-sm); border:1px solid var(--border-card); cursor:pointer; background:white; color:var(--text-main);">Prot. 2: Riñas</button>
        <button class="btn-proto" onclick="cambiarProtocoloVisualizado('sexual', '${rol}')" data-proto-btn="${rol}-sexual" style="padding:8px; font-size:0.75rem; font-weight:bold; border-radius:var(--radius-sm); border:1px solid var(--border-card); cursor:pointer; background:white; color:var(--text-main);">Prot. 5: Connot. Sexual</button>
        <button class="btn-proto" onclick="cambiarProtocoloVisualizado('drogas', '${rol}')" data-proto-btn="${rol}-drogas" style="padding:8px; font-size:0.75rem; font-weight:bold; border-radius:var(--radius-sm); border:1px solid var(--border-card); cursor:pointer; background:white; color:var(--text-main);">Prot. 6: Drogas/Alcohol</button>
        <button class="btn-proto" onclick="cambiarProtocoloVisualizado('armas', '${rol}')" data-proto-btn="${rol}-armas" style="padding:8px; font-size:0.75rem; font-weight:bold; border-radius:var(--radius-sm); border:1px solid var(--border-card); cursor:pointer; background:white; color:var(--text-main);">Prot. 7: Armas</button>
        <button class="btn-proto" onclick="cambiarProtocoloVisualizado('tea', '${rol}')" data-proto-btn="${rol}-tea" style="padding:8px; font-size:0.75rem; font-weight:bold; border-radius:var(--radius-sm); border:1px solid var(--border-card); cursor:pointer; background:white; color:var(--text-main);">Prot. 14: Ley TEA</button>
      </div>

      <!-- Área de Visualización Dinámica -->
      <div id="protocol-display-area-${rol}" style="background:rgba(255,255,255,0.7); border:1px solid var(--border-card); border-radius:var(--radius-sm); padding:16px;">
        <p style="text-align:center; font-size:0.8rem; color:var(--text-muted);">Cargando flujograma de protocolo...</p>
      </div>
    </div>
  `;
}

// Cambiar dinámicamente el protocolo mostrado
window.cambiarProtocoloVisualizado = function(id, rol) {
  const container = document.querySelector(`#protocol-display-area-${rol}`);
  if (!container) return;

  const buttons = document.querySelectorAll(`[data-proto-btn^="${rol}-"]`);
  buttons.forEach(btn => {
    if (btn.getAttribute('data-proto-btn') === `${rol}-${id}`) {
      btn.style.cssText = 'padding:10px 12px !important; font-size:0.78rem !important; font-weight:800 !important; border-radius:8px !important; border:2px solid #047857 !important; cursor:pointer !important; background:#047857 !important; color:#ffffff !important; box-shadow:0 4px 12px rgba(4,120,87,0.3) !important; transform:scale(1.02);';
    } else {
      btn.style.cssText = 'padding:10px 12px !important; font-size:0.78rem !important; font-weight:700 !important; border-radius:8px !important; border:1.5px solid #cbd5e1 !important; cursor:pointer !important; background:#ffffff !important; color:#334155 !important;';
    }
  });

  const flows = {
    atrasos: {
      titulo: "Protocolo de Atrasos",
      desc: "El Liceo Huara no excluye de clases por atraso, priorizando el Derecho a la Educación.",
      pasos: [
        { num: 1, nombre: "Ingreso Regular", desc: "El estudiante solicita pase en portería e ingresa a clases sin exclusión.", color: "hsl(210, 80%, 40%)" },
        { num: 2, nombre: "3° Atraso mensual", desc: "Amonestación verbal y registro de constancia en plataforma Lirmi.", color: "hsl(35, 80%, 45%)" },
        { num: 3, nombre: "5° Atraso mensual", desc: "Citación formal al apoderado para firma de compromiso de puntualidad.", color: "hsl(280, 70%, 45%)" },
        { num: 4, nombre: "10° Atraso mensual", desc: "Entrevista con Convivencia para indagar causas y aplicar planes de apoyo.", color: "hsl(150, 75%, 35%)" }
      ],
      flujograma: ["Portería", "Registro Lirmi", "Citación Apoderado", "Plan Apoyo"]
    },
    rinas: {
      titulo: "Protocolo 2 - Agresiones o Riñas Escolares",
      desc: "Procedimiento obligatorio ante agresiones físicas, peleas o ciberacoso entre estudiantes.",
      pasos: [
        { num: 1, nombre: "Separación Física", desc: "Cese inmediato de la agresión y traslado de estudiantes a enfermería/lugar seguro.", color: "hsl(0, 80%, 45%)" },
        { num: 2, nombre: "Medidas de Resguardo", desc: "Separación preventiva de espacios y toma de versiones por escrito.", color: "hsl(35, 80%, 45%)" },
        { num: 3, nombre: "Citación Inmediata", desc: "Citación a los apoderados de todos los estudiantes involucrados.", color: "hsl(280, 70%, 45%)" },
        { num: 4, nombre: "Sanción y Apoyo", desc: "Aplicación de medidas disciplinarias formativas y plan de apoyo psicosocial.", color: "hsl(150, 75%, 35%)" }
      ],
      flujograma: ["Contener Agresión", "Toma Declaraciones", "Citación Apoderados", "Medidas Formativas"]
    },
    sexual: {
      titulo: "Protocolo 5 - Connotación o Abuso Sexual (ASI)",
      desc: "Procedimiento obligatorio de resguardo y denuncia ante hechos de connotación sexual que involucren estudiantes.",
      pasos: [
        { num: 1, nombre: "Acogida y Resguardo", desc: "Apoyo inmediato a la víctima. Prohibición de careos, mediaciones o interrogatorios.", color: "hsl(340, 80%, 45%)" },
        { num: 2, nombre: "Información Interna", desc: "Notificación directa a Convivencia y Dirección para activar equipo psicosocial.", color: "hsl(35, 80%, 45%)" },
        { num: 3, nombre: "Denuncia Obligatoria", desc: "Derivación por ley en menos de 24 horas hábiles a Carabineros, PDI o Fiscalía.", color: "hsl(0, 80%, 45%)" },
        { num: 4, nombre: "Plan de Acompañamiento", desc: "Adecuaciones de clases y coordinación con redes de salud externas.", color: "hsl(150, 75%, 35%)" }
      ],
      flujograma: ["Acogida Confidencial", "Reporte Dirección", "Denuncia < 24 hrs", "Apoyo Psicosocial"]
    },
    drogas: {
      titulo: "Protocolo 6 - Presencia o Consumo de Drogas y Alcohol",
      desc: "Acción institucional ante tenencia, consumo o sospecha de comercialización de sustancias.",
      pasos: [
        { num: 1, nombre: "Retiro y Custodia", desc: "Resguardo del estudiante y de la sustancia sospechosa en sobre cerrado y firmado.", color: "hsl(210, 80%, 40%)" },
        { num: 2, nombre: "Citación Apoderados", desc: "Llamado urgente al apoderado para retiro del alumno y notificación.", color: "hsl(35, 80%, 45%)" },
        { num: 3, nombre: "Derivación a Red", desc: "Coordinación con Senda Previene o consultorio local para apoyo terapéutico.", color: "hsl(280, 70%, 45%)" },
        { num: 4, nombre: "Denuncia por Tráfico", desc: "Si hay sospecha de comercialización, denuncia obligatoria a Carabineros/Fiscalía.", color: "hsl(0, 80%, 45%)" }
      ],
      flujograma: ["Custodia Sustancia", "Retiro Apoderado", "Derivación Apoyo", "Denuncia (Si hay venta)"]
    },
    armas: {
      titulo: "Protocolo 7 - Tenencia o Porte de Armas",
      desc: "Procedimiento obligatorio ante presencia de armas de fuego, cortopunzantes o elementos de peligro.",
      pasos: [
        { num: 1, nombre: "Aislamiento Seguro", desc: "Retiro calmado del estudiante de la sala de clases. Prohibición de forcejeo.", color: "hsl(0, 80%, 45%)" },
        { num: 2, nombre: "Llamado a Carabineros", desc: "Notificación de urgencia a Carabineros de Huara para desarme seguro.", color: "hsl(0, 80%, 45%)" },
        { num: 3, nombre: "Citación Apoderados", desc: "Llamado inmediato y urgente al apoderado del estudiante.", color: "hsl(280, 70%, 45%)" },
        { num: 4, nombre: "Medidas y Cierre", desc: "Medidas pedagógicas disciplinarias y plan obligatorio de acompañamiento.", color: "hsl(150, 75%, 35%)" }
      ],
      flujograma: ["Aislamiento Alumno", "Llamado Carabineros", "Retiro Alumno", "Medidas RICE"]
    },
    tea: {
      titulo: "Protocolo 14 - Desregulación TEA (Ley Autismo)",
      desc: "Protocolo formativo de contención y calma de estudiantes con Trastorno del Espectro Autista.",
      pasos: [
        { num: 1, nombre: "Desarme Sensorial", desc: "Retiro del estímulo de sobrecarga. Prohibido forcejear o zamarrear.", color: "hsl(200, 80%, 40%)" },
        { num: 2, nombre: "Espacio de Calma", desc: "Acompañamiento tranquilo a la sala de recursos o área de contención.", color: "hsl(170, 75%, 35%)" },
        { num: 3, nombre: "Regulación Adulta", desc: "Contención verbal, emocional y física suave por docente calificado.", color: "hsl(280, 70%, 45%)" },
        { num: 4, nombre: "Adecuación y PIE", desc: "Ajuste de metas curriculares mediante DUA y coordinación con equipo PIE.", color: "hsl(150, 75%, 35%)" }
      ],
      flujograma: ["Retiro de Estímulos", "Espacio de Calma", "Contención Reguladora", "Plan Curricular PIE"]
    }
  };

  const data = flows[id];
  if (!data) return;

  // Generar HTML de pasos
  let pasosHtml = "";
  data.pasos.forEach(p => {
    pasosHtml += `
      <div style="background:white; border-radius:var(--radius-sm); border:1px solid var(--border-card); border-left:5px solid ${p.color}; padding:14px; margin-bottom:10px;">
        <span style="display:inline-block; background:${p.color}; color:white; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:30px; margin-bottom:6px;">Paso ${p.num}</span>
        <h4 style="font-size:0.85rem; font-weight:700; color:var(--primary); margin-bottom:4px;">${p.nombre}</h4>
        <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4;">${p.desc}</p>
      </div>
    `;
  });

  // Generar Flujograma HTML
  let flujoHtml = "";
  data.flujograma.forEach((node, idx) => {
    flujoHtml += `
      <div style="display:flex; align-items:center; gap:8px;">
        <div style="background:var(--primary); color:white; font-size:0.75rem; font-weight:bold; padding:8px 12px; border-radius:var(--radius-sm); border:1px solid rgba(0,0,0,0.1); text-align:center; min-width:110px;">
          ${node}
        </div>
        ${idx < data.flujograma.length - 1 ? '<span style="color:var(--primary); font-weight:bold; font-size:1.1rem;">➔</span>' : ''}
      </div>
    `;
  });

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <h4 style="font-size:1rem; font-weight:bold; color:var(--primary); margin-bottom:0;">${data.titulo}</h4>
      <a href="fuentes/RICE%20LICEO%20DE%20HUARA%202026.pdf" download class="btn-primary" style="margin-top:0; width:auto; font-size:0.72rem; padding:4px 10px;">
        📥 Descargar RICE
      </a>
    </div>
    <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:14px; line-height:1.45;">${data.desc}</p>
    
    <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
      <h5 style="font-size:0.8rem; font-weight:bold; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px; letter-spacing:0.5px;">Pasos Reglamentarios</h5>
      ${pasosHtml}
    </div>

    <div>
      <h5 style="font-size:0.8rem; font-weight:bold; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px; letter-spacing:0.5px;">Flujograma de Acción</h5>
      <div style="display:flex; align-items:center; gap:8px; overflow-x:auto; padding-bottom:8px;">
        ${flujoHtml}
      </div>
    </div>
  `;
};

// Abre un modal interactivo con la información del protocolo citado
window.mostrarDetalleProtocoloModal = function(art) {
  let cleanTitle = art.titulo;
  let steps = [
    { num: 1, name: "Detección y Resguardo", desc: "Se detiene la situación de riesgo y se resguarda inmediatamente a él o los afectados." },
    { num: 2, name: "Registro Interno", desc: "El funcionario registra la Bitácora de Incidentes en un plazo máximo de 24 horas." },
    { num: 3, name: "Indagación y Citación", desc: "El Coordinador de Convivencia toma declaraciones y cita a los apoderados." },
    { num: 4, name: "Cierre y Medidas", desc: "Se aplican medidas pedagógicas y formativas, firmando compromisos." }
  ];
  let flowchart = ["Detección", "Bitácora", "Indagación", "Plan de Apoyo"];

  const tLower = art.titulo.toLowerCase();
  if (tLower.includes("atraso")) {
    steps = [
      { num: 1, name: "Ingreso sin Exclusión", desc: "Se otorga pase en portería e ingresa a clases." },
      { num: 2, name: "3° Atraso", desc: "Registro de constancia en plataforma Lirmi." },
      { num: 3, name: "5° Atraso", desc: "Citación del Profesor Jefe al apoderado para firmar compromisos." },
      { num: 4, name: "10° Atraso", desc: "Derivación a Convivencia para indagar causas socioemocionales." }
    ];
    flowchart = ["Portería", "Lirmi", "Apoderado", "Convivencia"];
  } else if (tLower.includes("agresiones") || tLower.includes("violencia") || tLower.includes("rinas")) {
    steps = [
      { num: 1, name: "Contención Física", desc: "Separación inmediata de las partes involucradas y derivación médica si corresponde." },
      { num: 2, name: "Medidas de Resguardo", desc: "Traslado a dependencias seguras y toma de versiones por escrito." },
      { num: 3, name: "Citación Apoderados", desc: "Llamado inmediato para informar el caso presencialmente." },
      { num: 4, name: "Compromiso y Apoyo", desc: "Aplicación de medidas formativas y derivación psicosocial." }
    ];
    flowchart = ["Separar", "Declaraciones", "Apoderados", "Resolución RICE"];
  } else if (tLower.includes("abuso") || tLower.includes("sexual") || tLower.includes("asi")) {
    steps = [
      { num: 1, name: "Acogida Confidencial", desc: "Escucha activa sin careos ni mediación. Resguardo absoluto." },
      { num: 2, name: "Derivación Dirección", desc: "Se informa a Dirección para activar de inmediato el equipo de resguardo." },
      { num: 3, name: "Denuncia Penal < 24h", desc: "Derivación legal ante Carabineros o Fiscalía por sospecha de delito." },
      { num: 4, name: "Acompañamiento", desc: "Plan pedagógico diferenciado y acompañamiento de salud mental." }
    ];
    flowchart = ["Acogida", "Dirección", "Denuncia < 24h", "Acompañamiento"];
  } else if (tLower.includes("droga") || tLower.includes("alcohol") || tLower.includes("consumo")) {
    steps = [
      { num: 1, name: "Retiro y Custodia", desc: "Resguardo seguro del alumno y custodia de la sustancia sospechosa en sobre lacrado." },
      { num: 2, name: "Citación Apoderados", desc: "Llamado urgente al apoderado para retiro presencial del estudiante." },
      { num: 3, name: "Senda Previene", desc: "Derivación a apoyo preventivo y talleres terapéuticos." },
      { num: 4, name: "Denuncia por Tráfico", desc: "Si hay sospecha de microventa, denuncia directa a Carabineros/Fiscalía." }
    ];
    flowchart = ["Resguardar", "Retiro Familiar", "Apoyo Senda", "Denuncia (Comercio)"];
  } else if (tLower.includes("desregulacion") || tLower.includes("tea") || tLower.includes("autismo")) {
    steps = [
      { num: 1, name: "Desarme Sensorial", desc: "Retiro de luces, ruidos o estímulos. Prohibición absoluta de contención física." },
      { num: 2, name: "Espacio de Calma", desc: "Traslado acompañado de forma calmada a la sala de recursos." },
      { num: 3, name: "Contención Afectiva", desc: "Presencia reguladora de un adulto capacitado hasta que baje la crisis." },
      { num: 4, name: "Ajuste DUA/PIE", desc: "Planificación curricular especial (PACI) y derivación al PIE." }
    ];
    flowchart = ["Desarme Sens.", "Área Calma", "Acompañamiento", "Plan de Apoyo"];
  }

  let modal = document.getElementById("rice-protocol-modal");
  if (!modal) {
    modal = document.createElement('div');
    modal.id = "rice-protocol-modal";
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); backdrop-filter:blur(5px); z-index:10000; display:flex; align-items:center; justify-content:center; padding:20px;';
    document.body.appendChild(modal);
  }

  let pasosHtml = "";
  steps.forEach(s => {
    pasosHtml += `
      <div style="background:#f8fafc; border-radius:8px; border:1px solid #cbd5e1; border-left:4px solid #047857; padding:12px 14px; flex:1; min-width:180px;">
        <span style="font-size:0.75rem; font-weight:700; color:#047857; background:#e6f4ea; padding:2px 8px; border-radius:4px; display:inline-block; margin-bottom:6px;">Paso ${s.num}</span>
        <h5 style="font-size:0.85rem; font-weight:700; color:#0f172a; margin-bottom:4px;">${s.name}</h5>
        <p style="font-size:0.78rem; color:#334155; line-height:1.4; margin:0;">${s.desc}</p>
      </div>
    `;
  });

  let flowchartHtml = "";
  flowchart.forEach((node, idx) => {
    flowchartHtml += `
      <div style="display:flex; align-items:center; gap:6px;">
        <div style="background:#047857; color:#ffffff !important; font-size:0.78rem; font-weight:800; padding:8px 14px; border-radius:6px; text-align:center; box-shadow:0 2px 6px rgba(4,120,87,0.2);">
          ${node}
        </div>
        ${idx < flowchart.length - 1 ? '<span style="color:#047857; font-weight:bold; font-size:1.1rem;">➔</span>' : ''}
      </div>
    `;
  });

  modal.innerHTML = `
    <div style="background:#ffffff; color:#0f172a; border-radius:16px; max-width:850px; width:100%; border:1.5px solid #cbd5e1; box-shadow:0 25px 50px -12px rgba(0,0,0,0.4); display:flex; flex-direction:column; max-height:90vh; overflow-y:auto; animation: fadeIn 0.25s;">
      
      <!-- Cabecera -->
      <div style="background:#047857; color:#ffffff; padding:18px 24px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #065f46;">
        <div>
          <span style="font-size:0.75rem; background:rgba(255,255,255,0.2); color:#ffffff !important; padding:3px 10px; border-radius:50px; font-weight:bold;">Protocolo RICE Oficial</span>
          <h3 style="font-size:1.15rem; font-weight:800; color:#ffffff !important; margin-top:4px; margin-bottom:0;">${cleanTitle}</h3>
        </div>
        <button onclick="document.getElementById('rice-protocol-modal').style.display='none'" style="background:rgba(255,255,255,0.15); border:none; color:#ffffff !important; font-size:1.4rem; font-weight:bold; cursor:pointer; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center;">✕</button>
      </div>

      <!-- Cuerpo -->
      <div style="padding:24px; display:flex; flex-direction:column; gap:20px; background:#ffffff;">
        
        <!-- Texto Original -->
        <div style="background:#f1f5f9; border-radius:8px; padding:16px; border:1px solid #cbd5e1;">
          <h4 style="font-size:0.85rem; font-weight:800; color:#047857; text-transform:uppercase; margin-bottom:6px; letter-spacing:0.5px;">Extracto del RICE 2026</h4>
          <p style="font-size:0.85rem; color:#0f172a; line-height:1.5; font-style:italic; margin:0;">"${art.contenido}"</p>
        </div>

        <!-- Pasos en Cuadros de Colores -->
        <div>
          <h4 style="font-size:0.85rem; font-weight:800; color:#0f172a; text-transform:uppercase; margin-bottom:10px; letter-spacing:0.5px;">Secuencia de Pasos Obligatoria</h4>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            ${pasosHtml}
          </div>
        </div>

        <!-- Flujograma -->
        <div>
          <h4 style="font-size:0.85rem; font-weight:800; color:#0f172a; text-transform:uppercase; margin-bottom:10px; letter-spacing:0.5px;">Flujograma de Acción</h4>
          <div style="display:flex; align-items:center; gap:8px; background:#f8fafc; padding:14px; border-radius:8px; overflow-x:auto; border:1px solid #cbd5e1;">
            ${flowchartHtml}
          </div>
        </div>

        <!-- Tarjeta de Invitación a Notificar / Consultar Confidencialmente -->
        <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1.5px solid #6ee7b7; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px; text-align: center;">
          <strong style="color: #047857; font-size: 0.95rem; font-weight: 800;">
            🤝 ¿Deseas consultar o informar confidencialmente esta situación al Equipo de Convivencia?
          </strong>
          <span style="font-size: 0.82rem; color: #065f46; line-height: 1.4;">
            Tu mensaje o reporte es <strong>100% reservado y protegido</strong> bajo la Circular 781 y Ley 21.430. El equipo investigará y te brindará apoyo sin exponer tu identidad.
          </span>
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 6px;">
            <button onclick="document.getElementById('rice-protocol-modal').style.display='none'; window.irAReporteConfidencial('${cleanTitle}');" style="margin: 0; background: #047857 !important; color: #ffffff !important; font-weight: 800 !important; padding: 10px 20px !important; border-radius: 50px !important; font-size: 0.84rem !important; cursor: pointer !important; border: none !important; box-shadow: 0 4px 12px rgba(4,120,87,0.25) !important; display: inline-flex !important; align-items: center !important; gap: 6px !important;">
              📩 Sí, Deseo Notificar Confidencialmente
            </button>
            <button onclick="document.getElementById('rice-protocol-modal').style.display='none';" style="margin: 0; background: #ffffff !important; color: #0f172a !important; border: 1.5px solid #cbd5e1 !important; font-weight: 700 !important; padding: 10px 18px !important; border-radius: 50px !important; font-size: 0.84rem !important; cursor: pointer !important;">
              ✋ Solo deseaba revisar la norma
            </button>
          </div>
        </div>

      </div>

      <!-- Pie -->
      <div style="background:#f8fafc; padding:16px 24px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #cbd5e1; border-radius: 0 0 16px 16px;">
        <a href="fuentes/RICE%20LICEO%20DE%20HUARA%202026.pdf" download style="margin-top:0; width:auto; display:inline-flex; align-items:center; gap:8px; font-size:0.85rem; background:#047857 !important; color:#ffffff !important; font-weight:bold; border-radius:50px; padding:10px 18px; text-decoration:none;">
          📥 Descargar RICE Completo (PDF)
        </a>
        <button onclick="document.getElementById('rice-protocol-modal').style.display='none'" style="margin-top:0; width:auto; background:#ffffff !important; color:#0f172a !important; border:1px solid #cbd5e1 !important; font-weight:700; padding:10px 18px; border-radius:50px; cursor:pointer;">Cerrar Detalle</button>
      </div>

    </div>
  `;
  modal.style.display = "flex";
};

// Guardar en el historial privado local de consultas
window.guardarEnHistorialChat = function(pregunta, respuesta) {
  try {
    const chatHist = JSON.parse(localStorage.getItem('mirice_chat_history') || '[]');
    chatHist.unshift({
      fecha: new Date().toLocaleDateString('es-CL') + ' ' + new Date().toLocaleTimeString('es-CL', {hour:'2-digit', minute:'2-digit'}),
      pregunta: pregunta,
      respuesta: respuesta
    });
    if (chatHist.length > 50) chatHist.pop();
    localStorage.setItem('mirice_chat_history', JSON.stringify(chatHist));
  } catch(e) {}
};

// Modal de Historial de Preguntas y Consultas RICE 2026
window.mostrarHistorialPreguntasModal = function() {
  let modal = document.getElementById('historial-preguntas-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'historial-preguntas-modal';
    modal.className = 'lirmi-notice-modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); backdrop-filter:blur(5px); z-index:10000; display:flex; align-items:center; justify-content:center; padding:16px;';
    document.body.appendChild(modal);
  }

  const historial = JSON.parse(localStorage.getItem('mirice_chat_history') || '[]');
  let contentHtml = '';

  if (historial.length === 0) {
    contentHtml = `
      <div style="text-align:center; padding:30px 16px; color:#475569;">
        <div style="font-size:3rem; margin-bottom:10px;">💬</div>
        <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin-bottom:6px;">Aún no tienes preguntas registradas en este dispositivo</h4>
        <p style="font-size:0.84rem; line-height:1.45; max-width:380px; margin:0 auto 16px;">
          Cada vez que realices una consulta al Orientador Virtual sobre el RICE 2026, tus preguntas y respuestas se guardarán aquí de forma privada.
        </p>
        <button onclick="document.getElementById('historial-preguntas-modal').style.display='none';" style="padding:10px 22px; font-weight:bold; font-size:0.85rem; border-radius:50px; background:#047857 !important; color:#ffffff !important; border:none; cursor:pointer; box-shadow:0 4px 12px rgba(4,120,87,0.25);">
          💬 Ir a realizar una consulta
        </button>
      </div>
    `;
  } else {
    contentHtml = `<div style="display:flex; flex-direction:column; gap:12px; max-height:60vh; overflow-y:auto; padding-right:4px;">`;
    historial.forEach((item, idx) => {
      contentHtml += `
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-left:4px solid #047857; padding:12px 14px; border-radius:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:0.75rem; font-weight:700; color:#047857; background:#e6f4ea; padding:2px 8px; border-radius:4px;">Consulta #${historial.length - idx}</span>
            <span style="font-size:0.72rem; color:#64748b;">📅 ${item.fecha}</span>
          </div>
          <strong style="color:#0f172a; font-size:0.88rem; display:block; margin-bottom:6px;">❓ "${item.pregunta}"</strong>
          <div style="font-size:0.82rem; color:#334155; line-height:1.45; background:white; padding:10px; border-radius:8px; border:1px solid #e2e8f0;">
            ${item.respuesta}
          </div>
        </div>
      `;
    });
    contentHtml += `</div>`;
  }

  modal.innerHTML = `
    <div class="lirmi-modal-card" style="max-width:620px; width:100%; text-align:left; background:white; border-radius:16px; padding:22px; box-shadow:0 20px 40px rgba(0,0,0,0.3); border:1px solid #cbd5e1; animation: fadeIn 0.25s;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #cbd5e1; padding-bottom:12px; margin-bottom:16px;">
        <h3 style="color:#047857; font-size:1.15rem; font-weight:800; margin:0; display:flex; align-items:center; gap:8px;">
          💬 Historial Privado de Consultas RICE
        </h3>
        <button onclick="document.getElementById('historial-preguntas-modal').style.display='none'" style="background:none; border:none; font-size:1.4rem; cursor:pointer; color:#475569; font-weight:bold;">&times;</button>
      </div>

      ${contentHtml}

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; border-top:1px solid #cbd5e1; padding-top:12px;">
        ${historial.length > 0 ? `
          <button onclick="localStorage.removeItem('mirice_chat_history'); mostrarHistorialPreguntasModal();" style="background:#fff1f2; color:#e11d48 !important; border:1px solid #fecdd3; padding:8px 14px; border-radius:50px; font-size:0.78rem; font-weight:700; cursor:pointer;">
            🗑️ Limpiar Historial
          </button>
        ` : '<div></div>'}
        <button onclick="document.getElementById('historial-preguntas-modal').style.display='none'" style="background:#334155 !important; color:#ffffff !important; border:none; padding:8px 20px; border-radius:50px; font-size:0.82rem; font-weight:700; cursor:pointer;">
          Cerrar
        </button>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
};

// Función global para redirigir o abrir el formulario de reporte confidencial
window.irAReporteConfidencial = function(asunto = '') {
  const modal = document.getElementById('rice-protocol-modal');
  if (modal) modal.style.display = 'none';
  
  if (typeof window.abrirFormularioDenuncia === 'function') {
    window.abrirFormularioDenuncia(asunto);
  } else {
    window.location.href = `denuncia.html?asunto=${encodeURIComponent(asunto)}`;
  }
};

// Manejador del Botón "Atrás" del Celular (Evita salir de la App PWA en Android/iOS)
window.addEventListener('popstate', (e) => {
  const editModal = document.getElementById('edit-profile-modal');
  if (editModal && editModal.style.display === 'flex') {
    editModal.style.display = 'none';
    return;
  }
  const protocolModal = document.getElementById('rice-protocol-modal');
  if (protocolModal && protocolModal.style.display === 'flex') {
    protocolModal.style.display = 'none';
    return;
  }
  const notifModal = document.getElementById('notif-settings-modal');
  if (notifModal && notifModal.style.display === 'flex') {
    notifModal.style.display = 'none';
    return;
  }
  const pwaModal = document.getElementById('pwa-install-modal');
  if (pwaModal && pwaModal.style.display === 'flex') {
    pwaModal.style.display = 'none';
    return;
  }
});

// Antes esta función solo le sacaba puntos y guion al RUT: el número seguía
// legible tal cual dentro de localStorage (mirice_avatar_12345678, etc.) y en
// ids del DOM. En un computador compartido (sala de computación, biblioteca)
// eso deja acumulados los RUT de varios estudiantes en el mismo navegador.
// No es una clave de seguridad (esa la calcula el servidor con pepper, ver
// api/_comun.js) — es solo para que la preferencia de cada persona (avatar,
// contacto, etc.) no quede guardada bajo su número de identidad en claro.
window.obtenerRutKeySeguro = function(userData) {
  if (!userData) return 'default';
  const raw = String(userData.rut_limpio || userData.rut || 'default').toUpperCase();
  let hash = 0x811c9dc5;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return 'u' + (hash >>> 0).toString(36);
};

// Modal de Edición de Perfil y Datos Personales (Accedido desde el Menú)
window.mostrarModalEditarPerfil = function() {
  let modal = document.getElementById('edit-profile-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'edit-profile-modal';
    modal.className = 'lirmi-notice-modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); backdrop-filter:blur(5px); z-index:10000; display:flex; align-items:center; justify-content:center; padding:16px;';
    document.body.appendChild(modal);
  }

  const userData = (typeof currentLoggedUser !== 'undefined' && currentLoggedUser.data) ? currentLoggedUser.data : { nombre: 'Usuario', rut_limpio: '0' };
  
  // Garantizar resolución exacta del rol activo (buscando en currentLoggedUser o atributo de la vista)
  let role = (typeof currentLoggedUser !== 'undefined' && currentLoggedUser && currentLoggedUser.role) ? currentLoggedUser.role : 'ninguno';
  if (role === 'ninguno' && userData) {
    if (userData.curso && !userData.pupilo && !userData.cargo) role = 'estudiante';
    else if (userData.pupilo) role = 'apoderado';
    else if (userData.cargo) role = 'funcionario';
  }
  
  const rutKey = window.obtenerRutKeySeguro(userData);

  modal.innerHTML = `
    <div class="lirmi-modal-card" style="max-width:680px; width:100%; text-align:left; background:white; border-radius:18px; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.3); border:1px solid #cbd5e1; max-height:88vh; overflow-y:auto; animation: fadeIn 0.25s;">
      
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #cbd5e1; padding-bottom:12px; margin-bottom:16px;">
        <div>
          <h3 style="color:#047857; font-size:1.2rem; font-weight:800; margin:0; display:flex; align-items:center; gap:8px;">
            ✏️ Editar Perfil y Datos Personales
          </h3>
          <span style="font-size:0.78rem; color:#64748b;">${userData.nombre} • ${userData.curso || userData.cargo || 'Liceo de Huara'}</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="background:#ffffff; padding:4px 8px; border-radius:10px; border:1px solid #047857; box-shadow:0 2px 6px rgba(4,120,87,0.12); display:flex; align-items:center; justify-content:center;">
            <img src="assets/branding/LOGO%20DE%20LICEO%20DE%20HUARA.png" onerror="this.onerror=null;this.src='assets/branding/Logo%20oficial%20de%20toda%20la%20plataforma%20y%20proyecto.png';" alt="Logo Liceo de Huara" style="width:36px; height:36px; object-fit:contain; display:block;">
          </div>
          <button onclick="document.getElementById('edit-profile-modal').style.display='none'" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:#475569; font-weight:bold;">&times;</button>
        </div>
      </div>

      <!-- 1. FICHA OFICIAL DE MATRÍCULA -->
      <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px; margin-bottom:14px;">
        <h4 style="font-size:0.85rem; font-weight:800; color:#047857; text-transform:uppercase; margin-bottom:6px;">Ficha Oficial de Matrícula</h4>
        <div style="font-size:0.82rem; color:#334155; line-height:1.6; display:grid; grid-template-columns:1fr 1fr; gap:6px;">
          <div><strong>RUN:</strong> ${userData.rut_formato || userData.rut_limpio}</div>
          <div><strong>Curso / Nivel:</strong> ${userData.curso || userData.cargo || 'Matriculado'}</div>
          ${userData.pupilo ? `<div><strong>Pupilo Asociado:</strong> ${userData.pupilo}</div>` : ''}
          <div><strong>Estado:</strong> <span style="color:#059669; font-weight:bold;">${userData.estado || 'Activo'}</span></div>
        </div>
      </div>

      <!-- 2. EDITOR DE DATOS DE CONTACTO (TELÉFONO Y CORREO) -->
      ${(typeof window.generarHtmlEditorPerfilContacto === 'function') ? window.generarHtmlEditorPerfilContacto(userData, role) : ''}

      <!-- 3. SELECTOR DE AVATARES HD POR CATEGORÍAS (EXCLUSIVO ESTUDIANTES — BLOQUEADO PARA ADULTOS) -->
      ${(role === 'estudiante') ? `
        <div id="netflix-avatar-selector-container" style="margin-top:4px;">
          ${(typeof window.generarHtmlSelectorAvatarNetflix === 'function') ? window.generarHtmlSelectorAvatarNetflix(userData) : ''}
        </div>
      ` : '<!-- Avatar bloqueado: solo para estudiantes -->'}

      <!-- 4. DESCARGA DE RICE Y CERTIFICADO DE RECEPCIÓN -->
      ${(typeof window.generarHtmlBotonCertificadoRICE === 'function') ? window.generarHtmlBotonCertificadoRICE(userData, role) : ''}

      <!-- BOTÓN PRINCIPAL DE GUARDAR Y ACTUALIZAR -->
      <div style="margin-top:18px; border-top:1.5px solid #cbd5e1; padding-top:14px; text-align:center;">
        <div id="profile-full-save-msg-${rutKey}" style="display:none; background:#dcfce7; color:#15803d; border:1.5px solid #86efac; border-radius:12px; padding:12px; font-size:0.88rem; font-weight:800; margin-bottom:12px; animation: fadeIn 0.2s;">
          ✔️ ¡Perfil y Avatar actualizados correctamente!
        </div>
        <div style="display:flex; gap:10px; justify-content:flex-end; align-items:center;">
          <button onclick="document.getElementById('edit-profile-modal').style.display='none'" style="background:#f1f5f9 !important; color:#475569 !important; border:1px solid #cbd5e1; padding:10px 20px; border-radius:50px; font-size:0.84rem; font-weight:700; cursor:pointer;">
            Cancelar
          </button>
          <button onclick="window.guardarPerfilYActualizar('${rutKey}')" style="background:#047857 !important; color:#ffffff !important; font-weight:800; padding:12px 26px; border-radius:50px; border:none; cursor:pointer; font-size:0.88rem; box-shadow:0 4px 14px rgba(4,120,87,0.25);">
            💾 Guardar y Actualizar Perfil
          </button>
        </div>
      </div>

    </div>
  `;
  modal.style.display = 'flex';
};

window.guardarPerfilYActualizar = function(rutKey) {
  window.guardarPerfilContacto(rutKey);

  const savedAvatar = localStorage.getItem('mirice_avatar_' + rutKey) || '💻';
  const headerAvatarBadge = document.getElementById('header-user-avatar-badge');
  if (headerAvatarBadge) headerAvatarBadge.textContent = savedAvatar;

  const saveMsg = document.getElementById(`profile-full-save-msg-${rutKey}`);
  if (saveMsg) saveMsg.style.display = 'block';

  setTimeout(() => {
    const editModal = document.getElementById('edit-profile-modal');
    if (editModal) editModal.style.display = 'none';
    if (saveMsg) saveMsg.style.display = 'none';
  }, 1000);
};

// 1. Descarga RICE con propuesta de Certificado Digital
window.descargarRICEConOpcionCertificado = function() {
  const link = document.createElement('a');
  link.href = 'fuentes/RICE%20LICEO%20DE%20HUARA%202026.pdf';
  link.download = 'RICE LICEO DE HUARA 2026.pdf';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    let certModal = document.getElementById('cert-offer-modal');
    if (!certModal) {
      certModal = document.createElement('div');
      certModal.id = 'cert-offer-modal';
      certModal.className = 'lirmi-notice-modal';
      certModal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); backdrop-filter:blur(5px); z-index:10000; display:flex; align-items:center; justify-content:center; padding:16px;';
      document.body.appendChild(certModal);
    }

    certModal.innerHTML = `
      <div class="lirmi-modal-card" style="max-width:500px; width:100%; text-align:center; background:white; border-radius:18px; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.3); border:1.5px solid #6ee7b7; animation: fadeIn 0.25s;">
        <div style="font-size:3rem; margin-bottom:8px;">📜</div>
        <h3 style="color:#047857; font-size:1.2rem; font-weight:800; margin-bottom:8px;">
          ¡RICE 2026 Descargado con Éxito!
        </h3>
        <p style="font-size:0.86rem; color:#334155; line-height:1.5; margin-bottom:16px;">
          Conforme a la <strong>Circular N° 781 del Mineduc</strong>, ¿deseas generar y descargar tu <strong>Certificado Digital de Recepción y Toma de Conocimiento</strong> con folio único de verificación?
        </p>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
          <button onclick="document.getElementById('cert-offer-modal').style.display='none'; if(typeof window.descargarCertificadoRecepcionRICE==='function') window.descargarCertificadoRecepcionRICE(currentLoggedUser ? currentLoggedUser.data : null, currentLoggedUser ? currentLoggedUser.role : 'estudiante');" style="background:#047857 !important; color:#ffffff !important; font-weight:800; padding:10px 20px; border-radius:50px; border:none; cursor:pointer; font-size:0.84rem; box-shadow:0 4px 12px rgba(4,120,87,0.25);">
            📜 Sí, Descargar Certificado de Recepción
          </button>
          <button onclick="document.getElementById('cert-offer-modal').style.display='none';" style="background:#ffffff !important; color:#475569 !important; border:1.5px solid #cbd5e1 !important; font-weight:700; padding:10px 18px; border-radius:50px; font-size:0.84rem; cursor:pointer;">
            ✋ No por ahora
          </button>
        </div>
      </div>
    `;
    certModal.style.display = 'flex';
  }, 600);
};

// 2. Editor de Datos de Contacto (Teléfono y Correo)
window.generarHtmlEditorPerfilContacto = function(userData, role) {
  const rutKey = window.obtenerRutKeySeguro(userData);
  const savedContact = JSON.parse(localStorage.getItem('mirice_contact_' + rutKey) || '{}');

  const currentPhone = savedContact.telefono || userData.telefono || '+56 9 9876 5432';
  const currentEmail = savedContact.email || userData.email || (rutKey + '@liceodehuara.cl');

  return `
    <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:14px; padding:16px; margin-top:14px;">
      <h4 style="color:#047857; font-size:0.95rem; font-weight:800; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
        ✏️ Actualizar Mis Datos de Contacto
      </h4>
      <p style="font-size:0.8rem; color:#475569; margin-bottom:12px; line-height:1.4;">
        Mantén actualizada tu información de contacto para recibir notificaciones y resguardar tu comunicación con el establecimiento:
      </p>

      <div style="display:flex; flex-direction:column; gap:10px;">
        <div>
          <label style="font-size:0.8rem; font-weight:700; color:#0f172a; display:block; margin-bottom:4px;">📱 Teléfono de Contacto / WhatsApp</label>
          <input type="tel" id="contact-phone-${rutKey}" value="${currentPhone}" class="form-control" style="font-size:0.85rem; padding:8px 12px;" placeholder="+56 9 1234 5678">
        </div>
        <div>
          <label style="font-size:0.8rem; font-weight:700; color:#0f172a; display:block; margin-bottom:4px;">📧 Correo Electrónico de Notificación</label>
          <input type="email" id="contact-email-${rutKey}" value="${currentEmail}" class="form-control" style="font-size:0.85rem; padding:8px 12px;" placeholder="ejemplo@correo.cl">
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
          <button onclick="window.guardarPerfilContacto('${rutKey}')" style="background:#047857 !important; color:#ffffff !important; font-weight:800; padding:8px 18px; border-radius:50px; border:none; cursor:pointer; font-size:0.82rem; box-shadow:0 3px 10px rgba(4,120,87,0.2);">
            💾 Guardar Datos de Contacto
          </button>
          <span id="contact-save-msg-${rutKey}" style="font-size:0.75rem; color:#059669; font-weight:bold; display:none; margin-left:10px;">✔️ Guardado correctamente</span>
        </div>
      </div>
    </div>
  `;
};

window.guardarPerfilContacto = function(rutKey) {
  const phoneInput = document.getElementById(`contact-phone-${rutKey}`);
  const emailInput = document.getElementById(`contact-email-${rutKey}`);
  const phone = phoneInput ? phoneInput.value : '';
  const email = emailInput ? emailInput.value : '';

  localStorage.setItem('mirice_contact_' + rutKey, JSON.stringify({ telefono: phone, email: email }));

  const msg = document.getElementById(`contact-save-msg-${rutKey}`);
  if (msg) {
    msg.style.display = 'inline';
    setTimeout(() => { msg.style.display = 'none'; }, 3000);
  }
};

// 3. Selector de Avatar Tipo Netflix con Personajes Institucionales Generados por Categorías
window.generarHtmlSelectorAvatarNetflix = function(userData, selectedCat = 'todos') {
  const rutKey = window.obtenerRutKeySeguro(userData);
  const savedAvatar = localStorage.getItem('mirice_avatar_' + rutKey) || '💻';

  const catalog = (typeof window.RICE_AvataresCatalog !== 'undefined') ? window.RICE_AvataresCatalog : {
    categorias: [
      { id: 'todos', nombre: '🌟 Todos los Avatares' },
      { id: 'profesiones', nombre: '🎓 Profesiones y Ciencia' },
      { id: 'futbol', nombre: '⚽ Fútbol y Deportes' }
    ],
    lista: [{ id: 'inf-1', cat: 'profesiones', nombre: 'Programador / Informático', icono: '💻', bg: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)' }]
  };

  // Botones de categorías con resaltado activo garantizado
  let catBtnsHtml = '';
  catalog.categorias.forEach(cat => {
    const isActive = (cat.id === selectedCat);
    catBtnsHtml += `
      <button type="button" onclick="window.filtrarCategoriaAvatarNetflix('${rutKey}', '${cat.id}', this)" style="background-color:${isActive ? '#047857' : '#ffffff'}; color:${isActive ? '#ffffff' : '#334155'}; border:2px solid ${isActive ? '#047857' : '#cbd5e1'}; padding:7px 15px; border-radius:50px; font-size:0.78rem; font-weight:${isActive ? '800' : '600'}; cursor:pointer; white-space:nowrap; transition:all 0.2s ease; box-shadow:${isActive ? '0 4px 12px rgba(4,120,87,0.3)' : '0 2px 5px rgba(0,0,0,0.04)'}; transform:${isActive ? 'scale(1.04)' : 'scale(1)'}; margin-right:4px;">
        ${cat.nombre}
      </button>
    `;
  });

  // Lista de avatares filtrada según categoría elegida
  const avataresFiltrados = (selectedCat === 'todos') ? catalog.lista : catalog.lista.filter(a => a.cat === selectedCat);

  let gridHtml = '';
  avataresFiltrados.forEach(a => {
    const isSelected = (a.icono === savedAvatar);
    gridHtml += `
      <div onclick="window.seleccionarAvatarNetflix('${rutKey}', '${a.icono}', '${selectedCat}')" title="${a.nombre}" style="cursor:pointer; background:${a.bg}; width:62px; height:62px; border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:${isSelected ? '0 0 0 4px #10b981, 0 6px 18px rgba(16,185,129,0.3)' : '0 4px 10px rgba(0,0,0,0.08)'}; transform:${isSelected ? 'scale(1.08)' : 'scale(1)'}; transition:all 0.2s ease; position:relative;">
        <span style="font-size:2.2rem; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));">${a.icono}</span>
        ${isSelected ? '<span style="position:absolute; top:-5px; right:-5px; background:#10b981; color:white; font-size:0.7rem; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-weight:900; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.2);">✓</span>' : ''}
      </div>
    `;
  });

  return `
    <div class="avatar-selector-wrapper" data-rutkey="${rutKey}" data-cat="${selectedCat}" style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:18px; padding:18px; margin-top:10px; box-shadow:0 4px 16px rgba(0,0,0,0.04); text-align:left;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <div>
          <h4 style="color:#047857; font-size:1.02rem; font-weight:800; margin:0; display:flex; align-items:center; gap:6px;">
            🎭 Elige tu Avatar Institucional HD
          </h4>
          <span style="font-size:0.78rem; color:#475569;">Selecciona tu personaje favorito por profesión, ciencia o deporte.</span>
        </div>
        <div id="avatar-current-display-${rutKey}" style="font-size:2.6rem; background:white; padding:6px 14px; border-radius:16px; border:2.5px solid #047857; box-shadow:0 4px 12px rgba(4,120,87,0.15); display:flex; align-items:center; justify-content:center;">
          ${savedAvatar}
        </div>
      </div>

      <!-- Barra de Filtro por Categorías con Desplazamiento Suave -->
      <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:8px; margin-bottom:12px; scrollbar-width:thin;">
        ${catBtnsHtml}
      </div>

      <!-- Cuadrícula de Avatares -->
      <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-start; max-height:270px; overflow-y:auto; padding-right:4px; padding-top:4px;">
        ${gridHtml}
      </div>
    </div>
  `;
};

window.filtrarCategoriaAvatarNetflix = function(rutKey, catId, el = null) {
  let container = null;
  if (el && el.closest) {
    container = el.closest('.avatar-selector-wrapper') || el.closest('[id*="avatar-selector-container"]');
  }
  if (!container) {
    container = document.getElementById('onboarding-avatar-selector-container') ||
                document.getElementById('netflix-avatar-selector-container') ||
                document.querySelector('.avatar-selector-wrapper') ||
                document.querySelector('[id*="avatar-selector-container"]');
  }

  const userData = (typeof currentLoggedUser !== 'undefined' && currentLoggedUser && currentLoggedUser.data) ? currentLoggedUser.data : { rut_limpio: rutKey };
  if (container) {
    container.outerHTML = window.generarHtmlSelectorAvatarNetflix(userData, catId);
  }
};

window.seleccionarAvatarNetflix = function(rutKey, icono, catId = 'todos') {
  localStorage.setItem('mirice_avatar_' + rutKey, icono);
  localStorage.setItem('mirice_avatar_selected_' + rutKey, 'true');

  const display = document.getElementById(`avatar-current-display-${rutKey}`);
  if (display) display.innerHTML = icono;

  // Actualizar el avatar en el perfil del estudiante
  const perfilDisplay = document.getElementById('est-perfil-avatar-display');
  if (perfilDisplay) perfilDisplay.textContent = icono;

  // Actualizar el badge en la barra superior
  const headerBadge = document.getElementById('header-user-avatar-badge');
  if (headerBadge) headerBadge.textContent = icono;

  const userData = (typeof currentLoggedUser !== 'undefined' && currentLoggedUser && currentLoggedUser.data) ? currentLoggedUser.data : { rut_limpio: rutKey };

  const containers = document.querySelectorAll('.avatar-selector-wrapper, [id*="avatar-selector-container"]');
  containers.forEach(c => {
    c.outerHTML = window.generarHtmlSelectorAvatarNetflix(userData, catId);
  });
};

// 4. Modal de Onboarding de Selección de Avatar para Primer Inicio de Sesión
window.mostrarOnboardingAvatarModal = function(userData) {
  if (!userData) return;
  const rutKey = window.obtenerRutKeySeguro(userData);

  let modal = document.getElementById('avatar-onboarding-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'avatar-onboarding-modal';
    modal.className = 'lirmi-notice-modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.8); backdrop-filter:blur(6px); z-index:10000; display:flex; align-items:center; justify-content:center; padding:16px; animation: fadeIn 0.3s ease;';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="lirmi-modal-card" style="max-width:640px; width:100%; background:#ffffff; border-radius:22px; padding:24px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.35); border:2.5px solid #10b981; max-height:90vh; overflow-y:auto; text-align:center; animation: fadeIn 0.25s;">
      
      <!-- Encabezado de Bienvenida -->
      <div style="background:linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius:16px; padding:18px; border:1px solid #a7f3d0; margin-bottom:14px;">
        <span style="font-size:3rem; display:block; margin-bottom:4px;">🎭✨</span>
        <h2 style="color:#047857; font-size:1.3rem; font-weight:800; margin:0 0 6px 0;">
          ¡Bienvenido/a, ${userData.nombre ? userData.nombre.split(' ')[0] : 'Estudiante'}!
        </h2>
        <p style="color:#065f46; font-size:0.86rem; line-height:1.5; margin:0; font-weight:600;">
          Elige tu Avatar Institucional HD para personalizar tu perfil en MiRice. Podrás modificarlo siempre que quieras desde tu menú de perfil.
        </p>
      </div>

      <!-- Selector de Avatares Tipo Netflix -->
      <div id="onboarding-avatar-selector-container">
        ${(typeof window.generarHtmlSelectorAvatarNetflix === 'function') ? window.generarHtmlSelectorAvatarNetflix(userData) : ''}
      </div>

      <!-- Botón de Confirmación de Onboarding -->
      <div style="margin-top:18px; border-top:1.5px solid #cbd5e1; padding-top:14px; display:flex; justify-content:center;">
        <button onclick="window.finalizarOnboardingAvatar('${rutKey}')" style="background:#047857 !important; color:#ffffff !important; font-weight:800; padding:12px 32px; border-radius:50px; border:none; cursor:pointer; font-size:0.92rem; box-shadow:0 4px 14px rgba(4,120,87,0.3); transition:all 0.2s ease;">
          🚀 ¡Listo, Ingresar a MiRice!
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
};

window.finalizarOnboardingAvatar = function(rutKey) {
  localStorage.setItem('mirice_avatar_selected_' + rutKey, 'true');
  const modal = document.getElementById('avatar-onboarding-modal');
  if (modal) modal.style.display = 'none';
};

// 5. Modal de Despliegue de Notificación Diaria cuando el usuario hace clic en el Push móvil
window.mostrarModalNotificacionDiaria = function(userData) {
  const rutLimpio = (userData && userData.rut_limpio) ? userData.rut_limpio : 'estudiante';
  const fraseHoy = (typeof window.obtenerFraseDiariaPersonalizada === 'function') 
    ? window.obtenerFraseDiariaPersonalizada(rutLimpio)
    : "💡 El respeto mutuo y el diálogo son la base de la convivencia en el Liceo de Huara.";

  let modal = document.getElementById('notif-daily-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'notif-daily-modal';
    modal.className = 'lirmi-notice-modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.8); backdrop-filter:blur(6px); z-index:10000; display:flex; align-items:center; justify-content:center; padding:16px; animation: fadeIn 0.3s ease;';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="lirmi-modal-card" style="max-width:540px; width:100%; background:#ffffff; border-radius:22px; padding:24px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.35); border:2.5px solid #047857; text-align:center; animation: fadeIn 0.25s;">
      <div style="background:linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius:16px; padding:20px; border:1.5px solid #6ee7b7; margin-bottom:16px;">
        <span style="font-size:2.8rem; display:block; margin-bottom:6px;">✨📜</span>
        <h3 style="color:#047857; font-size:1.25rem; font-weight:800; margin:0 0 8px 0;">
          Mensaje Diario de Convivencia Educativa
        </h3>
        <p style="color:#065f46; font-size:0.94rem; line-height:1.6; margin:0; font-weight:700;">
          "${fraseHoy}"
        </p>
      </div>
      <div style="font-size:0.8rem; color:#64748b; margin-bottom:18px;">
        📖 Orientación humana basada en el RICE 2026 y la Circular 781 Mineduc • Liceo de Huara
      </div>
      <button onclick="document.getElementById('notif-daily-modal').style.display='none'" style="background:#047857 !important; color:#ffffff !important; font-weight:800; padding:12px 30px; border-radius:50px; border:none; cursor:pointer; font-size:0.9rem; box-shadow:0 4px 14px rgba(4,120,87,0.3); transition:all 0.2s ease;">
        👍 ¡Entendido, Continuar al Liceo!
      </button>
    </div>
  `;

  modal.style.display = 'flex';
};

// Estilos dinámicos para inyección de animaciones
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
document.head.appendChild(styleSheet);
