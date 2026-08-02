/**
 * MIRICE 2026 — PROXY DEL CHATBOT (GEMINI)
 * Liceo de Huara • SLEP Tamarugal
 *
 * Antes, bot.js llamaba directo a Gemini desde el navegador con la clave en
 * la URL (`?key=...`), y la guardaba en localStorage. Cualquiera con la
 * pestaña Network abierta, o acceso al panel admin, se la llevaba. Este
 * endpoint recibe el prompt ya armado por el cliente y hace la llamada real
 * con una clave que solo existe en el servidor.
 *
 * Variable de entorno que necesita (Vercel → Settings → Environment Variables):
 *   GEMINI_API_KEY   la clave de Google AI Studio — nunca en el cliente
 *
 * Límite de frecuencia (agregado 02-ago-2026)
 * -------------------------------------------
 * Es el único endpoint sin sesión que llama a un servicio pago por uso. Sin
 * límite, cualquiera podía automatizar peticiones y agotar la cuota o subir
 * el costo de la cuenta de Gemini sin que nada lo frenara.
 */

const { excedeLimite, ipDe } = require('./_comun');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'metodo_no_permitido' });
    return;
  }

  if (excedeLimite('chat:' + ipDe(req), 20, 10 * 60 * 1000)) {
    res.status(429).json({
      error: 'demasiados_mensajes',
      texto: 'Demasiados mensajes seguidos. Espera unos minutos antes de continuar.',
    });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Sin clave configurada: bot.js cae de vuelta a su motor local (comportamiento
    // intencional, igual que antes cuando no había clave guardada en localStorage).
    res.status(501).json({ error: 'chatbot_no_configurado' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  const prompt = (body && body.prompt) ? String(body.prompt).slice(0, 8000) : '';
  if (!prompt) {
    res.status(400).json({ error: 'falta_prompt' });
    return;
  }

  try {
    const respuestaGemini = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          // thinkingLevel: "minimal" reemplaza al thinkingBudget:0 que se usaba
          // antes (actualizado 02-ago-2026: Google dejó thinking_budget como
          // parámetro heredado para los modelos 3.x, ver guía de Gemini 3.5).
          // El motivo de fondo es el mismo que el 31-jul-2026: sin acotar el
          // razonamiento interno, esos tokens se descuentan del mismo límite
          // que la respuesta visible y con maxOutputTokens bajo la respuesta
          // se cortaba a mitad de frase. También se quitó `temperature`: para
          // los modelos 3.x Google ya no recomienda fijarlo.
          generationConfig: {
            maxOutputTokens: 1024,
            thinkingConfig: { thinkingLevel: 'minimal' },
          }
        })
      }
    );

    if (!respuestaGemini.ok) {
      res.status(502).json({ error: 'gemini_no_disponible' });
      return;
    }

    const data = await respuestaGemini.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: 'gemini_no_disponible' });
  }
};
