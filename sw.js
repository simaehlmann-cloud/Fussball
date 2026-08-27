/* U11 Kaderplaner · Service Worker
 *
 * Zweck: Die App soll am Sportplatz auch ohne Netz starten.
 *
 * ------------------------------------------------------------------
 * Die wichtigste Entscheidung: NETZWERK ZUERST, Zwischenspeicher nur
 * als Rückfallebene.
 *
 * Der naheliegende Weg wäre "Zwischenspeicher zuerst" — schneller, aber
 * gefährlich: Eine neue app.js auf GitHub käme dann bei niemandem mehr an,
 * bis hier die Versionsnummer erhöht wird. Und man merkt es nicht einmal,
 * weil im eigenen frisch geladenen Browser alles richtig aussieht. Genau
 * diese Falle ist der Grund, warum die Taktiktafel in einem eigenen
 * Unterordner liegt.
 *
 * Ein Zeitlimit von drei Sekunden federt schlechtes Netz ab — aber nur,
 * WENN etwas im Zwischenspeicher liegt. Sonst wird weiter aufs Netz
 * gewartet: Beim allerersten Besuch über eine zähe Mobilfunkverbindung
 * wäre ein Abbruch nach drei Sekunden das Schlimmste, was passieren kann.
 * ------------------------------------------------------------------
 */

const CACHE = 'u11-kaderplaner-v1';
const NETZ_ZEITLIMIT_MS = 3000;

/* Beim Installieren vorgeladen, damit der erste Start ohne Netz gelingt.
 * Fehlt eine Datei, bricht die Installation NICHT ab — sonst würde ein
 * einzelner Tippfehler die ganze Offlinefähigkeit verhindern. */
const SHELL = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.webmanifest',
  './uebungen.json',
  './wappen.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(SHELL.map((url) => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((namen) =>
        Promise.all(namen.map((name) => (name !== CACHE ? caches.delete(name) : null))),
      )
      .then(() => self.clients.claim()),
  );
});

/** Antwort ablegen — nur vollständige, eigene Antworten. */
function ablegen(request, response) {
  if (!response || !response.ok || response.type === 'opaque') return response;
  const kopie = response.clone();
  caches
    .open(CACHE)
    .then((cache) => cache.put(request, kopie))
    .catch(() => {});
  return response;
}

/**
 * Netzwerk zuerst.
 *
 * Der Zwischenspeicher springt in zwei Fällen ein: wenn das Netz einen
 * Fehler liefert, oder wenn es nach drei Sekunden noch nichts geliefert
 * hat UND etwas Passendes gespeichert ist. Ohne gespeicherte Fassung
 * wird weiter gewartet, statt aufzugeben.
 */
function netzZuerst(request) {
  return new Promise((fertig) => {
    let entschieden = false;
    const liefern = (antwort) => {
      if (entschieden) return;
      entschieden = true;
      fertig(antwort);
    };

    const uhr = setTimeout(() => {
      if (entschieden) return;
      caches.match(request).then((treffer) => {
        // Nur übernehmen, wenn wirklich etwas da ist.
        if (treffer) liefern(treffer);
      });
    }, NETZ_ZEITLIMIT_MS);

    fetch(request)
      .then((antwort) => {
        clearTimeout(uhr);
        /*
         * Eine Fehlerantwort ist kein Grund, eine funktionierende
         * gespeicherte Fassung zu verwerfen. Genau dieser Fall tritt in
         * öffentlichen WLANs auf, in denen eine Anmeldeseite mit 4xx
         * antwortet, statt die Datei zu liefern.
         */
        if (!antwort || !antwort.ok) {
          if (entschieden) return;
          caches.match(request).then((treffer) => {
            if (treffer) liefern(treffer);
            else liefern(antwort);
          });
          return;
        }
        // ablegen() legt selbst eine Kopie an - kein zweites clone() nötig,
        // sonst bleibt ein ungelesener Antwortkörper zurück.
        ablegen(request, antwort);
        liefern(antwort);
      })
      .catch(() => {
        clearTimeout(uhr);
        if (entschieden) return;
        caches.match(request).then((treffer) => {
          if (treffer) return liefern(treffer);
          if (request.mode === 'navigate') {
            return caches
              .match('./index.html')
              .then((seite) => caches.match('./').then((wurzel) => liefern(seite || wurzel ||
                new Response('Offline und noch nichts gespeichert.', {
                  status: 503,
                  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
                }))));
          }
          return liefern(new Response('', { status: 503, statusText: 'Offline' }));
        });
      });
  });
}

/**
 * Zwischenspeicher zuerst — nur für Bilder und Schriften.
 *
 * Die ändern sich praktisch nie und sollen offline sofort da sein. Im
 * Hintergrund wird trotzdem aufgefrischt, damit ein ausgetauschtes Wappen
 * spätestens beim übernächsten Start ankommt.
 */
function cacheZuerst(request) {
  return caches.match(request).then((treffer) => {
    if (treffer) {
      // Im Hintergrund auffrischen. Das Ergebnis interessiert hier
      // niemanden mehr - ausgeliefert wurde bereits die gespeicherte Fassung.
      fetch(request)
        .then((antwort) => {
          ablegen(request, antwort);
        })
        .catch(() => {});
      return treffer;
    }
    return fetch(request)
      .then((antwort) => ablegen(request, antwort))
      .catch(() => new Response('', { status: 503, statusText: 'Offline' }));
  });
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Nur eigene Dateien. Die gemeinsame Ablage (Firebase, jsonblob) darf
  // NIEMALS zwischengespeichert werden — dort geht es um aktuelle Daten,
  // und eine alte Antwort wäre schlimmer als gar keine.
  if (url.origin !== self.location.origin) return;

  // Die Taktiktafel bringt ihren eigenen Service Worker mit und verwaltet
  // ihren Ordner selbst. Hier nicht hineinregieren.
  if (url.pathname.includes('/taktik/')) return;

  // Wird erst beim Bau der Android-App erzeugt; im Web fehlt sie und soll
  // keine Fehlantwort im Zwischenspeicher hinterlassen.
  if (url.pathname.endsWith('/config.js')) return;

  const istBild = /\.(png|jpe?g|gif|webp|svg|ico|woff2?)$/i.test(url.pathname);
  event.respondWith(istBild ? cacheZuerst(request) : netzZuerst(request));
});

self.addEventListener('message', (event) => {
  // Wartende Fassung sofort übernehmen (nach "Jetzt neu laden").
  if (event.data === 'sofort-uebernehmen') self.skipWaiting();

  // Zwischenspeicher leeren — falls doch einmal der Verdacht aufkommt,
  // eine alte Fassung zu sehen.
  if (event.data === 'zwischenspeicher-leeren') {
    caches.delete(CACHE).then(() => {
      if (event.source && event.source.postMessage) {
        event.source.postMessage('zwischenspeicher-geleert');
      }
    });
  }
});
