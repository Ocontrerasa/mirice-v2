/**
 * SISTEMA DE NOTIFICACIONES PUSH NATIVAS Y FRASES ALEATORIAS PERSONALIZADAS
 * MiRice — Liceo de Huara
 * 
 * Funcionalidad:
 * 1. Selecciona un mensaje único y aleatorio para CADA usuario en CADA día lectivo (1 Mar - 21 Dic, Lunes a Viernes).
 * 2. Ningún estudiante recibe el mismo mensaje el mismo día (algoritmo determinista hash por RUT + Fecha).
 * 3. Se envía como una NOTIFICACIÓN PUSH NATIVA del sistema móvil/escritorio (tipo mensaje de texto).
 */

(function () {
  // Función Hash determinista para aleatorizar el mensaje por RUT + Fecha
  function calcularHashUsuarioFecha(rut, fechaKey) {
    const semilla = (rut || 'invitado_mirice') + '_' + fechaKey;
    let hash = 0;
    for (let i = 0; i < semilla.length; i++) {
      hash = ((hash << 5) - hash) + semilla.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  // Verificar si la fecha está dentro del año lectivo (1 de Marzo al 21 de Diciembre) y es Lunes a Viernes
  function esDiaLectivoEscolar(fecha) {
    const mes = fecha.getMonth() + 1; // 1 = Enero, 3 = Marzo, 12 = Diciembre
    const diaMes = fecha.getDate();
    const diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ..., 5 = Viernes, 6 = Sábado

    // Solo de Lunes (1) a Viernes (5)
    if (diaSemana === 0 || diaSemana === 6) return false;

    // Rango: 1 de Marzo al 21 de Diciembre
    if (mes < 3 || mes > 12) return false;
    if (mes === 12 && diaMes > 21) return false;

    return true;
  }

  // Obtener la frase personalizada del día para el usuario
  window.obtenerFraseDiariaPersonalizada = function (rut) {
    const hoy = new Date();
    const fechaKey = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');

    if (typeof FRASES_CONVIVENCIA_MIRICE === 'undefined' || FRASES_CONVIVENCIA_MIRICE.length === 0) {
      return "💡 El respeto mutuo y el diálogo son la base de la convivencia en el Liceo de Huara. ¡Que tengas un excelente día!";
    }

    const hash = calcularHashUsuarioFecha(rut, fechaKey);
    const indice = hash % FRASES_CONVIVENCIA_MIRICE.length;

    return FRASES_CONVIVENCIA_MIRICE[indice];
  };

  // Programar o enviar la Notificación Push Nativa del Sistema
  window.desplegarNotificacionDiariaConvivencia = function (rutUsuario) {
    const hoy = new Date();

    // 1. Verificar si hoy es día lectivo (Marzo - Diciembre, Lunes a Viernes)
    if (!esDiaLectivoEscolar(hoy)) {
      console.log('📅 MiRice: Hoy no es día lectivo escolar. Notificación suspendida.');
      return;
    }

    const fechaKey = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');
    const storageKey = 'mirice_daily_notif_sent_' + fechaKey;

    // 2. Evitar enviar más de una notificación por día en el mismo dispositivo
    if (localStorage.getItem(storageKey) === 'true') {
      console.log('🔔 MiRice: La notificación diaria de hoy ya fue entregada.');
      return;
    }

    // 3. Obtener la frase aleatoria personalizada para este usuario hoy
    const mensajeHoy = window.obtenerFraseDiariaPersonalizada(rutUsuario);

    // 4. Comprobar permisos de Notificación Web
    if (!('Notification' in window)) {
      console.log('⚠️ Las notificaciones no son soportadas en este navegador.');
      return;
    }

    if (Notification.permission === 'granted') {
      enviarNotificacionNativa(mensajeHoy, storageKey);
    } else if (Notification.permission !== 'denied') {
      // Solicitar permiso de notificaciones al usuario discretamente
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          enviarNotificacionNativa(mensajeHoy, storageKey);
        }
      });
    }
  };

  // Función de Envío de Notificación Nativa del Sistema Móvil/Escritorio
  function enviarNotificacionNativa(mensaje, storageKey) {
    const titulo = "✨ MiRice — Mensaje del Día";
    const opciones = {
      body: mensaje,
      icon: './assets/branding/Logo MiRice Android.png',
      badge: './assets/branding/Logo MiRice Android.png',
      tag: 'mirice-daily-phrase',
      renotify: true,
      vibrate: [100, 50, 100],
      data: { url: './index.html?notif=daily' }
    };

    // Intentar enviar mediante el Service Worker (para notificaciones nativas móviles tipo SMS)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(titulo, opciones);
        localStorage.setItem(storageKey, 'true');
        console.log('📲 Notificación Push Nativa entregada exitosamente vía Service Worker.');
      }).catch(err => {
        // Fallback a Notificación Web Estándar si el Service Worker no responde
        new Notification(titulo, opciones);
        localStorage.setItem(storageKey, 'true');
      });
    } else {
      // Fallback Estándar
      new Notification(titulo, opciones);
      localStorage.setItem(storageKey, 'true');
    }
  }

})();
