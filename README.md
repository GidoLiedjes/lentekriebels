# Bijzondere Breintjes

De website van Bijzondere Breintjes: liedjes, verhaaltjes, rustmomenten, oefeningen, knutsels, filmpjes en tekeningen voor kinderen van 3 tot 8 jaar.

Het is een gewone, losse website. Er is niets te installeren en er hoeft niets "gebouwd" te worden.

## Inhoud aanpassen

Alles wat op de site staat, zet je in één bestand: **`inhoud.js`**. Daarin staat uitleg bij elk onderdeel.

| Tabblad | Waar in `inhoud.js` | Bestanden neerzetten in |
| --- | --- | --- |
| Liedjes | `liedjes` | map `liedjes/` (mp3) |
| Verhaaltjes | `verhaaltjes` | map `verhaaltjes/` (mp3, als je het voorleest) |
| Rustmoment | `rustmomenten` | – |
| Oefeningen | `oefeningen` | – |
| Knutselen | `knutsels` | map `knutsels/` (foto's) |
| Filmpjes | `filmpjes` | YouTube-link, of map `filmpjes/` (mp4) |
| Tekeningen | `tekeningen` | map `tekeningen/` |
| Wie zijn wij | `wieZijnWij` | – |
| Mailadres voor ideeën | `contact.email` | – |

De vaste teksten (zoals "Voor grote mensen") staan in `index.html`. Kleuren en letters staan bovenaan in `css/stijl.css`.

Bij de voorbeelden staat `voorbeeld: true`. Die zijn er alleen om te laten zien hoe het eruitziet. Haal ze weg of vervang ze. De verhaaltjes, rustmomenten, oefeningen en knutsels die er nu in staan zijn bruikbaar, maar schrijf ze gerust over in jullie eigen woorden.

## Bekijken op je eigen computer

```bash
python3 -m http.server 8000
```

Open daarna `http://localhost:8000` in je browser.

## Online zetten

De site werkt op elke webruimte: zet alle bestanden erop en klaar. Met GitHub Pages kan het zo:

1. Ga op GitHub naar **Settings → Pages**.
2. Kies bij **Source** voor *Deploy from a branch*, de branch `main` en de map `/ (root)`.
3. Na een minuut staat de site online op het adres dat GitHub daar laat zien.

## Hoe de site in elkaar zit

- `index.html`: de pagina, de tabbladen en de vaste teksten
- `inhoud.js`: alles wat op de tabbladen komt te staan
- `css/stijl.css`: de opmaak, met een lichte, een donkere en een rustige stand
- `js/breintje.js`: tekent de breintjes. Elk getal geeft een ander breintje.
- `js/site.js`: zet de inhoud op de pagina en laat de tabbladen en knoppen werken
- `tekeningen/`: de kleurplaten
- `tools/maak-plaatjes.js`: maakt de kleurplaten en het icoontje opnieuw (`node tools/maak-plaatjes.js`)
- `fonts/`: de letters Grandstander en Andika, met hun licentie

Elk tabblad heeft een eigen adres, bijvoorbeeld `.../#liedjes`. Zo kun je rechtstreeks naar één onderdeel linken.

## Keuzes voor bijzondere breintjes

- Muziek en filmpjes starten nooit vanzelf.
- De knop **Rustig** zet beweging uit en maakt de kleuren zachter. De keuze wordt op het apparaat onthouden.
- Eén ding tegelijk: elk onderdeel heeft een eigen tabblad, een vaste kleur en een vast plaatje.
- Ga je naar een ander tabblad, dan stoppen het geluid en het voorlezen.
- De leesletter (Andika) heeft de a en de g zoals kinderen ze leren schrijven.
- Geen reclame, geen cookies, geen meetprogramma's. Een YouTube-filmpje laadt pas na een druk op afspelen, via `youtube-nocookie.com`.
- Waar het apparaat Nederlands kan voorlezen, staat er een knop **Lees voor**.
- De rustmomenten en oefeningen zijn spelletjes, geen behandeling.
