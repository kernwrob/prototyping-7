# ScreenStack – Movie Watchlist, Teil 2

SvelteKit-Projekt zur Übung 6. Die Anwendung liest und speichert Filme in
MongoDB Atlas, Datenbank `ScreenStackDB`, Collection `movies`.

## Starten

PowerShell im Projektordner öffnen:

```powershell
npm.cmd ci
```

Falls `.env` fehlt, `.env.example` als `.env` kopieren. Den eigenen MongoDB
Connection String bei `DB_URI` eintragen. Die Platzhalter durch die Zugangsdaten
eines Datenbankusers ersetzen. Sonderzeichen im Passwort müssen URL-kodiert sein.
MongoDB Atlas muss Verbindungen von der eigenen IP erlauben.

```powershell
npm.cmd run dev
```

Die im Terminal angezeigte Local-Adresse öffnen. Falls Port 5173 bereits belegt
ist, verwendet Vite einen anderen Port. Den Server mit Strg+C beenden.
Die Endung `.cmd` umgeht die PowerShell-Ausführungsrichtlinie für `npm.ps1`.

## Funktionen

- `/`: Startseite mit Filmen und Anzahl aus MongoDB.
- `/movies`: alle Filme laden, suchen, sortieren und Detailseiten öffnen (e).
- `/movies/[id]`: Film anhand der MongoDB-ID laden, inklusive Darsteller (f).
- `/movies/create`: Titel, Jahr, Dauer und optionale Poster-URL speichern (g).
- Detailseite: Film nach Bestätigung löschen, danach zurück zur Übersicht (h).
- Bei ungültigen IDs erscheint 404; bei Datenbankproblemen eine Fehlermeldung.
- Ohne Poster-URL wird `static/images/placeholder.jpg` verwendet.
- Auch bei fehlenden oder nicht erreichbaren Posterbildern zeigt der Browser das
  Platzhalterbild. Einige Bilddateien der importierten Beispieldaten fehlen im
  bereitgestellten Material; diese werden nicht zusätzlich vorausgesetzt.
- Fehlen Genre und Beschreibung in MongoDB, blendet die Oberfläche sie aus.
  Vorhandene Genre-Daten bleiben durchsuchbar und filterbar.

Die Anwendungsseiten verwenden die MongoDB. `src/lib/data/movies.json` bleibt als
feste Testdatenquelle aus Übung 5 erhalten und wird von keiner Seite importiert.

## Erklärung

[WALKTHROUGH.md](WALKTHROUGH.md) erklärt die Umsetzung von e bis h mit den
wichtigen Dateien und Codebeispielen.

## Prüfen

```powershell
npm.cmd test
npm.cmd run check
npm.cmd run build
```

Ein zusätzlicher Integrationstest prüft die laufende Anwendung und MongoDB:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 5176 --strictPort
```

In einem zweiten Terminal:

```powershell
node --env-file=.env scripts/smoke-test.mjs
```

Bei einem anderen Port die Basisadresse als Argument anhängen. Der Test legt
zwei eindeutig benannte Filme an, prüft Speichern, Anzeigen und Löschen und
entfernt nur seine eigenen Testeinträge. Er verwendet die Datenbank aus `.env`.
Die Browserbedienung und das mobile Layout wurden nicht automatisiert visuell
geprüft, weil die verfügbare Browsersteuerung den Zugriff beendet hat.

## Deployment auf Netlify (Übung 7)

Das Projekt verwendet `@sveltejs/adapter-netlify`. Der Adapter läuft mit
Node.js (`edge: false`), damit der MongoDB-Treiber verwendet werden kann.
`netlify.toml` legt Node.js 24, `npm run build` und den Ausgabeordner `build` fest.

1. Das Projekt als GitHub-Repository veröffentlichen. `.env`, `node_modules`,
   `.svelte-kit`, `.netlify`, `build` und `output` sind durch `.gitignore`
   ausgeschlossen. Nur `.env.example` enthält Platzhalter und wird versioniert.
2. Bei Netlify anmelden und das GitHub-Repository über **Add new project /
   Import an existing project** auswählen. Liegt dieses Projekt im Stamm des
   Repositorys, bleibt **Base directory** leer.
3. Vor dem ersten Deployment die Umgebungsvariable `DB_URI` mit dem Wert aus
   der lokalen `.env` eintragen. Sie muss für die Server-Funktionen verfügbar
   sein; bei auswählbaren Scopes **Builds** und **Functions** setzen. Die URI
   niemals in GitHub-Dateien, Screenshots oder Chat-Nachrichten kopieren.
4. Prüfen, ob MongoDB Atlas Verbindungen aus der Netlify-Laufzeit erlaubt.
   Eine Freigabe nur für die eigene lokale IP reicht dafür nicht aus.
5. Deployment starten. Nach erfolgreichem Build die veröffentlichte Adresse
   öffnen und Startseite, Filmliste sowie eine Film-Detailseite prüfen.

Netlify baut nach weiteren Pushes auf den Produktionsbranch automatisch neu.
Die Anwendung erlaubt Besuchern das Anlegen und Löschen von Filmen; für die
veröffentlichte Übung eine dafür vorgesehene Übungsdatenbank verwenden.

## Beispieldaten und Abgabe

Die ursprünglichen MongoDB-Demodaten liegen unter `data/mongodb-movies.json`.
Bei einer neuen Datenbank diese einmalig mit Compass in `ScreenStackDB.movies`
importieren. Nicht erneut importieren, wenn diese IDs bereits existieren.

ZIP erstellen:

```powershell
python scripts/package-submission.py
```

Ergebnis: `output/movie-watchlist-ue6.zip`. Es enthält Quellcode, Bilder, Tests,
Dokumentation und `.env.example`. `node_modules`, `.svelte-kit` und die lokale
`.env` mit Zugangsdaten sind ausgeschlossen. Nach dem Entpacken muss die Person,
die das Projekt startet, eine eigene `.env` einrichten und `npm.cmd ci` ausführen.
Das ZIP selbst auf Moodle hochladen.
