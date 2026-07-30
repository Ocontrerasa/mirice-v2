/**
 * ORIENTADOR RAG INTELIGENTE — MiRice 2026 v5
 * Liceo de Huara • RICE 2026
 * MOTOR v5: CRISIS VITAL + NLP CHILENO + SCORING MEJORADO + ANTI-SPAM + ANALYTICS
 */
const RICE_Bot = {
	// 28-jul-2026: la clave de Gemini ya no vive en el navegador (antes se
	// guardaba en localStorage y viajaba en la URL de cada solicitud). Ahora
	// solo existe como variable de entorno GEMINI_API_KEY en el servidor;
	// ver api/chat.js.
	_ultimoTema: null,
	_ultimaPerspectiva: null,
	_historialConversacion: [],
	_ultimoEnvio: 0,

	comprenderMensaje: function(texto, rol) {
		let q = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

		// MEJORA 1: Vocabulario chileno estudiantil extendido
		q = q
			.replace(/\b(bulying|bulin|bully|buli|acosao|molestando|molestao|pelan|pelando|pelaron|cargando|cargaron|cargao|webeo|webeando|webiar)\b/g, 'acoso')
			.replace(/\b(pofe|profe|profes|profeso|profesora|profee|pjefe)\b/g, 'docente')
			.replace(/\b(pega|pegan|pegaron|pegaro|pegame|golpe|golpearon|peliar|agredieron|pelea|empujo|empujaron|cachetearon|cacheteo|zamparon)\b/g, 'violencia')
			.replace(/\b(pololo|polola|polol|pololio|pareja|novio|novia|pololeo)\b/g, 'pololeo')
			.replace(/\b(droga|drogas|mariua|marihuana|piti|pito|cigarro|vape|vapear|vapeo|falopa|pasto|faso|yesca|porro|pasta base|cocaina)\b/g, 'drogas')
			.replace(/\b(arma|cuchio|cuchillo|navaja|pistola|punzon|cortapluma|escopeta|explosivo)\b/g, 'armas')
			.replace(/\b(robo|robaron|hurtar|hurtaron|sacaron|sustrajeron|afanaron)\b/g, 'robo')
			.replace(/\b(atraso|tarde|lleguetarde|llegue\s+tarde)\b/g, 'atraso')
			.replace(/\b(celu|celular|telefono|telef|pantalla|smartphone)\b/g, 'celular')
			.replace(/\b(sancion|anotacion|suspendio|suspendieron|expulsaron|rajaron)\b/g, 'sancion')
			.replace(/\b(palomilla|cabros|cabras|chiquillos|chiquillas)\b/g, 'estudiante')
			.replace(/\b(dupla|psicologo|sicolog[ao]|asistente social|orientador[ao]?)\b/g, 'dupla_psicosocial')
			.replace(/\b(udi|utp|inspector[ao]?|inspectoria)\b/g, 'directivo');

		const perspectiva = {
			esApoderado: (rol === 'apoderado') || /\b(mi\s+(hijo|hija|pupilo|alumno|chico|chica)|como\s+apoderado|como\s+padre|como\s+mama|como\s+papa|mi\s+chiquillo|mi\s+cabro)\b/.test(q),
			esTercero: /\b(companer[ao]|amig[ao]|un\s+alumno|una\s+alumna|alguien|otro\s+estudiante|mi\s+amig[ao]|vi\s+que|me\s+conto|escuche\s+que)\b/.test(q),
			esSiMismo: /\b(me\s+(pasa|ocurre|hicieron|dijeron|siento|pegan|pegaron|molesta|asusta)|yo\s+(tengo|tuve|fui|estoy)|a\s+mi|tengo\s+miedo|no\s+se\s+que\s+hacer|que\s+hago)\b/.test(q),
			esFuncionario: (rol === 'funcionario'),
		};

		const scores = {
			ARMAS: 0, DROGAS: 0, ACOSO: 0, VIOLENCIA: 0, VIOLENCIA_PAREJA: 0,
			EMBARAZO: 0, ROBO: 0, DOCENTE: 0, ATRASO: 0, CELULAR: 0,
			FALTA_SANCION: 0, DERECHOS: 0, SALUD: 0, CONDUCTO_REGULAR: 0,
			SEGUIMIENTO: 0, AMBIGUO: 0, NEURODIVERSIDAD: 0, MALTRATO_ADULTO: 0,
		};

		// MEJORA 3: CRISIS VITAL — prioridad máxima absoluta
		const CRISIS_VITAL_RE = /\b(suicid|quitarse la vida|hacerse da[n\u00f1]o|no quiero vivir|no quiero seguir|ya no aguanto|me voy a matar|autoles|cortarse|tirarse|me quiero morir)\b/i;
		if (CRISIS_VITAL_RE.test(q)) {
			this._ultimoTema = 'CRISIS_VITAL';
			return { tema: 'CRISIS_VITAL', scores, perspectiva, q, tieneSeniales: true, URGENTE: true };
		}

		// Violencia en el pololeo
		if (/\b(polol|parej|novi)/i.test(q) && /\b(pega|golp|violenc|maltrat|amenaz|empuj|agred|insult)/i.test(q)) scores.VIOLENCIA_PAREJA += 30;
		if (/\b(violencia de pareja|abuso emocional|relacion toxica|relacion violenta)/i.test(q)) scores.VIOLENCIA_PAREJA += 25;

		// Seguimiento contextual
		if (this._ultimoTema && /\b(que\s+(debo|tengo|puedo|hago)\s+hacer|como\s+(procedo|actuo|hago)|pero\s+que|que\s+sigue|siguiente\s+paso)\b/.test(q)) scores.SEGUIMIENTO += 15;

		// Conducto regular
		if (/\b(conducto regular|canal|atencion|jerarquia|recurro|acudo|consulto|pasos para|procedimiento)\b/i.test(q)) scores.CONDUCTO_REGULAR += 18;

		// Scores principales
		if (/\b(armas|arma|cuchill|navaj|pisto|escopet|punzon|explosiv)\b/i.test(q)) scores.ARMAS += 12;
		if (/\b(drogas|droga|mariu|cocain|alcohol|borrach|curad|adiccion|fuma|fumar|cigarr|vape|tabac)\b/i.test(q)) scores.DROGAS += 12;
		if (/\b(acoso|bull|hostig|discrim|burl|ridicul|aislad|excluid|molest|insult)\b/i.test(q)) scores.ACOSO += 12;
		if (/\b(internet|redes|whatsapp|instagram|tiktok)\b/.test(q) && /\b(acoso|amenaza|foto|viral)\b/.test(q)) scores.ACOSO += 8;
		if (/\b(no quiere ir|no quiero ir|miedo al liceo)\b/.test(q)) scores.ACOSO += 6;
		if (/\b(robo|robar|robado|hurt|sustrac|mochila|pertenenc)\b/i.test(q)) scores.ROBO += 12;
		if (/\b(violencia|pelea|rina|agred|golp|puno|patad|atac)\b/i.test(q)) scores.VIOLENCIA += 12;
		if (/\b(embaraz|bebe|guagua|maternidad|paternidad|prenatal)\b/i.test(q)) scores.EMBARAZO += 12;
		if (/\b(profesor|profesora|docente|profe|funcionario|inspector|inspectora|director|directora|asistente|auxiliar|adulto)\b/i.test(q)) scores.DOCENTE += 6;
		// MALTRATO_ADULTO: prioridad alta cuando la mención a un adulto del liceo
		// viene junto a una palabra de maltrato — antes esto solo activaba DOCENTE
		// (respuesta genérica de "habla con tu profesor"), ignorando que podía
		// tratarse de exactamente la persona que está maltratando (29-jul-2026).
		if (/\b(profesor|profesora|docente|profe|funcionario|inspector|inspectora|director|directora|asistente|auxiliar|adulto)\b/i.test(q) &&
			/\b(maltrat|trata\s*mal|me\s*trata|insult|humill|grit|golpe|abus|amenaz|acos|toc[oa]|discrimin)\b/i.test(q)) {
			scores.MALTRATO_ADULTO += 22;
		}
		if (/\b(atraso|tarde|inasis|mandaron a la casa)\b/i.test(q)) scores.ATRASO += 12;
		if (/\b(celu|celular|telefono|pantalla)\b/g.test(q)) scores.CELULAR += 12;
		if (/\b(sancion|suspen|expul|anota|castig|apelar)\b/i.test(q)) scores.FALTA_SANCION += 12;

		// MEJORA 5: Derechos y normativa mejorada
		if (/\b(circular\s*482|ley\s*21\.?430|ley\s*20\.?536|ley\s*19\.?628|mineduc|superintendencia)\b/i.test(q)) scores.DERECHOS += 20;
		if (/\b(derecho a|tengo derecho|mis derechos|puedo apelar|protocolo|normativa|reglamento)\b/i.test(q)) scores.DERECHOS += 14;
		if (/\b(derecho|garanti|protec)\b/i.test(q)) scores.DERECHOS += 8;

		if (/\b(trist|depres|ansied|crisi|llorand|autoles|duelo|autismo|tea)\b/i.test(q)) scores.SALUD += 12;

		// Neurodiversidad / TEA / NEE
		if (/\b(autismo|tea|trastorno espectro|asperger|neurodiversidad|nee|necesidades educativas|discapacidad|desregulacion|sensorial)\b/i.test(q)) scores.NEURODIVERSIDAD += 25;

		// MEJORA 2: Multiplicadores contextuales
		if (perspectiva.esSiMismo) {
			if (scores.ACOSO > 0)            scores.ACOSO            = Math.round(scores.ACOSO * 1.5);
			if (scores.VIOLENCIA > 0)        scores.VIOLENCIA        = Math.round(scores.VIOLENCIA * 1.5);
			if (scores.VIOLENCIA_PAREJA > 0) scores.VIOLENCIA_PAREJA = Math.round(scores.VIOLENCIA_PAREJA * 1.6);
		}
		if (/\b(siempr|repetid|muchas veces|todo el rato|todos los dias|constantement)\b/i.test(q)) {
			if (scores.ACOSO > 0)     scores.ACOSO     += 10;
			if (scores.VIOLENCIA > 0) scores.VIOLENCIA += 10;
		}
		if (/\b(golpe|puno|patad|cachet|sangr|lesion|herida|lastim)\b/i.test(q)) {
			if (scores.VIOLENCIA > 0) scores.VIOLENCIA += 12;
			if (scores.ACOSO > 0)    scores.ACOSO     += 8;
		}

		// Ambiguo
		if (texto.trim().length < 15) scores.AMBIGUO += 20;
		if (/^(hola|ayuda|auxilio|que hago|no se|dudas?|consulta|necesito ayuda)$/.test(q.trim())) scores.AMBIGUO += 15;

		let maxScore = 0;
		let temaGanador = 'NINGUNO';
		for (const [tema, puntaje] of Object.entries(scores)) {
			if (puntaje > maxScore) { maxScore = puntaje; temaGanador = tema; }
		}
		if (temaGanador === 'SEGUIMIENTO' && this._ultimoTema) temaGanador = this._ultimoTema;

		if (temaGanador !== 'AMBIGUO' && temaGanador !== 'NINGUNO' && temaGanador !== 'SEGUIMIENTO') {
			this._ultimoTema = temaGanador;
			this._ultimaPerspectiva = perspectiva;
			// MEJORA 4: Historial multi-turno
			if (!this._historialConversacion) this._historialConversacion = [];
			this._historialConversacion.push({ tema: temaGanador, q, ts: Date.now() });
			if (this._historialConversacion.length > 5) this._historialConversacion.shift();
			// MEJORA 10: Analytics anónimo
			try {
				const _log = JSON.parse(localStorage.getItem('mirice_bot_analytics') || '[]');
				_log.push({ tema: temaGanador, ts: Date.now(), rol });
				if (_log.length > 200) _log.shift();
				localStorage.setItem('mirice_bot_analytics', JSON.stringify(_log));
			} catch(e) {}
		}
		return { tema: temaGanador, scores, perspectiva, q, tieneSeniales: maxScore > 0 };
	},

	botonInvitacion: function(pregunta, analisis) {
		const q = pregunta.replace(/'/g, '').replace(/"/g, '');
		const { tema, perspectiva: p } = analisis;
		const BTNS = {
			ARMAS: { i: '🚨', t: 'Alertar ahora al Equipo de Convivencia — es urgente' },
			DROGAS: p.esApoderado ? { i: '🏥', t: 'Pedir entrevista confidencial con la Dupla Psicosocial' } : p.esTercero ? { i: '🤝', t: 'Notificar anónimamente la situación de mi compañero/a' } : { i: '💚', t: 'Conversar en privado con la Dupla Psicosocial' },
			ACOSO: p.esApoderado ? { i: '🛡️', t: 'Solicitar protección formal para mi pupilo/a' } : p.esTercero ? { i: '🚨', t: 'Avisar de forma anónima por mi compañero/a' } : { i: '🛡️', t: 'Notificar mi situación de forma confidencial' },
			ROBO: { i: '🎒', t: 'Notificar o solicitar indagación por pérdida de pertenencias' },
			VIOLENCIA: { i: '⚖️', t: 'Reportar este hecho al Equipo de Convivencia' },
			VIOLENCIA_PAREJA: { i: '💜', t: 'Solicitar contención confidencial con la Dupla Psicosocial' },
			EMBARAZO: { i: '🌱', t: 'Coordinar apoyo reservado con la Dupla Psicosocial' },
			DOCENTE: p.esApoderado ? { i: '📅', t: 'Solicitar cita con el docente a través de Convivencia' } : { i: '📚', t: 'Consultar sobre mi derecho a ser atendido' },
			ATRASO: { i: '📝', t: 'Registrar el motivo de mi atraso o inasistencia' },
			CELULAR: { i: '📱', t: 'Consultar sobre este derecho con Convivencia' },
			FALTA_SANCION: { i: '⚖️', t: 'Solicitar orientación sobre el proceso o apelar' },
			DERECHOS: { i: '📋', t: 'Solicitar orientación formal sobre mis derechos' },
			SALUD: { i: '💙', t: 'Solicitar apoyo reservado con la Dupla Psicosocial' },
			CONDUCTO_REGULAR: { i: '📋', t: 'Solicitar atención o cita por Conducto Regular' },
			NEURODIVERSIDAD: { i: '🧩', t: 'Coordinar Plan de Apoyo con el equipo de Inclusión' },
			CRISIS_VITAL: { i: '🆘', t: 'Conectar AHORA con la Dupla Psicosocial — urgente' },
			NINGUNO: { i: '📩', t: 'Consultar o notificar a Convivencia Educativa' },
			AMBIGUO: { i: '💬', t: 'Cuéntanos más sobre tu situación' },
		};
		const b = BTNS[tema] || BTNS.NINGUNO;
		const s = 'background:linear-gradient(135deg,#047857 0%,#065f46 100%); color:#fff !important; border:none; font-weight:800; font-size:0.82rem; padding:11px 22px; border-radius:50px; cursor:pointer; box-shadow:0 4px 12px rgba(4,120,87,0.28);';
		return `<div style="background:#ecfdf5; border:1.5px solid #6ee7b7; border-radius:12px; padding:14px; margin-top:16px; text-align:center;"><span style="font-size:0.78rem; color:#065f46; display:block; margin-bottom:10px;">🔒 Tu comunicación es 100% privada — Circular 482 Mineduc y Ley N° 21.430</span><button onclick="window.irAReporteConfidencial('${q}');" style="${s}">${b.i} ${b.t}</button></div>`;
	},

	obtenerContencionEmpatica: function(nombre, rol, tema, esFueraDeColegio = false) {
		if (esFueraDeColegio) return `<div style="background:#fefce8; border-left:4.5px solid #eab308; padding:13px 16px; border-radius:12px; margin-bottom:14px; color:#713f12; font-size:0.88rem; line-height:1.55;"> 💛 <strong>Hola, ${nombre}. Te escuchamos con mucha atención, respeto y cariño.</strong><br> Aunque las normas del RICE 2026 rigen formalmente dentro del liceo, tu salud y bienestar están por encima de todo. Estamos aquí para orientarte sin juzgarte jamás. </div>`;
		if (rol === 'apoderado') return `<div style="background:#f0fdf4; border-left:4.5px solid #10b981; padding:13px 16px; border-radius:12px; margin-bottom:14px; color:#065f46; font-size:0.88rem; line-height:1.55;"> 💚 <strong>Hola, ${nombre}. Comprendemos profundamente su inquietud como familia.</strong><br> En el Liceo de Huara su tranquilidad y la protección integral de su hijo/a son nuestra máxima prioridad. Le escuchamos con empatía y estricta confidencialidad. </div>`;
		if (rol === 'funcionario') return `<div style="background:#f0f9ff; border-left:4.5px solid #0284c7; padding:13px 16px; border-radius:12px; margin-bottom:14px; color:#075985; font-size:0.88rem; line-height:1.55;"> 🤝 <strong>Estimado/a docente o colaborador/a, ${nombre}.</strong><br> Acompañamos su labor con contención y apoyo profesional alineado al RICE 2026 y la Ley de Inclusión. </div>`;
		return `<div style="background:#ecfdf5; border-left:4.5px solid #047857; padding:13px 16px; border-radius:12px; margin-bottom:14px; color:#047857; font-size:0.88rem; line-height:1.55;"> 🤗 <strong>Hola, ${nombre}. Te escuchamos con mucha empatía, respeto y comprensión.</strong><br> Queremos que sepas que en tu liceo no estás solo/a. Tus sentimientos nos importan profundamente. </div>`;
	},

	generarRespuesta: function(pregunta, analisis, resultados, nombre) {
		const { tema, perspectiva: p } = analisis;
		const btn = this.botonInvitacion(pregunta, analisis);
		const es = p.esApoderado;
		const rol = es ? 'apoderado' : (p.esFuncionario ? 'funcionario' : 'estudiante');
		const qLower = pregunta.toLowerCase();
		const esFueraDeColegio = ['casa', 'hogar', 'afuera', 'calle', 'redes', 'fin de semana', 'barrio'].some(w => qLower.includes(w));
		const bannerEmpatico = this.obtenerContencionEmpatica(nombre, rol, tema, esFueraDeColegio);
		const cita = (prot, art) => `<span style="font-size:0.78rem; color:#64748b; display:block; margin-top:6px;">📖 <em>${prot}${art ? ' • Art. ' + art : ''} — RICE 2026 • Liceo de Huara</em></span>`;

		switch(tema) {

		// CRISIS VITAL — PRIORIDAD MÁXIMA
		case 'CRISIS_VITAL':
			return `<div style="background:#fef2f2; border-left:5px solid #dc2626; padding:16px 18px; border-radius:14px; margin-bottom:14px; color:#7f1d1d; font-size:0.95rem; line-height:1.7; box-shadow:0 4px 15px rgba(220,38,38,0.15);">
🆘 <strong>Hola, ${nombre}. Lo que me compartes es lo más importante que puedo escuchar hoy.</strong><br><br>
No estás solo/a. Hay personas que quieren ayudarte ahora mismo:<br><br>
📞 <strong>Línea de Crisis: 600 360 7777</strong> (MINSAL — gratuita, 24/7)<br>
📞 <strong>Fono Infancia: 147</strong> (SENAME — gratuita para jóvenes)<br>
📞 <strong>Teléfono de la Esperanza: 717</strong> (gratuita, 24/7)<br><br>
En el <strong>Liceo de Huara</strong>, la Dupla Psicosocial está disponible para escucharte hoy mismo en total privacidad.
</div>
<div style="text-align:center; margin-top:12px;">
<button onclick="window.irAReporteConfidencial('necesito ayuda urgente');" style="background:linear-gradient(135deg,#dc2626,#991b1b); color:#fff; font-weight:900; font-size:0.9rem; padding:14px 28px; border-radius:50px; border:none; cursor:pointer; box-shadow:0 4px 15px rgba(220,38,38,0.35);">
🆘 Conectar AHORA con la Dupla Psicosocial
</button>
</div>`;

		// NEURODIVERSIDAD / TEA / NEE
		case 'NEURODIVERSIDAD':
			return `${bannerEmpatico}En el <strong>Liceo de Huara</strong> la diversidad de formas de aprender es un valor que celebramos.<br><br>
El <strong>Protocolo N° 14 del RICE 2026</strong> establece apoyos para estudiantes con NEE o TEA:<br><br>
📌 <strong>Plan de Apoyo Individualizado (PAI):</strong> elaborado con la familia y especialistas.<br>
📌 <strong>Adecuaciones Curriculares:</strong> evaluaciones y metodologías adaptadas.<br>
📌 <strong>Espacio de Calma:</strong> zona segura ante desregulación emocional.<br>
📌 <strong>Dupla Psicosocial:</strong> acompañamiento permanente y coordinación con CESFAM.<br><br>
<em>¿Le gustaría coordinar una reunión con el equipo de inclusión?</em>${btn}`;

		// CONDUCTO REGULAR
		case 'CONDUCTO_REGULAR':
			if (es) return `${bannerEmpatico}En el <strong>Liceo de Huara</strong> el Conducto Regular es una garantía de que su voz será escuchada (<strong>RICE 2026 Art. 31 y Circular 482</strong>).<br><br>📌 <strong>1° Nivel — Profesor/a Jefe:</strong> para inquietudes pedagógicas del día a día.<br><br>📌 <strong>2° Nivel — Convivencia Educativa / Dupla Psicosocial:</strong> para temas de convivencia o apoyo emocional.<br><br>📌 <strong>3° Nivel — Dirección del Liceo:</strong> para casos de mayor complejidad.<br><br>💬 <em>¿Le gustaría coordinar una reunión?</em>${btn}`;
			return `${bannerEmpatico}El <strong>Liceo de Huara</strong> tiene un equipo dispuesto a escucharte:<br><br>📌 <strong>1. Tu Profesor/a Jefe:</strong> para orientarte en clases y convivencia diaria.<br><br>📌 <strong>2. Convivencia Educativa y Dupla Psicosocial:</strong> si necesitas desahogarte o recibir ayuda reservada.<br><br>📌 <strong>3. Dirección del Liceo:</strong> para inquietudes de mayor alcance.<br><br>💬 <em>¿Hay algún tema en el que te gustaría que te acompañemos hoy?</em>${btn}`;

		// DROGAS
		case 'DROGAS':
			if (esFueraDeColegio) return `${bannerEmpatico}Fuera del liceo, las normas disciplinarias del RICE no aplican como castigos. Nuestro enfoque es 100% de salud y apoyo.<br><br>La <strong>Dupla Psicosocial</strong> puede orientarte en privado sobre cómo apoyar a tu amigo/a (SENDA Previene / CESFAM), con protección absoluta de tu identidad (Circular 482 y Ley 21.430). ${cita('Protocolo N° 6 — Apoyo de Salud y Prevención', '')}${btn}`;
			if (es) return `${bannerEmpatico}El liceo <strong>no busca sancionar, sino apoyar la salud del estudiante (Protocolo N° 6)</strong>.<br><br>Si el hecho ocurre dentro del establecimiento, se tipifica como Falta Gravísima (Art. 17) y activa acompañamiento psicológico y citación a apoderados para un plan de apoyo integral (SENDA Previene / CESFAM). ${cita('Protocolo N° 6 y Art. 17', '')}${btn}`;
			if (p.esTercero) return `${bannerEmpatico}Tu identidad queda <strong>100% protegida</strong> al avisar. El objetivo del liceo es brindar ayuda médica y psicológica, no castigar. ${cita('Protocolo N° 6', '')}${btn}`;
			return `${bannerEmpatico}Tu salud y bienestar son lo primero. Tienes derecho a orientación privada con la Dupla Psicosocial sin ser juzgado/a. ${cita('Protocolo N° 6 — Apoyo Socioemocional', '')}${btn}`;

		// AMBIGUO
		case 'AMBIGUO':
			return `👋 <strong>Hola, ${nombre}.</strong> Estoy aquí para orientarte.<br><br>Para ayudarte mejor, <strong>cuéntame un poco más sobre lo que te preocupa</strong>.<br><br>💡 <em>${es ? '¿Es algo que está viviendo su pupilo/a, una situación con un docente, o un tema de convivencia?' : '¿Es algo que te está pasando a ti o a alguien más? ¿Tiene que ver con convivencia, normas, o algo personal?'}</em><br><br>📌 <em>Todo lo que compartas es privado — Liceo de Huara.</em>`;

		// ARMAS
		case 'ARMAS':
			if (es) return `👨‍👩‍👧‍👦 <strong>Hola, ${nombre}. Esto es urgente — el Liceo debe actuar de inmediato.</strong><br><br>El <strong>Protocolo N° 7 del RICE 2026</strong> activa de inmediato llamado a <strong>Carabineros de Huara</strong>, aislamiento seguro de la zona y ningún estudiante debe confrontar a la persona involucrada.${btn}`;
			if (p.esTercero) return `🤝 <strong>Hola, ${nombre}. Gracias por alertar — tu identidad queda completamente protegida (Circular 482 y Ley 21.430).</strong><br><br>El equipo directivo actúa de inmediato al recibir el aviso. <strong>No intervengas directamente</strong> — tu rol es avisar.${btn}`;
			return `⚠️ <strong>Hola, ${nombre}. Esto necesita atención urgente del Liceo.</strong><br><br>El <strong>RICE 2026 (Protocolo N° 7 — Falta Gravísima)</strong> requiere respuesta inmediata. <strong>Avisa ahora a un adulto responsable.</strong> ${btn}`;

		// ACOSO
		case 'ACOSO':
			if (es) return `👨‍👩‍👧‍👦 <strong>Hola, ${nombre}. Usted hizo lo correcto al buscar orientación — el liceo tiene la obligación de actuar.</strong><br><br>1. <strong>Solicitar entrevista urgente con el Profesor Jefe</strong> (pida fecha y hora).<br>2. Si no responde en 48 horas, <strong>escale a Convivencia Educativa</strong> — tienen el deber legal de activar el Protocolo N° 1.<br>3. <strong>Documente los hechos</strong>: fechas, situaciones, evidencias (capturas, testigos).<br><br>El liceo resguardará a su pupilo/a en aula y recreos sin exponerlo/a jamás. ${cita('Protocolo N° 1 de Acoso Escolar', '')}${btn}`;
			if (p.esTercero) return `🤝 <strong>Hola, ${nombre}. Es muy valioso que te preocupes por tu compañero/a — tu nombre queda completamente protegido.</strong><br><br>Avisa a tu <strong>Profesor Jefe o a cualquier adulto de confianza</strong> o repórtalo aquí de forma anónima. El liceo activará medidas de protección de inmediato. ${cita('Protocolo N° 1 de Acoso Escolar', '')}${btn}`;
			return `👋 <strong>Hola, ${nombre}. Esto no es tu culpa — nadie tiene derecho a molestarte ni hacerte sentir mal.</strong><br><br>Al reportarlo: tu Profesor Jefe y la Dupla Psicosocial actúan con total reserva, sin exponerte ni obligarte a enfrentar a quien te afecta. Se aplican acciones de resguardo en clases y recreos.<br><br><strong>¿Cuándo ocurrió? ¿Fue algo puntual o ha pasado más de una vez?</strong> ${cita('Protocolo N° 1 de Acoso Escolar', '')}${btn}`;

		// ROBO
		case 'ROBO':
			if (es) return `👨‍👩‍👧‍👦 <strong>Hola, ${nombre}.</strong><br><br>La sustracción de bienes se tipifica como <strong>Falta Grave (Art. 16) o Gravísima (Art. 17)</strong>. Inspectoría realiza un proceso de indagación reservado y exige devolución o reparación económica. ${cita('Art. 16 y 17', '')}${btn}`;
			return `👋 <strong>Hola, ${nombre}.</strong><br><br>Informa de inmediato a tu <strong>Profesor Jefe o Inspectoría General</strong> para iniciar la búsqueda e indagación reservada. ${cita('Art. 16 — Faltas Graves', '')}${btn}`;

		// DOCENTES (consulta genérica, sin señales de maltrato)
		case 'DOCENTE':
			if (es) return `👨‍👩‍👧‍👦 <strong>Hola, ${nombre}.</strong><br><br>Si el docente no ha respondido: 1. Solicite entrevista formal. 2. Si no hay respuesta en <strong>48 horas</strong>, escale a UTP o Inspectoría. 3. Convivencia Educativa puede canalizar su requerimiento. ${cita('Conducto Regular — Derechos del Apoderado', '')}${btn}`;
			return `👋 <strong>Hola, ${nombre}.</strong><br><br>Acércate al finalizar la clase o habla con tu <strong>Profesor Jefe</strong> para que coordine. Si persiste, puedes acudir a <strong>UTP</strong>. ${cita('Conducto Regular — RICE 2026', '')}${btn}`;

		// MALTRATO DE UN ADULTO DEL LICEO HACIA UN ESTUDIANTE (Protocolo N°3, RICE 2026)
		// Agregado el 29-jul-2026: antes, mencionar a un profesor junto a una
		// palabra de maltrato caía en el caso DOCENTE genérico de arriba
		// ("habla con tu profesor jefe"), sin importar que la persona
		// mencionada fuera justo quien maltrata.
		case 'MALTRATO_ADULTO':
			if (es) return `👨‍👩‍👧‍👦 <strong>Hola, ${nombre}. Gracias por contarlo — esto se toma en serio de inmediato.</strong><br><br>El <strong>Protocolo N°3 del RICE 2026</strong> exige que, ante cualquier sospecha de maltrato de un adulto hacia un estudiante, el liceo separe de inmediato a esa persona de todo contacto con su pupilo/a mientras se investiga — no es un castigo anticipado, es una medida de resguardo. 1. <strong>Informe el hecho directamente a Convivencia Educativa o a Dirección</strong> (no solo al Profesor Jefe, ya que podría ser la persona involucrada). 2. Si hay indicios de un delito, el liceo tiene la obligación legal de denunciar ante Carabineros o el Ministerio Público dentro de 24 horas. ${cita('Protocolo N° 3 — Vulneración de Derechos', '')}${btn}`;
			if (p.esTercero) return `🤝 <strong>Hola, ${nombre}. Es muy valioso que avises — tu identidad queda protegida.</strong><br><br>Avisa directamente a <strong>Convivencia Educativa o Dirección</strong> (no solo al profesor involucrado). El liceo debe separar de inmediato a la persona adulta de todo contacto con el estudiante mientras investiga. ${cita('Protocolo N° 3 — Vulneración de Derechos', '')}${btn}`;
			return `👋 <strong>Hola, ${nombre}. Esto no es tu culpa, y mereces que te escuchen.</strong><br><br>Ningún adulto tiene derecho a maltratarte, sin importar quién sea. <strong>Cuéntaselo directamente a Convivencia Educativa, a Dirección, o a la Dupla Psicosocial</strong> — no tienes que resolverlo solo/a hablando con esa misma persona. El liceo debe separar de inmediato a quien te está afectando mientras se investiga, y si corresponde, denunciarlo ante Carabineros dentro de 24 horas.<br><br><strong>¿Quieres contarme un poco más de lo que está pasando?</strong> ${cita('Protocolo N° 3', '')}${btn}`;

		// ATRASO
		case 'ATRASO':
			return `${es ? '👨‍👩‍👧‍👦' : '👋'} <strong>Hola, ${nombre}. El derecho a la educación siempre está protegido.</strong><br><br>La <strong>Circular 482 del Mineduc</strong> es clara: el liceo <strong>nunca puede devolver a un estudiante a casa</strong> por atraso u otra causa menor. Los atrasos se abordan desde el acompañamiento, no desde el castigo.<br><br>${es ? '<em>¿Su pupilo/a fue enviado/a a casa? Puede formalizar queja ante la Superintendencia de Educación.</em>' : '<em>¿Te enviaron a casa? Eso es una infracción y puedes reportarlo.</em>'} ${cita('Circular 482 Mineduc — Atrasos e Inasistencias', '')}${btn}`;

		// CELULAR
		case 'CELULAR':
			return `${es ? '👨‍👩‍👧‍👦' : '👋'} <strong>Hola, ${nombre}.</strong><br><br>• <strong>Durante clases:</strong> en silencio y guardado.<br>• <strong>En recreos:</strong> libre uso para comunicarse con la familia.<br>• <strong>Si lo confiscaron:</strong> solo puede retenerse durante la clase — devolución obligatoria al final de la jornada.<br><br><em>¿El celular fue confiscado por más de una jornada? Puedes solicitar su devolución.</em> ${cita('Art. 15 — Autorregulación Digital', '')}${btn}`;

		// SANCIONES
		case 'FALTA_SANCION':
			return `${es ? '👨‍👩‍👧‍👦' : '👋'} <strong>Hola, ${nombre}. Las sanciones tienen un proceso formal que el liceo debe respetar.</strong><br><br>${es ? '<em>¿Su pupilo/a ya fue citado/a por Inspectoría? Cuénteme para orientarle en el debido proceso.</em>' : '<em>Si estás involucrado/a, avisa a tu Profesor Jefe para buscar la mejor solución juntos.</em>'} ${cita('Protocolo N° 2 y Arts. 16-17 del RICE 2026', '')}${btn}`;

		// VIOLENCIA FÍSICA
		case 'VIOLENCIA':
			if (es) return `👨‍👩‍👧‍👦 <strong>Hola, ${nombre}.</strong><br><br>Participar en una pelea es <strong>Falta Grave (Art. 16) o Gravísima (Art. 17)</strong> si hubo premeditación o lesiones. El liceo cita al apoderado, activa Acta de Compromiso Restaurativo, suspensión preventiva (1-5 días) y derivación a la Dupla Psicosocial. Si hay lesiones graves, el liceo informa a Carabineros (Ley 20.536). ${cita('Protocolo N° 2 y Arts. 16-17', '')}${btn}`;
			return `👋 <strong>Hola, ${nombre}.</strong><br><br>Las peleas tienen consecuencias claras: citación a apoderados, compromiso de no agresión y eventual suspensión preventiva. El liceo busca siempre que las partes puedan dialogar y reparar la convivencia. ${cita('Protocolo N° 2 — Riñas y Violencia Física', '')}${btn}`;

		// VIOLENCIA DE PAREJA
		case 'VIOLENCIA_PAREJA':
			return `<div style="background:#fef2f2; border-left:4.5px solid #ef4444; padding:14px 16px; border-radius:12px; margin-bottom:14px; color:#991b1b; font-size:0.9rem; line-height:1.6;">
💜 <strong>Hola, ${nombre}. Nadie tiene derecho a tratarte mal, a gritarte, ni a pegarte. La violencia nunca es normal ni es amor.</strong>
</div>
Estás en un espacio seguro. La <strong>Dupla Psicosocial</strong> te escucha en privado, sin juzgarte ni exponerte (Ley N° 21.430 y Circular 482). Tienes derecho a resguardo escolar y asesoría de la <strong>Ley N° 20.066</strong>.<br><br>
💬 <em>¿Te gustaría que la Dupla Psicosocial te atienda hoy mismo?</em> ${cita('Ley N° 21.430 y Ley N° 20.066', '')}${btn}`;

		// EMBARAZO
		case 'EMBARAZO':
			return `${es ? '👨‍👩‍👧‍👦' : '👋'} <strong>Hola, ${nombre}.</strong><br><br>El <strong>Protocolo N° 9 del RICE 2026 y la Ley N° 20.370</strong> garantizan: derecho a continuar estudiando sin discriminación, flexibilidad académica y apoyo reservado con la Dupla Psicosocial. ${cita('Protocolo N° 9 — Embarazo y Maternidad/Paternidad', '')}${btn}`;

		// SALUD MENTAL
		case 'SALUD':
			return `${es ? '👨‍👩‍👧‍👦' : '👋'} <strong>Hola, ${nombre}. Lo que describes merece atención y el liceo está aquí para apoyar.</strong><br><br>${p.esTercero ? 'Tu preocupación por tu compañero/a puede hacer la diferencia.' : 'No tienes que cargar esto solo/a.'}<br><br>La <strong>Dupla Psicosocial</strong> puede brindar contención emocional en total confidencialidad y derivar a redes de salud externas si es necesario.<br><br><em>¿Hay algo específico que te preocupe?</em>${btn}`;

		// DERECHOS
		case 'DERECHOS':
			return `${es ? '👨‍👩‍👧‍👦' : '👋'} <strong>Hola, ${nombre}.</strong><br><br>${es ? 'Como apoderado/a tiene derecho a:' : 'Como estudiante tienes derecho a:'}<br>• <strong>Estudiar en un clima de respeto y buen trato</strong> sin discriminación.<br>• <strong>Ser escuchado/a</strong> antes de cualquier medida disciplinaria (debido proceso).<br>• <strong>Acceder al RICE completo</strong> y sus protocolos en cualquier momento.<br>• <strong>Apoyo psicosocial</strong> confidencial, sin consecuencias.<br>• <strong>Apelar</strong> cualquier medida dentro de 5 días hábiles.<br><br><em>¿Siente que alguno de estos derechos no está siendo respetado?</em> ${cita('Capítulo I — Derechos', '')}${btn}`;

		// FALLBACK RAG
		default:
			const bannerDefault = this.obtenerContencionEmpatica(nombre, rol, tema, esFueraDeColegio);
			if (resultados && resultados.length > 0) {
				const enc = es ? `Comprendemos su inquietud. Orientación del <strong>RICE 2026 y Circular 482 Mineduc</strong>:` : `Te escuchamos. Según el <strong>RICE 2026</strong>:`;
				const resaltarTexto = (texto, consulta) => {
					if (!consulta || consulta.length < 3) return texto.replace(/\n/g, '<br>');
					const palabras = consulta.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !['sobre', 'como', 'para', 'este', 'esta'].includes(w));
					if (palabras.length === 0) return texto.replace(/\n/g, '<br>');
					let res = texto;
					palabras.forEach(p => {
						const reg = new RegExp(`(${p})`, 'gi');
						res = res.replace(reg, '<mark style="background:#fef08a; color:#854d0e; padding:1px 4px; border-radius:4px; font-weight:700;">$1</mark>');
					});
					return res.replace(/\n/g, '<br>');
				};
				let html = `${bannerDefault}${enc}<br><br>`;
				// BUG #2 FIX: usar analisis.q en lugar de textoLimpio
				resultados.forEach(art => {
					const contenidoResaltado = resaltarTexto(art.contenido, analisis.q);
					html += `<div style="background:#fff; border:1.5px solid #cbd5e1; border-left:4px solid #047857; padding:14px; border-radius:12px; margin-bottom:12px; box-shadow:0 3px 10px rgba(0,0,0,0.04);"><strong style="color:#047857; font-size:0.92rem; display:block; margin-bottom:6px;">📖 ${art.seccion} — ${art.titulo}</strong><div style="font-size:0.85rem; color:#1e293b; line-height:1.6;">${contenidoResaltado}</div></div>`;
				});
				html += `<p style="font-size:0.82rem; color:#475569; margin-top:8px;">💡 <em>Todas las medidas se aplican garantizando el debido proceso y la confidencialidad.</em></p>`;
				html += btn;
				return html;
			}
			return `${bannerDefault}<strong>Hola, ${nombre}.</strong><br><br>Para orientarte con exactitud, <strong>¿podría contarme con más detalle qué sucedió?</strong><br><br>💡 <em>${es ? '¿Es sobre convivencia, un trámite académico, comunicación con un docente o sus derechos?' : '¿Te pasó a ti o a un amigo? ¿Convivencia, normas, o algo personal?'}</em><br><br>📌 <em>Todo es 100% confidencial — Ley N° 21.430.</em>`;
		}
	},

	preguntar: async function(pregunta, forzar = false, rol = 'estudiante', userData = null) {
		// MEJORA 9: Anti-spam
		const ahora = Date.now();
		if (!forzar && (ahora - (this._ultimoEnvio || 0)) < 2000) {
			return { exito: false, mensaje: '⏳ Por favor espera un momento antes de enviar otro mensaje.', articulosCados: [] };
		}
		this._ultimoEnvio = ahora;

		let nombre = (rol === 'apoderado') ? 'Apoderado/a' : (rol === 'funcionario') ? 'Colaborador/a' : 'Estudiante';
		if (userData && userData.nombre) {
			const p = userData.nombre.trim().split(/\s+/);
			if (p[0] && p[0].length > 1) nombre = p[0];
		}
		await new Promise(resolve => setTimeout(resolve, 900));

		let resultadosLocales = [];
		try { resultadosLocales = (typeof RICE_SearchEngine !== 'undefined') ? RICE_SearchEngine.buscar(pregunta, 3) : []; } catch(e) {}

		const analisis = this.comprenderMensaje(pregunta, rol);

		{
			try {
				const promptSystem = `Eres el Orientador/a de Convivencia Educativa del Liceo de Huara (Región de Tarapacá, Chile). Tu nombre es Orientador MiRice.\nSé profundamente HUMANO/A, cálido/a y empático/a. JAMÁS respondas como un robot frío.\nSi es estudiante, usa 'tú' con cariño. Si es apoderado/a, responde con respeto y empatía. Si es funcionario/a, responde con respaldo profesional.\nPrimero ACOGE la emoción. Luego EXPLICA paso a paso. Finalmente cita el RICE 2026 o Circular 482 de forma fluida.\nNombre del usuario: ${nombre}. Rol: ${rol}.`;
				const contextoRICE = resultadosLocales.map(art => `${art.seccion} - ${art.titulo}: ${art.contenido}`).join('\n');
				const promptCompleto = `${promptSystem}\n\n[CONTEXTO RICE]:\n${contextoRICE}\n\n[MENSAJE DE ${nombre.toUpperCase()}]:\n"${pregunta}"`;
				const responseGemini = await fetch('/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ prompt: promptCompleto })
				});
				if (responseGemini.ok) {
					const dataGemini = await responseGemini.json();
					if (dataGemini.candidates && dataGemini.candidates[0] && dataGemini.candidates[0].content) {
						const rawText = dataGemini.candidates[0].content.parts[0].text;
						const btnAction = this.botonInvitacion(pregunta, analisis);
						let formattedText = rawText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
						const respuestaGeminiHtml = `<div style="background:#f0fdf4; border-left:4.5px solid #10b981; padding:16px 18px; border-radius:14px; margin-bottom:14px; color:#065f46; font-size:0.92rem; line-height:1.65; box-shadow:0 3px 12px rgba(16,185,129,0.08);">🤗 <strong>Hola, ${nombre}. Me alegra mucho que conversemos sobre esto.</strong><br><br>${formattedText}</div>${btnAction}`;
						if (typeof window.guardarEnHistorialChat === 'function') window.guardarEnHistorialChat(pregunta, respuestaGeminiHtml);
						return { exito: true, mensaje: respuestaGeminiHtml, articulosCados: resultadosLocales };
					}
				}
			} catch (eGemini) {
				console.warn("⚠️ API Gemini offline, usando motor local:", eGemini);
			}
		}

		try {
			const respuesta = this.generarRespuesta(pregunta, analisis, resultadosLocales, nombre);
			if (typeof window.guardarEnHistorialChat === 'function') window.guardarEnHistorialChat(pregunta, respuesta);
			return { exito: true, mensaje: respuesta, articulosCados: resultadosLocales };
		} catch (err) {
			console.error("Error RICE_Bot:", err);
			return { exito: true, mensaje: `<div style="background:#ecfdf5; border-left:4.5px solid #047857; padding:13px 16px; border-radius:12px; color:#047857;">🤗 <strong>Hola, ${nombre}. Te escuchamos con toda nuestra atención.</strong><br>En el Liceo de Huara todas las consultas se abordan con confidencialidad absoluta (Circular 482 y Ley N° 21.430).</div><div style="text-align:center; margin-top:12px;"><button onclick="window.irAReporteConfidencial('${pregunta.replace(/'/g, '')}');" style="background:#047857; color:#fff; font-weight:800; padding:10px 22px; border-radius:50px; border:none; cursor:pointer;">📩 Consultar a Convivencia Educativa</button></div>`, articulosCados: [] };
		}
	}
};

window.RICE_Bot = RICE_Bot;
