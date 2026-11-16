/*
 * INHOUD VAN DE WEBSITE
 * =====================
 * Alles wat op de website staat, zet je in dit bestand.
 * Je hoeft de andere bestanden niet aan te raken.
 *
 * Regels:
 *  - Tekst staat tussen "aanhalingstekens".
 *  - Na elk onderdeel komt een komma.
 *  - Een lijst staat tussen [ vierkante haken ].
 *  - Staat er  voorbeeld: true  bij? Dan is het een voorbeeld van mij.
 *    Haal het weg of vervang het door je eigen tekst.
 */
window.INHOUD = {

  /* Het mailadres voor ideeën. Leeg laten = er staat nog geen adres op de site. */
  contact: {
    email: ""
  },

  /* ------------------------------------------------------------------
   * BREINTJES-CLUB PLUS
   *  prijs       : bijvoorbeeld "€ 4,95". Leeg = aanmelden kan nog niet.
   *  aanmeldlink : de betaallink van je betaaldienst (begint met https://).
   *                Pas als prijs én link zijn ingevuld, werkt de knop "Meld je aan".
   *  ledenlink   : (mag leeg) de link naar de club zelf. LET OP: wie deze link
   *                heeft, kan erin. Vul hem alleen in als dat de bedoeling is.
   *  maand       : het pakket van deze maand. Haal "maand" leeg ("") om het vak te verbergen.
   * ------------------------------------------------------------------ */
  club: {
    prijs: "",
    aanmeldlink: "",
    ledenlink: "",
    maand: "november",
    thema: "Trots",
    uitleg: "Trots zijn op wat je kunt, en op wie je bent.",
    liedje: "Trots",
    verhaaltje: "Gijs en de hoge tak",
    rustmoment: "Wakker met een glimlach",
    printblad: "Mijn trots-ster"
  },

  /* ------------------------------------------------------------------
   * WIE ZIJN WIJ
   * De alinea's komen onder elkaar op de pagina te staan.
   * ------------------------------------------------------------------ */
  wieZijnWij: {
    alineas: [
      "Wij zijn Nicky en Gert van Bijzondere Breintjes. We schrijven, zingen en tekenen alles zelf.",
      "We maken dit voor elk kind dat veel voelt, snel vol zit of zijn gevoel nog moeilijk kan zeggen. Een diagnose is niet nodig."
    ],
    groet: "Liefs, Nicky en Gert",
    /* Wil je per persoon iets vertellen? Zet het hier, bijvoorbeeld:
       { naam: "Nicky", doet: "Schrijft de verhaaltjes." }                */
    mensen: []
  },

  /* ------------------------------------------------------------------
   * WEERBERICHT
   * Hoe is het weer in je hoofd? Bij elk weer hoort een gevoel, iets wat
   * kan helpen en een liedje.
   *  meten     : het liedje vooraf.   afsluiter : het liedje aan het eind.
   *  weer      : de soorten weer, in de volgorde van de knoppen.
   *    soort   : het plaatje. Kies uit: zon, wolk, regen, storm, onweer, vuurwerk.
   *    kleur   : geel, lila, blauw, groen, oranje of roze.
   *    naam    : het woord op de knop.      kop   : de titel als je het kiest.
   *    gevoel  : zo voelt het.              helpt : dit kan helpen.
   *    liedje  : de naam van het liedje.    audio : het mp3-bestand in de map "liedjes".
   * ------------------------------------------------------------------ */
  weerbericht: {
    meten: {
      titel: "Thermometer",
      uitleg: "Luister en voel hoe het vanbinnen is.",
      audio: "liedjes/thermometer.mp3"
    },
    weer: [
      {
        soort: "zon", kleur: "geel", naam: "Zonnetje",
        kop: "Bij mij schijnt de zon",
        gevoel: "Ik voel me fijn. Ik heb er zin in!",
        helpt: "Deel je zon. Geef iemand een lach of een high five.",
        liedje: "Schijn", audio: "liedjes/schijn.mp3"
      },
      {
        soort: "wolk", kleur: "lila", naam: "Wolkjes",
        kop: "Er hangen wolkjes",
        gevoel: "Het gaat wel. Maar er zit iets in de weg.",
        helpt: "Vertel of teken wat er zit. Je hoeft niet altijd blij te zijn.",
        liedje: "Ik hoef niet altijd blij te zijn", audio: "liedjes/ik-hoef-niet-altijd-blij-te-zijn.mp3"
      },
      {
        soort: "regen", kleur: "blauw", naam: "Regen",
        kop: "Het regent vanbinnen",
        gevoel: "Ik ben verdrietig of moe. Het drupt in mijn hoofd.",
        helpt: "Zoek een knuffel of een rustig plekje. Huilen mag.",
        liedje: "Druppel", audio: "liedjes/druppel.mp3"
      },
      {
        soort: "storm", kleur: "groen", naam: "Storm",
        kop: "Het stormt in mijn hoofd",
        gevoel: "Alles waait door elkaar. Het is druk en veel.",
        helpt: "Adem langzaam in. Blaas zacht uit, alsof je de wind tot rust blaast.",
        liedje: "Kalmeer mijn storm", audio: "liedjes/kalmeer-mijn-storm.mp3"
      },
      {
        soort: "onweer", kleur: "oranje", naam: "Onweer",
        kop: "Het onweert",
        gevoel: "Ik ben boos. Het knettert en het dondert.",
        helpt: "Stamp met je voeten of knijp in een kussen. Tel daarna tot tien.",
        liedje: "Boos", audio: "liedjes/boos.mp3"
      },
      {
        soort: "vuurwerk", kleur: "roze", naam: "Vuurwerk",
        kop: "Vuurwerk in mijn hoofd",
        gevoel: "Het knalt en het flitst. Alles komt te hard binnen.",
        helpt: "Handen op je oren, ogen even dicht. Zoek een stil hoekje.",
        liedje: "Overprikkeling", audio: "liedjes/overprikkeling.mp3"
      }
    ],
    afsluiter: {
      titel: "Ik ben ik en jij bent jij",
      uitleg: "Bij jou regent het, bij mij schijnt de zon. Dat mag allebei. Kijk straks nog eens: is jouw weer veranderd?",
      audio: "liedjes/ik-ben-ik-en-jij-bent-jij.mp3"
    }
  },

  /* ------------------------------------------------------------------
   * LIEDJES
   *  titel : de naam van het liedje
   *  audio : het geluidsbestand, bijvoorbeeld "liedjes/lentekriebels.mp3"
   *          (zet het mp3-bestand in de map "liedjes"). Leeg = nog geen muziek.
   *  tekst : de tekst om mee te zingen. Een lege regel begint een nieuw couplet.
   * ------------------------------------------------------------------ */
  liedjes: [
    {
      titel: "Lentekriebels",
      audio: "",
      tekst: `
Kriebel, kriebel, in mijn teen,
de lente komt, de kou gaat heen.
Kriebel, kriebel, in mijn hoofd,
de zon heeft het aan mij beloofd.
`,
      voorbeeld: true
    }
  ],

  /* ------------------------------------------------------------------
   * VERHAALTJES
   *  titel : de naam van het verhaal
   *  audio : (mag leeg) een voorgelezen versie, bijvoorbeeld "verhaaltjes/pief.mp3"
   *  tekst : het verhaal. Een lege regel begint een nieuwe alinea.
   * ------------------------------------------------------------------ */
  verhaaltjes: [
    {
      titel: "Pief en de trein die wachtte",
      audio: "",
      tekst: `
Pief houdt van treinen. Elke dag gaat Pief naar het spoor. Daar komt de trein. Altijd.

Maar vandaag komt de trein niet. Het spoor is leeg. Pief wordt warm vanbinnen. Zijn handen willen wapperen.

Dan denkt Pief: ik tel de wolken. Eén wolk. Twee wolken. Drie dikke wolken.

Bij wolk zeven hoort Pief iets. Tjoek. Tjoek. Daar is de trein.

De trein was er gewoon nog niet. En Pief was er al.
`,
      voorbeeld: true
    },
    {
      titel: "Noot wil even niet praten",
      audio: "",
      tekst: `
Noot heeft woorden in zijn hoofd. Maar ze willen er niet uit. Vandaag niet.

Zoef komt erbij zitten. Zoef zegt niets. Zoef wacht gewoon.

Samen kijken ze naar een slak. De slak gaat heel langzaam. Dat is goed.

Na een hele tijd zegt Noot: "Slak."

"Slak," zegt Zoef.

En dat was genoeg.
`,
      voorbeeld: true
    }
  ],

  /* ------------------------------------------------------------------
   * RUSTMOMENTEN
   *  titel      : de naam
   *  duur       : hoe lang het ongeveer duurt
   *  stappen    : de stapjes, één voor één
   *  ademhaling : true = er komt een cirkel bij die langzaam groter en
   *               kleiner wordt om mee te ademen
   * ------------------------------------------------------------------ */
  rustmomenten: [
    {
      titel: "Ballonbuik",
      duur: "1 minuut",
      ademhaling: true,
      stappen: [
        "Leg je hand op je buik.",
        "Adem in door je neus. Je buik wordt een ballon.",
        "Adem uit door je mond. De ballon loopt leeg.",
        "Doe het nog vier keer."
      ],
      voorbeeld: true
    },
    {
      titel: "Zware handen",
      duur: "1 minuut",
      stappen: [
        "Ga zitten. Leg je handen op je benen.",
        "Voel hoe zwaar je handen zijn.",
        "Duw je handen zachtjes naar beneden. Tel tot vijf.",
        "Laat los. Voel hoe je handen nu warm zijn."
      ],
      voorbeeld: true
    },
    {
      titel: "Drie dingen",
      duur: "2 minuten",
      stappen: [
        "Kijk rond. Zoek drie dingen die blauw zijn.",
        "Luister. Hoor je drie geluiden?",
        "Voel met je vingers. Wat is zacht? Wat is hard?",
        "Haal één keer diep adem. Klaar."
      ],
      voorbeeld: true
    }
  ],

  /* ------------------------------------------------------------------
   * OEFENINGEN
   *  titel   : de naam
   *  duur    : hoe lang het ongeveer duurt
   *  stappen : de stapjes, één voor één
   * ------------------------------------------------------------------ */
  oefeningen: [
    {
      titel: "Stamp als een olifant",
      duur: "1 minuut",
      stappen: [
        "Ga staan. Maak je heel groot.",
        "Stamp met je voeten. Boem. Boem.",
        "Zwaai je arm als een slurf.",
        "Sta stil. Voel je je voeten nog?"
      ],
      voorbeeld: true
    },
    {
      titel: "Groeien als een boom",
      duur: "1 minuut",
      stappen: [
        "Zit klein in elkaar. Je bent een zaadje.",
        "Kom heel langzaam omhoog.",
        "Strek je armen uit. Dat zijn je takken.",
        "Waai zachtjes heen en weer."
      ],
      voorbeeld: true
    },
    {
      titel: "Schud de kriebels eruit",
      duur: "halve minuut",
      stappen: [
        "Schud je handen los.",
        "Schud je armen los.",
        "Schud je benen los.",
        "Schud alles tegelijk. En dan: stop."
      ],
      voorbeeld: true
    }
  ],

  /* ------------------------------------------------------------------
   * KNUTSELEN
   *  titel      : de naam
   *  nodig      : wat je nodig hebt
   *  stappen    : de stapjes, één voor één
   *  grootMens  : true = er komt bij te staan dat je hier een groot mens
   *               bij nodig hebt (bijvoorbeeld bij een schaar)
   *  plaatje    : (mag leeg) een foto, bijvoorbeeld "knutsels/breintje.jpg"
   * ------------------------------------------------------------------ */
  knutsels: [
    {
      titel: "Je eigen breintje van klei",
      nodig: ["Klei of deeg", "Twee kraaltjes of twee stukjes papier voor de ogen"],
      stappen: [
        "Rol een bal van klei.",
        "Druk er met je duim kuiltjes in. Dat zijn de kronkels.",
        "Maak twee ogen.",
        "Geef je breintje een naam."
      ],
      plaatje: "",
      voorbeeld: true
    },
    {
      titel: "Een wolkje van watten",
      nodig: ["Watten", "Blauw papier", "Lijm"],
      stappen: [
        "Trek de watten een beetje uit elkaar.",
        "Smeer lijm op het papier.",
        "Druk de watten erop.",
        "Blaas zachtjes. Beweegt je wolk?"
      ],
      plaatje: "",
      voorbeeld: true
    },
    {
      titel: "Breintje op een stokje",
      nodig: ["Een kleurplaat van deze website", "Kleurpotloden", "Een rietje of een satéprikker", "Plakband", "Een schaar"],
      grootMens: true,
      stappen: [
        "Print een kleurplaat en kleur hem in.",
        "Vraag een groot mens om het breintje uit te knippen.",
        "Plak het rietje achterop met plakband.",
        "Nu kun je met je breintje spelen."
      ],
      plaatje: "",
      voorbeeld: true
    }
  ],

  /* ------------------------------------------------------------------
   * FILMPJES
   *  titel   : de naam van het filmpje
   *  youtube : de link naar het filmpje op YouTube, bijvoorbeeld
   *            "https://www.youtube.com/watch?v=abc123xyz"
   *  bestand : of een eigen videobestand, bijvoorbeeld "filmpjes/dans.mp4"
   *  plaatje : (mag leeg) een plaatje dat je ziet vóór het afspelen,
   *            bijvoorbeeld "filmpjes/dans.jpg"
   * ------------------------------------------------------------------ */
  filmpjes: [
    {
      titel: "Lentekriebels: dans mee",
      youtube: "",
      bestand: "",
      plaatje: "",
      voorbeeld: true
    }
  ],

  /* ------------------------------------------------------------------
   * TEKENINGEN
   *  titel      : de naam van de tekening
   *  bestand    : het plaatje, in de map "tekeningen"
   *  kleurplaat : true = er staat "Open en print" bij
   * ------------------------------------------------------------------ */
  tekeningen: [
    { titel: "Billie", bestand: "tekeningen/kleurplaat-billie.png", kleurplaat: true },
    { titel: "Lisa met een boekje", bestand: "tekeningen/kleurplaat-lisa.png", kleurplaat: true },
    { titel: "Hetty met een koptelefoon", bestand: "tekeningen/kleurplaat-hetty.png", kleurplaat: true },
    { titel: "Suus springt", bestand: "tekeningen/kleurplaat-suus.png", kleurplaat: true }
  ]
};
