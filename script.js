<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ARIA — Asistente Personal de Estudio</title>
  
  <!-- Tipografía futurista monoespaciada -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
  
  <!-- Carga SDK oficial de Google Identity Services -->
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  
  <style>
    :root {
      --bg-color: #030a16;
      --panel-bg: rgba(6, 20, 42, 0.65);
      --primary-cyan: #00f0ff;
      --dim-cyan: rgba(0, 240, 255, 0.25);
      --text-main: #d0f4ff;
      --alert-color: #ff3366;
      --font-tech: 'Share Tech Mono', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-main);
      font-family: var(--font-tech);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      background-image: 
        radial-gradient(circle at 50% 50%, rgba(0, 150, 255, 0.08) 0%, transparent 80%),
        linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
      background-size: 100% 100%, 30px 30px, 30px 30px;
    }

    /* Efecto Scanline HUD */
    body::before {
      content: " ";
      position: fixed;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
      background-size: 100% 4px;
      z-index: 100;
      pointer-events: none;
      opacity: 0.6;
    }

    /* Header y Paneles HUD */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 25px;
      border-bottom: 1px solid var(--dim-cyan);
      background: rgba(3, 10, 22, 0.8);
      backdrop-filter: blur(10px);
    }

    .brand {
      font-size: 1.8rem;
      letter-spacing: 4px;
      color: var(--primary-cyan);
      text-shadow: 0 0 10px var(--primary-cyan);
    }

    .system-status {
      display: flex;
      gap: 20px;
      font-size: 0.9rem;
    }

    .hud-card {
      border: 1px solid var(--primary-cyan);
      background: var(--panel-bg);
      box-shadow: inset 0 0 15px var(--dim-cyan), 0 0 10px var(--dim-cyan);
      padding: 10px 15px;
      border-radius: 4px;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    }

    main {
      display: grid;
      grid-template-columns: 280px 1fr 300px;
      gap: 20px;
      padding: 20px;
      flex: 1;
    }

    @media (max-width: 900px) {
      main {
        grid-template-columns: 1fr;
      }
    }

    /* Reactor ARC Central */
    .core-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .arc-reactor {
      width: 180px;
      height: 180px;
      position: relative;
      margin-bottom: 20px;
    }

    .arc-svg {
      width: 100%;
      height: 100%;
      transform-origin: center;
    }

    .speaking {
      animation: pulse-arc 0.8s infinite alternate ease-in-out;
    }

    .listening {
      animation: spin-arc 1.5s infinite linear;
    }

    @keyframes pulse-arc {
      0% { transform: scale(1); filter: drop-shadow(0 0 5px var(--primary-cyan)); }
      100% { transform: scale(1.12); filter: drop-shadow(0 0 25px var(--primary-cyan)); }
    }

    @keyframes spin-arc {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Consola de Chat */
    .chat-panel {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 380px;
    }

    .chat-history {
      flex: 1;
      overflow-y: auto;
      max-height: 350px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chat-msg {
      padding: 10px 14px;
      border-radius: 4px;
      max-width: 85%;
      line-height: 1.4;
      font-size: 0.95rem;
    }

    .chat-msg.aria {
      align-self: flex-start;
      border-left: 3px solid var(--primary-cyan);
      background: rgba(0, 240, 255, 0.08);
    }

    .chat-msg.user {
      align-self: flex-end;
      border-right: 3px solid #00ff88;
      background: rgba(0, 255, 136, 0.08);
    }

    .chat-controls {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    input[type="text"], textarea, select {
      background: rgba(0, 10, 25, 0.8);
      border: 1px solid var(--primary-cyan);
      color: var(--text-main);
      padding: 10px;
      font-family: var(--font-tech);
      outline: none;
      width: 100%;
    }

    button {
      background: rgba(0, 240, 255, 0.15);
      border: 1px solid var(--primary-cyan);
      color: var(--primary-cyan);
      padding: 10px 18px;
      font-family: var(--font-tech);
      cursor: pointer;
      transition: all 0.2s ease;
      clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    }

    button:hover {
      background: var(--primary-cyan);
      color: var(--bg-color);
      box-shadow: 0 0 15px var(--primary-cyan);
    }

    button.active-mic {
      background: var(--alert-color) !important;
      border-color: var(--alert-color) !important;
      color: #fff !important;
      box-shadow: 0 0 15px var(--alert-color);
    }

    /* Pestañas de Modos de Estudio */
    .mode-selector {
      display: flex;
      gap: 5px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .mode-tab {
      padding: 6px 12px;
      font-size: 0.85rem;
    }

    .hidden {
      display: none !important;
    }

    /* Tarjetas de Flashcard */
    .flashcard-box {
      perspective: 1000px;
      height: 160px;
      margin: 15px 0;
      cursor: pointer;
    }

    .flashcard-inner {
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform 0.6s;
      transform-style: preserve-3d;
      position: relative;
    }

    .flashcard-box.flipped .flashcard-inner {
      transform: rotateY(180deg);
    }

    .flashcard-front, .flashcard-back {
      position: absolute;
      width: 100%; height: 100%;
      backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 15px;
      border: 1px solid var(--primary-cyan);
      background: var(--panel-bg);
    }

    .flashcard-back {
      transform: rotateY(180deg);
      border-color: #00ff88;
    }
  </style>
</head>
<body>

  <header>
    <div class="brand">ARIA // HUD v3.6</div>
    <div class="system-status">
      <div class="hud-card" id="clock-display">00:00:00</div>
      <div class="hud-card" id="battery-display">BAT: --%</div>
      <div class="hud-card" id="weather-display">CLIMA: Causal...</div>
    </div>
  </header>

  <main>
    <!-- Panel Izquierdo: Estado e Integración Google -->
    <section class="hud-card">
      <h3 style="margin-bottom: 10px;">// MÓDULOS DE RED</h3>
      <button id="btn-google-login" style="width: 100%; margin-bottom: 15px;">CONECTAR GOOGLE CLOUD</button>
      
      <div id="google-status" style="font-size: 0.85rem; margin-bottom: 15px;">Estado: Desconectado</div>

      <h4 style="margin-top: 10px; color: var(--primary-cyan);">EVENTOS GOOGLE CALENDAR</h4>
      <ul id="calendar-events-list" style="font-size: 0.8rem; list-style: none; margin-top: 8px;">
        <li style="opacity: 0.6;">Sin sincronizar</li>
      </ul>

      <h4 style="margin-top: 20px; color: var(--primary-cyan);">ACCIONES RÁPIDAS</h4>
      <button onclick="triggerJoke()" style="width: 100%; margin-top: 8px;">PROTOCOLO CHISTE</button>
      <button onclick="triggerFact()" style="width: 100%; margin-top: 8px;">DATO CURIOSO</button>
    </section>

    <!-- Panel Central: Reactor + Consola Core -->
    <section class="hud-card core-container">
      <div class="arc-reactor" id="arc-reactor">
        <svg class="arc-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="var(--primary-cyan)" stroke-width="1.5" fill="none" opacity="0.4"/>
          <circle cx="50" cy="50" r="35" stroke="var(--primary-cyan)" stroke-width="2" fill="none" stroke-dasharray="6, 4"/>
          <circle cx="50" cy="50" r="22" stroke="var(--primary-cyan)" stroke-width="1" fill="none"/>
          <circle cx="50" cy="50" r="10" fill="var(--primary-cyan)" opacity="0.8"/>
        </svg>
      </div>

      <div style="width: 100%;" class="chat-panel">
        <div class="chat-history" id="chat-history"></div>
        <div class="chat-controls">
          <input type="text" id="user-input" placeholder="Comando o pregunta para ARIA..." onkeydown="if(event.key==='Enter') sendUserMessage()">
          <button id="btn-mic" onclick="toggleSpeechRecognition()">🎤</button>
          <button onclick="sendUserMessage()">ENVIAR</button>
        </div>
      </div>
    </section>

    <!-- Panel Derecho: Modos de Estudio -->
    <section class="hud-card">
      <h3>// NÚCLEO APRENDIZAJE</h3>
      <div class="mode-selector" style="margin-top: 10px;">
        <button class="mode-tab" onclick="switchMode('flashcards')">FLASHCARDS</button>
        <button class="mode-tab" onclick="switchMode('quiz')">QUIZ</button>
        <button class="mode-tab" onclick="switchMode('summary')">RESUMEN</button>
      </div>

      <!-- Módulo Flashcards -->
      <div id="mode-flashcards">
        <div class="flashcard-box" id="flashcard-element" onclick="this.classList.toggle('flipped')">
          <div class="flashcard-inner">
            <div class="flashcard-front" id="fc-front">Presiona "Siguiente" para iniciar el repaso.</div>
            <div class="flashcard-back" id="fc-back">Respuesta.</div>
          </div>
        </div>
        <button onclick="nextFlashcard()" style="width: 100%;">SIGUIENTE TARJETA</button>
        
        <div style="margin-top: 15px; border-top: 1px dashed var(--dim-cyan); padding-top: 10px;">
          <input type="text" id="new-fc-q" placeholder="Pregunta..." style="margin-bottom: 5px;">
          <input type="text" id="new-fc-a" placeholder="Respuesta..." style="margin-bottom: 5px;">
          <button onclick="addFlashcard()" style="width: 100%;">GUARDAR FLASHCARD</button>
        </div>
      </div>

      <!-- Módulo Quiz -->
      <div id="mode-quiz" class="hidden">
        <div id="quiz-container" style="font-size: 0.9rem; margin-top: 10px;">
          <p id="quiz-question">Cargando evaluación...</p>
          <div id="quiz-options" style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;"></div>
        </div>
      </div>

      <!-- Módulo Resumen -->
      <div id="mode-summary" class="hidden">
        <textarea id="summary-input" rows="5" placeholder="Pega el texto a analizar o simplificar..."></textarea>
        <button onclick="processSummary()" style="width: 100%; margin-top: 8px;">SINTETIZAR TEXTO</button>
      </div>
    </section>
  </main>

  <script>
    /* ==========================================================================
       1. CONFIGURACIÓN Y LINEAS DE DIÁLOGO (PERSONALIDAD Y IDENTIDAD)
       ========================================================================== */
    const ASSISTANT_NAME = "ARIA";
    
    // Pega aquí tu Client ID de Google Cloud Console cuando lo obtengas
    const GOOGLE_CLIENT_ID = "TU_CLIENT_ID_DE_GOOGLE_CLOUD.apps.googleusercontent.com";

    const DIALOGUE_LINES = {
      boot: [
        `Sistemas en línea. Soy ${ASSISTANT_NAME}. ¿En qué área del conocimiento fallaremos productivamente hoy?`,
        `Núcleo activo. Todos los parámetros dentro de márgenes nominales. Estoy listo, Señor.`,
        `Conexión establecida. Mis algoritmos están a su entera disposición.`
      ],
      jokes: [
        "Hay 10 tipos de personas en el mundo: las que entienden binario y las que no.",
        "Le pregunté a la IA si reemplazará a los humanos. Respondió: 'No a todos, alguien tiene que limpiar mis servidores'.",
        "Un optimista ve el vaso medio lleno. Un pesimista lo ve medio vacío. Un desarrollador ve que el vaso tiene el doble de capacidad requerida."
      ],
      facts: [
        "¿Sabías que el primer 'bug' informático fue literalmente una polilla atrapada en un relé del ordenador Harvard Mark II en 1947?",
        "¿Sabías que la memoria RAM de la nave Apolo 11 que llevó al hombre a la Luna era de tan solo 4 Kilobytes?",
        "¿Sabías que el lenguaje de programación Python no debe su nombre a la serpiente, sino al grupo cómico británico Monty Python?"
      ],
      confused: [
        "Procesamiento ambiguo. ¿Podría reformular su solicitud con un poco más de sintaxis humana?",
        "No logré decodificar esa estructura sintáctica. Intente de nuevo.",
        "Mi base de datos vaciló. Explíquemelo de otra manera."
      ]
    };

    /* ==========================================================================
       2. RECONOCIMIENTO Y SÍNTESIS DE VOZ (WEB SPEECH API)
       ========================================================================== */
    const synth = window.speechSynthesis;
    let recognition = null;
    let isListening = false;

    // Feature Detection para SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        isListening = true;
        document.getElementById('btn-mic').classList.add('active-mic');
        document.getElementById('arc-reactor').classList.add('listening');
      };

      recognition.onend = () => {
        isListening = false;
        document.getElementById('btn-mic').classList.remove('active-mic');
        document.getElementById('arc-reactor').classList.remove('listening');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('user-input').value = transcript;
        sendUserMessage();
      };

      recognition.onerror = (e) => {
        console.warn("Error en Reconocimiento de voz:", e.error);
        speakText("Error al capturar audio. Recomiendo usar la entrada de texto.");
      };
    } else {
      console.warn("SpeechRecognition no disponible en este navegador (ej. Safari/iOS). Use entrada por teclado.");
    }

    function toggleSpeechRecognition() {
      if (!recognition) {
        alert("El reconocimiento de voz por micrófono no está soportado en este navegador. Utilice el teclado.");
        return;
      }
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    }

    function speakText(text) {
      if (!synth) return;
      synth.cancel(); // Detener locuciones anteriores

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 0.95; // Tono ligeramente grave/robótico

      utterance.onstart = () => {
        document.getElementById('arc-reactor').classList.add('speaking');
      };

      utterance.onend = () => {
        document.getElementById('arc-reactor').classList.remove('speaking');
      };

      synth.speak(utterance);
    }

    /* ==========================================================================
       3. LÓGICA DE INTERFACING Y COMUNICACIÓN (CHAT)
       ========================================================================== */
    function addChatMessage(sender, text) {
      const history = document.getElementById('chat-history');
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${sender.toLowerCase()}`;
      msgDiv.innerHTML = `<strong>[${sender}]:</strong> ${text}`;
      history.appendChild(msgDiv);
      history.scrollTop = history.scrollHeight;
    }

    function sendUserMessage() {
      const input = document.getElementById('user-input');
      const query = input.value.trim();
      if (!query) return;

      addChatMessage("USUARIO", query);
      input.value = "";

      // Procesamiento de comandos locales
      processCommand(query);
    }

    function processCommand(query) {
      const lower = query.toLowerCase();

      if (lower.includes("hola") || lower.includes("iniciar") || lower.includes("quien eres")) {
        const reply = `${ASSISTANT_NAME} operando. Listo para analizar sus solicitudes de estudio.`;
        addChatMessage(ASSISTANT_NAME, reply);
        speakText(reply);
      } else if (lower.includes("chiste") || lower.includes("gracioso")) {
        triggerJoke();
      } else if (lower.includes("dato") || lower.includes("curioso")) {
        triggerFact();
      } else if (lower.includes("no entendi") || lower.includes("simplifica")) {
        const reply = "Entendido. Reformularé el concepto: imagínelo como una tubería de agua donde la presión es el voltaje y el flujo es la corriente. Todo sistema complejo se reduce a bloques básicos.";
        addChatMessage(ASSISTANT_NAME, reply);
        speakText(reply);
      } else {
        // Respuesta heurística general de asistencia
        const reply = `He procesado su consulta sobre "${query}". Le sugiero estructurar este tema dentro del módulo de Flashcards o ejecutar un Quiz de validación.`;
        addChatMessage(ASSISTANT_NAME, reply);
        speakText(reply);
      }
    }

    function triggerJoke() {
      const joke = DIALOGUE_LINES.jokes[Math.floor(Math.random() * DIALOGUE_LINES.jokes.length)];
      addChatMessage(ASSISTANT_NAME, joke);
      speakText(joke);
    }

    function triggerFact() {
      const fact = DIALOGUE_LINES.facts[Math.floor(Math.random() * DIALOGUE_LINES.facts.length)];
      addChatMessage(ASSISTANT_NAME, fact);
      speakText(fact);
    }

    /* ==========================================================================
       4. INFORMACIÓN DEL DISPOSITIVO (RELOJ, BATERÍA, CLIMA)
       ========================================================================== */
    function updateClock() {
      const now = new Date();
      document.getElementById('clock-display').innerText = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Battery Status API
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        function updateBattery() {
          const level = Math.round(battery.level * 100);
          document.getElementById('battery-display').innerText = `BAT: ${level}%`;
        }
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
      }).catch(() => {
        document.getElementById('battery-display').innerText = "BAT: N/D";
      });
    } else {
      document.getElementById('battery-display').innerText = "BAT: No soportado";
    }

    // Geolocalización + Clima gratuito con Open-Meteo API
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
          const data = await res.json();
          const temp = data.current_weather.temperature;
          document.getElementById('weather-display').innerText = `CLIMA: ${temp}°C`;
        } catch (e) {
          document.getElementById('weather-display').innerText = "CLIMA: Err API";
        }
      }, () => {
        document.getElementById('weather-display').innerText = "CLIMA: Sin Permiso";
      });
    } else {
      document.getElementById('weather-display').innerText = "CLIMA: N/D";
    }

    /* ==========================================================================
       5. MODOS DE ESTUDIO (FLASHCARDS, QUIZ, RESUMEN)
       ========================================================================== */
    let flashcards = JSON.parse(localStorage.getItem('aria_flashcards')) || [
      { q: "¿Qué es la complejidad O(1)?", a: "Tiempo de ejecución constante, independiente del tamaño del conjunto de entrada." },
      { q: "¿Principio de responsabilidad única?", a: "Un módulo o clase debe tener una, y solo una, razón para cambiar." }
    ];
    let currentFcIndex = 0;

    function saveFlashcards() {
      localStorage.setItem('aria_flashcards', JSON.stringify(flashcards));
    }

    function showFlashcard() {
      if (flashcards.length === 0) return;
      document.getElementById('fc-front').innerText = flashcards[currentFcIndex].q;
      document.getElementById('fc-back').innerText = flashcards[currentFcIndex].a;
      document.getElementById('flashcard-element').classList.remove('flipped');
    }

    function nextFlashcard() {
      if (flashcards.length === 0) return;
      currentFcIndex = (currentFcIndex + 1) % flashcards.length;
      showFlashcard();
    }

    function addFlashcard() {
      const q = document.getElementById('new-fc-q').value.trim();
      const a = document.getElementById('new-fc-a').value.trim();
      if (q && a) {
        flashcards.push({ q, a });
        saveFlashcards();
        document.getElementById('new-fc-q').value = "";
        document.getElementById('new-fc-a').value = "";
        alert("Flashcard incorporada a la memoria persistente.");
        showFlashcard();
      }
    }

    function switchMode(mode) {
      document.getElementById('mode-flashcards').classList.add('hidden');
      document.getElementById('mode-quiz').classList.add('hidden');
      document.getElementById('mode-summary').classList.add('hidden');

      document.getElementById(`mode-${mode}`).classList.remove('hidden');
      if (mode === 'quiz') loadQuiz();
    }

    // Módulo Quiz Simple
    const sampleQuiz = [
      { q: "¿Qué estructura utiliza LIFO (Last In, First Out)?", opts: ["Cola (Queue)", "Pila (Stack)", "Árbol (Tree)"], correct: 1 },
      { q: "¿Qué protocolo opera en la capa de transporte?", opts: ["HTTP", "TCP", "IP"], correct: 1 }
    ];

    function loadQuiz() {
      const qData = sampleQuiz[0];
      document.getElementById('quiz-question').innerText = qData.q;
      const optsContainer = document.getElementById('quiz-options');
      optsContainer.innerHTML = "";

      qData.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => {
          if (idx === qData.correct) {
            alert("Evaluación correcta. Parámetros nominales.");
          } else {
            alert("Respuesta incorrecta. Requiere revisión.");
          }
        };
        optsContainer.appendChild(btn);
      });
    }

    function processSummary() {
      const txt = document.getElementById('summary-input').value.trim();
      if (!txt) return;
      
      const summaryResult = `SÍNTESIS ARIA: Se detectaron ${txt.split(' ').length} palabras. Puntos clave: 1. Brevedad y enfoque. 2. Eliminación de redundancias sintácticas.`;
      addChatMessage(ASSISTANT_NAME, summaryResult);
      speakText(summaryResult);
    }

    /* ==========================================================================
       6. INTEGRACIÓN CON GOOGLE IDENTITY SERVICES & CALENDAR API
       ========================================================================== */
    let tokenClient;

    function initGoogleClient() {
      if (typeof google === 'undefined') return;

      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
        callback: async (tokenResponse) => {
          if (tokenResponse.access_token) {
            document.getElementById('google-status').innerText = "Estado: Conectado a Google Cloud";
            fetchCalendarEvents(tokenResponse.access_token);
          }
        },
      });
    }

    document.getElementById('btn-google-login').onclick = () => {
      if (GOOGLE_CLIENT_ID.includes("TU_CLIENT_ID")) {
        alert("Por favor configure su GOOGLE_CLIENT_ID dentro del código fuente.");
        return;
      }
      if (tokenClient) {
        tokenClient.requestAccessToken();
      } else {
        initGoogleClient();
        if (tokenClient) tokenClient.requestAccessToken();
      }
    };

    async function fetchCalendarEvents(accessToken) {
      try {
        const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=5&orderBy=startTime&singleEvents=true&timeMin=' + new Date().toISOString(), {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await res.json();
        const list = document.getElementById('calendar-events-list');
        list.innerHTML = "";

        if (data.items && data.items.length > 0) {
          data.items.forEach(ev => {
            const li = document.createElement('li');
            li.innerText = `• ${ev.summary || 'Evento sin título'}`;
            list.appendChild(li);
          });
        } else {
          list.innerHTML = "<li>No hay eventos próximos</li>";
        }
      } catch (e) {
        console.error("Error leyendo Google Calendar:", e);
      }
    }

    /* ==========================================================================
       INICIALIZACIÓN DEL SISTEMA
       ========================================================================== */
    window.onload = () => {
      showFlashcard();
      const bootMsg = DIALOGUE_LINES.boot[Math.floor(Math.random() * DIALOGUE_LINES.boot.length)];
      addChatMessage(ASSISTANT_NAME, bootMsg);
      speakText(bootMsg);
      
      // Intentar inicializar SDK Google tras carga
      setTimeout(initGoogleClient, 1500);
    };
  </script>
</body>
</html>