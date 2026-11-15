/*
 * Maakt de kleurplaten en het icoontje van de website.
 * Gebruik:  node tools/maak-plaatjes.js
 *
 * Een ander breintje als kleurplaat? Zet het getal en de naam in de lijst hieronder.
 */
const fs = require("fs");
const path = require("path");
const Breintje = require("../js/breintje.js");

const basis = path.join(__dirname, "..");

const kleurplaten = [10, 6, 19, 5];

for (const zaadje of kleurplaten) {
  const naam = Breintje.beschrijf(zaadje).naam;
  // A4, staand. De maten zijn in millimeters, zodat de plaat het hele vel vult.
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297" width="210mm" height="297mm">' +
    "<title>Kleurplaat van " + naam + "</title>" +
    '<rect width="210" height="297" fill="#fff"/>' +
    '<text x="105" y="38" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="15" font-weight="bold" fill="#111">Dit is ' + naam + ".</text>" +
    '<g transform="translate(13 52) scale(.7667)">' + Breintje.vormen(zaadje, { kleurplaat: true }) + "</g>" +
    '<text x="105" y="262" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="9" fill="#111">Kleur ' + naam + " zoals jij wilt.</text>" +
    '<text x="105" y="284" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="5" fill="#555">Bijzondere Breintjes</text>' +
    "</svg>\n";
  const bestand = path.join(basis, "tekeningen", "kleurplaat-" + naam.toLowerCase() + ".svg");
  fs.writeFileSync(bestand, svg);
  console.log("gemaakt:", path.relative(basis, bestand));
}

// Icoontje voor het tabblad: het gezicht van Pief.
const icoon =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="18 14 204 204">' +
  '<g color="#232B45">' + Breintje.vormen(10, {}) + "</g>" +
  "</svg>\n";
fs.writeFileSync(path.join(basis, "favicon.svg"), icoon);
console.log("gemaakt: favicon.svg");
