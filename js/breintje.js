/*
 * Breintje-tekenaar.
 * Maakt van een getal (het "zaadje") altijd hetzelfde breintje als SVG,
 * getekend in krijtstijl (huisstijl 3): wiebelige lijn, arcering, rode wangetjes, gele sokjes.
 * Een ander getal geeft een ander breintje. Zo zijn er geen twee gelijk.
 *
 * Werkt in de browser (window.Breintje) en in Node (module.exports).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Breintje = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // De kleuren van de huisstijl. Roze is de kleur van het vaste breintje.
  var KLEUREN = [
    { naam: "roze", vul: "#F4A6C3", donker: "#C2588C" },
    { naam: "geel", vul: "#F6CF5A", donker: "#A67F12" },
    { naam: "blauw", vul: "#8DBBE6", donker: "#2A5A8C" },
    { naam: "groen", vul: "#8FD391", donker: "#2B6E30" },
    { naam: "lila", vul: "#B995DE", donker: "#5A3591" },
    { naam: "oranje", vul: "#F29A73", donker: "#A8401A" }
  ];

  var NAMEN = [
    "Bloep", "Wiebel", "Kwik", "Zoef", "Dot", "Flap", "Mop", "Tuut",
    "Biep", "Snor", "Pluk", "Krul", "Fluf", "Hop", "Tik", "Roef",
    "Plons", "Wolk", "Stip", "Kiek", "Noot", "Boem", "Pief", "Zoem"
  ];

  var HOUDT_VAN = [
    "treinen", "tellen", "stilte", "rondjes draaien", "heel veel vragen",
    "dino's", "muziek", "dromen", "puzzels", "knuffels", "springen",
    "water", "sterren", "hard lachen", "alles op een rij zetten",
    "hetzelfde liedje nog een keer", "zachte dekens", "torens bouwen",
    "regenplassen", "kleuren", "verstoppen", "de maan"
  ];

  var INKT = "#1E2A5A";
  var SOK = "#F6CF5A";   // gele sokjes: die heeft elk breintje
  var WANG = "#E8556B";  // rode krijtwangetjes

  // Krijt-filter: maakt de lijnen wiebelig en laat het papier door de kleur schijnen.
  var KRIJT = '<filter id="bk-krijt" x="-8%" y="-8%" width="116%" height="116%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="w"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="w" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" result="k"/>' +
    '<feColorMatrix in="k" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -11 7.7" result="g"/>' +
    '<feComposite in="d" in2="g" operator="in"/></filter>';

  // Kleine, vaste toevalsmachine: hetzelfde zaadje geeft dezelfde reeks.
  function toeval(zaadje) {
    // Eerst husselen, anders lijken buur-getallen te veel op elkaar.
    var a = Math.imul((zaadje >>> 0) ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
    a = Math.imul(a ^ (a >>> 13), 0xc2b2ae35) >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function kies(r, lijst) {
    return lijst[Math.floor(r() * lijst.length)];
  }

  function n(getal) {
    return Math.round(getal * 10) / 10;
  }

  // De eigenschappen van een breintje, zonder het te tekenen.
  function beschrijf(zaadje) {
    var r = toeval(zaadje);
    return {
      zaadje: zaadje,
      kleur: kies(r, KLEUREN),
      naam: kies(r, NAMEN),
      houdtVan: kies(r, HOUDT_VAN),
      bobbels: 6 + Math.floor(r() * 4),
      bobbelFase: r() * Math.PI * 2,
      scheefFase: r() * Math.PI * 2,
      breedte: 74 + r() * 10,
      hoogte: 60 + r() * 10,
      ogen: kies(r, ["stip", "groot", "blij", "bril"]),
      kijk: kies(r, [-2, 0, 0, 2]),
      mond: kies(r, ["lach", "open", "o", "lachje"]),
      wangen: r() < 0.6,
      armen: kies(r, ["omlaag", "omhoog", "zwaai"]),
      extra: kies(r, ["niets", "oorkappen", "strik", "feesthoed", "sprietje", "krul"]),
      extraKleur: kies(r, KLEUREN)
    };
  }

  // Alleen de vormen, zonder <svg> eromheen (handig om in een groter plaatje te zetten).
  function vormen(zaadje, opties) {
    opties = opties || {};
    var lijn = !!opties.kleurplaat; // alleen zwarte lijnen, om in te kleuren
    var b = beschrijf(zaadje);
    var cx = 120, cy = 120;

    var vul = lijn ? "#fff" : b.kleur.vul;
    var detail = lijn ? "#111" : b.kleur.donker;
    var inkt = lijn ? "#111" : INKT;
    var rand = lijn ? ' stroke="#111" stroke-width="3" stroke-linejoin="round"' : "";
    // Kies een extra kleur die afwijkt van het lijf.
    var ek = b.extraKleur.naam === b.kleur.naam
      ? KLEUREN[(KLEUREN.indexOf(b.extraKleur) + 2) % KLEUREN.length]
      : b.extraKleur;
    var extraVul = lijn ? "#fff" : ek.vul;
    var extraDonker = lijn ? "#111" : ek.donker;
    var wit = "#fff";

    // Lijf: een ovaal met zachte bobbels.
    var punten = [];
    for (var i = 0; i < 120; i++) {
      var h = (i / 120) * Math.PI * 2;
      var f = 1 + 0.055 * Math.sin(b.bobbels * h + b.bobbelFase) + 0.03 * Math.sin(2 * h + b.scheefFase);
      punten.push(n(cx + Math.cos(h) * b.breedte * f) + " " + n(cy + Math.sin(h) * b.hoogte * f));
    }
    var lijf = "M" + punten.join("L") + "Z";
    var top = cy - b.hoogte;
    var onder = cy + b.hoogte;

    var s = [];
    // Armen, benen en schoenen nemen de tekstkleur van de pagina over,
    // zodat je ze ook op een donkere achtergrond ziet.
    var lid = lijn ? "#111" : "currentColor";
    var streep = ' fill="none" stroke="' + inkt + '" stroke-width="' + (lijn ? 5 : 4) + '" stroke-linecap="round" stroke-linejoin="round"';
    var lidStreep = ' fill="none" stroke="' + lid + '" stroke-width="' + (lijn ? 5 : 3.5) + '" stroke-linecap="round" stroke-linejoin="round"';

    if (!lijn) {
      s.push("<defs>" + KRIJT + '<clipPath id="bk-l' + zaadje + '"><path d="' + lijf + '"/></clipPath></defs>');
      s.push('<g filter="url(#bk-krijt)">');
      // Een krijtkrabbel als schaduw onder de voeten.
      s.push('<path d="M70 236l20 -5l-12 7l26 -7l-14 7l28 -7l-12 7l26 -6l-10 6l24 -5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity=".22"/>');
    }

    // Benen en gele sokjes.
    var sokRand = ' stroke="' + lid + '" stroke-width="3" stroke-linejoin="round"';
    s.push('<path d="M100 ' + n(onder - 6) + 'V224M140 ' + n(onder - 6) + 'V224"' + lidStreep + "/>");
    s.push('<ellipse cx="93" cy="226" rx="13" ry="7" fill="' + (lijn ? wit : SOK) + '"' + (lijn ? rand : sokRand) + "/>");
    s.push('<ellipse cx="147" cy="226" rx="13" ry="7" fill="' + (lijn ? wit : SOK) + '"' + (lijn ? rand : sokRand) + "/>");

    // Armen.
    var lx = cx - b.breedte + 6, rx = cx + b.breedte - 6;
    var links = b.armen === "omhoog" ? "M" + n(lx) + " 128L22 96" : "M" + n(lx) + " 130L24 158";
    var rechts = b.armen === "omlaag" ? "M" + n(rx) + " 130L216 158" : "M" + n(rx) + " 128L218 96";
    s.push('<path d="' + links + rechts + '"' + lidStreep + "/>");

    // Oorkappen: de beugel gaat achter het lijf langs.
    if (b.extra === "oorkappen") {
      s.push('<path d="M' + n(cx - b.breedte - 2) + " 112C" + n(cx - b.breedte) + " " + n(top - 34) + " " + n(cx + b.breedte) + " " + n(top - 34) + " " + n(cx + b.breedte + 2) + ' 112" fill="none" stroke="' + extraDonker + '" stroke-width="7" stroke-linecap="round"/>');
    }

    if (lijn) {
      s.push('<path d="' + lijf + '" fill="' + vul + '"' + rand + "/>");
    } else {
      s.push('<path d="' + lijf + '" fill="' + vul + '"/>');
      // Arcering: schuine krijtstreken waar het papier doorheen komt.
      var a = toeval(zaadje + 77), strepen = [];
      for (var sx = -40; sx < 260; sx += 9) {
        var j = (a() - 0.5) * 5;
        strepen.push("M" + n(sx + j) + " 30L" + n(sx + j - 62 + (a() - 0.5) * 8) + " 215");
      }
      s.push('<path d="' + strepen.join("") + '" clip-path="url(#bk-l' + zaadje + ')" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".34"/>');
      s.push('<path d="' + lijf + '" fill="none" stroke="' + inkt + '" stroke-width="3.5" stroke-linejoin="round"/>');
    }

    // Kronkels: het groefje in het midden en een paar krullen.
    var kr = ' fill="none" stroke="' + detail + '" stroke-width="' + (lijn ? 3 : 3.2) + '" stroke-linecap="round"';
    s.push('<path d="M120 ' + n(top + 5) + "q-7 9 0 18t0 18" + '"' + kr + "/>");
    s.push('<path d="M' + n(cx - 46) + " " + n(top + 26) + "q10 -13 22 -2M" + n(cx + 24) + " " + n(top + 24) + "q12 -11 22 2M" + n(cx - 62) + " " + n(cy + 26) + "q4 12 16 10M" + n(cx + 46) + " " + n(cy + 36) + 'q12 2 16 -10"' + kr + "/>");

    // Wangen.
    if (!lijn) {
      s.push('<ellipse cx="78" cy="143" rx="10" ry="8" fill="' + WANG + '" opacity=".8"/><ellipse cx="162" cy="143" rx="10" ry="8" fill="' + WANG + '" opacity=".8"/>');
    }

    // Ogen.
    var k = b.kijk;
    if (b.ogen === "stip") {
      s.push('<circle cx="99" cy="124" r="6.5" fill="' + inkt + '"/><circle cx="141" cy="124" r="6.5" fill="' + inkt + '"/>');
    } else if (b.ogen === "blij") {
      s.push('<path d="M90 127q9 -11 18 0M132 127q9 -11 18 0"' + streep + "/>");
    } else {
      var oogRand = ' stroke="' + inkt + '" stroke-width="3"';
      s.push('<circle cx="99" cy="123" r="12" fill="' + wit + '"' + oogRand + '/><circle cx="141" cy="123" r="12" fill="' + wit + '"' + oogRand + "/>");
      s.push('<circle cx="' + (99 + k) + '" cy="124" r="5.5" fill="' + inkt + '"/><circle cx="' + (141 + k) + '" cy="124" r="5.5" fill="' + inkt + '"/>');
      if (b.ogen === "bril") {
        s.push('<path d="M82 123a17 17 0 1 0 34 0a17 17 0 1 0 -34 0M124 123a17 17 0 1 0 34 0a17 17 0 1 0 -34 0M116 121q4 -4 8 0" fill="none" stroke="' + inkt + '" stroke-width="4"/>');
      }
    }

    // Mond.
    if (b.mond === "lach") {
      s.push('<path d="M105 148q15 13 30 0"' + streep + "/>");
    } else if (b.mond === "open") {
      s.push('<path d="M104 147h32q-2 17 -16 17t-16 -17z" fill="' + (lijn ? wit : inkt) + '" stroke="' + inkt + '" stroke-width="3" stroke-linejoin="round"/>');
    } else if (b.mond === "o") {
      s.push('<ellipse cx="120" cy="153" rx="6" ry="7" fill="' + (lijn ? wit : inkt) + '" stroke="' + inkt + '" stroke-width="3"/>');
    } else {
      s.push('<path d="M110 149q10 8 20 0"' + streep + "/>");
    }

    // Extra's bovenop.
    var er = ' stroke="' + (lijn ? "#111" : extraDonker) + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
    if (b.extra === "oorkappen") {
      s.push('<rect x="' + n(cx - b.breedte - 12) + '" y="100" width="20" height="44" rx="9" fill="' + extraVul + '"' + er + "/>");
      s.push('<rect x="' + n(cx + b.breedte - 8) + '" y="100" width="20" height="44" rx="9" fill="' + extraVul + '"' + er + "/>");
    } else if (b.extra === "strik") {
      var sy = n(top + 2);
      s.push('<path d="M120 ' + sy + "l-24 -13v26zM120 " + sy + 'l24 -13v26z" fill="' + extraVul + '"' + er + "/>");
      s.push('<circle cx="120" cy="' + sy + '" r="6" fill="' + extraVul + '"' + er + "/>");
    } else if (b.extra === "feesthoed") {
      var hy = n(top + 8);
      s.push('<path d="M98 ' + hy + "L120 " + n(top - 36) + "L142 " + hy + 'z" fill="' + extraVul + '"' + er + "/>");
      s.push('<circle cx="120" cy="' + n(top - 38) + '" r="7" fill="' + (lijn ? wit : "#fff") + '"' + er + "/>");
    } else if (b.extra === "sprietje") {
      s.push('<path d="M120 ' + n(top + 4) + "V" + n(top - 22) + '" fill="none" stroke="' + (lijn ? "#111" : "#2B6E30") + '" stroke-width="4" stroke-linecap="round"/>');
      s.push('<path d="M120 ' + n(top - 20) + "q-16 -14 -24 0q12 10 24 0zM120 " + n(top - 20) + 'q16 -14 24 0q-12 10 -24 0z" fill="' + (lijn ? wit : "#8FD391") + '" stroke="' + (lijn ? "#111" : "#2B6E30") + '" stroke-width="3" stroke-linejoin="round"/>');
    } else if (b.extra === "krul") {
      s.push('<path d="M118 ' + n(top + 4) + "c-8 -18 14 -30 20 -16c4 10 -10 14 -12 6" + '" fill="none" stroke="' + detail + '" stroke-width="5" stroke-linecap="round"/>');
    }

    if (!lijn) s.push("</g>");
    return s.join("");
  }

  // Een compleet SVG-plaatje. Met sier: true is het plaatje alleen versiering
  // en slaat een schermlezer het over.
  function teken(zaadje, opties) {
    opties = opties || {};
    var kop = opties.sier
      ? ' aria-hidden="true" focusable="false">'
      : ' role="img"><title>' + beschrijf(zaadje).naam + ", een breintje</title>";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 250" class="breintje"' + kop + vormen(zaadje, opties) + "</svg>";
  }

  return { teken: teken, vormen: vormen, beschrijf: beschrijf };
});
