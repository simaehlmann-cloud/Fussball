# Taktiktafel

Hier liegt eine **Kopie** der TacticBoard-App. Das Original-Repository ist davon
unberuehrt; diese Dateien sind byteweise unveraendert uebernommen.

```
taktik/
├── index.html        die App (ein einziges Dokument, rund 150 KB)
├── sw.js             Service Worker, macht sie offlinefaehig
├── manifest.json
├── datenschutz.html
├── image.png
└── icon_fg.png
```

`config.xml`, `colors.xml` und der Cordova-Workflow bleiben absichtlich draussen — die
gehoeren zum Bau der eigenstaendigen Play-Store-App und haetten hier nichts zu suchen.

## Warum unveraendert?

Drei Dinge sahen zunaechst nach noetigen Aenderungen aus. Beim genauen Hinsehen ist keine
davon eine:

- `<script src="cordova.js">` findet die Datei nicht. Das erzeugt eine Meldung in der
  Browser-Konsole, sonst nichts.
- Genau deshalb feuert `deviceready` nie — und weil die Cordova-Behandlung der
  Zurueck-Taste daran haengt, meldet sie sich gar nicht erst an. Sie kann sich also nicht
  mit der des Kaderplaners streiten.
- `<link rel="manifest">` wird in einem eingebetteten Rahmen ohnehin nicht ausgewertet.

Wer die Konsolenmeldung nicht mag, kann die `cordova.js`-Zeile entfernen. Noetig ist es
nicht — und je weniger hier abweicht, desto einfacher ist das naechste Aktualisieren.

## Warum ein Unterordner und ein Rahmen (iframe)?

1. **Service Worker.** `sw.js` beherrscht sein Verzeichnis und alles darunter. In `taktik/`
   betrifft das nur die Taktiktafel — sie funktioniert dort sogar offline weiter. Laege
   dieselbe Datei im Hauptverzeichnis, wuerde ihre Regel *Cache-First* auch auf `app.js`
   und `styles.css` greifen: Der Kaderplaner waere beim ersten Besuch eingefroren und
   wuerde sich nie wieder aktualisieren. Das faellt lange nicht auf, weil im eigenen,
   frisch geladenen Browser alles richtig aussieht.

2. **Sicherheitsregeln.** Beide Seiten bringen eine eigene Content-Security-Policy mit. Im
   Rahmen bleiben sie getrennt: Die Taktiktafel darf html2canvas und gif.js vom CDN
   nachladen, ohne dass die strengere Regel des Kaderplaners aufgeweicht werden muss.

3. **Namen.** Die Taktiktafel speichert unter `tacticboard_tactics`, `tb_lang` und
   `tb_onboarding_done`, der Kaderplaner unter `u11-kaderplaner-*`. Auch die globalen
   Variablen (`field`, `canvas`, `translations`) bleiben im Rahmen fuer sich.

Der Rahmen ist auf `allow-scripts allow-same-origin allow-downloads` eingestellt — genug
fuer Speicher, Service Worker und den Bild- und GIF-Export, aber die Taktiktafel kann den
Kaderplaner nicht wegnavigieren.

## Bild- und GIF-Export

Die Taktiktafel laedt `html2canvas` und `gif.js` zuerst aus `libs/`, sonst vom CDN. Der
Ordner `libs/` liegt nicht im Repository — im Cordova-Build laedt ihn der Workflow beim
Bauen herunter.

Fuer diese Einbindung heisst das: **Der Export braucht beim ersten Mal Internet.** Wer ihn
auch offline will, legt hier einen Ordner `libs/` mit diesen drei Dateien an:

```
libs/html2canvas.min.js   cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
libs/gif.js               cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js
libs/gif.worker.js        cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js
```

Dann funktioniert er auch im Funkloch am Sportplatz.

## Aktualisieren

Aendert sich die Taktiktafel, die sechs Dateien einfach erneut hierher kopieren. Weil es
eine Kopie ist, entscheidest du selbst, wann das passiert.

Zeigt sie danach eine alte Fassung: Das ist ihr eigener Service Worker. `index.html` holt
er ohnehin immer neu (Network-First); fuer die uebrigen Dateien muss in `sw.js` der
`CACHE_NAME` erhoeht werden.
