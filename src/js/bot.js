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

		// MEJORA 1: Vocabulario chileno estudiantil extendido (ampliado 30-jul-2026
		// con jerga real de estudiantes: funar, andar curao/volao, corvo, combos,
		// ley del hielo, tener de punto, etc. — no son formas "incorrectas" del
		// español, son cómo efectivamente habla un estudiante chileno).
		q = q
			.replace(/\b(bulying|bulin|bully\w*|buli\w*|acos\w*|molestando|molestao|molesta\w*|pelan|pelando|pelaron|cargando|cargaron|cargao|webe\w*|funa\w*|hostig\w*|tienen?\s+de\s+punto|tienen?\s+mala|ley\s+del\s+hielo|hacen?\s+el\s+vacio|dejan?\s+de\s+lado|se\s+ri[ea]n?\s+de\s+mi|hazmerre[ií]r)\b/g, 'acoso')
			.replace(/\b(pofe|profe\w*|pjefe)\b/g, 'docente')
			.replace(/\b(peg\w*|golpe\w*|golpiza\w*|combos?|cachet\w*|pu[nñ]ete\w*|zampa\w*|zampon\w*|se\s+agarraron|se\s+fueron\s+a\s+combos|le\s+sac\w*\s+la\s+mugre|le\s+dieron?\s+una\s+paliza|empuj\w*|agred\w*|patead\w*|pate\w*|pi[nñ]a\w*|conchaz\w*|palo\w*|coscorron\w*|manota\w*|zamarre\w*)\b/g, 'violencia')
			.replace(/\b(pololo|polola|polol\w*|pareja|novi[ao]|pololea\w*|anduvi\w*\s+con)\b/g, 'pololeo')
			.replace(/\b(droga\w*|mariu\w*|marihuana\w*|piti\w*|pito\w*|cigarro\w*|vape\w*|vapea\w*|falopa\w*|pasto\w*|faso\w*|yesca\w*|porro\w*|pasta\s*base|cocaina\w*|volad\w*|and\w*\s+vola\w*|and\w*\s+curad\w*|curao\w*|(dando?|di[oó])\s+a\s+la\s+maria|(dando?|di[oó])\s+a\s+la\s+hierba|and\w*\s+pasad\w*|se\s+dio\s+vuelta|se\s+puso\s+la\s+raja)\b/g, 'drogas')
			.replace(/\b(arma\w*|cuchi[oll]\w*|navaj\w*|pistol\w*|punzon\w*|cortapluma\w*|escopet\w*|explosiv\w*|corvo\w*|fierro\w*)\b/g, 'armas')
			.replace(/\b(robo\w*|hurt\w*|sac\w*\s+(mis?|sus?)\s+cosas|sustra\w*|afan\w*|choree?\w*|se\s+arranch\w*)\b/g, 'robo')
			.replace(/\b(atraso\w*|tarde|llegu[eé]\s+tarde)\b/g, 'atraso')
			.replace(/\b(celu\w*|celular\w*|telefono\w*|telef\w*|pantalla\w*|smartphone)\b/g, 'celular')
			.replace(/\b(sancion\w*|anotacion\w*|suspend\w*|expuls\w*|raj\w*)\b/g, 'sancion')
			.replace(/\b(palomilla|cabr[oa]s?|chiquill[oa]s?|el\s+curso|los\s+companeros)\b/g, 'estudiante')
			.replace(/\b(dupla|psicolog[ao]|sicolog[ao]|asistente\s+social|orientador[ao]?)\b/g, 'dupla_psicosocial')
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
		// RIESGO VITAL — máxima prioridad de todo el sistema. Corregido el
		// 30-jul-2026: la versión anterior exigía la palabra "suicid" exacta
		// (con límite de palabra al final), lo que significaba que "me siento
		// suicida", "quiero suicidarme", "pensé en el suicidio" o "quiero
		// autolesionarme" — la forma en que alguien realmente escribe esto —
		// NUNCA activaban esta alerta. Se probó exhaustivamente antes de
		// subir este cambio; ver nota al final del archivo.
		const CRISIS_VITAL_RE = /\b(suicid\w*|quitarse\s+la\s+vida|quitarme\s+la\s+vida|hacerse\s+da[n\u00f1]o|hacerme\s+da[n\u00f1]o|no\s+quiero\s+vivir|no\s+quiero\s+seguir(\s+viviendo)?|ya\s+no\s+aguanto|me\s+voy\s+a\s+matar|matarme|autoles\w*|me\s+corto|cortarme|me\s+quiero\s+cortar|cortar\w*\s+(los\s+brazos|las\s+mu[n\u00f1]ecas|la\s+piel)|tirarse|aventarse|me\s+quiero\s+morir|quiero\s+morir\w*|desaparecer\s+para\s+siempre|acabar\s+con\s+todo|no\s+quiero\s+existir|no\s+quiero\s+estar\s+aqui|mejor\s+no\s+estar)\b/i;
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
		if (/\b(conducto\s+regular|canal(es)?|atencion|jerarquia|recurr\w*|acud\w*|consult\w*|pasos\s+para|procedimiento)\b/i.test(q)) scores.CONDUCTO_REGULAR += 18;

		// Scores principales
		// CORREGIDO 30-jul-2026: casi todas estas raíces tenían un límite de
		// palabra al final que exigía la forma exacta sin conjugar — así,
		// "cuchillo", "embarazada", "me insultan", "me golpearon" o "está
		// triste" NUNCA calzaban. Se agregó \w* donde correspondía y se
		// probó cada categoría con frases reales antes de subir el cambio.
		if (/\b(armas?|cuchill\w*|navaj\w*|pistol\w*|escopet\w*|punzon\w*|explosiv\w*)\b/i.test(q)) scores.ARMAS += 12;
		if (/\b(drogas?|mariu\w*|cocain\w*|alcohol\w*|borrach\w*|curad\w*|adiccion\w*|fum\w*|cigarr\w*|vape\w*|vapea\w*|tabac\w*)\b/i.test(q)) scores.DROGAS += 12;
		if (/\b(acoso|acosa\w*|bull\w*|hostig\w*|discrimin\w*|burl\w*|ridicul\w*|aislad\w*|exclu\w*|molest\w*|insult\w*)\b/i.test(q)) scores.ACOSO += 12;
		if (/\b(internet|redes|whatsapp|instagram|tiktok)\b/.test(q) && /\b(acoso|acosa\w*|amenaz\w*|foto\w*|viral)\b/.test(q)) scores.ACOSO += 8;
		if (/\b(no\s+quiere\s+ir|no\s+quiero\s+ir|miedo\s+al\s+liceo)\b/.test(q)) scores.ACOSO += 6;
		if (/\b(robo|roba\w*|hurt\w*|sustra\w*|mochila\w*|pertenenci\w*)\b/i.test(q)) scores.ROBO += 12;
		if (/\b(violencia|pele\w*|ri[nñ]a\w*|agred\w*|golpe\w*|pu[nñ]o\w*|patad\w*|atac\w*)\b/i.test(q)) scores.VIOLENCIA += 12;
		if (/\b(embaraz\w*|bebe|guagua|maternidad|paternidad|prenatal\w*)\b/i.test(q)) scores.EMBARAZO += 12;
		if (/\b(profesor\w*|docente\w*|profe\w*|funcionari\w*|inspector\w*|director\w*|asistente\w*|auxiliar\w*|adulto\w*)\b/i.test(q)) scores.DOCENTE += 6;
		// MALTRATO_ADULTO: prioridad alta cuando la mención a un adulto del liceo
		// viene junto a una palabra de maltrato — antes esto solo activaba DOCENTE
		// (respuesta genérica de "habla con tu profesor"), ignorando que podía
		// tratarse de exactamente la persona que está maltratando (29-jul-2026).
		if (/\b(profesor\w*|docente\w*|profe\w*|funcionari\w*|inspector\w*|director\w*|asistente\w*|auxiliar\w*|adulto\w*)\b/i.test(q) &&
			(/\b(maltrat\w*|trata\s*mal|me\s*trata|insult\w*|humill\w*|grit\w*|golpe\w*|violencia|abus\w*|amenaz\w*|acos\w*|toc[oa]\w*|discrimin\w*)\b/i.test(q) ||
			 /\b(pasa\w*\s+a\s+llevar|se\s+aprovecha\w*|abusa\w*\s+de\s+su\s+(poder|autoridad|cargo)|mal\s*trato|me\s+hace\s+sentir\s+(mal|pesim\w*)|se\s+burla\w*\s+de\s+mi|me\s+falta\w*\s+el\s+respeto)\b/i.test(q))) {
			scores.MALTRATO_ADULTO += 22;
		}
		if (/\b(atraso\w*|tarde|inasist\w*|mandaron\s+a\s+la\s+casa)\b/i.test(q)) scores.ATRASO += 12;
		if (/\b(celu\w*|celular\w*|telefono\w*|pantalla\w*)\b/i.test(q)) scores.CELULAR += 12;
		if (/\b(sancion\w*|suspend\w*|suspension\w*|expuls\w*|anota\w*|castig\w*|apela\w*)\b/i.test(q)) scores.FALTA_SANCION += 12;

		// MEJORA 5: Derechos y normativa mejorada
		if (/\b(circular\s*482|ley\s*21\.?430|ley\s*20\.?536|ley\s*19\.?628|mineduc|superintendencia)\b/i.test(q)) scores.DERECHOS += 20;
		if (/\b(derecho\s+a|tengo\s+derecho|mis\s+derechos|puedo\s+apelar|protocolo\w*|normativa\w*|reglamento\w*)\b/i.test(q)) scores.DERECHOS += 14;
		if (/\b(derecho\w*|garanti\w*|protec\w*)\b/i.test(q)) scores.DERECHOS += 8;

		if (/\b(trist\w*|depres\w*|ansied\w*|ansios\w*|crisis|llorand\w*|llor[oó]|autoles\w*|duelo|autis\w*|\btea\b)\b/i.test(q)) scores.SALUD += 12;

		// Neurodiversidad / TEA / NEE
		if (/\b(autis\w*|\btea\b|trastorno\s+del?\s+espectro|asperger|neurodivers\w*|\bnee\b|necesidades\s+educativas|discapacid\w*|desregula\w*|sensorial\w*)\b/i.test(q)) scores.NEURODIVERSIDAD += 25;

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

		// Ambiguo — CORREGIDO 30-jul-2026: antes sumaba puntaje solo por ser un
		// mensaje corto (<15 caracteres), lo que hacía perder a temas reales
		// pero breves como "traía un corvo" o "me pegó fuerte" contra la
		// categoría genérica de "pide más contexto". Ahora solo compite si
		// ninguna categoría específica encontró algo.
		const yaHayAlgoEspecifico = Object.entries(scores).some(([tema, val]) => tema !== 'AMBIGUO' && tema !== 'SEGUIMIENTO' && val > 0);
		if (!yaHayAlgoEspecifico && texto.trim().length < 15) scores.AMBIGUO += 20;
		if (!yaHayAlgoEspecifico && /^(hola|ayuda|auxilio|que hago|no se|dudas?|consulta|necesito ayuda)$/.test(q.trim())) scores.AMBIGUO += 15;

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
			DROGAS: p.esApoderado ? { i: '🏥', t: 'Pedir entrevista confidencial con el Equipo de Convivencia Educativa' } : p.esTercero ? { i: '🤝', t: 'Notificar anónimamente la situación de mi compañero/a' } : { i: '💚', t: 'Conversar en privado con el Equipo de Convivencia Educativa' },
			ACOSO: p.esApoderado ? { i: '🛡️', t: 'Solicitar protección formal para mi pupilo/a' } : p.esTercero ? { i: '🚨', t: 'Avisar de forma anónima por mi compañero/a' } : { i: '🛡️', t: 'Notificar mi situación de forma confidencial' },
			ROBO: { i: '🎒', t: 'Notificar o solicitar indagación por pérdida de pertenencias' },
			VIOLENCIA: { i: '⚖️', t: 'Reportar este hecho al Equipo de Convivencia' },
			VIOLENCIA_PAREJA: { i: '💜', t: 'Solicitar contención confidencial con el Equipo de Convivencia Educativa' },
			EMBARAZO: { i: '🌱', t: 'Coordinar apoyo reservado con el Equipo de Convivencia Educativa' },
			DOCENTE: p.esApoderado ? { i: '📅', t: 'Solicitar cita con el docente a través de Convivencia' } : { i: '📚', t: 'Consultar sobre mi derecho a ser atendido' },
			ATRASO: { i: '📝', t: 'Registrar el motivo de mi atraso o inasistencia' },
			CELULAR: { i: '📱', t: 'Consultar sobre este derecho con Convivencia' },
			FALTA_SANCION: { i: '⚖️', t: 'Solicitar orientación sobre el proceso o apelar' },
			DERECHOS: { i: '📋', t: 'Solicitar orientación formal sobre mis derechos' },
			SALUD: { i: '💙', t: 'Solicitar apoyo reservado con el Equipo de Convivencia Educativa' },
			CONDUCTO_REGULAR: { i: '📋', t: 'Solicitar atención o cita por Conducto Regular' },
			NEURODIVERSIDAD: { i: '🧩', t: 'Coordinar Plan de Apoyo con el equipo de Inclusión' },
			CRISIS_VITAL: { i: '🆘', t: 'Conectar AHORA con el Equipo de Convivencia Educativa — urgente' },
			NINGUNO: { i: '📩', t: 'Consultar o notificar a Convivencia Educativa' },
			AMBIGUO: { i: '💬', t: 'Cuéntanos más sobre tu situación' },
		};
		const b = BTNS[tema] || BTNS.NINGUNO;
		const s = 'background:linear-gradient(135deg,#047857 0%,#065f46 100%); color:#fff !important; border:none; font-weight:800; font-size:0.82rem; padding:11px 22px; border-radius:50px; cursor:pointer; box-shadow:0 4px 12px rgba(4,120,87,0.28);';
		return `<div style="background:#ecfdf5; border:1.5px solid #6ee7b7; border-radius:12px; padding:14px; margin-top:16px; text-align:center;"><span style="font-size:0.78rem; color:#065f46; display:block; margin-bottom:10px;">🔒 Tu comunicación es 100% privada — Circular 781 Mineduc y Ley N° 21.430</span><button onclick="window.irAReporteConfidencial('${q}');" style="${s}">${b.i} ${b.t}</button></div>`;
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
En el <strong>Liceo de Huara</strong>, el Equipo de Convivencia Educativa está disponible para escucharte hoy mismo en total privacidad.
</div>
<div style="text-align:center; margin-top:12px;">
<button onclick="window.irAReporteConfidencial('necesito ayuda urgente');" style="background:linear-gradient(135deg,#dc2626,#991b1b); color:#fff; font-weight:900; font-size:0.9rem; padding:14px 28px; border-radius:50px; border:none; cursor:pointer; box-shadow:0 4px 15px rgba(220,38,38,0.35);">
🆘 Conectar AHORA con el Equipo de Convivencia Educativa
</button>
</div>`;

		// NEURODIVERSIDAD / TEA / NEE
		case 'NEURODIVERSIDAD':
			return `${bannerEmpatico}En el <strong>Liceo de Huara</strong> la diversidad de formas de aprender es un valor que celebramos.<br><br>
El <strong>Protocolo N° 14 del RICE 2026</strong> establece apoyos para estudiantes con NEE o TEA:<br><br>
📌 <strong>Plan de Apoyo Individualizado (PAI):</strong> elaborado con la familia y especialistas.<br>
📌 <strong>Adecuaciones Curriculares:</strong> evaluaciones y metodologías adaptadas.<br>
📌 <strong>Espacio de Calma:</strong> zona segura ante desregulación emocional.<br>
📌 <strong>Equipo de Convivencia Educativa:</strong> acompañamiento permanente y coordinación con CESFAM.<br><br>
<em>¿Le gustaría coordinar una reunión con el equipo de inclusión?</em>${btn}`;

		// CONDUCTO REGULAR
		case 'CONDUCTO_REGULAR':
			if (es) return `${bannerEmpatico}En el <strong>Liceo de Huara</strong> el Conducto Regular es una garantía de que su voz será escuchada (<strong>RICE 2026 Art. 31 y Circular 781</strong>).<br><br>📌 <strong>1° Nivel — Profesor/a Jefe:</strong> para inquietudes pedagógicas del día a día.<br><br>📌 <strong>2° Nivel — Convivencia Educativa / Equipo de Convivencia Educativa:</strong> para temas de convivencia o apoyo emocional.<br><br>📌 <strong>3° Nivel — Dirección del Liceo:</strong> para casos de mayor complejidad.<br><br>💬 <em>¿Le gustaría coordinar una reunión?</em>${btn}`;
			return `${bannerEmpatico}El <strong>Liceo de Huara</strong> tiene un equipo dispuesto a escucharte:<br><br>📌 <strong>1. Tu Profesor/a Jefe:</strong> para orientarte en clases y convivencia diaria.<br><br>📌 <strong>2. Convivencia Educativa y Equipo de Convivencia Educativa:</strong> si necesitas desahogarte o recibir ayuda reservada.<br><br>📌 <strong>3. Dirección del Liceo:</strong> para inquietudes de mayor alcance.<br><br>💬 <em>¿Hay algún tema en el que te gustaría que te acompañemos hoy?</em>${btn}`;

		// DROGAS
		case 'DROGAS':
			if (esFueraDeColegio) return `${bannerEmpatico}Lo que cuentas es delicado, y que te preocupes por tu amigo/a ya dice mucho de ti. El liceo tiene un protocolo pensado justo para esto (Protocolo N° 6) — fuera del liceo, las normas disciplinarias del RICE no aplican como castigo, así que el enfoque acá también es 100% de salud, nunca de sancionar a tu amigo/a.<br><br>Si quieres saber cómo ayudarlo sin meterte tú solo/a en el problema: 1. <strong>Cuéntaselo al Equipo de Convivencia Educativa</strong> (usa el botón de abajo) o a un adulto de confianza. 2. Ellos pueden orientarte en privado sobre cómo acercarlo a ayuda real (SENDA Previene, CESFAM). Tu identidad queda protegida siempre, lo cuentes ahora o más adelante. ${cita('Protocolo N° 6 — Apoyo de Salud y Prevención', '')}${btn}`;
			if (es) return `${bannerEmpatico}Entiendo que esto preocupe — es un tema serio, y el liceo tiene un protocolo estricto para abordarlo (Protocolo N° 6), pensado primero en la salud del estudiante, no en sancionarlo de entrada.<br><br>Si solo quiere informarse de qué pasaría: se registra como Falta Gravísima si ocurrió dentro del liceo, pero eso no significa expulsión automática — si es la primera vez, se le pide acreditar tratamiento (SENDA o CESFAM) en 30 días para mantener la matrícula.<br><br>Si quiere que esto se informe formalmente al liceo, esto es lo que sigue: 1. Cuéntelo a Convivencia Educativa o a Inspectoría General. 2. Van a citarlo/a a usted dentro de los próximos días para conversar el plan de apoyo. 3. Puede solicitar que el Equipo de Convivencia Educativa atienda a su hijo/a de forma reservada. ${cita('Protocolo N° 6 y Art. 41/45', '')}${btn}`;
			if (p.esTercero) return `${bannerEmpatico}Que te preocupes por tu compañero/a y vengas a preguntar ya es cuidar a tu comunidad — y tu identidad queda <strong>100% protegida</strong> pase lo que pase.<br><br>Si solo quieres saber qué pasaría: el liceo se va a acercar a ofrecerle ayuda, no a expulsarlo de entrada — el objetivo es de salud, no de castigo.<br><br>Si quieres que esto se sepa de verdad para que lo ayuden: 1. Cuéntaselo a tu Profesor Jefe, a Inspectoría, o usa el botón de abajo para hablar directo con el Equipo de Convivencia Educativa. ${cita('Protocolo N° 6', '')}${btn}`;
			return `${bannerEmpatico}Lo que preguntas es un tema serio, y que hayas venido a informarte en vez de quedarte con la duda solo/a dice mucho de ti — acá no vienes a que te castiguen. El liceo tiene un protocolo específico para esto (Protocolo N° 6), pensado primero en tu salud.<br><br>Si solo quieres saber qué pasaría: nadie te va a interrogar como si fueras culpable, y si es la primera vez, lo que sigue es apoyo (SENDA Previene / CESFAM), no una expulsión.<br><br>Si es algo que te está pasando a ti o a alguien cercano y quieres que esto se sepa de verdad, esto es lo que puedes hacer: 1. <strong>Cuéntaselo a tu Profesor Jefe, a Convivencia Educativa, o usa el botón de abajo</strong> para hablar en privado con el Equipo de Convivencia Educativa ahora mismo. 2. Tu apoderado va a ser citado, porque el liceo necesita que también te acompañen en esto desde la casa.<br><br><strong>¿Quieres contarme un poco de lo que está pasando, o prefieres que quede solo como información por ahora?</strong> ${cita('Protocolo N° 6 — Apoyo Socioemocional', '')}${btn}`;

		// AMBIGUO
		case 'AMBIGUO':
			return `👋 <strong>Hola, ${nombre}.</strong> Estoy aquí para orientarte.<br><br>Para ayudarte mejor, <strong>cuéntame un poco más sobre lo que te preocupa</strong>.<br><br>💡 <em>${es ? '¿Es algo que está viviendo su pupilo/a, una situación con un docente, o un tema de convivencia?' : '¿Es algo que te está pasando a ti o a alguien más? ¿Tiene que ver con convivencia, normas, o algo personal?'}</em><br><br>📌 <em>Todo lo que compartas es privado — Liceo de Huara.</em>`;

		// ARMAS
		case 'ARMAS':
			if (es) return `👨‍👩‍👧‍👦 <strong>Hola, ${nombre}.</strong> Esto es serio, y hace bien en avisar de inmediato — el liceo tiene un protocolo estricto para esto (Protocolo N° 7) precisamente porque no se puede esperar.<br><br>Esto es lo que pasa apenas se avisa: se llama de inmediato a <strong>Carabineros de Huara</strong>, se aísla la zona con calma, y ningún funcionario ni estudiante confronta directamente a la persona involucrada.<br><br>Si esto está pasando ahora: <strong>avise de inmediato a Inspectoría o Dirección</strong>, no espere a que termine la jornada.${btn}`;
			if (p.esTercero) return `🤝 <strong>Hola, ${nombre}. Que hayas avisado es lo correcto — esto no se resuelve solo/a.</strong> Tu identidad queda completamente protegida (Circular 781 y Ley 21.430).<br><br>El equipo directivo actúa de inmediato al recibir el aviso: aíslan la zona y llaman a Carabineros. <strong>Tu única tarea es avisar ahora mismo a un adulto</strong> — no te acerques ni intentes intervenir tú.${btn}`;
			return `⚠️ <strong>Hola, ${nombre}. Esto es grave, y necesita atención del liceo ahora mismo, no después.</strong><br><br>El liceo tiene un protocolo estricto para esto (Protocolo N° 7 — Falta Gravísima) que se activa apenas alguien avisa: aíslan la zona y llaman a Carabineros de inmediato.<br><br><strong>Avisa ahora a un adulto responsable</strong> (Inspectoría, Profesor Jefe, o cualquier funcionario cerca) — no confrontes tú a la persona involucrada.${btn}`;

		// ACOSO
		case 'ACOSO':
			if (es) return `👨‍👩‍👧‍👦 <strong>Hola, ${nombre}. Lo que cuenta es serio, y usted hizo lo correcto al buscar orientación — el liceo tiene la obligación legal de actuar ante esto (Protocolo N° 1).</strong><br><br>Si quiere que esto se investigue formalmente: 1. <strong>Solicite entrevista urgente con el Profesor Jefe</strong> (pida fecha y hora). 2. Si no responde en 48 horas, <strong>escale a Convivencia Educativa</strong> — tienen el deber de activar el protocolo. 3. <strong>Documente los hechos</strong>: fechas, situaciones, evidencias (capturas, testigos).<br><br>El liceo resguardará a su pupilo/a en aula y recreos sin exponerlo/a jamás. ${cita('Protocolo N° 1 de Acoso Escolar', '')}${btn}`;
			if (p.esTercero) return `🤝 <strong>Hola, ${nombre}. Es muy valioso que te preocupes por tu compañero/a — esto es exactamente lo que el liceo quiere que hagas.</strong> Tu nombre queda completamente protegido.<br><br>Avisa a tu <strong>Profesor Jefe o a cualquier adulto de confianza</strong>, o repórtalo aquí de forma anónima. El liceo activará medidas de protección de inmediato, sin que tu compañero/a sepa que fuiste tú. ${cita('Protocolo N° 1 de Acoso Escolar', '')}${btn}`;
			return `👋 <strong>Hola, ${nombre}. Lo que cuentas es serio, y quiero que sepas algo primero: esto no es tu culpa — nadie tiene derecho a molestarte ni hacerte sentir mal.</strong> El liceo tiene un protocolo específico para esto.<br><br>Si quieres que esto se reporte de verdad: tu Profesor Jefe y el Equipo de Convivencia Educativa actúan con total reserva, sin exponerte ni obligarte a enfrentar a quien te afecta — se aplican acciones de resguardo en clases y recreos.<br><br><strong>¿Cuándo ocurrió? ¿Fue algo puntual o ha pasado más de una vez?</strong> ${cita('Protocolo N° 1 de Acoso Escolar', '')}${btn}`;

		// ROBO
		case 'ROBO':
			if (es) return `👨‍👩‍👧‍👦 <strong>Hola, ${nombre}.</strong> Entiendo la molestia — vamos a ver esto con calma. El liceo tiene un procedimiento claro para esto (Protocolo N° 15).<br><br>Si quiere que se investigue formalmente: 1. La sustracción se tipifica como Falta Grave o Gravísima según haya habido fuerza o violencia. 2. Inspectoría va a entrevistar a los involucrados por separado y de forma reservada — está prohibido revisar mochilas de forma masiva o sin sospecha fundada. 3. Van a citarlo/a a usted dentro de las próximas 48 horas. 4. Si se identifica a quien lo hizo, deberá devolver lo sustraído o compensar su valor. ${cita('Protocolo N° 15 y Art. 40/44-41/45', '')}${btn}`;
			return `👋 <strong>Hola, ${nombre}. Que te hayan quitado algo tuyo se siente feo, y tienes derecho a que se resuelva.</strong> El liceo tiene un protocolo para esto (Protocolo N° 15), y no te van a hacer sentir sospechoso a ti por avisar.<br><br>Si quieres que se investigue de verdad: 1. <strong>Cuéntale a tu Profesor Jefe o ve directo a Inspectoría General</strong> para que quede registrado. 2. Te van a entrevistar en privado, sin exponerte frente a tus compañeros. 3. Nadie te va a revisar la mochila a ti ni a otros sin una razón fundada — eso está prohibido. 4. Si encuentran a quien lo hizo, tiene que devolverlo o compensarlo.<br><br><strong>¿Sabes más o menos cuándo pasó?</strong> ${cita('Protocolo N° 15 — Robo y Hurto', '')}${btn}`;

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
			if (es) return `👨‍👩‍👧‍👦 <strong>Hola, ${nombre}. Gracias por contarlo — lo que describe es serio, y el liceo lo toma así de inmediato.</strong> Existe un protocolo específico para esto (Protocolo N°3), justamente porque no se puede dejar pasar.<br><br>Si quiere que esto se informe formalmente: el liceo debe separar de inmediato a esa persona de todo contacto con su pupilo/a mientras se investiga — no es un castigo anticipado, es una medida de resguardo. 1. <strong>Informe el hecho directamente a Convivencia Educativa o a Dirección</strong> (no solo al Profesor Jefe, ya que podría ser la persona involucrada). 2. Si hay indicios de un delito, el liceo tiene la obligación legal de denunciar ante Carabineros o el Ministerio Público dentro de 24 horas. ${cita('Protocolo N° 3 — Vulneración de Derechos', '')}${btn}`;
			if (p.esTercero) return `🤝 <strong>Hola, ${nombre}. Es muy valioso que avises — lo que cuentas es serio, y tu identidad queda protegida.</strong><br><br>Si quieres que esto se sepa de verdad: avisa directamente a <strong>Convivencia Educativa o Dirección</strong> (no solo al profesor involucrado). El liceo debe separar de inmediato a la persona adulta de todo contacto con el estudiante mientras investiga. ${cita('Protocolo N° 3 — Vulneración de Derechos', '')}${btn}`;
			return `👋 <strong>Hola, ${nombre}. Lo que cuentas es serio, y quiero que sepas algo primero: esto no es tu culpa, y mereces que te escuchen.</strong> Ningún adulto tiene derecho a maltratarte, sin importar quién sea — por eso el liceo tiene un protocolo específico para esto.<br><br>Si quieres que esto se informe de verdad: <strong>cuéntaselo directamente a Convivencia Educativa, a Dirección, o al Equipo de Convivencia Educativa</strong> — no tienes que resolverlo solo/a hablando con esa misma persona. El liceo debe separar de inmediato a quien te está afectando mientras se investiga, y si corresponde, denunciarlo ante Carabineros dentro de 24 horas.<br><br><strong>¿Quieres contarme un poco más de lo que está pasando, o prefieres que quede solo como información por ahora?</strong> ${cita('Protocolo N° 3', '')}${btn}`;

		// ATRASO
		case 'ATRASO':
			return `${es ? '👨‍👩‍👧‍👦' : '👋'} <strong>Hola, ${nombre}. El derecho a la educación siempre está protegido.</strong><br><br>La <strong>Circular 781 del Mineduc</strong> es clara: el liceo <strong>nunca puede devolver a un estudiante a casa</strong> por atraso u otra causa menor. Los atrasos se abordan desde el acompañamiento, no desde el castigo.<br><br>${es ? '<em>¿Su pupilo/a fue enviado/a a casa? Puede formalizar queja ante la Superintendencia de Educación.</em>' : '<em>¿Te enviaron a casa? Eso es una infracción y puedes reportarlo.</em>'} ${cita('Circular 781 Mineduc — Atrasos e Inasistencias', '')}${btn}`;

		// CELULAR
		case 'CELULAR':
			return `${es ? '👨‍👩‍👧‍👦' : '👋'} <strong>Hola, ${nombre}.</strong><br><br>• <strong>Durante clases:</strong> en silencio y guardado.<br>• <strong>En recreos:</strong> libre uso para comunicarse con la familia.<br>• <strong>Si lo confiscaron:</strong> solo puede retenerse durante la clase — devolución obligatoria al final de la jornada.<br><br><em>¿El celular fue confiscado por más de una jornada? Puedes solicitar su devolución.</em> ${cita('Faltas L-03/L-04/G-08/G-13 — Uso de Celular', '')}${btn}`;

		// SANCIONES
		case 'FALTA_SANCION':
			return `${es ? '👨‍👩‍👧‍👦' : '👋'} <strong>Hola, ${nombre}. Las sanciones tienen un proceso formal que el liceo debe respetar.</strong><br><br>${es ? '<em>¿Su pupilo/a ya fue citado/a por Inspectoría? Cuénteme para orientarle en el debido proceso.</em>' : '<em>Si estás involucrado/a, avisa a tu Profesor Jefe para buscar la mejor solución juntos.</em>'} ${cita('Artículo 51 — Plazos del Procedimiento Investigativo', '')}${btn}`;

		// VIOLENCIA FÍSICA
		case 'VIOLENCIA':
			if (es) return `👨‍👩‍👧‍👦 <strong>Hola, ${nombre}.</strong> Entiendo la preocupación — esto es serio, y el liceo tiene un protocolo claro para abordarlo (Protocolo N° 2).<br><br>Si quiere que se investigue formalmente: participar en una pelea es Falta Grave o Gravísima si hubo premeditación o lesiones. El liceo cita al apoderado, activa un Acta de Compromiso Restaurativo, suspensión preventiva (1-5 días) y derivación al Equipo de Convivencia Educativa. Si hay lesiones graves, el liceo informa a Carabineros (Ley 20.536). ${cita('Protocolo N° 2 y Art. 40/44-41/45', '')}${btn}`;
			return `👋 <strong>Hola, ${nombre}.</strong> Lo que cuentas es serio, y el liceo tiene un protocolo para esto que busca resolverlo, no solo castigar.<br><br>Si quieres que esto se reporte: las peleas tienen consecuencias claras — citación a apoderados, compromiso de no agresión y eventual suspensión preventiva. El liceo siempre busca que las partes puedan dialogar y reparar la convivencia, no solo sancionar. ${cita('Protocolo N° 2 — Riñas y Violencia Física', '')}${btn}`;

		// VIOLENCIA DE PAREJA
		case 'VIOLENCIA_PAREJA':
			return `<div style="background:#fef2f2; border-left:4.5px solid #ef4444; padding:14px 16px; border-radius:12px; margin-bottom:14px; color:#991b1b; font-size:0.9rem; line-height:1.6;">
💜 <strong>Hola, ${nombre}. Nadie tiene derecho a tratarte mal, a gritarte, ni a pegarte. La violencia nunca es normal ni es amor.</strong>
</div>
Estás en un espacio seguro. La <strong>Equipo de Convivencia Educativa</strong> te escucha en privado, sin juzgarte ni exponerte (Ley N° 21.430 y Circular 781). Tienes derecho a resguardo escolar y asesoría de la <strong>Ley N° 20.066</strong>.<br><br>
💬 <em>¿Te gustaría que el Equipo de Convivencia Educativa te atienda hoy mismo?</em> ${cita('Ley N° 21.430 y Ley N° 20.066', '')}${btn}`;

		// EMBARAZO
		case 'EMBARAZO':
			if (es) return `👨‍👩‍👧‍👦 <strong>Hola, ${nombre}.</strong> Gracias por contarlo. Quiero que sepa algo primero: el lugar de su hijo/a en el liceo está 100% garantizado — nadie puede sugerir su retiro ni condicionar la matrícula por esto, existe un protocolo específico que lo protege (Protocolo N° 9).<br><br>Si quiere avanzar con el acompañamiento: 1. Se les va a citar a una reunión privada dentro de 48 horas para armar un plan. 2. Ese plan incluye calendario de evaluaciones flexible y justificación automática de inasistencias por controles médicos. 3. Si necesita amamantar en el liceo, hay un espacio privado habilitado. 4. Se le puede eximir del uniforme y de esfuerzo físico en Educación Física. ${cita('Protocolo N° 9 — Embarazo y Maternidad/Paternidad', '')}${btn}`;
			return `👋 <strong>Hola, ${nombre}. Gracias por confiar esto — sea lo que sea que sientas ahora, quiero que sepas algo primero: tu lugar en el liceo está 100% garantizado.</strong> Nadie te puede pedir que te retires ni condicionar tu matrícula por esto — hay un protocolo que te protege (Protocolo N° 9).<br><br>Si quieres avanzar con el acompañamiento: 1. <strong>Cuéntaselo a tu Profesor Jefe o a Convivencia Educativa</strong> cuando te sientas list@ — nadie más se entera sin tu autorización. 2. En un par de días te van a citar (a ti y a tu apoderado) para armar un plan: evaluaciones más flexibles y permisos para tus controles médicos. 3. Si necesitas amamantar, hay un espacio privado en el liceo. 4. Puedes pedir no usar el uniforme si te complica.<br><br><strong>¿Quieres que te ayude a pensar cómo contarlo, o prefieres solo tener la información por ahora?</strong> ${cita('Protocolo N° 9 — Embarazo y Maternidad/Paternidad', '')}${btn}`;

		// SALUD MENTAL
		case 'SALUD':
			return `${es ? '👨‍👩‍👧‍👦' : '👋'} <strong>Hola, ${nombre}. Lo que describes merece atención y el liceo está aquí para apoyar.</strong><br><br>${p.esTercero ? 'Tu preocupación por tu compañero/a puede hacer la diferencia.' : 'No tienes que cargar esto solo/a.'}<br><br>La <strong>Equipo de Convivencia Educativa</strong> puede brindar contención emocional en total confidencialidad y derivar a redes de salud externas si es necesario.<br><br><em>¿Hay algo específico que te preocupe?</em>${btn}`;

		// DERECHOS
		case 'DERECHOS':
			return `${es ? '👨‍👩‍👧‍👦' : '👋'} <strong>Hola, ${nombre}.</strong><br><br>${es ? 'Como apoderado/a tiene derecho a:' : 'Como estudiante tienes derecho a:'}<br>• <strong>Estudiar en un clima de respeto y buen trato</strong> sin discriminación.<br>• <strong>Ser escuchado/a</strong> antes de cualquier medida disciplinaria (debido proceso).<br>• <strong>Acceder al RICE completo</strong> y sus protocolos en cualquier momento.<br>• <strong>Apoyo psicosocial</strong> confidencial, sin consecuencias.<br>• <strong>Apelar</strong> cualquier medida dentro de 5 días hábiles.<br><br><em>¿Siente que alguno de estos derechos no está siendo respetado?</em> ${cita('Capítulo I — Derechos', '')}${btn}`;

		// FALLBACK RAG
		default:
			const bannerDefault = this.obtenerContencionEmpatica(nombre, rol, tema, esFueraDeColegio);
			if (resultados && resultados.length > 0) {
				const enc = es ? `Comprendemos su inquietud. Orientación del <strong>RICE 2026 y Circular 781 Mineduc</strong>:` : `Te escuchamos. Según el <strong>RICE 2026</strong>:`;
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
				// El system prompt ya NO se arma aquí: vive en api/chat.js, en el
				// servidor, donde el cliente no puede reemplazarlo (27-ago-2026).
				// Solo se envía la pregunta, el contexto RICE del buscador local,
				// el nombre de pila (cosmético) y el token de sesión.
				const contextoRICE = resultadosLocales.map(art => `${art.seccion} - ${art.titulo}: ${art.contenido}`).join('\n');
				const responseGemini = await fetch('/api/chat', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + (window.miriceSesionToken || '')
					},
					body: JSON.stringify({ pregunta: pregunta, contexto: contextoRICE, nombre: nombre })
				});
				if (responseGemini.ok) {
					const dataGemini = await responseGemini.json();
					if (dataGemini.candidates && dataGemini.candidates[0] && dataGemini.candidates[0].content) {
						const rawText = dataGemini.candidates[0].content.parts[0].text;
						const btnAction = this.botonInvitacion(pregunta, analisis);
						let formattedText = rawText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
						const respuestaGeminiHtml = `<div style="background:#f0fdf4; border-left:4.5px solid #10b981; padding:16px 18px; border-radius:14px; margin-bottom:14px; color:#065f46; font-size:0.92rem; line-height:1.65; box-shadow:0 3px 12px rgba(16,185,129,0.08);">🤗 ${formattedText}</div>${btnAction}`;
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
			return { exito: true, mensaje: `<div style="background:#ecfdf5; border-left:4.5px solid #047857; padding:13px 16px; border-radius:12px; color:#047857;">🤗 <strong>Hola, ${nombre}. Te escuchamos con toda nuestra atención.</strong><br>En el Liceo de Huara todas las consultas se abordan con confidencialidad absoluta (Circular 781 y Ley N° 21.430).</div><div style="text-align:center; margin-top:12px;"><button onclick="window.irAReporteConfidencial('${pregunta.replace(/'/g, '')}');" style="background:#047857; color:#fff; font-weight:800; padding:10px 22px; border-radius:50px; border:none; cursor:pointer;">📩 Consultar a Convivencia Educativa</button></div>`, articulosCados: [] };
		}
	}
};

window.RICE_Bot = RICE_Bot;
