/**
 * MÓDULO DE TERMÓMETRO DE CLIMA ESCOLAR SEMANAL — MIRICE 2026
 * Liceo de Huara • Enfoque Anónimo y Estadístico
 *
 * Reescrito el 02-ago-2026: antes el banco de preguntas vivía fijo en este
 * archivo y las respuestas se guardaban solo en localStorage del propio
 * navegador (nunca salían de ese dispositivo, y el "ya respondiste" se podía
 * evadir cambiando de navegador o borrando datos). Ahora todo pasa por
 * /api/encuesta: las preguntas se administran desde el panel admin y el
 * control de "una sola vez por semana" lo hace el servidor con el hash del
 * RUT — ver api/encuesta.js para el detalle de cómo se preserva el anonimato
 * de igual forma (la respuesta en sí nunca lleva el hash de quien la envió).
 */

(function () {

  // Renderiza la tarjeta de encuesta. Como ahora depende de una llamada al
  // servidor, primero pinta un estado "cargando" y reemplaza el contenido
  // cuando llega la respuesta.
  window.generarHtmlTermometroClima = function (role, rut) {
    // Dispara la carga real de forma asíncrona; el contenedor se reemplaza
    // solo cuando la respuesta esté lista.
    setTimeout(() => window.cargarTermometroClima(), 0);

    return `
      <div id="card-termometro-clima" style="background:#ffffff; border:1.5px solid #cbd5e1; border-left:5px solid #047857; border-radius:16px; padding:18px; margin-top:14px; box-shadow:0 4px 16px rgba(0,0,0,0.04);">
        <div style="display:flex; align-items:center; gap:8px; color:#64748b; font-size:0.85rem;">
          <span>📊 Cargando encuesta anónima de esta semana…</span>
        </div>
      </div>
    `;
  };

  window.cargarTermometroClima = async function () {
    const card = document.getElementById('card-termometro-clima');
    if (!card) return;

    let data;
    try {
      const resp = await fetch('/api/encuesta', {
        headers: { Authorization: 'Bearer ' + (window.miriceSesionToken || '') }
      });
      data = await resp.json();
      if (!resp.ok || !data || data.estado !== 'ok') throw new Error('respuesta_no_ok');
    } catch (e) {
      card.innerHTML = `
        <p style="font-size:0.82rem; color:#64748b; margin:0;">
          No se pudo cargar la encuesta de esta semana. Intenta más tarde.
        </p>`;
      return;
    }

    if (data.ya_respondio) {
      card.outerHTML = `
        <div id="card-termometro-clima" style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; margin-top:14px; box-shadow:0 4px 14px rgba(0,0,0,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
            <span style="font-size:0.75rem; font-weight:800; color:#047857; background:#e6f4ea; padding:3px 10px; border-radius:50px;">📊 RESPUESTA REGISTRADA (${data.periodo})</span>
            <span style="font-size:0.75rem; color:#64748b; font-weight:600;">🔒 100% Anónimo</span>
          </div>
          <h4 style="font-size:0.95rem; font-weight:800; color:#0f172a; margin-bottom:6px;">¡Gracias por participar en el Termómetro de Clima Escolar! 👋</h4>
          <p style="font-size:0.84rem; color:#334155; line-height:1.45; margin:0;">${data.texto}</p>
        </div>`;
      return;
    }

    if (!data.preguntas || data.preguntas.length === 0) {
      card.innerHTML = `
        <p style="font-size:0.82rem; color:#64748b; margin:0;">
          Por ahora no hay preguntas activas para tu perfil. Vuelve a revisar la próxima semana.
        </p>`;
      return;
    }

    window._encuestaPreguntasActuales = data.preguntas;

    const preguntasHtml = data.preguntas.map((p, i) => `
      <div style="margin-bottom:14px;">
        <label style="font-size:0.85rem; font-weight:700; color:#0f172a; display:block; margin-bottom:6px;">
          ${i + 1}. ${p.texto}
        </label>
        <select id="clima-p-${p.id}" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.85rem; background:#ffffff; color:#0f172a;">
          <option value="">-- Selecciona una opción --</option>
          ${(p.opciones || []).map(o => `<option value="${o}">${o}</option>`).join('')}
        </select>
      </div>
    `).join('');

    card.outerHTML = `
      <div id="card-termometro-clima" style="background:#ffffff; border:1.5px solid #cbd5e1; border-left:5px solid #047857; border-radius:16px; padding:18px; margin-top:14px; box-shadow:0 4px 16px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:10px;">
          <span style="font-size:0.75rem; font-weight:800; color:#047857; background:#e6f4ea; padding:3px 10px; border-radius:50px;">📊 ENCUESTA ANÓNIMA SEMANAL (${data.periodo})</span>
          <span style="font-size:0.75rem; color:#047857; font-weight:700;">🔒 100% Anónimo y Estadístico</span>
        </div>
        <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin-bottom:6px;">🌱 Termómetro de Clima Escolar</h4>
        <p style="font-size:0.82rem; color:#334155; line-height:1.45; margin-bottom:14px;">
          Tu respuesta ayuda al Liceo de Huara a tomar decisiones para mejorar la convivencia y el bienestar comunitario. <strong>Las respuestas son completamente anónimas y no se asocian a tu nombre ni RUT.</strong>
        </p>
        <form id="form-clima-semanal" onsubmit="window.guardarRespuestaClima(event)">
          ${preguntasHtml}
          <button type="submit" class="btn-primary" style="background:linear-gradient(135deg, #047857 0%, #065f46 100%); color:white; font-weight:bold; padding:10px 18px; border-radius:50px; border:none; cursor:pointer; width:100%; font-size:0.85rem;">
            📩 Enviar Respuesta Anónima
          </button>
        </form>
      </div>
    `;
  };

  window.guardarRespuestaClima = async function (event) {
    event.preventDefault();

    const preguntas = window._encuestaPreguntasActuales || [];
    const respuestas = [];
    for (const p of preguntas) {
      const sel = document.getElementById('clima-p-' + p.id);
      if (!sel || !sel.value) {
        alert('⚠️ Debes responder todas las preguntas antes de enviar.');
        return;
      }
      respuestas.push({ pregunta_id: p.id, opcion_texto: sel.value });
    }

    const btn = event.target.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.7'; }

    try {
      const resp = await fetch('/api/encuesta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (window.miriceSesionToken || '')
        },
        body: JSON.stringify({ respuestas })
      });
      const data = await resp.json();

      if (resp.status === 409) {
        // Ya se había registrado (ej. dos pestañas abiertas) — no es un
        // error real, solo recargamos para mostrar el estado correcto.
        window.cargarTermometroClima();
        return;
      }
      if (!resp.ok || !data || data.estado !== 'ok') {
        alert('⚠️ No se pudo registrar tu respuesta. Intenta de nuevo en un momento.');
        if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
        return;
      }

      alert('✅ ¡Gracias! Tu opinión anónima fue registrada exitosamente para las estadísticas institucionales.');
      window.cargarTermometroClima();
    } catch (e) {
      alert('⚠️ No se pudo conectar. Revisa tu internet e intenta de nuevo.');
      if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
    }
  };

  // TABLERO VISUAL DE TENDENCIAS DE CLIMA PARA LA DIRECCIÓN Y COORDINACIÓN
  // Ahora vive en el panel admin real (admin.html), con datos de verdad de
  // Supabase — ver la sección "Encuesta de Clima" ahí. Esta función queda
  // solo para no romper la llamada existente en app.js; ya no muestra nada
  // en la vista de funcionario porque duplicaba, con datos locales, lo que
  // el panel admin ya hace bien.
  window.generarHtmlTableroDireccionClima = function () {
    return '';
  };

})();
