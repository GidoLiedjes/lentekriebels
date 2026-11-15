/*
 * INHOUD VAN DE WEBSITE
 * =====================
 * Alles wat op de website staat, zet je in dit bestand.
 * Je hoeft de andere bestanden niet aan te raken.
 *
 * Regels:
 *  - Tekst staat tussen "aanhalingstekens".
 *  - Na elk onderdeel komt een komma.
 *  - Staat er  voorbeeld: true  bij? Dan is het een voorbeeld van mij.
 *    Haal het weg of vervang het door je eigen liedje of filmpje.
 */
window.INHOUD = {

  /* Het mailadres voor ideeën. Leeg laten = er staat nog geen adres op de site. */
  contact: {
    email: ""
  },

  /*
   * LIEDJES
   *  titel : de naam van het liedje
   *  audio : het geluidsbestand, bijvoorbeeld "liedjes/lentekriebels.mp3"
   *          (zet het mp3-bestand in de map "liedjes"). Leeg = nog geen muziek.
   *  tekst : de tekst om mee te zingen. Een lege regel begint een nieuw couplet.
   */
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

  /*
   * FILMPJES
   *  titel   : de naam van het filmpje
   *  youtube : de link naar het filmpje op YouTube, bijvoorbeeld
   *            "https://www.youtube.com/watch?v=abc123xyz"
   *  bestand : of een eigen videobestand, bijvoorbeeld "filmpjes/dans.mp4"
   *  plaatje : (mag leeg) een plaatje dat je ziet vóór het afspelen,
   *            bijvoorbeeld "filmpjes/dans.jpg"
   */
  filmpjes: [
    {
      titel: "Lentekriebels: dans mee",
      youtube: "",
      bestand: "",
      plaatje: "",
      voorbeeld: true
    }
  ],

  /*
   * TEKENINGEN
   *  titel      : de naam van de tekening
   *  bestand    : het plaatje, in de map "tekeningen"
   *  kleurplaat : true = er staat "Open en print" bij
   */
  tekeningen: [
    { titel: "Pief met oorkappen", bestand: "tekeningen/kleurplaat-pief.svg", kleurplaat: true },
    { titel: "Zoef met een strik", bestand: "tekeningen/kleurplaat-zoef.svg", kleurplaat: true },
    { titel: "Pluk viert feest", bestand: "tekeningen/kleurplaat-pluk.svg", kleurplaat: true },
    { titel: "Kwik met een sprietje", bestand: "tekeningen/kleurplaat-kwik.svg", kleurplaat: true }
  ]
};
