/**
 * MIRICE 2026 — SUSCRIPCIÓN A NOTIFICACIONES PUSH REALES
 * Liceo de Huara • SLEP Tamarugal
 *
 * A diferencia de daily_notifications.js (que solo puede mostrar un aviso
 * mientras la pestaña está abierta o recién estuvo activa), esto usa el
 * estándar Web Push: una vez que la persona acepta, el navegador queda
 * suscrito y el servidor puede despertarlo con un aviso aunque la app esté
 * cerrada — así llega el aviso semanal de la encuesta (ver
 * api/enviar-encuesta-semanal.js).
 *
 * La llave pública VAPID no es secreta — está pensada para ir en el
 * navegador, es la contraparte de la llave privada que solo vive en las
 * variables de entorno del servidor.
 */

(function () {
  const VAPID_PUBLIC_KEY = 'BI6wtqwniBvT2wwMMBTPSIICKXi0x1m-9syccFJnI0LkdOODrGjvBrGfwhGgqsVafxi-VXltLjGPQ4lfW61HvgU';

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Devuelve 'no_soportado' | 'denegado' | 'ya_suscrito' | 'suscrito' | 'error'
  window.suscribirNotificacionesPush = async function () {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return 'no_soportado';
    }

    try {
      const registro = await navigator.serviceWorker.ready;

      let permiso = Notification.permission;
      if (permiso === 'default') {
        permiso = await Notification.requestPermission();
      }
      if (permiso !== 'granted') return 'denegado';

      let suscripcion = await registro.pushManager.getSubscription();
      const yaEstaba = !!suscripcion;
      if (!suscripcion) {
        suscripcion = await registro.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      const plano = suscripcion.toJSON();
      const resp = await fetch('/api/push-suscribir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (window.miriceSesionToken || ''),
        },
        body: JSON.stringify({ endpoint: plano.endpoint, keys: plano.keys }),
      });
      if (!resp.ok) return 'error';

      try { localStorage.setItem('mirice_push_suscrito', 'true'); } catch (e) {}
      return yaEstaba ? 'ya_suscrito' : 'suscrito';
    } catch (e) {
      console.warn('[push] no se pudo suscribir:', e);
      return 'error';
    }
  };

  // Tarjeta que invita a activar el aviso, para pintar en el inicio del
  // estudiante. Se oculta sola si el navegador no soporta push, si ya
  // rechazó el permiso antes, o si ya está suscrito en este dispositivo.
  window.generarHtmlInvitacionPush = function () {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return '';
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') return '';
    let yaSuscrito = false;
    try { yaSuscrito = localStorage.getItem('mirice_push_suscrito') === 'true'; } catch (e) {}
    if (yaSuscrito) return '';

    return `
      <div id="card-invitacion-push" style="background:#ecfdf5; border:1.5px solid #a7f3d0; border-radius:14px; padding:14px 16px; margin-top:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div style="font-size:0.82rem; color:#065f46;">
          🔔 <strong>Activa el aviso semanal</strong> de la encuesta de bienestar — te llega directo al celular, sin tener que acordarte de entrar.
        </div>
        <button onclick="window.activarInvitacionPush(this)" style="background:#047857; color:white; font-weight:700; padding:8px 16px; border-radius:50px; border:none; cursor:pointer; font-size:0.8rem; white-space:nowrap;">
          Activar
        </button>
      </div>
    `;
  };

  window.activarInvitacionPush = async function (btn) {
    if (btn) { btn.disabled = true; btn.textContent = 'Activando…'; }
    const resultado = await window.suscribirNotificacionesPush();
    const card = document.getElementById('card-invitacion-push');

    const mensajes = {
      suscrito: '✅ Listo, activaste el aviso semanal.',
      ya_suscrito: '✅ Ya estabas suscrito en este dispositivo.',
      denegado: '⚠️ Bloqueaste el permiso de notificaciones. Actívalo desde la configuración del navegador si cambias de opinión.',
      no_soportado: 'ℹ️ Tu navegador no soporta notificaciones push.',
      error: '⚠️ No se pudo activar. Intenta de nuevo más tarde.',
    };

    if (card) {
      if (resultado === 'suscrito' || resultado === 'ya_suscrito') {
        card.outerHTML = '';
      } else if (btn) {
        btn.disabled = false;
        btn.textContent = 'Activar';
        alert(mensajes[resultado] || mensajes.error);
      }
    }
  };

})();
