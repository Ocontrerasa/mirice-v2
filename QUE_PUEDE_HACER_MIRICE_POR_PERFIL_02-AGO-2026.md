# Qué puede hacer MiRice — por perfil (estado real, 02-ago-2026)

Este documento describe lo que la plataforma **efectivamente hace hoy**, verificado directamente en el código — no es una descripción aspiracional. Complementa a `MANUAL_OFICIAL_Y_GUIA_DE_USO_MIRICE_2026.md` (que explica el propósito y contexto legal del proyecto) con el detalle técnico de qué puede hacer cada perfil, incluyendo lo agregado hoy: encuesta de clima configurable, notificaciones push reales, y el acceso dual al panel admin.

Hay 4 perfiles: **Estudiante**, **Apoderado**, **Funcionario** (incluye docentes), y **Panel Admin / Directivo**.

---

## 🎒 Estudiante

**Acceso:** login con RUT + clave (los últimos 4 dígitos del RUT la primera vez; debe cambiarla antes de poder reportar).

**Puede:**
- Consultar el reglamento (RICE) conversando con el Orientador Virtual (chatbot con IA — Gemini), que responde solo con base en el reglamento real, nunca inventa normas.
- Descargar el RICE en PDF *(pendiente — ver nota abajo)*.
- Enviar un **reporte de convivencia** (acoso, violencia, discriminación, etc.), identificado o anónimo, con folio de seguimiento. Si el relato contiene señales de riesgo vital o abuso, el sistema lo marca como crítico y muestra teléfonos de emergencia de inmediato.
- Responder la **encuesta anónima semanal de clima escolar** — una vez por semana, sin poder repetirla ni ver la respuesta asociada a su identidad (ni el propio servidor puede cruzarlo).
- Activar el **aviso push semanal** de esa encuesta, para que le llegue directo al celular aunque no tenga la app abierta.
- Elegir un avatar y editar su información de contacto (teléfono/correo) — preferencia solo de ese dispositivo.
- Ver el módulo de autorregulación digital / bienestar en aula.
- Recibir una frase diaria de convivencia como notificación local (mientras usa el navegador; no es push real, ver nota técnica al final).

**No puede:** ver reportes de otras personas, ver el panel admin, ver estadísticas agregadas de la encuesta.

---

## 👨‍👩‍👧‍👦 Apoderado

**Acceso:** login con RUT + clave, igual que estudiante.

**Puede:**
- Ver el nombre y curso de su pupilo/a vinculado (nunca el RUT del estudiante).
- Consultar el reglamento con el Orientador Virtual, con respuestas orientadas a la mirada de la familia.
- Descargar el RICE y su certificado de recepción 2026.
- Enviar un reporte de convivencia (igual que estudiante).
- Responder la **encuesta anónima semanal** — *esto se corrigió hoy*: existían preguntas para apoderados desde el origen del proyecto, pero nunca se mostraba la tarjeta de la encuesta en su pantalla de inicio. Ya se agregó.
- Ver comparativa de normativa RICE general vs. Educación Parvularia.

**No puede:** ver el panel admin, ver reportes o incidentes de otras familias.

---

## 🏫 Funcionario (incluye docentes)

**Acceso:** login con RUT + clave.

**Puede, además de todo lo del apoderado:**
- Registrar un **incidente de convivencia** (bitácora de 6 secciones: involucrados, tipificación, relato, medidas, derivación) — queda guardado en la base de datos real, visible para el panel admin, con gravedad y alertas legales (TEA, abuso, drogas, embarazo) calculadas automáticamente en el servidor.
- Buscar personas (estudiantes/funcionarios) por nombre para completar el formulario de incidentes, sin ver la base completa.
- Ver sus propios incidentes ya registrados.
- Responder la encuesta de clima (preguntas propias del perfil funcionario, ej. sobre protocolos y ambiente laboral).
- **Si tiene `panel_admin = true`** (ej. Omar Contreras): ve además, dentro de su mismo perfil de funcionario, un botón **"Abrir Panel Admin"** que lo lleva directo a `admin.html` — *agregado hoy*, antes tenía que salir a la pantalla de inicio a buscar el enlace por separado.

**No puede (a menos que tenga `panel_admin`):** ver reportes/incidentes de otras personas, gestionar la encuesta, resetear claves de otros.

---

## 🛡️ Panel Admin / Directivo (`admin.html`, requiere `panel_admin = true`)

**Acceso:** el mismo login de siempre (RUT + clave) — **no existe un usuario/contraseña separado**; lo que da acceso es la columna `panel_admin` en la ficha de esa persona en la base de datos. Ver la aclaración que te di sobre esto: no hay credenciales "de admin" distintas a las tuyas.

**Puede:**
- Ver **todos** los reportes de convivencia (folio, categoría, prioridad, relato, estado) y cambiar su estado (recibido / en proceso / cerrado).
- Ver **todos** los incidentes registrados por cualquier funcionario, con badges de gravedad y alertas legales.
- Generar e imprimir **actas oficiales** de casos e incidentes.
- **Reiniciar la clave** de cualquier persona escribiendo su RUT (queda en los últimos 4 dígitos, y se le pide cambiarla de nuevo al entrar).
- **Gestionar la encuesta de clima** *(agregado hoy)*:
  - Ver todas las preguntas activas e inactivas, separadas por perfil (estudiante/apoderado/funcionario).
  - **Agregar** preguntas nuevas (texto + entre 2 y 6 alternativas), eligiendo a qué perfil se le muestran — ya no hay límite de 2 preguntas por perfil.
  - **Editar** el texto y las alternativas de una pregunta existente.
  - **Activar/Desactivar** una pregunta sin borrarla.
  - **Eliminar** una pregunta — si ya tiene respuestas asociadas, el sistema la desactiva en vez de borrarla, para no perder el historial.
  - Ver **resultados agregados** (conteo y porcentaje por alternativa) filtrando por periodo, y **exportar a CSV** para abrir en Excel/Sheets y hacer gráficos.
- Ver el checklist de auditoría normativa (Circular 781, Ley TEA, Ley 19.628, etc.).

---

## 🔔 Nota técnica: los dos tipos de "notificación" que tiene MiRice

Vale la pena que lo tengas claro porque suenan parecidos pero son cosas distintas:

1. **Frase diaria de convivencia** (`daily_notifications.js`): se muestra solo si la persona tiene la app/pestaña abierta (o muy recién estuvo abierta). No despierta el celular si la app está cerrada. Existía desde antes.
2. **Aviso push semanal de la encuesta** (`push_subscripcion.js` + `api/enviar-encuesta-semanal.js`, agregado hoy): notificación real tipo Web Push — llega aunque la app esté completamente cerrada, una vez a la semana, disparada automáticamente por un cron de Vercel. Requiere que el estudiante presione "Activar" una vez.

## 📄 Nota sobre el RICE en PDF

El botón de descarga del RICE apunta a un archivo (`fuentes/RICE LICEO DE HUARA 2026.pdf`) que **no existe en el repositorio** — no es un problema de tamaño ni de código, el archivo simplemente nunca se subió (o se perdió). El contenido del reglamento sí está disponible como texto estructurado dentro del chatbot (`rice_db.js`), pero el PDF descargable/imprimible falta. Te pasé por separado el flujo de trabajo para comprimirlo y subirlo una vez que lo ubiques.

---

*Documento generado a partir de una revisión directa del código fuente el 02-ago-2026. Si algo de esto deja de ser cierto tras futuros cambios, hay que actualizarlo — no es una promesa de marketing, es un reflejo del código.*
