# U11 Kaderplaner · SV Weyhe

Kaderplanung für zwei U11-Mannschaften (4+1 und 6+1) mit Prüfung der Festspielregel nach
NFV-Jugendordnung § 5.

Die App besteht aus statischen Dateien, läuft in jedem Browser und speichert auf dem Gerät.
Wer sie zu zweit nutzen will, hinterlegt eine gemeinsame Ablage — siehe `ANLEITUNG.md`.

**In diesem Repository liegt nur Programmcode. Keine Spielerdaten.**

---

## Was drin ist

| Datei | Zweck |
| --- | --- |
| `index.html` | Startseite |
| `app.js` | die App (fertig gebaut) |
| `styles.css` | Gestaltung |
| `manifest.webmanifest` | „Zum Startbildschirm hinzufügen" |
| `icon-*.png`, `apple-touch-icon.png` | App-Symbol |
| `wappen.png` | Wappen in der Kopfzeile |
| `assets/` | Vorlagen für die App-Symbole beim APK-Bau |
| `taktik/` | Platz für die Taktiktafel — siehe unten |
| `.github/workflows/android-apk.yml` | baut die Android-App |
| `capacitor.config.json`, `package.json` | Einstellungen für den APK-Bau |
| `sw.js` | macht die App offlinefähig (netzwerk-zuerst) |
| `uebungen.json` | Übungskatalog für den Session-Builder |
| `.nojekyll` | verhindert, dass GitHub die Dateien umbaut |
| `ANLEITUNG.md` | Einrichtung, Bedienung, Firebase |

## Loslegen

1. Repository **Public** anlegen (GitHub Pages ist für private Repos kostenpflichtig).
2. Alle Dateien hochladen — Ordnerstruktur beibehalten.
3. **Settings → Pages → Deploy from a branch → main → / (root)**.
4. Nach ein bis zwei Minuten läuft die App unter
   `https://DEIN-NAME.github.io/NAME-DES-REPOS/`.

Alles Weitere steht in `ANLEITUNG.md`.

---

## Wichtig: der Quelltext liegt nicht hier

`app.js` ist das **gebaute Ergebnis**, nicht der Bauplan. Der Quelltext ist eine einzelne
Datei `App.jsx` (rund 6.100 Zeilen). Sie gehört **nicht** ins Repository, sondern auf den
eigenen Rechner und in eine Sicherung.

Ohne sie lässt sich die App nicht sinnvoll weiterentwickeln — der gebaute Code ist
minifiziert und praktisch unlesbar. Das ist schon einmal passiert; die Rückgewinnung hat
eine ganze Arbeitssitzung gekostet.

### Neu bauen

```bash
npm install react@18.3.1 react-dom@18.3.1 lucide-react@0.383.0 \
            esbuild@0.21.5 tailwindcss@3.4.10

npx esbuild src/main.jsx --bundle --minify --format=iife --target=es2019 \
    --loader:.css=empty --outfile=app.js \
    --define:process.env.NODE_ENV='"production"'

npx tailwindcss -i src/styles.css -o styles.css --minify
```

`src/main.jsx` hängt lediglich `App.jsx` in `#root` ein, `src/styles.css` enthält die drei
Tailwind-Zeilen.

---

## Taktiktafel

Im Ordner `taktik/` liegt eine unveränderte Kopie der TacticBoard-App. Sie wird im Reiter
*Training → Taktiktafel* in einem Rahmen geladen — erst beim Antippen, damit der Start der
App nicht länger dauert.

**Die `sw.js` muss in `taktik/` bleiben.** Ein Service Worker beherrscht sein Verzeichnis
und alles darunter. Läge er neben `app.js`, würde er die Kaderplaner-Dateien dauerhaft
zwischenspeichern — Änderungen kämen dann bei niemandem mehr an, und man merkt es nicht
einmal, weil im eigenen frisch geladenen Browser alles richtig aussieht.

Der Bild- und GIF-Export braucht beim ersten Mal Internet, weil die Taktiktafel dafür zwei
Bibliotheken vom CDN nachlädt. Wie sich das offline nachrüsten lässt, steht in
`taktik/LIESMICH.md` — dort auch alles Weitere zum Aktualisieren.

---

## Android-App

Der Workflow unter *Actions → „Android-App bauen"* erzeugt eine Debug-signierte APK. Sie
lässt sich installieren, aber nicht über den Play Store verteilen — für das Trainerteam
reicht das.

Optional lässt sich unter *Settings → Secrets and variables → Actions* ein Secret
`SYNC_URL` mit der Adresse der Ablage hinterlegen; die APK ist dann ab Start verbunden.
**Bei einem öffentlichen Repository kann jeder die gebaute APK herunterladen und die
Adresse darin auslesen** — dann lieber einmal pro Gerät eintippen.

---

## Datensparsamkeit

Hier geht es um Daten von Kindern. Deshalb:

- Spieler nur mit **Vorname und abgekürztem Nachnamen**. Kein Geburtsdatum, keine Adresse,
  keine Telefonnummer.
- Die Adresse der gemeinsamen Ablage ist faktisch das Passwort. Nur im Trainerteam
  weitergeben, nie in Eltern-Gruppen.
- Notizen sind für den Ablauf des Spieltags gedacht, nicht für Bewertungen einzelner
  Kinder.
