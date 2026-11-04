/* Religion learning data for The Infinity Engine flagship preview.
   Plain, attributed, beginner-level summaries. No verse text is copied
   from copyrighted translations. References are by book/chapter only.
   Canon totals vary by counting convention — that variation is shown,
   not hidden. */
(function () {
  "use strict";

  var CANONS = [
    { id: "tanakh", name: "Tanakh — Hebrew Bible", total: "24 books",
      detail: "Torah 5 + Nevi'im 8 counted + Ketuvim 11. Same writings as the Protestant Old Testament, counted differently. No New Testament in this canon — it is Judaism's scripture on its own terms.",
      who: "Judaism" },
    { id: "protestant", name: "Protestant Bible", total: "66 books",
      detail: "39 Old Testament + 27 New Testament. Follows the shorter Hebrew canon for the Old Testament.",
      who: "Baptist, Methodist, Lutheran, and non-denominational churches, among others" },
    { id: "catholic", name: "Catholic Bible", total: "73 books",
      detail: "46 Old Testament + 27 New Testament. Adds Tobit, Judith, Wisdom, Sirach, Baruch, 1 and 2 Maccabees, plus longer Esther and Daniel. Catholics call these deuterocanonical.",
      who: "Roman Catholic Church" },
    { id: "orthodox", name: "Eastern Orthodox Bible", total: "~76–77 books",
      detail: "About 49–50 Old Testament + 27 New Testament, varying by church: Greek commonly 76, Russian commonly 77. Adds 1 Esdras, 3 Maccabees, Prayer of Manasseh, and Psalm 151 beyond the Catholic canon.",
      who: "Greek, Russian, and other Eastern Orthodox churches" },
    { id: "ethiopian", name: "Ethiopian Orthodox Bible", total: "81 books*",
      detail: "Commonly cited 81, grouping varies: narrower 54 Old Testament + 27 New Testament, broader 46 Old Testament + 35 New Testament with church-order texts. Unique books include 1 Enoch, Jubilees, and Meqabyan I–III. Counting every separate text can reach 88.",
      who: "Ethiopian Orthodox Tewahedo Church" }
  ];

  var TRADITIONS = [
    { id: "judaism", name: "Judaism", scripture: "Tanakh (Torah, Nevi'im, Ketuvim); Talmud as rabbinic interpretation, not the same as the Tanakh itself.",
      teacher: "Moses as lawgiver; Abraham as patriarch. No single founder in the Christian sense.",
      core: "One God, covenant with Israel, Torah as law and teaching for life.",
      practice: "Shabbat, prayer, study, dietary law (kashrut), festivals such as Passover and Yom Kippur.",
      afterlife: "Views vary within Judaism; emphasis is often on life, covenant, and the world to come (Olam Ha-Ba) rather than a single detailed map." },
    { id: "christianity", name: "Christianity", scripture: "The Bible — canon varies: Protestant 66, Catholic 73, Eastern Orthodox ~76–77, Ethiopian 81 (see canon picker). Same 27-book New Testament in core form across traditions.",
      teacher: "Jesus Christ, in the Gospels, with the apostles and later church tradition interpreting his teaching.",
      core: "One God in Trinity (Father, Son, Holy Spirit, in most traditions), Jesus as Saviour, love of God and neighbour.",
      practice: "Prayer, worship, baptism, communion / Eucharist, charity, festivals such as Christmas and Easter.",
      afterlife: "Resurrection and eternal life with God for the faithful, and judgement — details vary by tradition." },
    { id: "islam", name: "Islam", scripture: "Quran, believed by Muslims to be the literal word of God (Allah) revealed to Muhammad. Hadith record Muhammad's sayings and practice, as a second source, not equal to the Quran.",
      teacher: "Muhammad as Prophet and Messenger, following earlier prophets including Abraham, Moses, and Jesus in Islamic teaching.",
      core: "One God (Allah), no partners, submission to God, mercy and justice.",
      practice: "Five Pillars: declaration of faith, prayer five times daily, charity (zakat), fasting in Ramadan, pilgrimage to Mecca (Hajj) if able.",
      afterlife: "Resurrection, judgement, Paradise and Hell in Islamic teaching." },
    { id: "hinduism", name: "Hinduism", scripture: "No single book. Vedas and Upanishads are ancient Sanskrit scriptures; Bhagavad Gita, Ramayana, and Mahabharata are widely read epics and teachings.",
      teacher: "Many rishis, gurus, and avatars, including Krishna in the Gita. No single founder.",
      core: "Brahman as ultimate reality, dharma (duty / right order), karma, and liberation (moksha) from rebirth.",
      practice: "Puja (worship), prayer, meditation, yoga, festivals such as Diwali and Holi, pilgrimage.",
      afterlife: "Samsara — rebirth shaped by karma — with moksha, liberation from that cycle, as the goal." },
    { id: "buddhism", name: "Buddhism", scripture: "Tripitaka / Pali Canon in Theravada tradition; Mahayana sutras in Mahayana traditions. No single Bible-like book across all schools.",
      teacher: "Siddhartha Gautama, the Buddha — the Awakened One. Not worshipped as a creator God in most teaching.",
      core: "Four Noble Truths: suffering exists, it has a cause (craving), it can end, and the Eightfold Path leads to its end.",
      practice: "Meditation, mindfulness, ethical conduct, generosity, monastic and lay practice.",
      afterlife: "Rebirth shaped by karma, with nirvana — ending craving and rebirth — as the goal. This is not heaven in the Abrahamic sense." },
    { id: "sikhism", name: "Sikhism", scripture: "Guru Granth Sahib, treated as the living, eternal Guru, not only as a book.",
      teacher: "Guru Nanak as first Guru, followed by nine human Gurus, then the Guru Granth Sahib as Guru.",
      core: "One God (Waheguru), equality, honest work, sharing, and remembrance of God.",
      practice: "Prayer, congregational worship (gurdwara), langar (free community meal), service (seva), Five Ks for initiated Sikhs.",
      afterlife: "Rebirth shaped by karma, with mukti — union with God, release from rebirth — as the goal." },
    { id: "jainism", name: "Jainism", scripture: "Agamas in Svetambara tradition; Digambara tradition holds the original texts are lost, with later texts authoritative. No single book across both.",
      teacher: "Mahavira as the most recent Tirthankara (ford-maker); 24 Tirthankaras in Jain teaching.",
      core: "Ahimsa (non-violence) above all, truth, non-stealing, celibacy / chastity, non-possession; karma as real particles binding the soul.",
      practice: "Non-violence in food and action, fasting, meditation, care not to harm even small life.",
      afterlife: "Rebirth shaped by karma, with kevala / moksha — liberation of the soul — as the goal." },
    { id: "zoroastrianism", name: "Zoroastrianism", scripture: "Avesta, including the Gathas attributed to Zarathustra.",
      teacher: "Zarathustra (Zoroaster) as prophet.",
      core: "One wise God, Ahura Mazda, with a cosmic struggle between truth (asha) and falsehood (druj); good thoughts, good words, good deeds.",
      practice: "Prayer before fire as a symbol of God, purity, festivals such as Nowruz.",
      afterlife: "Judgement of the soul, with a final renewal (Frashokereti) in Zoroastrian teaching." },
    { id: "bahai", name: "Bahá'í Faith", scripture: "Kitáb-i-Aqdas as the central book of laws, plus writings of Bahá'u'lláh and 'Abdu'l-Bahá.",
      teacher: "Bahá'u'lláh as Manifestation of God, following earlier Manifestations including Abraham, Moses, Jesus, Muhammad, and the Báb in Bahá'í teaching.",
      core: "One God, unity of humanity, unity of religions as progressive revelation, equality, education, and world peace.",
      practice: "Daily prayer, fasting in the Bahá'í month of fasting, Nineteen Day Feasts, service, no clergy.",
      afterlife: "The soul continues after death, progressing toward God; heaven and hell are understood as nearness to, or distance from, God." },
    { id: "taoism", name: "Taoism (Daoism)", scripture: "Tao Te Ching attributed to Laozi, and Zhuangzi, among other texts. No single closed canon across all schools.",
      teacher: "Laozi as traditional founder-figure; Zhuangzi as a major early thinker.",
      core: "The Tao (Way) as ultimate, unnamed source and order; living in harmony, simplicity, and non-forcing (wu wei).",
      practice: "Meditation, simplicity, balance of yin and yang, ritual in religious Taoism, longevity and health practices in some schools.",
      afterlife: "Emphasis is on harmony in this life and, in religious Taoism, immortality / transcendence — not a single heaven-hell map." },
    { id: "confucianism", name: "Confucianism", scripture: "Analects of Confucius, plus the Five Classics and Four Books in traditional education. More a teaching tradition than a scripture religion.",
      teacher: "Confucius (Kongzi) as teacher; Mencius as a major later thinker.",
      core: "Ren (humaneness), li (proper conduct / ritual), filial respect, learning, and social harmony.",
      practice: "Study, ritual respect for ancestors and elders, ethical conduct in family and public life.",
      afterlife: "Focus is on this life and on ancestors and legacy, not on a detailed afterlife doctrine." },
    { id: "shinto", name: "Shinto", scripture: "No single scripture. Kojiki and Nihon Shoki are early myth-histories; norito are prayers. Practice is central, not a closed book.",
      teacher: "No founder. Kami (spirits / sacred powers) in nature, ancestors, and places are honoured.",
      core: "Purity, sincerity, reverence for kami, and harmony with nature and community.",
      practice: "Shrine visits, purification, offerings, festivals (matsuri), respect for sacred places.",
      afterlife: "Views vary; emphasis is on purity and community in this life, with ancestral reverence, not a single heaven-hell system." },
    { id: "indigenous", name: "Indigenous traditions — many, distinct", scripture: "No single book. Many nations carry teachings orally, in ceremony, story, and law — each nation distinct. Do not treat them as one religion.",
      teacher: "Elders, knowledge keepers, and ancestors within each specific nation — not a universal founder.",
      core: "Relationship to land, kin, ancestors, and ceremony, as taught by each nation in its own terms.",
      practice: "Nation-specific ceremonies, stories, and protocols. Some ceremonies are closed to outsiders — that boundary is part of respect, not a gap to fill.",
      afterlife: "Varies by nation. This page does not generalise one afterlife view across all Indigenous peoples." }
  ];

  var TOPICS = {
    creation: { title: "Creation — how did the world begin?",
      rows: [
        ["Judaism / Christianity", "God creates the world in Genesis 1–2, in order, and calls it good. Humans are made in God's image, with stewardship of creation."],
        ["Islam", "Allah creates the heavens and earth, as in Quran 7:54 and 21:30 in Islamic reference — creation by God's command, humans as stewards (khalifa)."],
        ["Hinduism", "Creation is cyclical, not a single one-time beginning: worlds arise, endure, and dissolve, with Brahman as ultimate reality."],
        ["Buddhism", "No creator God is posited as the start. The focus is on dependent arising — things arise from causes and conditions, in cycles of rebirth."],
        ["Bahá'í Faith", "Creation is an ongoing expression of God, with science and religion understood as compatible, not opposed."] ] },
    prayer: { title: "Prayer / Worship — how do people talk to God, or practise?",
      rows: [
        ["Judaism", "Daily prayer (Shacharit, Mincha, Maariv), Shabbat prayer, Psalms as prayer book."],
        ["Christianity", "Prayer in Jesus' name, Lord's Prayer (Matthew 6), worship, liturgy, and personal prayer."],
        ["Islam", "Salah five times daily, with set movements and recitation, plus personal dua (supplication)."],
        ["Hinduism", "Puja with offerings, mantra, meditation, and temple or home worship."],
        ["Buddhism", "Meditation, chanting, and mindfulness practice, rather than prayer to a creator God in most schools."],
        ["Sikhism", "Naam japna — remembrance of God's name — in congregational and personal prayer."] ] },
    charity: { title: "Charity / Giving — what is owed to others?",
      rows: [
        ["Judaism", "Tzedakah — righteous giving, as a duty, not only kindness."],
        ["Christianity", "Giving to the poor, almsgiving, and love of neighbour (Luke 10, Matthew 25 in Christian reference)."],
        ["Islam", "Zakat as a pillar — set almsgiving — plus voluntary sadaqah."],
        ["Hinduism", "Dana — giving — as dharma, especially to teachers, the poor, and at holy times."],
        ["Buddhism", "Dana — generosity — as the first perfection, giving to monastics and to those in need."],
        ["Sikhism", "Vand chhakna — sharing what you have — and langar, the free community meal for all."] ] },
    fasting: { title: "Fasting — when, and why?",
      rows: [
        ["Judaism", "Yom Kippur as a full fast, plus other fast days for mourning and repentance."],
        ["Christianity", "Lent as a season of fasting and restraint before Easter; fasting as discipline, with practice varying by tradition."],
        ["Islam", "Ramadan: fasting from dawn to sunset for a lunar month, as a pillar."],
        ["Hinduism", "Fasting on holy days and festivals, varying by deity, region, and family custom."],
        ["Jainism", "Fasting as a major discipline, including long fasts, to shed karma — always with care and community guidance."],
        ["Bahá'í Faith", "Nineteen-Day Fast in the Bahá'í month of fasting, from sunrise to sunset."] ] },
    afterlife: { title: "Afterlife — what happens after death? (compare, don't flatten)",
      rows: [
        ["Judaism / Christianity / Islam", "Judgement and a world to come / eternal life / Paradise and Hell — with details differing sharply by tradition. Do not merge them into one view."],
        ["Hinduism / Buddhism / Sikhism / Jainism", "Rebirth (samsara) shaped by karma, with liberation — moksha, nirvana, mukti, kevala — as release from rebirth. The goal is not the same as heaven in Abrahamic teaching."],
        ["Zoroastrianism / Bahá'í", "Zoroastrian: judgement and final renewal. Bahá'í: soul progresses toward God after death, with heaven/hell as nearness or distance."] ] },
    golden_rule: { title: "The Golden Rule — treat others as you would be treated",
      rows: [
        ["Judaism", "Hillel's summary: 'What is hateful to you, do not do to your neighbour.'"],
        ["Christianity", "Matthew 7:12 — do to others what you would have them do to you."],
        ["Islam", "Hadith tradition: none of you believes until he loves for his brother what he loves for himself."],
        ["Hinduism", "Mahabharata: do not do to others what would cause pain if done to you."],
        ["Buddhism", "Treat others as you would treat yourself; non-harming (ahimsa in shared Indian traditions) as a root ethic."],
        ["Confucianism", "Analects: do not impose on others what you do not wish for yourself."] ] },
    scripture: { title: "Scripture — what counts as the book?",
      rows: [
        ["Judaism", "Tanakh, 24 books. Talmud interprets it, but is not the Tanakh."],
        ["Christianity", "Bible, canon varies — see canon picker above. New Testament 27 books in core form."],
        ["Islam", "Quran as God's word; Hadith as a second, distinct source."],
        ["Hinduism / Buddhism", "No single closed book. Libraries of texts, schools, and oral tradition."],
        ["Sikhism", "Guru Granth Sahib as Guru itself, not only a text."],
        ["Indigenous traditions", "No single book. Nation-specific oral teaching, story, ceremony, and law."] ] }
  };

  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function renderCanon(key) {
    var c = null, i;
    for (i = 0; i < CANONS.length; i++) { if (CANONS[i].id === key) c = CANONS[i]; }
    if (!c) c = CANONS[0];
    var p = el("religionCanonPanel");
    if (p) p.innerHTML = '<div style="font-size:26px;font-weight:800;color:#ffd700">' + esc(c.total) + '</div><h3 style="margin:6px 0">' + esc(c.name) + '</h3><p style="margin:0">' + esc(c.detail) + '</p><p style="color:#b8b0a0;font-size:14px">Used by: ' + esc(c.who) + '</p>';
    var btns = document.querySelectorAll("[data-religion-canon]");
    for (i = 0; i < btns.length; i++) btns[i].setAttribute("aria-pressed", btns[i].getAttribute("data-religion-canon") === key ? "true" : "false");
  }

  function renderTraditions(filter) {
    var box = el("religionTraditionList");
    if (!box) return;
    var q = (filter || "").toLowerCase();
    var html = "";
    TRADITIONS.forEach(function (t) {
      var hay = (t.name + " " + t.scripture + " " + t.core + " " + t.practice).toLowerCase();
      if (q && hay.indexOf(q) === -1) return;
      html += '<article style="border:1px solid #3a3220;border-radius:12px;padding:12px;background:#151515;margin:10px 0">'
        + '<h3 style="margin:0 0 4px;color:#ffd700">' + esc(t.name) + '</h3>'
        + '<p style="margin:4px 0"><strong>Scripture:</strong> ' + esc(t.scripture) + '</p>'
        + '<p style="margin:4px 0"><strong>Teacher / founder:</strong> ' + esc(t.teacher) + '</p>'
        + '<p style="margin:4px 0"><strong>Core:</strong> ' + esc(t.core) + '</p>'
        + '<p style="margin:4px 0"><strong>Practice:</strong> ' + esc(t.practice) + '</p>'
        + '<p style="margin:4px 0"><strong>Afterlife:</strong> ' + esc(t.afterlife) + '</p></article>';
    });
    box.innerHTML = html || "<p>No tradition matches that search. Try: prayer, fasting, Quran, Enoch, or Guru.</p>";
  }

  function renderTopic(key) {
    var t = TOPICS[key] || TOPICS.creation;
    var box = el("religionTopicPanel");
    if (!box) return;
    var html = "<h3 style=\"margin:0 0 8px;color:#ffd700\">" + esc(t.title) + "</h3><table style=\"width:100%;border-collapse:collapse;font-size:15px\">";
    t.rows.forEach(function (r) {
      html += "<tr><td style=\"padding:8px;border-bottom:1px solid #3a3220;vertical-align:top;font-weight:700;color:#c9a84c\">" + esc(r[0]) + "</td><td style=\"padding:8px;border-bottom:1px solid #3a3220\">" + esc(r[1]) + "</td></tr>";
    });
    html += "</table><p style=\"color:#b8b0a0;font-size:14px\">Cross-reference note: same topic, different teaching. Read the row in its own tradition's terms — do not merge the rows into one teaching.</p>";
    box.innerHTML = html;
    var btns = document.querySelectorAll("[data-religion-topic]");
    btns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-religion-topic") === key ? "true" : "false"); });
  }

  function renderCompare() {
    var aId = el("religionCompareA") ? el("religionCompareA").value : "judaism";
    var bId = el("religionCompareB") ? el("religionCompareB").value : "christianity";
    function find(id) { for (var i = 0; i < TRADITIONS.length; i++) if (TRADITIONS[i].id === id) return TRADITIONS[i]; return TRADITIONS[0]; }
    var a = find(aId), b = find(bId);
    var box = el("religionComparePanel");
    if (!box) return;
    function col(t) {
      return "<td style=\"padding:8px;border-bottom:1px solid #3a3220;vertical-align:top\"><strong style=\"color:#ffd700\">" + esc(t.name) + "</strong><br>Scripture: " + esc(t.scripture) + "<br><br>Core: " + esc(t.core) + "<br><br>Practice: " + esc(t.practice) + "<br><br>Afterlife: " + esc(t.afterlife) + "</td>";
    }
    box.innerHTML = "<table style=\"width:100%;border-collapse:collapse;font-size:15px\"><tr><td style=\"width:50%;padding:8px\">" + col(a) + "</td><td style=\"width:50%;padding:8px\">" + col(b) + "</td></tr></table>";
  }

  function bind() {
    document.querySelectorAll("[data-religion-canon]").forEach(function (b) {
      b.addEventListener("click", function () { renderCanon(b.getAttribute("data-religion-canon")); });
    });
    document.querySelectorAll("[data-religion-topic]").forEach(function (b) {
      b.addEventListener("click", function () { renderTopic(b.getAttribute("data-religion-topic")); });
    });
    var s = el("religionSearch");
    if (s) s.addEventListener("input", function () { renderTraditions(s.value); });
    var sb = el("religionSearchBtn");
    if (sb) sb.addEventListener("click", function () { renderTraditions(s ? s.value : ""); });
    var ca = el("religionCompareA"), cb = el("religionCompareB"), cbtn = el("religionCompareBtn");
    if (ca) ca.addEventListener("change", renderCompare);
    if (cb) cb.addEventListener("change", renderCompare);
    if (cbtn) cbtn.addEventListener("click", renderCompare);
    renderCanon("tanakh");
    renderTraditions("");
    renderTopic("creation");
    renderCompare();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  window.RELIGION_DATA = { canons: CANONS, traditions: TRADITIONS, topics: TOPICS };
})();
