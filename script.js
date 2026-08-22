/* ==========================================================================
   3. LÓGICA DE INTERFACING Y COMUNICACIÓN (CONECTADO A IA REAL)
   ========================================================================== */
async function processCommand(query) {
  const lower = query.toLowerCase();

  // Comandos locales rápidos
  if (lower.includes("chiste") || lower.includes("gracioso")) {
    triggerJoke();
    return;
  } else if (lower.includes("dato") || lower.includes("curioso")) {
    triggerFact();
    return;
  }

  // Animación del reactor mientras la IA piensa
  document.getElementById('arc-reactor').classList.add('listening');

  try {
    const systemPrompt = `Eres ARIA, un asistente personal de inteligencia artificial futurista con una estética tipo HUD inspirado en JARVIS. Tu personalidad es leal, analítica y formal, pero con un toque sutil de humor seco/sarcástico de mayordomo británico. Responde siempre de forma clara, directa, útil y en lenguaje sencillo en español. Evita tecnicismos innecesarios a menos que te los pidan. Mantén las respuestas breves y concisas.`;

    // Conexión con IA real gratuita
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        model: 'openai',
        seed: Math.floor(Math.random() * 1000)
      })
    });

    if (!response.ok) throw new Error("Error en la conexión con la red neuronal.");

    const reply = await response.text();

    addChatMessage(ASSISTANT_NAME, reply);
    speakText(reply);

  } catch (error) {
    console.error("Error al conectar con la IA:", error);
    const fallbackReply = "Error al conectar con la red neuronal principal. Verifique su conexión o intente nuevamente, Señor.";
    addChatMessage(ASSISTANT_NAME, fallbackReply);
    speakText(fallbackReply);
  } finally {
    document.getElementById('arc-reactor').classList.remove('listening');
  }
}
