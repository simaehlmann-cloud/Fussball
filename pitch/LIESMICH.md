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
| `index.html` SHA-256 | `752b81787a60eded8ee8f8098796897780848196c73061d3718e7391f9a37a5f` |
