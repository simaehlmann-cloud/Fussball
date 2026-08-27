# U11 Kaderplaner — Einrichtung

Die App besteht aus statischen Dateien und läuft in jedem Browser. GitHub Pages liefert sie
aus; gespeichert wird dort **nichts**. Deshalb zwei getrennte Schritte:

1. **App veröffentlichen** (GitHub Pages) — danach hat sie eine Adresse.
2. **Gemeinsame Ablage** — erst dann sieht das ganze Trainerteam dieselben Daten.

Ohne Schritt 2 funktioniert alles, die Daten liegen dann nur auf deinem Gerät.

---

## Diese Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | Startseite |
| `app.js` | die App |
| `styles.css` | Gestaltung |
| `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png` | App-Symbol (Vereinswappen) und „zum Startbildschirm hinzufügen" |
| `wappen.png` | Wappen in der Kopfzeile der App |
| `.nojekyll` | verhindert, dass GitHub die Dateien umbaut |
| `ANLEITUNG.md` | diese Datei |

Alle Dateien gehören zusammen in **einen** Ordner.

---

## Schritt 1 · GitHub Pages

1. Auf [github.com](https://github.com) anmelden (kostenloses Konto genügt).
2. Oben rechts **+ → New repository**.
   - Name z. B. `u11-kaderplaner`
   - **Public** auswählen (Pages ist für private Repositories kostenpflichtig)
   - **Create repository**
3. Im leeren Repository auf **uploading an existing file** klicken und alle Dateien aus
   diesem Ordner hineinziehen — die Dateien selbst, nicht den Ordner.
   Falls `.nojekyll` beim Hochladen verschwindet: nicht schlimm, die App läuft auch ohne.
4. Unten **Commit changes**.
5. **Settings → Pages**:
   - *Source*: **Deploy from a branch**
   - *Branch*: **main**, Ordner **/ (root)** → **Save**
6. Nach ein bis zwei Minuten steht oben die Adresse:
   `https://DEIN-NAME.github.io/u11-kaderplaner/`

Auf dem Handy öffnen und über das Browser-Menü **„Zum Startbildschirm hinzufügen"** ablegen —
dann verhält sie sich wie eine App.

> Im Repository liegt nur Programmcode, **keine Spielerdaten**.

---

## Schritt 2 · Gemeinsame Ablage

### Der schnelle Weg (gut zum Ausprobieren)

In der App auf **Optionen → Gemeinsame Ablage → „Ablage anlegen — ohne Konto"** tippen.
Fertig. Danach erscheint der Knopf **„Link für das Trainerteam"** — diesen Link einmal an die
anderen Trainer schicken, dann sind alle verbunden.

Dahinter steckt der kostenlose Dienst **jsonblob.com**. Zwei Dinge solltest du wissen:

- Er ist eigentlich für Software-Tests gedacht, nicht für Vereinsdaten. Es gibt **keine
  Zusage**, dass er dauerhaft läuft.
- **Nicht abgerufene Ablagen werden nach 75 Tagen gelöscht.** Solange ihr die App im
  Wochenrhythmus nutzt, passiert nichts — über eine lange Winterpause aber schon.

Für eine ganze Saison würde ich deshalb auf einen der folgenden Wege wechseln. Der Umzug ist
einfach: neue Adresse eintragen, **Verbinden** — die Daten von deinem Gerät werden
automatisch hochgeladen.

### Der dauerhafte Weg · Firebase Realtime Database

Kostenlos, in der EU, unter deinem eigenen Google-Konto. Etwa fünf Minuten.

1. [console.firebase.google.com](https://console.firebase.google.com) mit Google-Konto öffnen.
2. **Projekt hinzufügen**, Name z. B. `u11-kader`. Google Analytics kannst du abwählen.
3. Links **Build → Realtime Database → Datenbank erstellen**.
   - Standort: **europe-west1**
   - **Im gesperrten Modus starten** — die Regeln setzen wir gleich selbst.
4. Im Reiter **Daten** steht oben die Adresse, etwa
   `https://u11-kader-default-rtdb.europe-west1.firebasedatabase.app/`
5. Denk dir einen **schwer zu ratenden Namen** aus, der als Unterordner dient — hier im
   Beispiel `kader-7f3a9c2b`. Nimm einen eigenen, nicht diesen.
6. Reiter **Regeln**, Inhalt ersetzen durch — **den Namen aus Schritt 5 einsetzen**:

   ```json
   {
     "rules": {
       ".read": false,
       ".write": false,
       "kader-7f3a9c2b": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```

   **Veröffentlichen**.

   > **Warum nicht einfach `".read": true` ganz oben?** Das wäre bequemer und war hier
   > früher auch so beschrieben — es ist aber falsch. Steht die Freigabe an der Wurzel,
   > kann jeder, der nur die Datenbankadresse kennt, das Wurzelverzeichnis abrufen und
   > bekommt **sämtliche Unterordner-Namen** aufgelistet. Der ausgedachte Name schützt dann
   > gar nichts mehr. Mit den Regeln oben ist die Wurzel gesperrt und nur euer Ordner
   > erreichbar. (Der Testmodus wäre noch bequemer, läuft aber nach 30 Tagen ab — die App
   > wäre dann ohne Vorwarnung stumm.)

7. Die vollständige Adresse lautet damit:

   ```
   https://u11-kader-default-rtdb.europe-west1.firebasedatabase.app/kader-7f3a9c2b
   ```

   Diesen Text in der App unter **Optionen** eintragen, **Testen**, dann **Verbinden**.
   Das `.json` am Ende ergänzt die App selbst.

Der kostenlose Spark-Tarif reicht für diesen Zweck um Größenordnungen.

### Alternative · Webspace des Vereins

Falls der Verein eine Homepage mit PHP hat, lege dort eine Datei `daten.php` an:

```php
<?php
$datei = __DIR__ . '/u11-daten.json';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  file_put_contents($datei, file_get_contents('php://input'), LOCK_EX);
  echo '{"ok":true}';
  exit;
}
echo is_file($datei) ? file_get_contents($datei) : 'null';
```

In der App die volle Adresse eintragen, z. B. `https://verein.de/kader/daten.php`.
Sie muss über **https** erreichbar sein.

### Wenn etwas klemmt

Der Knopf **Testen** in der App sagt im Klartext, woran es liegt: falsche Adresse, fehlende
Schreibrechte, oder die Ablage lässt keine Zugriffe aus dem Browser zu.

---

## Schritt 4 · Android-App (APK) bauen — optional

Auf dem Handy reicht eigentlich „Zum Startbildschirm hinzufügen". Wer trotzdem eine echte
Installationsdatei möchte, kann sie GitHub bauen lassen — ohne eigenen Rechner, ohne
Android Studio. Die App verhält sich genauso und synchronisiert weiterhin über eure Ablage.

1. Im Repository auf den Reiter **Actions**. Beim ersten Mal fragt GitHub nach — mit
   **„I understand my workflows, go ahead and enable them"** bestätigen.
2. Links **Android-App bauen** anklicken, rechts **Run workflow** → **Run workflow**.
3. Nach etwa fünf Minuten den fertigen Lauf öffnen. Unten unter **Artifacts** liegt
   `u11-kaderplaner-apk` als ZIP zum Herunterladen; darin steckt `app-debug.apk`.
4. Die APK auf das Handy kopieren und öffnen. Android fragt, ob Apps aus dieser Quelle
   installiert werden dürfen — einmal erlauben.

Dazu drei ehrliche Hinweise:

- Die APK ist **Debug-signiert**. Sie lässt sich installieren, aber nicht über den Play Store
  verteilen. Für den internen Gebrauch im Trainerteam ist das in Ordnung.
- iPhones können keine APK installieren. Dort bleibt es beim Startbildschirm-Symbol — das
  funktioniert genauso gut.
- In der App gibt es keine Web-Adresse zum Teilen. Der Knopf zeigt dann statt eines Links die
  **Adresse der Ablage**, die die anderen einmal unter *Optionen* eintragen.

Ändert sich die App später, einfach den Workflow erneut starten — die neue APK enthält den
aktuellen Stand.

### Adresse der Ablage fest in die APK einbauen — mit Bedacht

Wer die Adresse nicht bei jeder Installation eintippen will, kann sie beim Bauen hinterlegen:

1. Im Repository auf **Settings → Secrets and variables → Actions → New repository secret**.
2. Name: `SYNC_URL`. Wert: die vollständige Adresse eurer Ablage.
3. Workflow neu starten. Die fertige APK ist dann sofort verbunden.

Das Secret steht **nicht** im Repository und landet auch nicht in der Web-Fassung auf GitHub
Pages — nur in der APK.

**Aber:** Bei einem öffentlichen Repository kann jeder, der die Actions-Seite aufruft, die
gebaute APK herunterladen. Wer sie auseinandernimmt, findet die Adresse darin. Damit wäre
sie faktisch öffentlich — und wer die Adresse hat, kann alle Daten lesen und ändern.

Deshalb die ehrliche Empfehlung: **Adresse lieber einmal pro Gerät eintippen.** Das dauert
zehn Sekunden und passiert genau einmal. Wenn ihr die Adresse doch einbauen wollt, dann nur
mit einem privaten Repository (dort sind auch die Artefakte geschützt) — und in jedem Fall
mit sparsamen Daten: Vorname und abgekürzter Nachname, sonst nichts.

---

## Was ihr wissen solltet

- **Die Adresse der Ablage ist das Passwort.** Wer sie kennt, kann alle Daten lesen und
  ändern. Nur im Trainerteam weitergeben, nicht in Eltern-Gruppen posten.
- **Fremde Links mit `#sync=` niemals anklicken.** Der Knopf „Link für das Trainerteam"
  erzeugt eine Adresse, die hinten `#sync=…` trägt. Wer so einen Link öffnet, stellt die
  App damit auf die darin genannte Ablage um — und der nächste Abgleich lädt alle Daten
  dorthin hoch. Ein Link aus einer fremden Quelle, der so aussieht, ist deshalb keine
  Einladung, sondern ein Angriff. Im Zweifel die Adresse von Hand unter *Optionen*
  eintragen.
- **Datensparsamkeit.** Kinder nur mit Vorname und abgekürztem Nachnamen, keine Geburtsdaten,
  Adressen oder Telefonnummern. Dann ist auch ein versehentlich geteilter Link kein ernster
  Schaden.
- **Abgleich.** Alle 15 Sekunden, beim Zurückkehren zur App und über die Anzeige oben rechts.
  Grüner Punkt und Uhrzeit heißen: verbunden. „nur hier" heißt: keine Ablage eingerichtet.
  „Fehler" heißt: Adresse falsch oder gerade nicht erreichbar — Eingaben gehen nicht
  verloren, sie bleiben auf dem Gerät und gehen beim nächsten Abgleich hoch.
- **Mannschaften.** Unter *Optionen → Mannschaften* stehen Name, Spielform (Feldspieler ohne
  Torwart) und Kadergröße je Mannschaft. Die App rechnet daraus die Zahl auf dem Feld und die
  Auswechselspieler aus. So lässt sich die App später auf 7+1, 9+1 oder 10+1 umstellen, ohne
  dass etwas neu gebaut werden muss.
- **Spieltag-Infos.** Heim oder auswärts, Gegner, Treffen an der ZSA, Treffen am Spielort
  (nur auswärts), Anstoß und die Adresse des Spielorts. Aus der Adresse baut die App einen
  Google-Maps-Link; ein fertiger Maps-Link darf auch direkt eingefügt werden. Der Knopf
  **Teilen** erzeugt daraus eine fertige Nachricht mit allen Zeiten, Navigation und Kader.
- **Zurück-Taste.** Sie schließt erst die geöffnete Ansicht und fragt auf der Startseite
  nach, bevor die App zugeht. Im Browser greift das ab der ersten Berührung des Bildschirms —
  vorher lässt Chrome keinen eigenen Verlaufseintrag zu.
- **Blick nach vorn.** Beim Aufstellen der oberen Mannschaft prüft die App, wie viele Kinder
  beim nächsten Pflichtspiel der unteren noch spielberechtigt wären. Wird es dort zu eng für
  eine Mannschaft plus zwei Auswechselspieler, warnt sie und nennt die Kinder, an denen es
  liegt.
- **Zusagen.** Drei Zustände je Kind: Haken (dabei), Fragezeichen (Eltern wissen es noch nicht),
  Kreuz (nicht dabei). Für den Kadervorschlag zählen nur Haken. Bleiben weniger als zwei
  Auswechselspieler übrig, weist die App darauf hin, bei welchen Kindern eine Nachfrage
  lohnt.
- **Gleichzeitiges Arbeiten.** Zusagen werden einzeln pro Spieler zusammengeführt, da könnt
  ihr euch nicht überschreiben. Nur wenn zwei im selben Moment dieselbe Aufstellung ändern,
  gewinnt die spätere Eingabe.
- **Ohne Internet** läuft die App weiter und gleicht ab, sobald wieder Netz da ist.
- **Sicherung.** In der App unter **Optionen → Sicherung** lädst du mit einem Tipp eine Datei
  mit allen Spielern, Spieltagen, Zusagen und Kadern herunter. Über **Einspielen** kommt sie
  zurück — der aktuelle Stand wird dabei ersetzt, bei gemeinsamer Ablage für das ganze
  Trainerteam. Empfehlung: einmal vor der Winterpause und vor größeren Umbauten.

---

## Neu: Spielbericht, Statistik und Training

### Nach dem Spiel

Öffne den Spieltag. Unter den Knöpfen steht **„Ergebnis und Torschützen nachtragen"**.
Dort trägst du das Ergebnis ein, tippst bei jedem Kind auf **+**, wenn es getroffen hat,
und kannst eine Notiz zum Ablauf schreiben. Stimmt die Zahl der zugeordneten Tore nicht
mit dem Ergebnis überein, weist die App darauf hin.

Tore ohne bekannten Schützen und Eigentore des Gegners haben eigene Knöpfe — so bleibt das
Ergebnis stimmig, auch wenn niemand mehr weiß, wer es war.

**Zu den Notizen:** Sie sind für den Ablauf des Spieltags gedacht — Platz, Wetter,
Schiedsrichter, was gut lief. Nicht für Bewertungen einzelner Kinder. Die Ablage ist über
einen Link erreichbar, und Sätze über einzelne Kinder gehören nicht dorthin.

### Bilanz

Im Reiter **Bilanz** steht unten neu die Auswertung:

- **Einsatzverteilung** — wer wie oft im Kader stand, wie oft trotz Zusage nicht, und wie
  viele Tore. Das ist die Zahl, mit der sich Aufstellungen gegenüber Eltern begründen
  lassen. Liegen zwischen dem meisten und dem wenigsten Einsatz drei Spieltage oder mehr,
  weist die App darauf hin.
- **Bilanz je Mannschaft** — Spiele, Siege, Unentschieden, Niederlagen, Torverhältnis.
- **Torschützen** — bewusst darunter und ohne Platzierungen.

### Training

Der Reiter **Training** hat drei Bereiche:

- **Stoppuhr** mit Rundenzeiten und einem Intervalltimer (Belastung, Pause, Durchgänge).
  Der Bildschirm bleibt an, solange etwas läuft. Töne: hoch = Belastung, tief = Pause,
  dreifach = Ende.
- **Termine** mit Anwesenheit je Kind und einem Notizfeld. Darunter die Anwesenheitsquote.
- **Taktiktafel** — siehe unten.

Brauchst du den Reiter nicht: **Optionen → Trainingsbereich → ausschalten.** Dann
verschwindet er aus der Leiste; bereits erfasste Trainings bleiben erhalten.

---

## Einheit planen (Session-Builder)

Öffne unter *Training → Termine* einen Termin. Unter der Anwesenheit steht **Einheit
planen**.

### Phasen frei einteilen

Voreingestellt sind **Aufwärmen, Hauptteil, Abschluss** — das ist aber nur ein Vorschlag.
Über **Phasen bearbeiten** kannst du:

- beliebig viele Abschnitte anlegen (vier, fünf, so viele du brauchst)
- sie frei benennen, etwa „Ankommen", „Torschussblock", „Cool-down", „Ansprache"
- die Reihenfolge ändern und einzelne wieder entfernen

Wird eine Phase entfernt, **wandern ihre Bausteine in die erste Phase** — sie gehen nicht
verloren. Sollte doch einmal ein Baustein ohne gültige Phase dastehen (etwa nach einem
Abgleich mit dem Trainerteam), zeigt die App ihn oben in einem eigenen Kasten an, statt ihn
verschwinden zu lassen.

Jede Einheit führt ihre eigene Phasenliste. Du kannst also für das Dienstagstraining eine
andere Einteilung nutzen als für das Freitagstraining.

### Zeiten und Gesamtdauer

Je Phase kommen Bausteine hinein — entweder **aus dem Katalog** (131 ausgearbeitete Übungen
mit Ablauf, Coaching-Punkten und Varianten) oder als **eigener Baustein** mit freiem Titel,
etwa „Trinkpause" oder „Ansprache".

Die Dauer je Baustein tippst du direkt ein. Daraus ergibt sich alles Weitere:

- **Gesamtdauer** der Einheit, groß oben — die Summe aller Bausteine
- **Endzeit**, sobald der Termin eine Uhrzeit hat („Ende 19:00 Uhr")
- **Dauer je Phase** und ein Balken, der die Verteilung zeigt
- ein optionales **Ziel**: Trägst du eine Wunschdauer ein, warnt die App beim Überziehen
  und nennt sonst die verbleibende Zeit. Lässt du das Feld leer, rechnet sie einfach
  zusammen, was du geplant hast.

Über **Einheit teilen** bekommst du den fertigen Ablauf als Text für die Zwischenablage
oder WhatsApp — mit Zeiten je Phase und Gesamtdauer.

### Der Übungskatalog

Der Katalog enthält **131 Übungen** in neun Kategorien: Erwärmung & Kognition, Passspiel &
Ballkontrolle, Zweikampf/Dribbling & 1v1, Torschuss & Flügelspiel, Spielformen/Taktik &
Gegenpressing, Lauf- & Sprintspiele, Standardsituationen, Abschlüsse & Fun-Spiele sowie
Torwarttraining. Jede Übung nennt Material, Feldgröße, Spielerzahl, Ablauf, Coaching-Punkte
und Varianten; viele tragen zusätzlich Schlagworte wie „Sprint", „Rondo" oder „E-Jugend",
nach denen sich ebenfalls suchen lässt.

Die Übungen liegen in der Datei **`uebungen.json`** neben der App — nicht im Programmcode.
Das hat drei Gründe: Er wird erst geladen, wenn du ihn brauchst; er lässt sich erweitern,
ohne die App neu zu bauen; und Übungen sind Inhalt, kein Programm.

**Eigene Übungen ergänzen:** Die Datei bei GitHub öffnen, Stift-Symbol, einen Eintrag nach
demselben Muster anhängen, speichern. Jede Übung braucht mindestens:

```json
{
  "id": "eigen-01",
  "titel": "Name der Übung",
  "kategorie": "Passspiel & Ballkontrolle",
  "phase": "hauptteil",
  "dauerMin": 10,
  "dauerMax": 15,
  "spielerMin": 8,
  "spielerMax": 16,
  "feld": "20×20 m",
  "material": "8 Hütchen, 2 Bälle",
  "ablauf": "Beschreibung …",
  "coaching": ["Punkt 1", "Punkt 2"],
  "varianten": ["Steigerung 1"],
  "tags": ["Passen", "E-Jugend"]
}
```

`phase` ist einer von `aufwaermen`, `hauptteil`, `abschluss` — sie steuert nur, welche
Übungen bei der Auswahl oben stehen. Die `id` muss eindeutig sein; für eigene Einträge
bietet sich ein Präfix wie `eigen-` an, dann kollidiert nichts mit dem Katalog.

Ist die Datei fehlerhaft, meldet die App das beim Öffnen der Auswahl und du kannst weiter
eigene Bausteine anlegen. Kaputtgehen kann dabei nichts.

---

## Taktiktafel einbinden

Die Taktiktafel ist eine eigenständige App. Für die Einbindung wird eine **Kopie** in einem
Unterordner abgelegt — das Original-Repository bleibt unangetastet.

1. Lege im Kaderplaner-Repository einen Ordner **`taktik`** an.
2. Kopiere aus dem TacticBoard-Repository hinein: `index.html`, `sw.js`, `manifest.json`,
   `image.png`, `icon_fg.png`, `datenschutz.html` und den Ordner `libs/`, falls vorhanden.
3. Öffne die kopierte `taktik/index.html` und nimm drei Dinge heraus:
   - die Zeile `<script src="cordova.js"></script>` — die Datei gibt es hier nicht
   - die Zeile `<link rel="manifest" href="manifest.json">` — in einem Rahmen wirkungslos
   - die Cordova-Behandlung der Zurück-Taste, sonst streiten sich zwei Handler darum

**Wichtig: Die `sw.js` muss im Ordner `taktik/` bleiben.** Ein Service Worker beherrscht
sein Verzeichnis und alles darunter. Läge er neben `app.js`, würde er die Kaderplaner-
Dateien dauerhaft zwischenspeichern — deine Änderungen kämen dann bei niemandem mehr an,
und du würdest es nicht einmal merken, weil bei dir alles richtig aussieht.

Über den Knopf unten rechts im Rahmen lässt sich die Taktiktafel auf **Vollbild**
schalten — dann verschwinden Kopfzeile und Reiter, und das Spielfeld bekommt den
ganzen Schirm. Zurück geht es über das Kreuz oben rechts oder die Zurück-Taste.

Fehlt der Ordner, zeigt der Bereich einen Hinweis. Die App funktioniert ohne ihn
vollständig.

---

## Sicherung: was die App von selbst tut

Neben der Sicherung zum Herunterladen legt die App **einmal täglich und vor jedem
Einspielen** still eine Kopie auf dem Gerät ab. Die letzten fünf bleiben erhalten,
abrufbar unter *Optionen → Sicherung → „Zuletzt gesichert"*.

Das ist eine Bequemlichkeit, kein Ersatz: Die Kopien liegen im Gerätespeicher und sind
weg, sobald die App neu installiert wird. Die heruntergeladene Datei bleibt die
eigentliche Sicherung.

Beim Einspielen zeigt die App jetzt vorher, was in der Datei steht und was gerade da ist
— und warnt ausdrücklich, wenn die Sicherung weniger enthält als der aktuelle Stand.

---

## Termine im Kalender

*Optionen → Termine im Kalender → Kalenderdatei erzeugen.* Erzeugt eine `.ics`-Datei mit
allen Spieltagen und Trainings. Beim Öffnen bietet das Handy an, sie zu übernehmen.

Der Termin beginnt, wann man losmuss: Treffen am Sportplatz, sonst — bei Auswärtsspielen
— Treffen am Spielort, sonst Anstoß. Treffpunkt, Anstoßzeit und Spielart stehen in der
Beschreibung, der Spielort als Ort.

Bewusst eine Datei und kein Kalender-Abonnement: Ein Abo bräuchte eine öffentlich
erreichbare Adresse, in der die Namen der Kinder stehen. Nach neuen Spieltagen die Datei
einfach erneut erzeugen.

---

## Offline am Sportplatz

Die Web-Fassung legt sich beim ersten Aufruf im Browser ab und **startet danach auch ohne
Netz**. Eingaben bleiben auf dem Gerät und werden nachgereicht, sobald wieder Empfang da
ist. Die Android-App war ohnehin nie darauf angewiesen.

Oben rechts steht dann **„offline"** statt einer Uhrzeit — grau, nicht rot. Das ist ein
Unterschied mit Absicht: „offline" heißt kein Netz und ist am Sportplatz normal, „Fehler"
heißt, dass die Ablage nicht antwortet, obwohl Netz da ist.

**Eine veraltete App kann es dadurch nicht geben.** Solange Netz vorhanden ist, wird immer
die aktuelle Fassung geladen; die abgelegte Kopie dient nur als Rückfallebene. Bei
schlechtem Empfang wartet die App höchstens drei Sekunden und nimmt dann die Kopie — ein
schwaches Netz darf nicht schlimmer sein als gar keines.

Falls du trotzdem einmal den Verdacht hast, eine alte Fassung zu sehen: *Optionen → Offline
nutzen → Zwischenspeicher leeren und neu laden.* Deine Daten sind davon nicht betroffen.

---

## Getrennt von einer älteren Fassung

Diese Fassung speichert unter eigenen Schlüsseln (`u11-kaderplaner-v2-…`). Das ist kein
Selbstzweck, sondern behebt eine Falle:

Der Browser trennt gespeicherte Daten nach **Domain**, nicht nach Pfad. Zwei
GitHub-Pages-Projekte desselben Kontos —
`…github.io/alt/` und `…github.io/neu/` — teilen sich deshalb denselben Speicher. Ohne
eigene Schlüssel würde die neue Fassung Daten **und Adresse der Ablage** der alten erben.
Und die alte Fassung, einmal wieder geöffnet, würde die ihr unbekannten Felder — Ergebnis,
Torschützen, Notizen, Trainings — beim Einlesen wegschneiden und den beschnittenen Stand
zurückschreiben. Still, ohne Meldung, auch in die gemeinsame Ablage.

**Beim ersten Start** fragt die App einmal, ob sie den Stand der älteren Fassung übernehmen
soll, und nennt dabei die Zahlen. Die **Adresse der Ablage wird bewusst nicht mit
übernommen** — die trägst du einmal neu ein. So ist ausgeschlossen, dass alt und neu im
selben Datenbestand arbeiten.

Der alte Speicher wird dabei nur gelesen, nie verändert. Die alte Fassung bleibt also
funktionsfähig, falls du zurück willst.

**Empfehlung:** Stell im alten Repository *Settings → Pages → Source* auf **None**. Dann
kann die alte Adresse niemand mehr versehentlich öffnen — auch niemand mit einem alten
Lesezeichen. Löschen musst du das Repository dafür nicht.

---

## Umstieg auf diese Fassung

Die Reihenfolge ist wichtig, weil die alte Fassung die neuen Felder noch nicht kennt und
sie beim Abgleich wegräumen würde.

1. **Sicherung herunterladen** (Optionen → Sicherung). Zehn Sekunden, macht alles Weitere
   entspannt.
2. Die neuen Dateien bei GitHub hochladen.
3. **APK neu bauen lassen** und bei allen im Trainerteam installieren. Vorher die alte
   deinstallieren — die Debug-Signatur ändert sich bei jedem Bau.
4. Die alte APK aus dem WhatsApp-Verlauf löschen, damit sie niemand versehentlich wieder
   installiert.
5. Erst danach Ergebnisse und Torschützen eintragen.

Wer die App über den Startbildschirm aus dem Browser nutzt, muss nur einmal neu laden.

**Ab dieser Fassung sind Rückschritte folgenlos:** Felder, die eine Fassung nicht kennt,
reicht sie unverändert weiter, statt sie wegzuschneiden.
