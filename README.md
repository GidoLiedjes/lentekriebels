# Bijzondere Breintjes

De website van Bijzondere Breintjes: liedjes, filmpjes en tekeningen voor kinderen van 3 tot 8 jaar.

Het is een gewone, losse website. Er is niets te installeren en er hoeft niets "gebouwd" te worden.

## Inhoud aanpassen

Alles wat op de site staat, zet je in één bestand: **`inhoud.js`**. Daarin staat uitleg bij elk onderdeel.

| Wat | Waar |
| --- | --- |
| Een liedje toevoegen | `inhoud.js` → `liedjes`. Zet het mp3-bestand in een map `liedjes/`. |
| Een filmpje toevoegen | `inhoud.js` → `filmpjes`. Plak de YouTube-link, of zet een mp4 in een map `filmpjes/`. |
| Een tekening toevoegen | Zet het plaatje in `tekeningen/` en noem het in `inhoud.js` → `tekeningen`. |
| Het mailadres voor ideeën | `inhoud.js` → `contact.email` |
| De vaste teksten | `index.html` |
| Kleuren en letters | `css/stijl.css`, bovenaan |

Bij het voorbeeldliedje en het voorbeeldfilmpje staat `voorbeeld: true`. Die zijn er alleen om te laten zien hoe het eruitziet. Haal ze weg of vervang ze.

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

- `index.html`: de pagina en de vaste teksten
- `inhoud.js`: liedjes, filmpjes, tekeningen en het mailadres
- `css/stijl.css`: de opmaak, met een lichte, een donkere en een rustige stand
- `js/breintje.js`: tekent de breintjes. Elk getal geeft een ander breintje.
- `js/site.js`: zet de inhoud op de pagina en laat de knoppen werken
- `tekeningen/`: de kleurplaten
- `tools/maak-plaatjes.js`: maakt de kleurplaten en het icoontje opnieuw (`node tools/maak-plaatjes.js`)
- `fonts/`: de letters Grandstander en Andika, met hun licentie

## Keuzes voor bijzondere breintjes

- Muziek en filmpjes starten nooit vanzelf.
- De knop **Rustig** zet beweging uit en maakt de kleuren zachter. De keuze wordt op het apparaat onthouden.
- Elke soort heeft een vaste kleur en een vast plaatje: liedjes geel, filmpjes blauw, tekeningen groen.
- De leesletter (Andika) heeft de a en de g zoals kinderen ze leren schrijven.
- Geen reclame, geen cookies, geen meetprogramma's. Een YouTube-filmpje laadt pas na een druk op afspelen, via `youtube-nocookie.com`.
- Waar het apparaat Nederlands kan voorlezen, staat er een knop **Lees voor**.
