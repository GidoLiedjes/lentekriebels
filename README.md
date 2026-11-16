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
| Weerbericht (het weer in je hoofd, met een liedje per weer) | `weerbericht` | map `liedjes/` (mp3) |
| Wie zijn wij | `wieZijnWij` | – |
| Club Plus (prijs, betaallink, pakket van de maand) | `club` | – |
| Mailadres voor ideeën | `contact.email` | – |

De **Dit ben ik-kaart** heeft geen inhoud om in te vullen: de vakken en keuzes staan in `js/dit-ben-ik.js`.

De vaste teksten (zoals "Voor grote mensen" en de uitleg van de club) staan in `index.html`. Kleuren en letters staan bovenaan in `css/stijl.css`.

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
- `css/stijl.css`: de opmaak in huisstijl 3 (krijt), met een rustige stand
- `js/breintje.js`: tekent de breintjes. Elk getal geeft een ander breintje.
- `js/site.js`: zet de inhoud op de pagina en laat de tabbladen en knoppen werken
- `js/dit-ben-ik.js`: de Dit ben ik-kaart (invullen, A4-kaart tekenen, bewaren als PDF of plaatje)
- `js/vendor/jspdf.umd.min.js`: maakt de PDF; wordt pas geladen als iemand op "Bewaar als PDF" drukt
- `tekeningen/`: de kleurplaten
- `tools/maak-plaatjes.js`: maakt de kleurplaten opnieuw (`node tools/maak-plaatjes.js`)
- `fonts/`: de letters Fredoka en Amatic SC uit de huisstijl, met hun licentie

Elk tabblad heeft een eigen adres, bijvoorbeeld `.../#liedjes`. Zo kun je rechtstreeks naar één onderdeel linken.

## Keuzes voor bijzondere breintjes

- Muziek en filmpjes starten nooit vanzelf.
- De knop **Rustig** zet beweging uit en maakt de kleuren zachter. De keuze wordt op het apparaat onthouden.
- Eén ding tegelijk: elk onderdeel heeft een eigen tabblad, een vaste kleur en een vast plaatje.
- Ga je naar een ander tabblad, dan stoppen het geluid en het voorlezen.
- De site volgt huisstijl 3 (krijt): wit papier, paars met zes accentkleuren, krijtranden, en het hoofdbreintje als logo. De plaatjes van de vaste breintjes staan in `beeld/`.
- Letters en de PDF-maker staan op de site zelf; er wordt niets bij Google of een ander bedrijf opgehaald.
- Wat je op de Dit ben ik-kaart invult, blijft op het eigen apparaat.
- Geen reclame, geen cookies, geen meetprogramma's. Een YouTube-filmpje laadt pas na een druk op afspelen, via `youtube-nocookie.com`.
- Waar het apparaat Nederlands kan voorlezen, staat er een knop **Lees voor**.
- De rustmomenten en oefeningen zijn spelletjes, geen behandeling.
