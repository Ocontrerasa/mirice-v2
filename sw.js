const CACHE_NAME = 'mirice-pwa-v7.4.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './denuncia.html',
  './terminos.html',
  './politicas.html',
  './src/css/styles.css',
  './src/css/mirice-responsive.css',
  './src/js/app.js',
  './src/js/bot.js',
  './src/js/search_engine.js',
  './src/js/rice_db.js',
  // liceo_db.js queda fuera a propósito: son 481 estudiantes con RUT,
  // curso, teléfono y correo. Precachearlo lo deja disponible sin
  // internet en cualquier dispositivo que haya abierto la app una vez.
  './src/data/frases_db.js',
  './src/js/daily_notifications.js',
  './src/js/digital_wellness.js',
  './src/js/climate_survey.js',
  './src/js/push_subscripcion.js',
  './src/js/certificate_generator.js',
  // cloud_storage.js y bitacora_export.js retirados el 02-ago-2026 (ver
  // index.html) — si siguieran en esta lista, cache.addAll() fallaría al
  // intentar descargar un archivo que ya no existe y rompería el modo
  // offline completo, no solo el de estos dos archivos.
  './src/js/parvularia_module.js',
  './assets/branding/Logo_MiRice_Tarapaca.svg',
  './assets/branding/Logo oficial de toda la plataforma y proyecto.png',
  './assets/branding/Logo MiRice Android.png',
  './assets/branding/Logo MiRice IOS.png',
  './assets/branding/LOGO DE LICEO DE HUARA.png',
  // LOGO DEL LICEO DE HUARA REDONDO.png ya no se precachea: no está
  // referenciado en ningún HTML/JS actual (29-jul-2026). Si se vuelve a
  // usar, hay que agregarlo aquí de nuevo — pero ya optimizado (262 KB,
  // antes 9.7 MB) no sería tan grave si se reincorpora.
  './assets/branding/Logo convivencia educativa liceo huara tamarugal.jpg'
];

// Instalación del Service Worker: Guardar recursos estáticos en caché
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker ' + CACHE_NAME + '] Guardando assets oficiales...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activación del Service Worker: Eliminar cachés antiguas inmediatamente
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando caché obsoleta:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Mensaje desde la aplicación (Actualización forzada)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Recepción de Notificaciones Push (Publicaciones y Actualizaciones del RICE)
self.addEventListener('push', (event) => {
  let data = { title: 'MiRice - Actualización Oficial', body: 'Se ha publicado una nueva actualización en la plataforma RICE 2026.' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }
  const options = {
    body: data.body,
    icon: './assets/branding/Logo MiRice Android.png',
    badge: './assets/branding/Logo MiRice Android.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || './index.html' }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Clic en Notificación Push enviada al usuario (Soporte Móvil / PWA)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const relUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : './index.html?notif=daily';
  const targetUrl = new URL(relUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 1. Si la aplicación ya está abierta en una pestaña o PWA, enfocarla y navegar
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url && client.url.includes('index.html') && 'focus' in client) {
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // 2. Si no hay ventanas abiertas, abrir la app en el destino exacto
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Estrategia de Caché: Network First con Cache Fallback
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  // /api/ nunca se cachea: son reportes, login y casos, no assets estáticos.
  if (new URL(event.request.url).pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

