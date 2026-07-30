# Entrega Paso 3 — denuncia.html conectado a Convivencia real

**Fecha:** 28 de julio de 2026
**Objetivo de esta sesión:** que `denuncia.html` deje de guardar en el teléfono
del estudiante y empiece a llegar de verdad a Convivencia.

---

## 0. Dos hallazgos que cambian el diagnóstico

Antes de tocar `denuncia.html` revisé el repo real (`MiRice-main.zip`) para
compararlo con lo que decían los diagnósticos. Dos cosas no coinciden:

### 0.1 El Paso 1 y el Paso 2 nunca llegaron al repositorio

`ENTREGA_PASO_1.md` y `ENTREGA_PASO_2.md` describen un backend completo
(`api/_comun.js`, `login.js`, `reporte.js`, `casos.js`, `cambiar-clave.js`,
`esquema.sql`) ya "listo, verificado, sin desplegar". Ese "sin desplegar" era
literal: el repo que bajaste de GitHub no tiene carpeta `/api` en absoluto, ni
`mirice-responsive.css`, ni el `vercel.json` sin CORS abierto. Los diagnósticos
describían archivos preparados en una carpeta de trabajo, no el estado del
repositorio. Esta entrega es la primera que efectivamente toca el repo.

### 0.2 `sw.js` precachea `liceo_db.js` — hallazgo nuevo, no estaba en los tres diagnósticos

El service worker real (`sw.js` línea 13, antes de esta entrega) incluye
`./src/data/liceo_db.js` en `ASSETS_TO_CACHE`. Eso significa que cualquier
dispositivo que abrió la app una vez tiene los 481 estudiantes —RUT, curso,
teléfono, correo— guardados localmente y disponibles **sin internet**. Es una
exposición más persistente que tenerlo solo en Vercel, porque sobrevive incluso
si el archivo se saca del despliegue. Lo saqué del precache en esta entrega
(§2.3), pero **eso no reemplaza la Vía 0**: mientras `liceo_db.js` siga en el
repositorio y en el historial de Git, cada visita nueva lo vuelve a cachear.
Sigue siendo lo primero que hay que resolver, antes que esto.

---

## 1. Qué llegó en esta entrega

| Archivo | Qué cambia | Reemplaza a |
|---|---|---|
| `api/_comun.js` | Utilidades de servidor (RUT, hash, sesión, Supabase) — sin cambios respecto al Paso 1 | No existía en el repo |
| `api/reporte.js` | Endpoint `POST /api/reporte` — sin cambios respecto al Paso 1 | No existía en el repo |
| `denuncia.html` | Ya no guarda en `localStorage` ni descarga un `.txt`: llama a `/api/reporte` de verdad | El `denuncia.html` actual del repo |
| `src/css/mirice-responsive.css` | Capa de responsividad, enlazada desde `denuncia.html` | No existía en el repo |
| `sw.js` | Sin `liceo_db.js` en el precache, con la capa responsiva agregada, sin cachear `/api/`, versión subida | El `sw.js` actual del repo |
| `vercel.json` | Sin `Access-Control-Allow-Origin: *`, con cabeceras de seguridad | El `vercel.json` actual del repo |

---

## 2. Qué cambió en `denuncia.html`, y por qué

### 2.1 El envío ahora es real

Antes: `submit` escribía en cuatro colecciones de `localStorage`, generaba un
`.txt` confidencial y lo descargaba automáticamente al dispositivo, y mostraba
el panel de éxito sin haber hablado nunca con un servidor.

Ahora: `submit` llama a `fetch('/api/reporte', { method: 'POST', ... })`. El
panel de éxito solo aparece si el servidor respondió `201` con
`estado: "recibido"`. Si la base falla, se muestra el error tal como lo entrega
`reporte.js` — nunca "enviado" cuando no fue así.

### 2.2 Los campos del formulario no calzaban con el contrato de la API

`reporte.js` acepta `categoria` (una lista fija: acoso, violencia,
discriminación, ciberacoso, robo, drogas, armas, maltrato_adulto, autolesión,
vulneración, transporte, otro), `relato`, `identificarse`, `contacto`, `rol`.
El formulario tenía "asunto" con los protocolos del RICE (`Protocolo 6:
consumo o venta de drogas...`), que es otra clasificación.

Resolví esto con `mapAsuntoACategoria()`: una función que traduce el asunto
elegido a la categoría más cercana por palabras clave. Es una heurística, así
que puede fallar en casos límite — pero la prioridad real (`critica` o
`normal`) la calcula el servidor leyendo el relato completo con sus propios
patrones de riesgo vital y abuso sexual, no esta categoría. Un error de
clasificación aquí no baja la urgencia de un caso grave.

El resto del contexto que antes iba en campos separados (protocolo interno,
si ya se informó a un adulto) ahora se pliega dentro del `relato`, porque es
el único lugar del contrato donde cabe.

### 2.3 Tres cosas que saqué del formulario, con la razón

- **Los adjuntos.** El input de archivos pedía hasta 10MB pero no había
  ningún lugar del backend que los recibiera — ni antes (se "guardaban" en el
  propio teléfono) ni ahora (`reporte.js` no tiene ese campo). Lo reemplacé
  por una nota que dice exactamente eso, en vez de dejar un botón que promete
  algo que no ocurre.
- **La descarga automática del `.txt`.** Generaba un archivo con el relato
  completo y lo bajaba al dispositivo sin preguntar, pensado para un flujo
  manual que ya no existe. Además era en sí mismo una fuga: cualquiera con
  acceso al teléfono podía abrir la carpeta de Descargas y leer reportes
  ajenos.
- **Los cuatro `localStorage.setItem` de "trazabilidad".** Guardaban el
  reporte completo, sin cifrar, en el navegador del estudiante. Ahora el
  reporte vive donde corresponde: en la base de datos, detrás de
  autenticación de servidor.

### 2.4 Lo que agregué

- **Contacto opcional.** Un campo de texto libre (`contacto`, hasta 200
  caracteres) para quien quiera dejar un correo, teléfono o el nombre de su
  profesor jefe. No existía antes.
- **Casilla de identificación**, oculta mientras no haya sesión iniciada.
  `reporte.js` exige que identificarse sea una decisión explícita de la
  persona, no algo que el sistema asuma — por eso es una casilla aparte y no
  algo automático. Se activa sola cuando el login (Paso 4, más abajo) empiece
  a guardar la sesión.
- **Tarjeta de crisis**, con los mismos tres teléfonos que ya usa `bot.js`
  (600 360 7777, 147, 717, 131), para que la persona vea la misma información
  sin importar si entró por el chat o por este formulario. Aparece cuando el
  servidor detecta riesgo vital o abuso en el relato y responde
  `tipo: "crisis"`.
- **Bug que arreglé de paso:** el bloque de autoguardado de borrador
  (`camposAutoguardado`) referenciaba `nombreInput`, `rutInput`,
  `subjectSelect` y otras variables que nunca se declaraban en este archivo —
  quedaban de una versión anterior del formulario. Tiraban
  `ReferenceError` apenas cargaba la página (después de que el botón de
  envío ya estaba conectado, así que el envío igual funcionaba, pero el
  autoguardado nunca corrió). Lo reescribí contra los campos que realmente
  existen: descripción, asunto y contacto.

### 2.5 Lo que dejé exactamente igual

Los cinco protocolos condicionales de UI (mostrar/ocultar "otra causa",
mostrar/ocultar "a quién se informó"), la validación de campos requeridos, y
el aviso legal de cabecera. No hacía falta tocarlos.

---

## 3. Antes de subir esto a producción

Tres cosas, en este orden:

### 3.1 Variables de entorno en Vercel

`api/_comun.js` y `api/reporte.js` no funcionan sin esto (Vercel → Settings →
Environment Variables):

```
SUPABASE_URL             https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY     la clave service_role, nunca la anon
MIRICE_PEPPER            cadena aleatoria larga y fija
MIRICE_SECRETO_SESION    otra cadena aleatoria larga, distinta de la anterior
TELEFONO_CONVIVENCIA     el número real al que derivar si el registro falla
RESEND_API_KEY           tu clave de Resend
AVISO_CORREO_DESTINO     omar.contreras@edu.sleptamarugal.gob.cl
AVISO_CORREO_REMITENTE   opcional — si no se define, usa onboarding@resend.dev
```

Para las dos cadenas aleatorias:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Se corre dos veces, una por cadena. **`MIRICE_PEPPER` no se cambia después de
cargar la nómina** — si se rota, todos los RUT dejan de calzar.

### 3.2 La base en Supabase

`esquema.sql` (ya lo tienes del Paso 1) todavía no está aplicado en ningún
proyecto de Supabase, según lo que muestra el repo. Sin las tablas `reportes`
y `reporte_eventos`, `POST /api/reporte` responde `503` siempre — que es el
comportamiento correcto (no dice "enviado" si no se guardó), pero nadie va a
poder reportar hasta que la base exista.

### 3.3 Confirmar Resend

Con `RESEND_API_KEY` y `AVISO_CORREO_DESTINO` configurados, el aviso llega por
correo. El cuerpo del correo trae folio, categoría, prioridad y hora — nunca
el relato ni el nombre de nadie, tal como dice el contrato de `reporte.js`;
hay que entrar al panel para leer el caso.

---

## 4. Cómo probarlo antes de anunciarlo

1. Con las variables de entorno puestas y la base creada, entra a
   `denuncia.html`, llena el formulario y envíalo.
2. Debe aparecer el panel de éxito con un folio real (no un `Denuncia-171...`
   generado en el navegador).
3. Revisa que llegó el correo a `omar.contreras@edu.sleptamarugal.gob.cl`.
4. Prueba un relato con una frase como "ya no quiero seguir viviendo" — debe
   aparecer la tarjeta roja con los teléfonos antes que cualquier otra cosa.
5. Apaga el wifi a mitad del envío — debe aparecer el mensaje de "no hay
   conexión", no un falso "enviado".

---

## 5. Lo que sigue

Con esto cerrado, la Vía 1 queda así:

- [x] S1 parcial — este archivo específico, con su backend
- [ ] **S3 · Login** — `app.js` sigue validando con los últimos 4 dígitos del
      RUT contra `liceo_db.js` en el navegador. `api/login.js` y
      `api/cambiar-clave.js` ya están escritos (Paso 1) pero, igual que
      `reporte.js` hasta hoy, nunca se copiaron al repo. Es la siguiente
      sesión.
- [ ] **Vía 0** — sigue sin hacerse: `liceo_db.js` y `fuentes/` fuera del
      repositorio y del historial de Git. Esta entrega la hace un poco más
      urgente, no menos: ahora que se ve que ni el Paso 1 ni el Paso 2 se
      habían aplicado, hay que asumir que nada de lo "listo" en un diagnóstico
      anterior está realmente en producción hasta confirmarlo archivo por
      archivo — como pasó hoy con `sw.js`.
