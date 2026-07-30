# Reporte de Conformidad Normativa y Aseguramiento de Calidad (QA) 🛡️

Este informe detalla cómo la plataforma **MiRice** del Liceo de Huara cumple con la legislación educacional chilena vigente para el año 2026, la Circular 482 de la Superintendencia de Educación, la Ley de Garantías de la Niñez y las directrices de accesibilidad universal WCAG 2.2.

---

## 1. Cumplimiento de la Circular 482 (Superintendencia de Educación)
*   **debido proceso:** La plataforma garantiza que en todo momento se haga referencia al derecho del estudiante a ser escuchado y a la presunción de inocencia en procesos disciplinarios.
*   **Tipificación de Faltas:** La sección del RICE en el perfil del estudiante detalla claramente la clasificación de faltas (Leves, Graves y Gravísimas) de acuerdo a las circulares de la Superintendencia.
*   **Pasos Obligatorios de Protocolos:** El módulo de funcionarios cuenta con un *Timeline interactivo* que guía visualmente al docente a través de las etapas reglamentarias del protocolo de maltrato escolar, evitando la omisión de pasos legales críticos.

---

## 2. Resguardo de Estudiantes TEA (Ley de Autismo 21.545 / Circular)
*   **Alerta de Emergencia TEA:** Al registrar un incidente, si la descripción de hechos del docente detecta conceptos de crisis, autismo o desregulación emocional, el sistema inyecta automáticamente una **Alerta de Alta Prioridad Psicosocial (Ley TEA)** en la Consola Directiva.
*   **Prohibición de Exclusión:** El acta imprimible A4 del caso incorpora de forma destacada la prohibición legal de sancionar, castigar, suspender o excluir del aula a un estudiante neurodivergente debido a una desregulación emocional, ordenando medidas exclusivas de contención sensorial y derivación al Aula PIE.

---

## 3. Delitos Penales y Denuncia Obligatoria en 24 Horas
En conformidad con las directrices de la Circular 482 y las leyes penales chilenas (Ley 20.000 de Drogas y Ley de Garantías 21.430):
*   **Connotación o Abuso Sexual (Artículo 35):** Si el reporte del docente o la consulta en el chatbot de IA detecta situaciones de connotación sexual, el sistema activa una **Alerta Roja de Máxima Urgencia**.
    *   Informa que el establecimiento tiene la **obligación legal ineludible de denunciar el caso ante la justicia (Carabineros, PDI o Fiscalía) en menos de 24 horas**.
    *   Detalla que está **estrictamente prohibido realizar careos, mediaciones o investigaciones escolares internas** para evitar la revictimización y encubrimiento de un delito penal.
*   **Porte o Consumo de Sustancias Prohibidas (Artículo 36):** Activa el protocolo de drogas ante comercialización (marihuana/alcohol), detallando la obligación de aviso inmediato a apoderados, contención preventiva (SENDA) y denuncia penal en 24h ante sospecha de microtráfico.

---

## 4. Protección de Datos y Privacidad Escolar (Ley 19.628)
*   **Aislamiento y Almacenamiento Local (Offline):** La base de datos y la persistencia de los incidentes se almacena en el `localStorage` del navegador del equipo de forma local. No se transmiten datos privados del estudiante a servidores en la nube de terceros.
*   **Aislamiento de la API de Gemini:** Las consultas del Chatbot RAG envían a la API únicamente la pregunta y los fragmentos del reglamento. La identidad o datos personales del estudiante no forman parte del contexto enviado a la API de IA Studio, resguardando su privacidad digital.

---

## 5. Conclusiones de Accesibilidad Universal (WCAG 2.2 AA)
*   **Contraste de Colores (AA):** La paleta de colores del archivo CSS global se ha optimizado elevando el contraste de `--text-muted` a un valor HSL que garantiza una relación de contraste superior a 4.5:1 frente a fondos claros y oscuros.
*   **Soporte para Lectores de Pantalla:** La interfaz del chatbot cuenta con los atributos ARIA obligatorios:
    *   `aria-live="polite"` en el contenedor de mensajes para que la respuesta de la IA sea anunciada por voz en tiempo real al usuario no vidente.
    *   `aria-live="assertive"` en el indicador de carga del bot.
    *   `aria-label="Enviar pregunta al Asistente IA"` y `aria-required="true"` en los formularios de entrada de texto.
