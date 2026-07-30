/**
 * CATÁLOGO DE AVATARES DE ALTA RESOLUCIÓN Y CATEGORÍAS PARA ESTUDIANTES
 * Liceo de Huara • Sistema MiRice 2026
 * 
 * Incluye ilustraciones vectoriales de alta resolución organizadas por categorías:
 * 1. 🎓 Profesiones, Ciencia y Artes
 * 2. ⚽ Fútbol y Deportes de Balón
 * 3. 🎾 Tenis, Pádel y Ping Pong
 * 4. 🚴‍♂️ Ciclismo, Running y Patinaje
 * 5. 🏊‍♂️ Natación, Surf y Deportes Acuáticos
 * 6. 🥋 Artes Marciales y Tiro con Arco
 * 7. 🛹 Skateboard, Hockey y Esgrima
 */

(function() {
  const CATEGORIAS_AVATARES = [
    { id: 'todos', nombre: '🌟 Todos los Avatares' },
    { id: 'profesiones', nombre: '🎓 Profesiones y Ciencia' },
    { id: 'futbol', nombre: '⚽ Fútbol y Básquetbol' },
    { id: 'tenis', nombre: '🎾 Tenis y Raqueta' },
    { id: 'ciclismo', nombre: '🚴‍♂️ Ciclismo y Running' },
    { id: 'agua', nombre: '🏊‍♂️ Natación y Surf' },
    { id: 'artes_marciales', nombre: '🥋 Artes Marciales y Arco' },
    { id: 'extremos', nombre: '🛹 Skateboard y Deportes' }
  ];

  const AVATARES_ESTUDIANTES = [
    // 🎓 PROFESIONES Y CIENCIA
    { id: 'inf-1', cat: 'profesiones', nombre: 'Programador / Informático', icono: '💻', bg: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)' },
    { id: 'cien-1', cat: 'profesiones', nombre: 'Científico / Investigador', icono: '🔬', bg: 'linear-gradient(135deg, #047857 0%, #10b981 100%)' },
    { id: 'fot-1', cat: 'profesiones', nombre: 'Fotógrafo / Reportero', icono: '📸', bg: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)' },
    { id: 'doc-1', cat: 'profesiones', nombre: 'Médico / Salud', icono: '🩺', bg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' },
    { id: 'parq-1', cat: 'profesiones', nombre: 'Guardaparques / Naturaleza', icono: '🤠', bg: 'linear-gradient(135deg, #15803d 0%, #4ade80 100%)' },
    { id: 'art-1', cat: 'profesiones', nombre: 'Música / Flautista', icono: '🎶', bg: 'linear-gradient(135deg, #7e22ce 0%, #c084fc 100%)' },
    { id: 'prof-1', cat: 'profesiones', nombre: 'Profesor / Lector', icono: '📖', bg: 'linear-gradient(135deg, #4338ca 0%, #818cf8 100%)' },
    { id: 'chef-1', cat: 'profesiones', nombre: 'Chef / Gastronomía', icono: '👨‍🍳', bg: 'linear-gradient(135deg, #e11d48 0%, #fb7185 100%)' },
    { id: 'ing-1', cat: 'profesiones', nombre: 'Ingeniero / Constructor', icono: '👷‍♂️', bg: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)' },
    { id: 'pol-1', cat: 'profesiones', nombre: 'Oficial de Seguridad', icono: '👮‍♂️', bg: 'linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%)' },

    // ⚽ FÚTBOL Y BÁSQUETBOL
    { id: 'fut-1', cat: 'futbol', nombre: 'Delantero Rojo', icono: '⚽', bg: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' },
    { id: 'fut-2', cat: 'futbol', nombre: 'Portero Verde', icono: '🧤', bg: 'linear-gradient(135deg, #059669 0%, #34d399 100%)' },
    { id: 'fut-3', cat: 'futbol', nombre: 'Mediocampista Azul', icono: '🏃‍♂️', bg: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)' },
    { id: 'fut-4', cat: 'futbol', nombre: 'Futbolista Amarilla', icono: '🏃‍♀️', bg: 'linear-gradient(135deg, #ca8a04 0%, #facc15 100%)' },
    { id: 'basq-1', cat: 'futbol', nombre: 'Baloncestista Pro', icono: '🏀', bg: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)' },
    { id: 'volei-1', cat: 'futbol', nombre: 'Voleibolista Estelar', icono: '🏐', bg: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)' },

    // 🎾 TENIS Y RAQUETA
    { id: 'ten-1', cat: 'tenis', nombre: 'Tenista Blanco', icono: '🎾', bg: 'linear-gradient(135deg, #475569 0%, #94a3b8 100%)' },
    { id: 'ten-2', cat: 'tenis', nombre: 'Tenista Pro', icono: '🏸', bg: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' },
    { id: 'ping-1', cat: 'tenis', nombre: 'Campeón Ping Pong', icono: '🏓', bg: 'linear-gradient(135deg, #b91c1c 0%, #f87171 100%)' },

    // 🚴‍♂️ CICLISMO Y RUNNING
    { id: 'cicl-1', cat: 'ciclismo', nombre: 'Ciclista de Montaña', icono: '🚴‍♂️', bg: 'linear-gradient(135deg, #15803d 0%, #86efac 100%)' },
    { id: 'cicl-2', cat: 'ciclismo', nombre: 'Ciclista Velocidad', icono: '🚴‍♀️', bg: 'linear-gradient(135deg, #0284c7 0%, #7dd3fc 100%)' },
    { id: 'run-1', cat: 'ciclismo', nombre: 'Runner Maratón', icono: '🏃‍♂️', bg: 'linear-gradient(135deg, #e11d48 0%, #fda4af 100%)' },
    { id: 'esc-1', cat: 'ciclismo', nombre: 'Escalador de Roca', icono: '🧗‍♂️', bg: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)' },

    // 🏊‍♂️ NATACIÓN Y SURF
    { id: 'nad-1', cat: 'agua', nombre: 'Nadador Olímpico', icono: '🏊‍♂️', bg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' },
    { id: 'surf-1', cat: 'agua', nombre: 'Surfista de Olas', icono: '🏄‍♂️', bg: 'linear-gradient(135deg, #0d9488 0%, #5eead4 100%)' },
    { id: 'kayak-1', cat: 'agua', nombre: 'Kayakista Veloz', icono: '🛶', bg: 'linear-gradient(135deg, #d97706 0%, #fde047 100%)' },

    // 🥋 ARTES MARCIALES Y ARCO
    { id: 'kar-1', cat: 'artes_marciales', nombre: 'Cinturón Negro Karate', icono: '🥋', bg: 'linear-gradient(135deg, #0f172a 0%, #475569 100%)' },
    { id: 'arc-1', cat: 'artes_marciales', nombre: 'Arquera Diana', icono: '🏹', bg: 'linear-gradient(135deg, #166534 0%, #4ade80 100%)' },

    // 🛹 SKATEBOARD Y DEPORTES
    { id: 'skat-1', cat: 'extremos', nombre: 'Skater Urbano', icono: '🛹', bg: 'linear-gradient(135deg, #6b21a8 0%, #c084fc 100%)' },
    { id: 'hock-1', cat: 'extremos', nombre: 'Jugador Hockey', icono: '🏒', bg: 'linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)' },
    { id: 'esgr-1', cat: 'extremos', nombre: 'Esgrimista Pro', icono: '🤺', bg: 'linear-gradient(135deg, #334155 0%, #cbd5e1 100%)' },
    { id: 'gim-1', cat: 'extremos', nombre: 'Gimnasta Rítmica', icono: '🤸‍♀️', bg: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)' }
  ];

  window.RICE_AvataresCatalog = {
    categorias: CATEGORIAS_AVATARES,
    lista: AVATARES_ESTUDIANTES
  };
})();
