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
| Version | PitchPro 1.0.1 mit Kaderplaner-Brücke (Fix: doppelte Funktion matchResult) |
| `index.html` SHA-256 | `330dc8a13a0cce43514c27e843e0e6f7250e72b82e9770569d51339f00866237` |
