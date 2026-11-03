// Member preview chat — Neverwinter-style bottom chat, canned navigation help only.
// This is NOT a live AI, NOT a backend, and messages do NOT send anywhere.
// A canned reply is never presented as a live AI answer.
(function () {
  "use strict";
  var cover = document.getElementById("coverView");
  var member = document.getElementById("memberView");
  var dock = document.getElementById("memberChat");
  var enterBtn = document.getElementById("enterPreviewBtn");
  var backBtn = document.getElementById("backToCoverBtn");
  var log = document.getElementById("chatLog");
  var input = document.getElementById("chatInput");
  var sendBtn = document.getElementById("chatSendBtn");
  var tabAll = document.getElementById("chatTabAll");
  var tabAgamoss = document.getElementById("chatTabAgamoss");
  if (!cover || !member || !dock || !enterBtn || !log || !input) return;

  var greeted = false;
  var currentTab = "all";

  function addMsg(who, text) {
    var p = document.createElement("p");
    p.className = "chat-msg chat-" + who;
    p.setAttribute("data-who", who);
    var b = document.createElement("strong");
    b.textContent = who === "agamoss" ? "AGAMOSS: " : "YOU: ";
    p.appendChild(b);
    p.appendChild(document.createTextNode(text));
    log.appendChild(p);
    applyTab();
    log.scrollTop = log.scrollHeight;
  }

  function applyTab() {
    var msgs = log.querySelectorAll(".chat-msg");
    msgs.forEach(function (m) {
      var who = m.getAttribute("data-who");
      m.style.display = (currentTab === "all" || who === "agamoss") ? "block" : "none";
    });
  }

  function greet() {
    if (greeted) return;
    greeted = true;
    addMsg("agamoss", "Hello, I am Agamoss. Welcome to this preview. This is a limited member cover page, not the full Engine.");
    addMsg("agamoss", "Try Sand Code, read About, or look at Time Capsule, Careers, Law, Fusion, Boats, and Support. Those are the sections in this preview.");
    addMsg("agamoss", "Plain note: this preview chat is a greeting and navigation helper only. It is not a live AI, and messages typed here do not send anywhere yet. Live AI replies, Ask the Administrator, and Request a Build come with the full front.");
  }

  function showPage(pageId) {
    var pages = document.querySelectorAll("#memberView main section");
    pages.forEach(function (sec) {
      sec.classList.toggle("active-page", sec.id === pageId);
    });
  }

  function openMember(pageId) {
    cover.hidden = true;
    member.hidden = false;
    document.body.classList.add("member-open");
    dock.hidden = false;
    showPage(pageId || "home");
    greet();
    // Stay with the member view; the chat dock itself stays fixed at the bottom,
    // it never pops to the top of the screen.
    var home = document.getElementById("home");
    if (home) home.scrollIntoView();
    if (input) input.focus({ preventScroll: true });
  }

  function backToCover() {
    member.hidden = true;
    dock.hidden = true;
    document.body.classList.remove("member-open");
    cover.hidden = false;
    window.scrollTo(0, 0);
  }

  function cannedReply(text) {
    var t = text.toLowerCase();
    if (t.indexOf("sand") >= 0 || t.indexOf("cup") >= 0 || t.indexOf("shape") >= 0) return "Navigation help, not a live answer: open the SAND CODE section on this page and use the shape picker or the slash terminal, for example /dog or /boat. Sand Code in this preview is the sandbox on this page only.";
    if (t.indexOf("about") >= 0) return "Navigation help, not a live answer: open the ABOUT IT section for the Engine, Serpent Intelligence Systems, and Captain Infinity as fiction.";
    if (t.indexOf("law") >= 0) return "Navigation help, not a live answer: open the LAW section. This preview lists only entries verified from official sources, and it is not legal advice.";
    if (t.indexOf("fusion") >= 0 || t.indexOf("infuse") >= 0) return "Navigation help, not a live answer: open the FUSION section for the official DOE INFUSE summary.";
    if (t.indexOf("boat") >= 0 || t.indexOf("mayday") >= 0 || t.indexOf("radio") >= 0) return "Navigation help, not a live answer: open the BOATS section for the marine VHF reference and the MAYDAY checklist. It is reference only, not a live scanner.";
    if (t.indexOf("career") >= 0 || t.indexOf("job") >= 0) return "Navigation help, not a live answer: open the CAREERS section. No roles are open right now in this preview.";
    if (t.indexOf("capsule") >= 0 || t.indexOf("time") >= 0) return "Navigation help, not a live answer: open the TIME CAPSULE section for the public living message.";
    if (t.indexOf("support") >= 0 || t.indexOf("donat") >= 0 || t.indexOf("pay") >= 0) return "Navigation help, not a live answer: open the SUPPORT section. This preview has no payment buttons, handles, or QR codes.";
    if (t.indexOf("sign") >= 0 || t.indexOf("member") >= 0 || t.indexOf("account") >= 0) return "Navigation help, not a live answer: this preview has no sign-in and no member accounts. Those come with the full front, and they are not faked here.";
    return "Navigation help, not a live answer: this preview has HOME, ABOUT IT, SAND CODE, TIME CAPSULE, CAREERS, LAW, FUSION, BOATS, and SUPPORT. Tell me a section name and I will point you to it. Messages here do not send anywhere yet.";
  }

  function send() {
    var text = input.value.trim();
    if (!text) return;
    addMsg("you", text);
    input.value = "";
    addMsg("agamoss", cannedReply(text));
  }

  enterBtn.addEventListener("click", function () { openMember("home"); });
  var tabLinks = document.querySelectorAll("nav.menu a, nav.bottom a");
  tabLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = a.getAttribute("href");
      if (!target || target.charAt(0) !== "#") return;
      e.preventDefault();
      openMember(target.slice(1));
    });
  });
  if (backBtn) backBtn.addEventListener("click", backToCover);
  if (sendBtn) sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") send();
  });
  if (tabAll) tabAll.addEventListener("click", function () {
    currentTab = "all";
    tabAll.classList.add("active");
    if (tabAgamoss) tabAgamoss.classList.remove("active");
    applyTab();
  });
  if (tabAgamoss) tabAgamoss.addEventListener("click", function () {
    currentTab = "agamoss";
    tabAgamoss.classList.add("active");
    if (tabAll) tabAll.classList.remove("active");
    applyTab();
  });
})();
