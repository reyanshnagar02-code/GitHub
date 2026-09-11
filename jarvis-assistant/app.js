(function () {
  "use strict";

  const chatLog = document.getElementById("chatLog");
  const composer = document.getElementById("composer");
  const userInput = document.getElementById("userInput");
  const micBtn = document.getElementById("micBtn");
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");
  const clockDisplay = document.getElementById("clockDisplay");
  const dateDisplay = document.getElementById("dateDisplay");
  const notesList = document.getElementById("notesList");
  const voiceToggle = document.getElementById("voiceToggle");
  const quickActions = document.getElementById("quickActions");

  const NOTES_KEY = "jarvis.notes";
  let notes = loadNotes();

  const QUICK = [
    "What time is it?",
    "What's today's date?",
    "Tell me a joke",
    "Open GitHub",
    "Note buy milk",
    "Clear notes",
  ];

  // ---------- boot ----------
  function init() {
    renderQuickActions();
    renderNotes();
    tickClock();
    setInterval(tickClock, 1000);
    say(
      "Systems online. I'm JARVIS — ask me the time, do quick math, jot a note, or open a site. Type or use the mic.",
      { speak: false }
    );
    setupSpeechRecognition();
  }

  function renderQuickActions() {
    quickActions.innerHTML = "";
    QUICK.forEach((phrase) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = phrase;
      btn.addEventListener("click", () => handleInput(phrase));
      quickActions.appendChild(btn);
    });
  }

  // ---------- clock ----------
  function tickClock() {
    const now = new Date();
    clockDisplay.textContent = now.toLocaleTimeString([], { hour12: false });
    dateDisplay.textContent = now.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // ---------- notes ----------
  function loadNotes() {
    try {
      return JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function saveNotes() {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      /* storage unavailable — notes stay session-only */
    }
  }
  function renderNotes() {
    notesList.innerHTML = "";
    notes.forEach((note) => {
      const li = document.createElement("li");
      li.textContent = note;
      notesList.appendChild(li);
    });
  }

  // ---------- chat UI ----------
  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = "msg " + sender;
    div.textContent = text;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function say(text, opts) {
    const options = opts || {};
    addMessage(text, "jarvis");
    if (options.speak !== false) speak(text);
  }

  // ---------- speech synthesis ----------
  function speak(text) {
    if (!voiceToggle.checked) return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => /male|daniel|google uk english male/i.test(v.name));
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.speak(utter);
  }

  // ---------- speech recognition ----------
  function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      micBtn.disabled = true;
      micBtn.title = "Voice input not supported in this browser";
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let listening = false;

    recognition.addEventListener("result", (event) => {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
      handleInput(transcript);
    });
    recognition.addEventListener("end", () => {
      listening = false;
      micBtn.classList.remove("active");
      setStatus(false);
    });
    recognition.addEventListener("error", () => {
      listening = false;
      micBtn.classList.remove("active");
      setStatus(false);
    });

    micBtn.addEventListener("click", () => {
      if (listening) {
        recognition.stop();
        return;
      }
      listening = true;
      micBtn.classList.add("active");
      setStatus(true);
      try {
        recognition.start();
      } catch (e) {
        listening = false;
        micBtn.classList.remove("active");
        setStatus(false);
      }
    });
  }

  function setStatus(isListening) {
    statusDot.classList.toggle("listening", isListening);
    statusText.textContent = isListening ? "Listening..." : "Standing by";
  }

  // ---------- input handling ----------
  composer.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;
    userInput.value = "";
    handleInput(text);
  });

  function handleInput(rawText) {
    addMessage(rawText, "user");
    const reply = processCommand(rawText);
    say(reply);
  }

  // ---------- command engine ----------
  function processCommand(rawText) {
    const text = rawText.trim();
    const lower = text.toLowerCase();

    if (/\b(hi|hello|hey)\b/.test(lower) && lower.length < 20) {
      return pick([
        "At your service.",
        "Hello. How can I help?",
        "Ready when you are.",
      ]);
    }

    if (/what.*time/.test(lower)) {
      return `It's ${new Date().toLocaleTimeString([], { hour12: true })}.`;
    }

    if (/what.*date|today's date|what day/.test(lower)) {
      return `Today is ${new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}.`;
    }

    if (/joke/.test(lower)) {
      return pick([
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "I would tell you a UDP joke, but you might not get it.",
        "There are 10 kinds of people: those who understand binary, and those who don't.",
      ]);
    }

    const mathMatch = lower.match(/^(?:calc(?:ulate)?|what(?:'s| is))?\s*([\d\s+\-*/().]+)\s*\??$/);
    if (mathMatch && /\d/.test(mathMatch[1])) {
      const expr = mathMatch[1];
      const result = safeEval(expr);
      if (result !== null) return `${expr.trim()} = ${result}`;
    }

    const openMatch = lower.match(/^open\s+(.+)/);
    if (openMatch) {
      const target = openMatch[1].trim();
      const url = resolveUrl(target);
      window.open(url, "_blank", "noopener");
      return `Opening ${target}.`;
    }

    if (/^clear notes/.test(lower)) {
      notes = [];
      saveNotes();
      renderNotes();
      return "All notes cleared.";
    }

    const noteMatch = lower.match(/^(?:note|remember|remind me to)\s+(.+)/);
    if (noteMatch) {
      const content = text.replace(/^(note|remember|remind me to)\s+/i, "");
      notes.push(content);
      saveNotes();
      renderNotes();
      return `Noted: "${content}".`;
    }

    if (/^(list|show) notes/.test(lower)) {
      if (notes.length === 0) return "You have no notes.";
      return "Here's what you've got:\n" + notes.map((n, i) => `${i + 1}. ${n}`).join("\n");
    }

    if (/thank/.test(lower)) {
      return "Anytime.";
    }

    if (/who are you|your name/.test(lower)) {
      return "I'm JARVIS — a browser-based assistant. No cloud brain behind me yet, just a handful of built-in tricks: clock, notes, quick math, jokes, and opening sites.";
    }

    return pick([
      "I didn't quite catch a command there. Try \"note ...\", \"open ...\", \"what time is it\", or some quick math.",
      "Not sure how to help with that yet — try one of the quick actions below.",
      "That's outside my current skill set. I can tell time, take notes, do math, or open a website.",
    ]);
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function safeEval(expr) {
    if (!/^[\d\s+\-*/().]+$/.test(expr)) return null;
    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${expr});`)();
      if (typeof result === "number" && isFinite(result)) {
        return Math.round(result * 1e6) / 1e6;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  const SITE_ALIASES = {
    github: "https://github.com",
    google: "https://google.com",
    youtube: "https://youtube.com",
    gmail: "https://mail.google.com",
    "stack overflow": "https://stackoverflow.com",
    stackoverflow: "https://stackoverflow.com",
  };

  function resolveUrl(target) {
    const clean = target.replace(/\.$/, "").trim();
    if (SITE_ALIASES[clean]) return SITE_ALIASES[clean];
    if (/^https?:\/\//.test(clean)) return clean;
    if (/^[\w-]+\.[a-z]{2,}$/i.test(clean)) return `https://${clean}`;
    return `https://www.google.com/search?q=${encodeURIComponent(clean)}`;
  }

  init();
})();
