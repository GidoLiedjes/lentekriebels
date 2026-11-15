/*
 * Zet de inhoud uit inhoud.js op de pagina en laat de knoppen werken.
 */
(function () {
  "use strict";

  var inhoud = window.INHOUD || {};
  var Breintje = window.Breintje;
  var stam = document.documentElement;

  // Hulpje: maak een element met eigenschappen en kinderen.
  function el(naam, eigenschappen, kinderen) {
    var e = document.createElement(naam);
    for (var k in eigenschappen || {}) {
      if (k === "tekst") e.textContent = eigenschappen[k];
      else e.setAttribute(k, eigenschappen[k]);
    }
    [].concat(kinderen || []).forEach(function (kind) {
      if (kind) e.appendChild(typeof kind === "string" ? document.createTextNode(kind) : kind);
    });
    return e;
  }

  function icoon(naam) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#i-" + naam);
    svg.appendChild(use);
    return svg;
  }

  function voorbeeldLabel(ding) {
    return ding.voorbeeld ? el("span", { class: "label-voorbeeld", tekst: "Voorbeeld" }) : null;
  }

  // Een vast getal bij een tekst, zodat elk filmpje zijn eigen breintje krijgt.
  function getalVan(tekst) {
    var h = 7;
    for (var i = 0; i < tekst.length; i++) h = (h * 31 + tekst.charCodeAt(i)) >>> 0;
    return h;
  }

  function leeg(tekst) {
    var beeld = el("span", { class: "leeg-beeld" });
    beeld.innerHTML = Breintje.teken(4, { sier: true });
    return el("div", { class: "leeg" }, [beeld, el("p", { tekst: tekst })]);
  }

  /* ---------- Vaste breintjes (logo en zo) ---------- */

  [].forEach.call(document.querySelectorAll("[data-breintje]"), function (plek) {
    plek.innerHTML = Breintje.teken(Number(plek.getAttribute("data-breintje")), { sier: true });
  });

  /* ---------- Het breintje op het podium ---------- */

  var podium = document.getElementById("podium-breintje");
  var podiumTekst = document.getElementById("podium-tekst");

  function toonBreintje(zaadje, metPlop) {
    var b = Breintje.beschrijf(zaadje);
    podium.innerHTML = Breintje.teken(zaadje);
    podiumTekst.textContent = "";
    podiumTekst.appendChild(document.createTextNode("Dit is "));
    podiumTekst.appendChild(el("strong", { tekst: b.naam }));
    podiumTekst.appendChild(document.createTextNode(". " + b.naam + " houdt van " + b.houdtVan + "."));
    if (metPlop) {
      podium.classList.remove("nieuw");
      void podium.offsetWidth; // start de beweging opnieuw
      podium.classList.add("nieuw");
    }
  }

  function nieuwBreintje() {
    toonBreintje(Math.floor(Math.random() * 4294967295), true);
  }

  podium.addEventListener("animationend", function () { podium.classList.remove("nieuw"); });
  podium.addEventListener("click", nieuwBreintje);
  document.getElementById("nog-een").addEventListener("click", nieuwBreintje);
  toonBreintje(10, false);

  /* ---------- De knop Rustig ---------- */

  var rustigKnop = document.getElementById("rustig-knop");

  function zetRustig(aan, bewaar) {
    if (aan) stam.setAttribute("data-rustig", "aan");
    else stam.removeAttribute("data-rustig");
    rustigKnop.setAttribute("aria-pressed", aan ? "true" : "false");
    if (bewaar) {
      try { localStorage.setItem("bb-rustig", aan ? "aan" : "uit"); } catch (e) {}
    }
  }

  zetRustig(stam.getAttribute("data-rustig") === "aan", false);
  rustigKnop.addEventListener("click", function () {
    zetRustig(stam.getAttribute("data-rustig") !== "aan", true);
  });

  /* ---------- Eén ding tegelijk laten spelen ---------- */

  var spelers = [];
  function stopAnderen(behalve) {
    spelers.forEach(function (s) { if (s !== behalve && !s.paused) s.pause(); });
  }

  /* ---------- Liedjes ---------- */

  function speler(lied) {
    var audio = new Audio();
    audio.preload = "none";
    audio.src = lied.audio;
    spelers.push(audio);

    var knop = el("button", { class: "speel", type: "button", "aria-label": "Speel " + lied.titel });
    knop.appendChild(icoon("speel"));
    var vul = el("div", { class: "balk-vul" });
    var balk = el("div", { class: "balk" }, vul);

    function zet(speelt) {
      knop.replaceChild(icoon(speelt ? "pauze" : "speel"), knop.firstChild);
      knop.setAttribute("aria-label", (speelt ? "Pauze " : "Speel ") + lied.titel);
    }

    knop.addEventListener("click", function () {
      if (audio.paused) { stopAnderen(audio); audio.play().catch(function () {}); }
      else audio.pause();
    });
    audio.addEventListener("play", function () { zet(true); });
    audio.addEventListener("pause", function () { zet(false); });
    audio.addEventListener("ended", function () { vul.style.width = "0"; });
    audio.addEventListener("timeupdate", function () {
      if (audio.duration) vul.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    });
    audio.addEventListener("error", function () {
      balk.replaceWith(el("p", { class: "nog-niet", tekst: "Dit liedje doet het even niet." }));
    });

    return { knop: knop, balk: balk };
  }

  function liedKaart(lied, nummer) {
    var titel = el("h3", {}, [lied.titel, voorbeeldLabel(lied)]);
    var links, onderTitel;
    if (lied.audio) {
      var s = speler(lied);
      links = s.knop;
      onderTitel = s.balk;
    } else {
      links = el("span", { class: "rondje" }, icoon("noot"));
      onderTitel = el("p", { class: "nog-niet", tekst: "De muziek komt nog." });
    }
    var kaart = el("article", { class: "lied" }, [links, el("div", { class: "lied-midden" }, [titel, onderTitel])]);

    var tekst = (lied.tekst || "").trim();
    if (tekst) {
      var id = "liedtekst-" + nummer;
      var coupletten = tekst.split(/\n\s*\n/).map(function (couplet) {
        var p = el("p");
        couplet.trim().split("\n").forEach(function (regel, i) {
          if (i) p.appendChild(el("br"));
          p.appendChild(document.createTextNode(regel.trim()));
        });
        return p;
      });
      var voorlees = el("button", { class: "leesvoor", type: "button", "data-leesvoor": id, hidden: "" }, [icoon("geluid"), el("span", { tekst: "Lees voor" })]);
      kaart.appendChild(
        el("details", { class: "zingmee" }, [
          el("summary", { tekst: "Zing mee" }),
          el("div", { class: "liedtekst", id: id }, coupletten),
          voorlees
        ])
      );
    }
    return kaart;
  }

  /* ---------- Filmpjes ---------- */

  function youtubeNummer(link) {
    if (!link) return "";
    var m = String(link).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{6,20})/);
    if (m) return m[1];
    return /^[\w-]{6,20}$/.test(link) ? link : "";
  }

  function filmKaart(film) {
    var beeld = el("div", { class: "film-beeld" });
    var knop = el("button", { class: "film-knop", type: "button", "aria-label": "Speel het filmpje " + film.titel });
    if (film.plaatje) knop.appendChild(el("img", { src: film.plaatje, alt: "", loading: "lazy" }));
    else knop.innerHTML = Breintje.teken(getalVan(film.titel), { sier: true });
    knop.appendChild(el("span", { class: "speel-merk" }, icoon("speel")));
    beeld.appendChild(knop);

    knop.addEventListener("click", function () {
      stopAnderen(null);
      var yt = youtubeNummer(film.youtube);
      var nieuw;
      if (yt) {
        // Pas nu maken we verbinding met YouTube, en dan zonder volg-cookies.
        nieuw = el("iframe", {
          src: "https://www.youtube-nocookie.com/embed/" + yt + "?autoplay=1&rel=0",
          title: film.titel,
          allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
          allowfullscreen: ""
        });
      } else if (film.bestand) {
        nieuw = el("video", { src: film.bestand, controls: "", autoplay: "", playsinline: "" });
        spelers.push(nieuw);
      } else {
        nieuw = el("p", { class: "film-melding", tekst: "Dit is een voorbeeld. Hier komt straks een echt filmpje." });
      }
      beeld.replaceChild(nieuw, knop);
    });

    return el("figure", { class: "film" }, [beeld, el("figcaption", {}, [film.titel, voorbeeldLabel(film)])]);
  }

  /* ---------- Tekeningen ---------- */

  function tekeningKaart(t) {
    return el("a", { class: "tekening", href: t.bestand, target: "_blank", rel: "noopener" }, [
      el("span", { class: "blad" }, el("img", { src: t.bestand, alt: "", loading: "lazy" })),
      el("span", { class: "tekening-titel", tekst: t.titel }),
      el("span", { class: "tekening-actie", tekst: t.kleurplaat ? "Open en print" : "Bekijk groot" })
    ]);
  }

  /* ---------- Alles op de pagina zetten ---------- */

  function vul(id, lijst, maak, leegTekst) {
    var plek = document.getElementById(id);
    if (!lijst || !lijst.length) { plek.appendChild(leeg(leegTekst)); return; }
    lijst.forEach(function (ding, i) { plek.appendChild(maak(ding, i)); });
  }

  vul("liedjes-lijst", inhoud.liedjes, liedKaart, "Hier komen de liedjes. Nog even wachten!");
  vul("filmpjes-lijst", inhoud.filmpjes, filmKaart, "Hier komen de filmpjes. Nog even wachten!");
  vul("tekeningen-lijst", inhoud.tekeningen, tekeningKaart, "Hier komen de tekeningen. Nog even wachten!");

  var contact = document.getElementById("idee-contact");
  var email = inhoud.contact && inhoud.contact.email;
  if (email) {
    contact.appendChild(el("a", { class: "knop", href: "mailto:" + email + "?subject=" + encodeURIComponent("Een idee voor Bijzondere Breintjes"), tekst: "Mail je idee" }));
    contact.appendChild(el("p", { class: "idee-adres", tekst: email }));
    contact.style.display = "grid";
    contact.style.gap = ".5rem";
  } else {
    contact.appendChild(el("p", { class: "nog-niet", tekst: "Het mailadres komt hier nog te staan." }));
  }

  document.getElementById("jaar").textContent = new Date().getFullYear();

  /* ---------- Lees voor ---------- */

  var stem = window.speechSynthesis;
  var bezig = null;

  function nlStem() {
    var stemmen = stem.getVoices();
    for (var i = 0; i < stemmen.length; i++) if (/^nl/i.test(stemmen[i].lang)) return stemmen[i];
    return null;
  }

  function klaar() {
    if (bezig) bezig.setAttribute("aria-pressed", "false");
    bezig = null;
  }

  // De knoppen verschijnen alleen als dit apparaat Nederlands kan voorlezen.
  function toonVoorleesKnoppen() {
    var kan = !!nlStem();
    [].forEach.call(document.querySelectorAll("[data-leesvoor]"), function (knop) { knop.hidden = !kan; });
  }

  if (stem && typeof SpeechSynthesisUtterance === "function") {
    toonVoorleesKnoppen();
    if (stem.addEventListener) stem.addEventListener("voiceschanged", toonVoorleesKnoppen);

    document.addEventListener("click", function (e) {
      var knop = e.target.closest && e.target.closest("[data-leesvoor]");
      if (!knop) return;
      var wasBezig = bezig === knop;
      stem.cancel();
      klaar();
      if (wasBezig) return;
      var bron = document.getElementById(knop.getAttribute("data-leesvoor"));
      if (!bron) return;
      stopAnderen(null);
      var zin = new SpeechSynthesisUtterance(bron.innerText);
      zin.lang = "nl-NL";
      zin.voice = nlStem();
      zin.rate = 0.9;
      zin.onend = zin.onerror = function () { if (bezig === knop) klaar(); };
      bezig = knop;
      knop.setAttribute("aria-pressed", "true");
      stem.speak(zin);
    });
    window.addEventListener("pagehide", function () { stem.cancel(); });
  }
})();
