# PitchPro (Spielprotokoll)

Hier liegt eine **byte-gleiche Kopie** von PitchPro aus dem Repository `pitchpro`. Gleiches
Prinzip wie bei der Taktiktafel in `taktik/`: eigener Unterordner, damit der Service Worker
von PitchPro nur sich selbst betrifft, und ein Rahmen (iframe) im Kaderplaner.

Anders als die Taktiktafel spricht PitchPro mit dem Kaderplaner – über `postMessage`, nur
innerhalb desselben Ursprungs. Das Protokoll steht in der README von PitchPro
(Abschnitt „Eingebettet im U11-Kaderplaner“). Die Brücke ist Teil von PitchPro selbst und
wirkt nur, wenn die App in einem Rahmen läuft; die Store-Version ist davon unberührt.

## Aktualisieren

Diese Dateien aus `pitchpro` hierher kopieren:
`index.html`, `sw.js`, `manifest.json`, `image.png`, `icon_maskable.png`,
`datenschutz.html`, `datenschutz-en.html`, `impressum.html`, `impressum-en.html`.

Nicht ändern – Anpassungen gehören ins Original-Repository.

## Stand

| | |
|---|---|
| Version | PitchPro 1.0.0 mit Kaderplaner-Brücke (Branch `kaderplaner-bridge`) |
| `index.html` SHA-256 | `da2c61f5811e86b5be80a3b79f6a412902ae8951b1d996df636db9a9a8280ce8` |
