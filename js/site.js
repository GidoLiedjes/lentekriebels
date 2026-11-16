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
    return ding && ding.voorbeeld ? el("span", { class: "label-voorbeeld", tekst: "Voorbeeld" }) : null;
  }

  // Een vast getal bij een tekst, zodat elk ding zijn eigen breintje krijgt.
  function getalVan(tekst) {
    var h = 7;
    for (var i = 0; i < tekst.length; i++) h = (h * 31 + tekst.charCodeAt(i)) >>> 0;
    return h;
  }

  // Alle breintjes op de site zijn de vaste krijtbreintjes uit de huisstijl (map beeld/).
  function plaatje(naam, alt) {
    return el("img", { class: "breintje", src: "beeld/" + naam + ".webp", alt: alt || "", loading: "lazy" });
  }

  function leeg(tekst) {
    var beeld = el("span", { class: "leeg-beeld" });
    beeld.appendChild(plaatje("breintje-verlegen"));
    return el("div", { class: "leeg" }, [beeld, el("p", { tekst: tekst })]);
  }

  // Tekst met lege regels wordt een rijtje alinea's.
  function alineas(tekst) {
    return String(tekst || "").trim().split(/\n\s*\n/).map(function (stuk) {
      var p = el("p");
      stuk.trim().split("\n").forEach(function (regel, i) {
        if (i) p.appendChild(el("br"));
        p.appendChild(document.createTextNode(regel.trim()));
      });
      return p;
    });
  }

  var teller = 0;
  function voorleesKnop(doelId) {
    return el("button", { class: "leesvoor", type: "button", "data-leesvoor": doelId, hidden: "" }, [
      icoon("geluid"), el("span", { tekst: "Lees voor" })
    ]);
  }

  /* ---------- Vaste breintjes (logo en zo) ---------- */

  // De tien vaste breintjes, met hun naam en waar ze van houden.
  var BREINTJES = [
    { naam: "Billie", beeld: "hoofdbreintje", houdtVan: "knuffels" },
    { naam: "Lisa", beeld: "breintje-bril", houdtVan: "heel veel vragen" },
    { naam: "Nicky", beeld: "breintje-lang", houdtVan: "zingen" },
    { naam: "Gido", beeld: "breintje-sportief", houdtVan: "springen" },
    { naam: "Juul", beeld: "breintje-nerveus", houdtVan: "alles op een rij zetten" },
    { naam: "Hetty", beeld: "breintje-koptelefoon", houdtVan: "stilte" },
    { naam: "Jelte", beeld: "breintje-rolstoel", houdtVan: "rondjes draaien" },
    { naam: "Suus", beeld: "breintje-vol-energie", houdtVan: "hard lachen" },
    { naam: "Loesje", beeld: "breintje-verlegen", houdtVan: "verstoppen" },
    { naam: "Lari", beeld: "breintje-slaperig", houdtVan: "zachte dekens" }
  ];

  /* ---------- Het breintje op het podium ---------- */

  var podium = document.getElementById("podium-breintje");
  var podiumTekst = document.getElementById("podium-tekst");

  var nuBreintje = 0;
  function toonBreintje(nummer, metPlop) {
    nuBreintje = nummer % BREINTJES.length;
    var b = BREINTJES[nuBreintje];
    podium.textContent = "";
    podium.appendChild(plaatje(b.beeld, b.naam + ", een breintje"));
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
    toonBreintje(nuBreintje + 1, true);
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

  /* ---------- Geluidsspeler (liedjes en voorgelezen verhalen) ---------- */

  function speler(bron, naam) {
    var audio = new Audio();
    audio.preload = "none";
    audio.src = bron;
    spelers.push(audio);

    var knop = el("button", { class: "speel", type: "button", "aria-label": "Speel " + naam });
    knop.appendChild(icoon("speel"));
    var vul = el("div", { class: "balk-vul" });
    var balk = el("div", { class: "balk" }, vul);

    function zet(speelt) {
      knop.replaceChild(icoon(speelt ? "pauze" : "speel"), knop.firstChild);
      knop.setAttribute("aria-label", (speelt ? "Pauze " : "Speel ") + naam);
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
      balk.replaceWith(el("p", { class: "nog-niet", tekst: "Dit geluid doet het even niet." }));
    });

    return { knop: knop, balk: balk };
  }

  /* ---------- Liedjes ---------- */

  function liedKaart(lied) {
    var titel = el("h3", {}, [lied.titel, voorbeeldLabel(lied)]);
    var links, onderTitel;
    if (lied.audio) {
      var s = speler(lied.audio, lied.titel);
      links = s.knop;
      onderTitel = s.balk;
    } else {
      links = el("span", { class: "rondje" }, icoon("noot"));
      onderTitel = el("p", { class: "nog-niet", tekst: "De muziek komt nog." });
    }
    var kaart = el("article", { class: "lied" }, [links, el("div", { class: "lied-midden" }, [titel, onderTitel])]);

    if (String(lied.tekst || "").trim()) {
      var id = "liedtekst-" + ++teller;
      kaart.appendChild(
        el("details", { class: "zingmee" }, [
          el("summary", { tekst: "Zing mee" }),
          el("div", { class: "liedtekst", id: id }, alineas(lied.tekst)),
          voorleesKnop(id)
        ])
      );
    }
    return kaart;
  }

  /* ---------- Verhaaltjes ---------- */

  function verhaalKaart(verhaal) {
    var id = "verhaal-" + ++teller;
    var kop = el("div", { class: "verhaal-kop" }, [el("h3", {}, [verhaal.titel, voorbeeldLabel(verhaal)])]);
    var rij = el("div", { class: "verhaal-rij" }, voorleesKnop(id));
    if (verhaal.audio) {
      var s = speler(verhaal.audio, verhaal.titel);
      kop.appendChild(s.knop);
    }
    return el("article", { class: "verhaal" }, [
      kop,
      el("div", { class: "verhaal-tekst", id: id }, alineas(verhaal.tekst)),
      rij
    ]);
  }

  /* ---------- Rustmoment, oefeningen en knutselen ---------- */

  function stappenKaart(ding) {
    var id = "stappen-" + ++teller;
    var kop = el("div", { class: "stappen-kop" }, [
      el("h3", {}, [ding.titel, voorbeeldLabel(ding)]),
      ding.duur ? el("span", { class: "duur", tekst: ding.duur }) : null
    ]);

    var kaart = el("article", { class: "stappen-kaart" }, kop);

    if (ding.ademhaling) {
      kaart.appendChild(
        el("div", { class: "adem" },
          el("div", { class: "adem-cirkel" },
            el("span", { class: "adem-woord" }, [
              el("span", { class: "in", tekst: "adem in" }),
              el("span", { class: "uit", tekst: "adem uit" })
            ])
          )
        )
      );
    }

    if (ding.plaatje) kaart.appendChild(el("img", { class: "knutsel-foto", src: ding.plaatje, alt: "", loading: "lazy" }));

    if (ding.nodig && ding.nodig.length) {
      kaart.appendChild(
        el("div", { class: "nodig" }, [
          el("h4", { tekst: "Dit heb je nodig" }),
          el("ul", {}, ding.nodig.map(function (n) { return el("li", { tekst: n }); }))
        ])
      );
    }

    var stappen = (ding.stappen || []).map(function (stap) { return el("li", { tekst: stap }); });
    if (stappen.length) kaart.appendChild(el("ol", { id: id }, stappen));

    if (ding.grootMens) {
      kaart.appendChild(el("p", { class: "let-op" }, [icoon("hart"), el("span", { tekst: "Doe dit samen met een groot mens." })]));
    }

    if (stappen.length) kaart.appendChild(voorleesKnop(id));
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
    else knop.appendChild(plaatje(BREINTJES[getalVan(film.titel) % BREINTJES.length].beeld));
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
    if (!plek) return;
    if (!lijst || !lijst.length) { plek.appendChild(leeg(leegTekst)); return; }
    lijst.forEach(function (ding) { plek.appendChild(maak(ding)); });
  }

  vul("liedjes-lijst", inhoud.liedjes, liedKaart, "Hier komen de liedjes. Nog even wachten!");
  vul("verhaaltjes-lijst", inhoud.verhaaltjes, verhaalKaart, "Hier komen de verhaaltjes. Nog even wachten!");
  vul("rustmoment-lijst", inhoud.rustmomenten, stappenKaart, "Hier komen de rustmomenten. Nog even wachten!");
  vul("oefeningen-lijst", inhoud.oefeningen, stappenKaart, "Hier komen de oefeningen. Nog even wachten!");
  vul("knutselen-lijst", inhoud.knutsels, stappenKaart, "Hier komen de knutsels. Nog even wachten!");
  vul("filmpjes-lijst", inhoud.filmpjes, filmKaart, "Hier komen de filmpjes. Nog even wachten!");
  vul("tekeningen-lijst", inhoud.tekeningen, tekeningKaart, "Hier komen de tekeningen. Nog even wachten!");

  /* ---------- Wie zijn wij ---------- */

  var wie = inhoud.wieZijnWij || {};
  var wieTekst = document.getElementById("wie-tekst");
  (wie.alineas || []).forEach(function (stuk, i) {
    var p = el("p", { tekst: stuk });
    if (i === 0 && wie.voorbeeld) p.appendChild(voorbeeldLabel(wie));
    wieTekst.appendChild(p);
  });
  if (!wieTekst.children.length) wieTekst.appendChild(leeg("Hier vertellen we straks wie we zijn."));

  if (wie.groet) wieTekst.appendChild(el("p", { class: "wie-groet", tekst: wie.groet }));

  var mensen = document.getElementById("wie-mensen");
  (wie.mensen || []).forEach(function (mens) {
    mensen.appendChild(el("article", { class: "mens" }, [
      el("h3", { tekst: mens.naam }),
      el("p", { tekst: mens.doet })
    ]));
  });

  /* ---------- Breintjes-club Plus ---------- */

  var club = inhoud.club || {};
  if (club.maand && club.thema) {
    document.getElementById("club-maand").hidden = false;
    document.getElementById("club-maand-label").textContent = "Deze maand: " + club.maand;
    document.getElementById("k-maand").textContent = club.thema;
    var zin = document.getElementById("club-maand-tekst");
    zin.appendChild(document.createTextNode((club.uitleg || "") + " Met "));
    var delen = [
      ["het liedje ", club.liedje], ["het voorleesverhaaltje ", club.verhaaltje],
      ["het rustmoment ", club.rustmoment], ["het printblad ", club.printblad]
    ].filter(function (d) { return d[1]; });
    delen.forEach(function (d, i) {
      if (i) zin.appendChild(document.createTextNode(i === delen.length - 1 ? " en " : ", "));
      zin.appendChild(document.createTextNode(d[0]));
      zin.appendChild(el("b", { tekst: d[1] }));
    });
    zin.appendChild(document.createTextNode("."));
  }
  if (club.prijs && /^https:\/\//.test(club.aanmeldlink || "")) {
    var bedrag = document.getElementById("club-bedrag");
    bedrag.hidden = false;
    bedrag.appendChild(document.createTextNode(club.prijs + " "));
    bedrag.appendChild(el("small", { tekst: "per maand" }));
    var aanmeld = document.getElementById("club-aanmeld");
    aanmeld.textContent = "Meld je aan";
    aanmeld.href = club.aanmeldlink;
    aanmeld.removeAttribute("aria-disabled");
    aanmeld.removeAttribute("role");
    aanmeld.rel = "noopener";
    document.getElementById("club-uitleg").textContent = "Je betaalt veilig via onze betaalpagina. Daarna krijg je de link naar de club.";
  }
  if (/^https:\/\//.test(club.ledenlink || "")) {
    document.getElementById("club-leden").hidden = false;
    document.getElementById("club-ledenlink").href = club.ledenlink;
  }

  /* ---------- Mailadres ---------- */

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

  /* ---------- Weerbericht ---------- */

  (function () {
    var weer = inhoud.weerbericht;
    var plek = document.getElementById("weer-plek");
    if (!plek || !weer) return;

    function weerBeeld(soort) {
      var ns = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(ns, "svg");
      svg.setAttribute("class", "weer-beeld");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("aria-hidden", "true");
      var use = document.createElementNS(ns, "use");
      use.setAttribute("href", "#w-" + soort);
      svg.appendChild(use);
      return svg;
    }

    // Een liedje met speelknop, zoals op het tabblad Liedjes.
    function weerLied(titel, audio, boven, uitleg) {
      if (!titel) return null;
      var links, onder;
      if (audio) {
        var s = speler(audio, titel);
        links = s.knop;
        onder = s.balk;
      } else {
        links = el("span", { class: "rondje" }, icoon("noot"));
        onder = el("p", { class: "nog-niet", tekst: "De muziek komt nog." });
      }
      return el("article", { class: "lied" }, [links, el("div", { class: "lied-midden" }, [
        boven ? el("p", { class: "klein", tekst: boven }) : null,
        el("h3", { tekst: titel }),
        onder,
        uitleg ? el("p", { tekst: uitleg }) : null
      ])]);
    }

    function stap(kop, kinderen) {
      return el("div", { class: "weer-stap" }, [el("h3", { tekst: kop })].concat(kinderen));
    }

    var soorten = weer.weer || [];
    var keuzes = el("div", { class: "weer-keuzes" });
    var hint = el("p", { class: "weer-hint", tekst: "Tik op het weer dat bij jou past. Het weer van nu trekt ook weer voorbij." });
    var toon = el("div", { class: "weer-toon" }, hint);
    var knoppen = [], kaarten = [];

    function kies(nummer) {
      knoppen.forEach(function (k, i) { k.setAttribute("aria-pressed", i === nummer ? "true" : "false"); });
      kaarten.forEach(function (k, i) { k.hidden = i !== nummer; });
      hint.hidden = true;
      stopAnderen(null);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }

    soorten.forEach(function (w, i) {
      var knop = el("button", { class: "weer-keuze is-" + w.kleur, type: "button", "aria-pressed": "false" }, [
        weerBeeld(w.soort), el("span", { tekst: w.naam })
      ]);
      knop.addEventListener("click", function () { kies(i); });
      knoppen.push(knop);
      keuzes.appendChild(knop);

      var id = "weertekst-" + i;
      // In de kaart staat het breintje dat zich zo voelt.
      var gevoelBreintje = { zon: "breintje-blij", wolk: "breintje-rustig", regen: "breintje-verdrietig", storm: "breintje-overprikkeld", onweer: "breintje-boos", vuurwerk: "breintje-vol-energie" }[w.soort];
      var groot = gevoelBreintje ? plaatje(gevoelBreintje) : weerBeeld(w.soort);
      if (gevoelBreintje) groot.setAttribute("class", "weer-beeld weer-breintje");
      var kaart = el("article", { class: "weer-kaart is-" + w.kleur, hidden: "" }, [
        groot,
        el("div", { class: "weer-tekst" }, [
          el("div", { class: "weer-woorden", id: id }, [
            el("h3", { tekst: w.kop }),
            el("p", { class: "weer-gevoel", tekst: w.gevoel }),
            w.helpt ? el("p", { class: "weer-helpt" }, [el("b", { tekst: "Dit kan helpen. " }), w.helpt]) : null
          ]),
          voorleesKnop(id),
          weerLied(w.liedje, w.audio, "Het liedje bij dit weer")
        ])
      ]);
      kaarten.push(kaart);
      toon.appendChild(kaart);
    });

    var meten = weer.meten || {}, slot = weer.afsluiter || {};
    [
      meten.titel ? stap("1. Eerst even meten", [weerLied(meten.titel, meten.audio, "", meten.uitleg)]) : null,
      stap((meten.titel ? "2. " : "") + "Kies jouw weer", [keuzes, toon]),
      slot.titel ? stap((meten.titel ? "3. " : "") + "Tot slot", [weerLied(slot.titel, slot.audio, "", slot.uitleg)]) : null
    ].forEach(function (deel) { if (deel) plek.appendChild(deel); });
  })();

  /* ---------- Superkrachten ---------- */

  (function () {
    var sk = inhoud.superkrachten;
    var plek = document.getElementById("superkrachten-plek");
    if (!plek || !sk) return;

    function lied(titel, audio, boven, uitleg) {
      if (!titel) return null;
      var links, onder;
      if (audio) {
        var s = speler(audio, titel);
        links = s.knop;
        onder = s.balk;
      } else {
        links = el("span", { class: "rondje" }, icoon("noot"));
        onder = el("p", { class: "nog-niet", tekst: "De muziek komt nog." });
      }
      return el("article", { class: "lied" }, [links, el("div", { class: "lied-midden" }, [
        boven ? el("p", { class: "klein", tekst: boven }) : null,
        el("h3", { tekst: titel }),
        onder,
        uitleg ? el("p", { tekst: uitleg }) : null
      ])]);
    }

    function stap(kop, kinderen) {
      return el("div", { class: "weer-stap" }, [el("h3", { tekst: kop })].concat(kinderen));
    }

    // 1. Uitleg
    var introId = "sk-intro";
    var intro = el("div", { class: "sk-intro" }, [
      el("div", { class: "sk-intro-tekst", id: introId }, alineas(sk.intro)),
      voorleesKnop(introId)
    ]);

    // 2. Kies een superkracht
    var krachten = sk.krachten || [];
    var keuzes = el("div", { class: "weer-keuzes" });
    var hint = el("p", { class: "weer-hint", tekst: "Tik op een superkracht. Bekijk ze gerust allemaal: misschien heb jij er wel meer!" });
    var toon = el("div", { class: "weer-toon" }, hint);
    var knoppen = [], kaarten = [];

    function kies(nummer) {
      knoppen.forEach(function (k, i) { k.setAttribute("aria-pressed", i === nummer ? "true" : "false"); });
      kaarten.forEach(function (k, i) { k.hidden = i !== nummer; });
      hint.hidden = true;
      stopAnderen(null);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }

    krachten.forEach(function (k, i) {
      var klein = plaatje(k.beeld);
      klein.setAttribute("class", "sk-knop-beeld");
      var knop = el("button", { class: "weer-keuze is-" + k.kleur, type: "button", "aria-pressed": "false" }, [
        klein, el("span", { tekst: k.naam })
      ]);
      knop.addEventListener("click", function () { kies(i); });
      knoppen.push(knop);
      keuzes.appendChild(knop);

      var id = "sktekst-" + i;
      var groot = plaatje(k.beeld);
      groot.setAttribute("class", "weer-beeld weer-breintje");
      var kaart = el("article", { class: "weer-kaart is-" + k.kleur, hidden: "" }, [
        groot,
        el("div", { class: "weer-tekst" }, [
          el("div", { class: "weer-woorden", id: id }, [
            el("p", { class: "klein", tekst: "Superkracht: " + k.naam }),
            el("h3", { tekst: k.kop }),
            el("p", { class: "weer-gevoel", tekst: k.kracht }),
            k.andereKant ? el("p", { class: "sk-andere" }, [el("b", { tekst: "De andere kant. " }), k.andereKant]) : null,
            k.helpt ? el("p", { class: "weer-helpt" }, [el("b", { tekst: "Dit helpt. " }), k.helpt]) : null
          ]),
          voorleesKnop(id),
          lied(k.liedje, k.audio, "Het liedje hierbij"),
          k.groteMensen ? el("details", { class: "sk-groot" }, [
            el("summary", { tekst: "Voor grote mensen" }),
            el("p", { tekst: k.groteMensen })
          ]) : null
        ])
      ]);
      kaarten.push(kaart);
      toon.appendChild(kaart);
    });

    // 3. Op je eigen kaart
    var kaartStap = el("div", { class: "sk-kaart-tip" }, [
      el("p", { tekst: "Weet je nu wat jouw superkrachten zijn? Zet ze op je Dit ben ik-kaart. Daar schrijf je ook wat je moeilijk vindt en wat jou helpt. Dan weet de juf het ook." }),
      el("a", { class: "knop", href: "#dit-ben-ik", tekst: "Maak je kaart" })
    ]);

    var slot = sk.afsluiter || {};
    var groot = sk.groteMensen ? el("div", { class: "sk-voor-groot" }, [
      el("h3", { tekst: "Voor grote mensen" }),
      el("p", { tekst: sk.groteMensen }),
      el("p", {}, ["Meer advies van Nicky voor ouders vind je in ", el("a", { href: "#club-plus", tekst: "Breintjes-club Plus" }), "."])
    ]) : null;

    [
      stap("1. Iedereen heeft superkrachten", [intro]),
      stap("2. Welke superkracht heb jij?", [keuzes, toon]),
      stap("3. Zet het op je kaart", [kaartStap]),
      slot.titel ? stap("4. Tot slot", [lied(slot.titel, slot.audio, "", slot.uitleg)]) : null,
      groot
    ].forEach(function (deel) { if (deel) plek.appendChild(deel); });
  })();

  /* ---------- Tabbladen ---------- */

  var paginas = [].slice.call(document.querySelectorAll(".pagina"));
  var tabs = [].slice.call(document.querySelectorAll(".tab"));
  var basisTitel = document.title;

  function toonPagina(naam, metSprong) {
    var gekozen = document.getElementById(naam);
    if (!gekozen || !gekozen.classList.contains("pagina")) {
      // Een link naar iets anders (zoals "ga naar de inhoud") laat het
      // tabblad staan dat al openstaat.
      var open = paginas.filter(function (p) { return !p.hidden; })[0];
      if (open && metSprong) return;
      gekozen = document.getElementById("thuis");
      naam = "thuis";
    }
    paginas.forEach(function (p) { p.hidden = p !== gekozen; });
    tabs.forEach(function (t) {
      if (t.getAttribute("href") === "#" + naam) t.setAttribute("aria-current", "page");
      else t.removeAttribute("aria-current");
    });

    // Stop geluid en voorlezen als je naar een ander tabblad gaat.
    stopAnderen(null);
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    var kop = gekozen.querySelector("h1, h2");
    document.title = naam === "thuis" || !kop ? basisTitel : kop.textContent.trim() + " – " + basisTitel;

    // De browser springt bij een adres met # naar dat stuk van de pagina.
    // Dat hoeft hier niet: een tabblad begint altijd bovenaan.
    window.scrollTo({ top: 0, behavior: "auto" });

    if (metSprong) gekozen.focus({ preventScroll: true });
    {
      // Schuif het gekozen tabblad in beeld, maar alleen zijwaarts:
      // de pagina zelf blijft bovenaan staan.
      var actieveTab = document.querySelector('.tab[aria-current="page"]');
      var rij = document.querySelector(".tabs-rij");
      if (actieveTab && rij && rij.scrollWidth > rij.clientWidth) {
        rij.scrollLeft = actieveTab.offsetLeft - (rij.clientWidth - actieveTab.offsetWidth) / 2;
      }
    }
  }

  function naamUitAdres() {
    return (location.hash || "").replace(/^#/, "") || "thuis";
  }

  window.addEventListener("hashchange", function () { toonPagina(naamUitAdres(), true); });
  toonPagina(naamUitAdres(), false);

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
