// Bluetooth conversation translator — public life tool, no backend, no key.
// Speaks any language into English: the mic hears the other person, the
// translation auto-detects the language, and the English plays back through
// the listener's earbuds or headset. Everything here is plain browser APIs
// (SpeechRecognition, speechSynthesis, Media Session). Nothing is sent to
// the Engine, nothing is stored anywhere, and the conversation log lives
// on this page only until you leave it.
// Honest limits, stated on the page: it needs Chrome on Android with the
// phone mic and a headset, and a translation fetch that fails is shown as
// UNAVAILABLE, never faked.
(function () {
  "use strict";
  var root = document.getElementById("translator");
  if (!root) return;

  var startBtn = document.getElementById("trStartBtn");
  var statusEl = document.getElementById("trStatus");
  var heardEl = document.getElementById("trHeard");
  var englishEl = document.getElementById("trEnglish");
  var logEl = document.getElementById("trLog");
  var flushBtn = document.getElementById("trFlushBtn");
  var discardBtn = document.getElementById("trDiscardBtn");
  var armBtn = document.getElementById("trArmBtn");
  var replayBtn = document.getElementById("trReplayBtn");
  var pauseInput = document.getElementById("trPause");
  var pauseVal = document.getElementById("trPauseVal");
  var speedSel = document.getElementById("trSpeed");
  var hearingSel = document.getElementById("trHearing");
  var focusBox = document.getElementById("trFocus");
  var headsetNote = document.getElementById("trHeadsetNote");
  if (!startBtn || !statusEl || !heardEl || !englishEl || !logEl) return;

  // 0.1s of silence, 8000 Hz mono 16-bit PCM, looped: it holds a silent
  // Media Session so the headset play/pause button routes to this page
  // instead of to the phone's music player. It makes no sound.
  var SILENT_WAV = "data:audio/wav;base64,UklGRmQGAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  var GOOGLE_URL = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=";
  var MYMEMORY_URL = "https://api.mymemory.translated.net/get?q=";
  var FOCUS_MIN_CONFIDENCE = 0.6;
  var DOUBLE_PRESS_MS = 400;
  var MAX_LOG_ENTRIES = 50;

  var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = null;
  var listening = false;
  var speaking = false;
  var heldText = "";
  var holdTimer = null;
  var lastEnglish = "";
  var lastPressAt = 0;
  var silentAudio = null;
  var headsetArmed = false;

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function setHeard(text) {
    heardEl.textContent = text;
  }

  function setEnglish(text) {
    englishEl.textContent = text;
  }

  function pauseMs() {
    var v = pauseInput ? parseInt(pauseInput.value, 10) : 1800;
    if (isNaN(v) || v < 1000) v = 1000;
    if (v > 2600) v = 2600;
    return v;
  }

  function updatePauseLabel() {
    if (pauseVal) pauseVal.textContent = (pauseMs() / 1000).toFixed(1) + "s";
  }

  function hearingLang() {
    var v = hearingSel ? hearingSel.value : "auto";
    if (v === "auto") return navigator.language || "en-US";
    return v;
  }

  function focusOn() {
    return !!(focusBox && focusBox.checked);
  }

  function addLog(original, lang, english, unavailable) {
    var empty = logEl.querySelector(".tr-log-empty");
    if (empty) empty.remove();
    var entry = document.createElement("div");
    entry.className = "tr-log-entry";
    var time = document.createElement("p");
    time.className = "tr-log-time";
    time.textContent = new Date().toLocaleTimeString() + (lang ? " · heard as " + lang : "");
    var orig = document.createElement("p");
    orig.className = "tr-log-orig";
    orig.textContent = original;
    var eng = document.createElement("p");
    eng.className = "tr-log-eng";
    eng.textContent = unavailable ? "English: UNAVAILABLE — the translation fetch failed." : english;
    entry.appendChild(time);
    entry.appendChild(orig);
    entry.appendChild(eng);
    logEl.appendChild(entry);
    while (logEl.children.length > MAX_LOG_ENTRIES) logEl.removeChild(logEl.firstChild);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function translateGoogle(text) {
    return fetch(GOOGLE_URL + encodeURIComponent(text)).then(function (res) {
      if (!res.ok) throw new Error("google " + res.status);
      return res.json();
    }).then(function (data) {
      var out = "";
      if (data && data[0]) {
        for (var i = 0; i < data[0].length; i++) {
          if (data[0][i] && data[0][i][0]) out += data[0][i][0];
        }
      }
      var lang = (data && data[2]) || "auto";
      if (!out) throw new Error("google empty");
      return { text: out, lang: lang };
    });
  }

  function translateMyMemory(text) {
    return fetch(MYMEMORY_URL + encodeURIComponent(text) + "&langpair=auto|en").then(function (res) {
      if (!res.ok) throw new Error("mymemory " + res.status);
      return res.json();
    }).then(function (data) {
      var out = data && data.responseData && data.responseData.translatedText;
      if (!out) throw new Error("mymemory empty");
      // MyMemory answers with the input itself when it cannot translate.
      if (out.trim() === text.trim()) throw new Error("mymemory untranslated");
      return { text: out, lang: "auto" };
    });
  }

  function translateText(text) {
    return translateGoogle(text).catch(function () {
      return translateMyMemory(text);
    });
  }

  function speakEnglish(text) {
    if (!window.speechSynthesis) {
      setStatus("Spoken English is unavailable on this browser — the text is shown above.");
      return;
    }
    // The mic suspends while the English plays so it cannot hear itself
    // or grab background voices.
    speaking = true;
    stopRecognition();
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    var rate = speedSel ? parseFloat(speedSel.value) : 0.85;
    if (isNaN(rate) || rate < 0.5 || rate > 1.2) rate = 0.85;
    utter.rate = rate;
    utter.onend = function () {
      speaking = false;
      if (listening) startRecognition();
      else setStatus("Stopped.");
    };
    utter.onerror = function () {
      speaking = false;
      setStatus("Spoken English failed — the text is shown above.");
      if (listening) startRecognition();
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  function flushHeld() {
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    var text = heldText.trim();
    if (!text) return;
    heldText = "";
    setHeard("Translating…");
    setStatus("Translating…");
    translateText(text).then(function (done) {
      lastEnglish = done.text;
      setEnglish(done.text);
      setHeard(text);
      setStatus(listening ? "Listening…" : "Stopped.");
      addLog(text, done.lang, done.text, false);
      speakEnglish(done.text);
    }).catch(function () {
      setEnglish("UNAVAILABLE");
      setHeard(text);
      setStatus("Translation fetch failed — shown as UNAVAILABLE, nothing faked.");
      addLog(text, null, "", true);
    });
  }

  function scheduleFlush() {
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = setTimeout(flushHeld, pauseMs());
  }

  function discardHeld() {
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    heldText = "";
    setHeard("Discarded. Nothing held.");
    setStatus(listening ? "Listening…" : "Stopped.");
  }

  function onResult(event) {
    var finalText = "";
    var interimText = "";
    for (var i = event.resultIndex; i < event.results.length; i++) {
      var result = event.results[i];
      var alt = result[0];
      if (!alt) continue;
      if (result.isFinal) {
        // Focus mode ignores faint, low-confidence background snippets.
        if (focusOn() && typeof alt.confidence === "number" && alt.confidence < FOCUS_MIN_CONFIDENCE) continue;
        if (alt.transcript && alt.transcript.trim().length < 2) continue;
        finalText += alt.transcript;
      } else {
        interimText += alt.transcript;
      }
    }
    if (finalText) {
      // Mixed language stays verbatim: the raw transcript goes to the
      // translator untouched, English words mixed in included.
      heldText = heldText ? heldText + " " + finalText.trim() : finalText.trim();
      setHeard(heldText + " …");
      setStatus("Holding — translating after a pause…");
      scheduleFlush();
    } else if (interimText) {
      setHeard((heldText ? heldText + " " : "") + interimText + " …");
    }
  }

  function startRecognition() {
    if (!Recognition) return;
    if (recognition) {
      try { recognition.stop(); } catch (e) { /* already stopped */ }
    }
    recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = hearingLang();
    recognition.onresult = onResult;
    recognition.onerror = function (event) {
      var err = event && event.error;
      if (err === "not-allowed" || err === "service-not-allowed") {
        listening = false;
        updateStartBtn();
        setStatus("Microphone blocked — allow it for this site in Chrome, then start again.");
      } else if (err === "network") {
        setStatus("Speech service unavailable right now — check the connection and start again.");
      }
      // no-speech and aborted are normal while listening; keep going.
    };
    recognition.onend = function () {
      // Chrome stops the recognizer on its own sometimes; restart while
      // the user still wants to listen, unless speech is playing.
      if (listening && !speaking) {
        setTimeout(function () {
          if (listening && !speaking) {
            try { recognition.start(); } catch (e) { /* start raced */ }
          }
        }, 300);
      }
    };
    try {
      recognition.start();
    } catch (e) {
      setStatus("Could not start the microphone — try again.");
    }
  }

  function stopRecognition() {
    if (recognition) {
      try { recognition.stop(); } catch (e) { /* already stopped */ }
    }
  }

  function updateStartBtn() {
    startBtn.textContent = listening ? "Stop listening" : "Start listening";
    startBtn.classList.toggle("listening", listening);
  }

  function toggleListening() {
    if (!Recognition) {
      setStatus("Speech recognition is UNAVAILABLE here — this needs Chrome on Android.");
      return;
    }
    listening = !listening;
    updateStartBtn();
    if (listening) {
      setStatus("Listening…");
      setHeard("Listening — hold the phone near the other person.");
      startRecognition();
    } else {
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
      stopRecognition();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      speaking = false;
      setStatus("Stopped.");
    }
  }

  function replayLast() {
    if (!lastEnglish) {
      setStatus("Nothing to replay yet — translate something first.");
      return;
    }
    setEnglish(lastEnglish);
    speakEnglish(lastEnglish);
  }

  function onHeadsetPress() {
    var now = Date.now();
    // Two quick presses is a double-click: replay the last English.
    if (now - lastPressAt < DOUBLE_PRESS_MS) {
      lastPressAt = 0;
      replayLast();
      return;
    }
    lastPressAt = now;
    toggleListening();
  }

  function armHeadset() {
    if (!navigator.mediaSession) {
      if (headsetNote) headsetNote.textContent = "Headset button is UNAVAILABLE here — Media Session is not supported on this browser. Use Chrome on Android.";
      return;
    }
    if (!silentAudio) {
      silentAudio = new Audio(SILENT_WAV);
      silentAudio.loop = true;
      silentAudio.preload = "auto";
    }
    var play = silentAudio.play();
    if (play && play.catch) {
      play.catch(function () {
        if (headsetNote) headsetNote.textContent = "Could not arm the headset button — tap Arm again. The browser needs a tap before it plays any audio.";
      });
    }
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: "Translator — listening" });
      navigator.mediaSession.setActionHandler("play", onHeadsetPress);
      navigator.mediaSession.setActionHandler("pause", onHeadsetPress);
      navigator.mediaSession.setActionHandler("previoustrack", replayLast);
      navigator.mediaSession.setActionHandler("nexttrack", replayLast);
    } catch (e) {
      if (headsetNote) headsetNote.textContent = "Headset button partly armed — some presses may not reach this page on this device.";
      return;
    }
    headsetArmed = true;
    if (armBtn) armBtn.textContent = "Headset button armed";
    if (headsetNote) headsetNote.textContent = "Headset button armed. Single click starts or stops listening. Double-click replays the last English. Long-press stays owned by Android — only the setup below quiets it.";
  }

  function init() {
    if (!Recognition) {
      setStatus("Speech recognition is UNAVAILABLE here — this needs Chrome on Android. The buttons below will not start listening on this browser.");
      startBtn.disabled = true;
      if (flushBtn) flushBtn.disabled = true;
      if (discardBtn) discardBtn.disabled = true;
    }
    if (!window.speechSynthesis) {
      setEnglish("Spoken English is unavailable on this browser — translations still show as text.");
    }
    updatePauseLabel();
    startBtn.addEventListener("click", toggleListening);
    if (flushBtn) flushBtn.addEventListener("click", flushHeld);
    if (discardBtn) discardBtn.addEventListener("click", discardHeld);
    if (replayBtn) replayBtn.addEventListener("click", replayLast);
    if (armBtn) armBtn.addEventListener("click", armHeadset);
    if (pauseInput) pauseInput.addEventListener("input", updatePauseLabel);
    if (hearingSel) hearingSel.addEventListener("change", function () {
      if (listening) startRecognition();
    });
  }

  init();
})();
