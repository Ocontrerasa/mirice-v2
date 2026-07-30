/**
 * MÓDULO DE CONVIVENCIALIDAD Y PICTOGRAMAS PARA EDUCACIÓN PARVULARIA (NT1 Y NT2)
 * Liceo de Huara • Orientaciones Subsecretaría de Educación Parvularia
 * 
 * Funcionalidad:
 * 1. Tarjetas pictográficas de buen trato, emociones e inclusión para párvulos (Pre-kínder y Kínder).
 * 2. Sintetizador de voz Web Speech API (Narración en audio) para que niños que aún no leen escuchen la historia.
 * 3. Enfoque 100% lúdico, afectivo y no punitivo.
 */

(function () {

  const CUENTOS_PICTOGRAMAS_PARVULARIA = [
    {
      id: "p1",
      icono: "🤝",
      titulo: "Compartir y Jugar Juntos",
      colorBorder: "#10b981",
      colorBg: "#ecfdf5",
      relato: "En el Liceo de Huara todos somos amigos. Cuando compartimos los juguetes y los lápices de colores, jugar es mucho más divertido y feliz.",
      audioTexto: "En el Liceo de Huara todos somos amigos. Cuando compartimos los juguetes y los lápices de colores, jugar es mucho más divertido y feliz."
    },
    {
      id: "p2",
      icono: "🗣️",
      titulo: "Hablar con Calma y Cariño",
      colorBorder: "#3b82f6",
      colorBg: "#eff6ff",
      relato: "Si algo me da rabia o pena, se lo digo con amor a mi educadora o a mis amigos. Usar palabras amables nos llena el corazón.",
      audioTexto: "Si algo me da rabia o pena, se lo digo con amor a mi educadora o a mis amigos. Usar palabras amables nos llena el corazón."
    },
    {
      id: "p3",
      icono: "🧸",
      titulo: "Cuidar a mis Compañeritos",
      colorBorder: "#8b5cf6",
      colorBg: "#f5f3ff",
      relato: "Si veo que un amiguito está solito o triste, me acerco a invitarlo a jugar. Todos tenemos un espacio bonito en nuestra sala.",
      audioTexto: "Si veo que un amiguito está solito o triste, me acerco a invitarlo a jugar. Todos tenemos un espacio bonito en nuestra sala."
    },
    {
      id: "p4",
      icono: "☀️",
      titulo: "Pedir Disculpas y Dar Abrazos",
      colorBorder: "#f59e0b",
      colorBg: "#fffbebfb",
      relato: "Si sin querer paso a llevar a alguien, le pido disculpas de corazón y le doy un abrazo. Aprender a reparar nos hace más fuertes.",
      audioTexto: "Si sin querer paso a llevar a alguien, le pido disculpas de corazón y le doy un abrazo. Aprender a reparar nos hace más fuertes."
    }
  ];

  // Función de síntesis de voz (Audio Narrado para párvulos)
  window.reproducirAudioParvularia = function (texto, btnElem = null) {
    if (!('speechSynthesis' in window)) {
      alert('🔊 Tu navegador no soporta lectura de audio automática.');
      return;
    }

    try {
      // Reanudar síntesis si estaba pausada por políticas del navegador
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      // Cancelar cualquier lectura previa
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(texto);
      // Cargar y seleccionar la mejor voz en español chileno / latinoamericano
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = voices.find(v => (v.lang.toLowerCase().includes('es-cl') || v.lang.toLowerCase().includes('es_cl')));
      
      if (!selectedVoice) {
        selectedVoice = voices.find(v => {
          const l = v.lang.toLowerCase();
          return (l.includes('es-419') || l.includes('es-mx') || l.includes('es-ar') || l.includes('es-co') || l.includes('es-us'));
        });
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith('es') && !v.lang.toLowerCase().includes('es-es'));
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith('es'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        utterance.lang = 'es-CL';
      }

      utterance.rate = 0.92;
      utterance.pitch = 1.05;

      if (btnElem) {
        const textoOriginal = btnElem.innerHTML;
        btnElem.innerHTML = "🔊 Reproduciendo Narración...";
        btnElem.style.background = "#059669";
        utterance.onend = function() {
          btnElem.innerHTML = textoOriginal;
          btnElem.style.background = "#047857";
        };
        utterance.onerror = function() {
          btnElem.innerHTML = textoOriginal;
          btnElem.style.background = "#047857";
        };
      }

      window.speechSynthesis.speak(utterance);
    } catch(e) {
      console.warn("Speech Synthesis error:", e);
    }
  };

  // Toggle para desplegar / ocultar los audiolibros de primera infancia
  window.toggleAudiolibrosParvularia = function(btnElem) {
    const container = document.getElementById('parvularia-audiobooks-container');
    if (!container) return;
    const isHidden = (container.style.display === 'none' || !container.style.display);
    if (isHidden) {
      container.style.display = 'block';
      if (btnElem) {
        btnElem.innerHTML = '🔽 Ocultar Audiolibros';
        btnElem.style.background = '#475569';
      }
    } else {
      container.style.display = 'none';
      if (btnElem) {
        btnElem.innerHTML = '▶️ Reproducir y Ver Audiolibros de Primera Infancia';
        btnElem.style.background = '#047857';
      }
    }
  };

  // Generar HTML del Módulo Parvulario con Invitación Previa para Apoderados
  window.generarHtmlModuloParvularia = function () {
    let tarjetasHtml = "";

    CUENTOS_PICTOGRAMAS_PARVULARIA.forEach(p => {
      tarjetasHtml += `
        <div style="background:${p.colorBg}; border:2px solid ${p.colorBorder}; border-radius:16px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; gap:10px; box-shadow:0 4px 12px rgba(0,0,0,0.03); text-align:left;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:2.2rem; background:white; padding:8px 12px; border-radius:14px; border:1px solid rgba(0,0,0,0.08);">${p.icono}</span>
            <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin:0;">${p.titulo}</h4>
          </div>
          <p style="font-size:0.86rem; color:#1e293b; line-height:1.5; margin:0; font-weight:500;">
            "${p.relato}"
          </p>
          <button onclick="window.reproducirAudioParvularia('${p.audioTexto.replace(/'/g, "\\'")}', this)" style="background:#047857 !important; color:#ffffff !important; border:none; padding:9px 16px; border-radius:50px; font-weight:800; font-size:0.82rem; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px; margin-top:4px; box-shadow:0 3px 10px rgba(4,120,87,0.25);">
            🔊 Escuchar Cuento Narrado
          </button>
        </div>
      `;
    });

    return `
      <!-- MÓDULO DE DE CUENTOS Y AUDIOBOOKS PARA PÁRVULOS Y PRIMER CICLO -->
      <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:18px; padding:20px; box-shadow:0 4px 16px rgba(0,0,0,0.04); margin-top:14px; text-align:left;">
        
        <!-- Tarjeta Invitación para Apoderados con Niños Pequeños -->
        <div style="background:linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border:1.5px solid #a7f3d0; border-radius:16px; padding:18px;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:2.4rem;">👶🎧</span>
              <div>
                <h3 style="font-size:1.08rem; font-weight:800; color:#047857; margin:0;">
                  Historias y Audiolibros de Buen Trato para Párvulos y Primer Ciclo
                </h3>
                <span style="font-size:0.75rem; font-weight:800; color:#047857; background:#ffffff; padding:2px 10px; border-radius:50px; border:1px solid #10b981;">
                  Educación Parvularia NT1, NT2 y 1er Ciclo
                </span>
              </div>
            </div>
          </div>
          <p style="font-size:0.86rem; color:#065f46; line-height:1.5; margin:0 0 14px 0; font-weight:600;">
            💡 <strong>Estimado/a Apoderado/a:</strong> Si su hijo o pupilo pertenece a los cursos más pequeños (Educación Parvularia o Primer Ciclo), le invitamos a compartir y reproducir juntos esta serie de historias con audios narrados y pictogramas sobre empatía, juego y convivencia.
          </p>
          <div>
            <button type="button" onclick="window.toggleAudiolibrosParvularia(this)" style="background:#047857 !important; color:#ffffff !important; font-weight:800; border:none; padding:10px 24px; border-radius:50px; font-size:0.86rem; cursor:pointer; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 14px rgba(4,120,87,0.25); transition:all 0.2s ease;">
              ▶️ Reproducir y Ver Audiolibros de Primera Infancia
            </button>
          </div>
        </div>

        <!-- Contenedor Desplegable de Audiolibros (Oculto por defecto para no saturar a todos los apoderados) -->
        <div id="parvularia-audiobooks-container" style="display:none; margin-top:16px;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:14px;">
            ${tarjetasHtml}
          </div>
        </div>
      </div>
    `;
  };

})();
