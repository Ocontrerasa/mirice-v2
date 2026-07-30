# DESCRIPCION MAESTRA Y ARQUITECTURA COMPLETA - PROYECTO 01_MIRICE 2026

## 1. Visión General del Proyecto
**01_MiRice** es la plataforma digital web e interactiva (PWA - Progressive Web App y Web) oficial del **Reglamento Interno de Convivencia Escolar (RICE)** del **Liceo de Huara**, Comuna de Huara, Región de Tarapacá, Chile. 

El sistema está diseñado para transformar un documento normativo extenso en una experiencia accesible, interactiva, transparente y preventiva para toda la comunidad educativa: estudiantes, apoderados, docentes, asistentes de la educación, equipo directivo y educación parvularia.

---

## 2. Marco Normativo y Fundamentos Legales (Chile)
La aplicación cumple de manera rigurosa con la legislación educacional chilena vigente:
* **Circular 482 de la Superintendencia de Educación:** Normas sobre reglamentos internos de establecimientos educacionales.
* **Ley 21.430:** Ley de Garantías y Protección Integral de los Derechos de la Niñez y Adolescencia.
* **Ley 20.536:** Ley sobre Violencia Escolar y Acoso (Bullying / Cyberbullying).
* **Ley 19.628:** Protección de la Vida Privada y Tratamiento de Datos Personales.
* **Orientaciones Subsecretaría de Educación Parvularia:** Enfoque en el interés superior del niño/a, juego, afectividad y no sanción punitiva en la primera infancia.

---

## 3. Arquitectura del Sistema y Tecnologías
* **Frontend Core:** HTML5 Semántico, JavaScript Moderno (ES6+ Vanilla), CSS3 con variables HSL, Glassmorphism, animaciones fluídas y responsive design.
* **PWA & Capacidades Offline:** Service Worker (`sw.js`), Manifest (`manifest.json`), instalación nativa en Android/iOS/Desktop y almacenamiento local (`localStorage` / `indexedDB`).
* **Buscador Inteligente:** Buscador contextual (`search_engine.js`) con auto-sugerencias, resaltado de términos, filtros por categoría/rol y búsqueda semántica local.
* **Módulos JS Especializados (`src/js/`):**
  - `app.js`: Lógica principal de navegación, control de perfiles y renderizado dinámico.
  - `admin.js`: Panel de administración, métricas, gestión de reportes y bitácora.
  - `bot.js`: Asistente de inteligencia de convivencia y consultas del RICE.
  - `rice_db.js`: Base de datos estructurada con títulos, capítulos, artículos, faltas y sanciones.
  - `climate_survey.js`: Módulo de encuestas de clima escolar y bienestar socioemocional.
  - `parvularia_module.js`: Adaptación específica para primera infancia y párvulos.
  - `digital_wellness.js`: Módulo de bienestar digital, uso responsable de redes y ciudadanía digital.
  - `daily_notifications.js`: Sistema de notificaciones diarias, tips formativos y reflexiones.
  - `bitacora_export.js`: Exportador de reportes en PDF/JSON.
  - `certificate_generator.js`: Generador de certificados de compromiso y firma de apoderados.

---

## 4. Perfiles de Usuario y Funcionalidades Principales

### A. Estudiantes (Básica y Media)
- Lectura interactiva por temas de interés (derechos, deberes, uso de celulares, uniformes, asistencia).
- Botón rápido de reporte/denuncia segura o solicitud de orientación.
- Trivias formativas, frases diarias de motivación y bienestar socioemocional.

### B. Apoderados y Familias
- Consulta directa de compromisos, deberes parentales y protocolos de actuación.
- Generación y firma digital/descarga de certificado de recepción del RICE.
- Módulo de crianza respetuosa y resolución pacífica de conflictos en el hogar.

### C. Educación Parvularia / Primera Infancia
- Interfaz adaptada con lenguaje lúdico e iconografía comprensible.
- Protocolos de buen trato, contención afectiva y apego seguro.

### D. Docentes y Equipo de Convivencia
- Acceso rápido a protocolos de actuación obligatorios (maltrato, ciberacoso, conductas de riesgo, drogas, vulneración de derechos).
- Flujogramas paso a paso con plazos legales de activación.

### E. Panel Administrador (`admin.html`)
- Tablero de control (Dashboard) con métricas de visitas, consultas frecuentes y encuestas de clima.
- Gestión de bitácora institucional y descarga de respaldos de información.

---

## 5. Estructura de Archivos del Proyecto
```
01_MiRice/
├── index.html                  # Portal principal con selector de perfiles y vistas del RICE
├── denuncia.html               # Formulario seguro de reportes y denuncias
├── admin.html                  # Panel administrativo y métricas
├── politicas.html              # Políticas de privacidad y datos
├── terminos.html               # Términos y condiciones de uso
├── test_search.html            # Entorno de pruebas del motor de búsqueda
├── manifest.json               # Configuración PWA para instalación móvil
├── sw.js                       # Service Worker para cache y funcionamiento offline
├── vercel.json                 # Configuración de despliegue en Vercel
├── assets/                     # Logos, branding e íconos institucionales
└── src/
    ├── css/
    │   └── styles.css          # Sistema de diseño centralizado
    └── js/                     # Scripts lógica cliente/servidor mock
```

---

## 6. Objetivos Específicos para la Depuración en ChatGPT Pro
1. **Unificación y corrección de scripts:** Resolver cualquier error sintáctico o de vinculación entre `index.html`, `app.js`, `rice_db.js` y `search_engine.js`.
2. **Garantizar la reactividad:** Verificar que el selector de roles filtre y muestre correctamente las secciones sin romperse.
3. **Validar PWA y Service Worker:** Asegurar que `sw.js` registre correctamente sin errores de consola en navegadores móviles.
4. **Formulario de Denuncia Integrado:** Confirmar que `denuncia.html` almacene o procese las solicitudes correctamente.
5. **Garantizar Accesibilidad (WCAG 2.2):** Mantener navegación por teclado, contrastes HSL adecuados y etiquetas `aria-*`.
