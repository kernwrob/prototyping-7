# So funktioniert Übung 6

Das Projekt aus Übung 5 liefert die Oberfläche. Für Teil 2 haben wir die
Datenquelle auf MongoDB umgestellt und Detailseiten sowie Formulare ergänzt.
Die Zugangsdaten bleiben in der lokalen `.env`. Sie werden über `src/env.js`
als private Umgebungsvariable `DB_URI` deklariert.

## Die drei Aufgaben der Dateien

| Datei | Aufgabe |
| --- | --- |
| `src/lib/db.js` | Verbindung zur Datenbank sowie Lesen, Anlegen und Löschen |
| `+page.server.js` | Daten für eine Seite laden und Formularanfragen bearbeiten |
| `+page.svelte` | Daten anzeigen, Links und Formulare darstellen |

Der Namensbestandteil `.server` ist entscheidend: Datenbankzugriffe laufen auf
dem Server. Eine Svelte-Komponente importiert `db.js` deshalb nicht.

Dieses Projekt verwendet SvelteKit 3. Deshalb steht in `db.js` der Import
`import { DB_URI } from '$app/env/private'`. Die bereitgestellte Vorlage verwendete
noch den älteren Import `$env/static/private`. Die Funktion ist dieselbe: Nur der
Server liest den Connection String aus der Umgebung.

## e) Filme aus MongoDB laden

Die Datei `src/routes/movies/+page.server.js` exportiert eine `load`-Funktion.
SvelteKit ruft sie automatisch auf, wenn die Seite ihre Daten benötigt:

```js
import db from '#lib/db.js';

export async function load() {
  return { movies: await db.getMovies() };
}
```

Im tatsächlichen Projekt fängt ein `try/catch` zusätzlich Datenbankfehler ab und
gibt dann eine verständliche 503-Fehlermeldung zurück.

`db.getMovies()` öffnet die Collection `ScreenStackDB.movies`, sucht mit
`find({})` alle Dokumente und verwandelt den Cursor mit `toArray()` in eine Liste.
`await` wartet auf diese Daten. Die Funktion `serializeMovie()` wandelt MongoDBs
`ObjectId` in eine Zeichenkette um und ergänzt fehlende optionale Felder.

Das zurückgegebene Objekt erhält `+page.svelte` als `data`:

```svelte
<script>
  let { data } = $props();
  let movies = $derived(data.movies);
</script>
```

Die bestehende Suche und Sortierung arbeiten nun mit dieser Liste. `$derived`
berechnet den Wert erneut, wenn sich die Seitendaten ändern. Die Filmschleife
verwendet `movie._id` als eindeutigen Schlüssel. Die alte Datenquelle hatte
stattdessen eine numerische `id`.

Ablauf: Browser öffnet `/movies` → `load()` → `db.getMovies()` → MongoDB →
`return { movies }` → `data.movies` → Filmkarten.

Auch die Startseite lädt ihre Vorschau und die Filmzahl aus MongoDB. Damit gibt
es keine widersprüchliche zweite Filmliste auf der Startseite.

## f) Eine Detailseite pro Film

Dafür gibt es einen Ordner `src/routes/movies/[id]`. Die eckigen Klammern machen
`id` zu einem variablen Teil der URL. Bei `/movies/6630e72c95e12055f661ff13`
enthält `params.id` genau diese Zeichenkette.

Die `load`-Funktion in diesem Ordner verwendet:

```js
const movie = await db.getMovie(params.id);
```

In `db.js` wird die Zeichenkette für die Abfrage in `new ObjectId(id)` umgewandelt.
`findOne()` sucht das Dokument mit dieser `_id`. Für die Übergabe an die Seite
wird die ID wieder in einen String umgewandelt.

Ein ungültiger oder unbekannter Wert führt zu einer 404-Seite. Ein Fehler beim
Datenbankzugriff wird als 503 angezeigt. Ein Datenbankfehler ist dadurch von einer
leeren Liste oder einem nicht vorhandenen Film unterscheidbar.

Die Filmkarte verlinkt Titel und Poster mit:

```svelte
<a href={`/movies/${movie._id}`}>{movie.title}</a>
```

Die Detailseite zeigt Titel, Jahr, Dauer und die vorhandenen Darsteller. Genre
und Beschreibung erscheinen nur, wenn die Datenbank entsprechende Werte enthält.

## g) Einen Film erfassen

Die feste Route `src/routes/movies/create` zeigt das Formular. SvelteKit erkennt
diese feste Route vor der variablen Route `[id]`: `create` wird also nicht als
Film-ID interpretiert.

Das Formular verwendet `method="POST"`. Seine Eingabefelder haben die Namen
`title`, `year`, `length` und `poster`. Beim Absenden erreichen diese Werte die
`default`-Action in `create/+page.server.js`:

```js
const formData = await request.formData();
```

`src/lib/server/movie-form.js` prüft die Werte. Der Titel darf nicht leer sein;
Jahr und Dauer müssen ganze Zahlen im angegebenen Bereich sein. Eine optionale
Bildadresse muss mit `http://` oder `https://` beginnen. Der Server prüft selbst,
weil man die HTML-Eingabeprüfung im Browser umgehen kann.

Formulare senden Texte. Deshalb wird z. B. `"2023"` in die Zahl `2023` und die
Dauer `"114"` in den Datenbankwert `"114 Minuten"` umgewandelt. Bei einem Fehler
liefert `fail(400, ...)` die Fehlermeldungen und die eingegebenen Werte zurück.
Die Person kann die Eingaben korrigieren, ohne alles neu einzutippen.

Bei gültigen Angaben ruft die Action `db.createMovie(movie)` auf. Diese Funktion
verwendet `insertOne()` und ergänzt `actors: []` sowie `watchlist: false`. Fehlt
die Bildadresse, wird `/images/placeholder.jpg` gespeichert. Die Datei liegt
unter `static/images/placeholder.jpg`: SvelteKit stellt den Inhalt von `static`
direkt unter der Website-Adresse bereit.

Die ursprüngliche `createMovie()`-Vorlage überschrieb jede Posteradresse mit dem
Platzhalter. Wir haben sie so angepasst, dass eine eingegebene Bild-URL erhalten
bleibt. `MoviePoster.svelte` fängt zusätzlich Fehler beim Laden eines Bildes ab.

MongoDB erzeugt beim Einfügen automatisch eine neue `_id`. Nach dem Speichern
leitet die Action mit `redirect(303, '/movies/' + id)` auf die neue Detailseite
weiter. So sieht man sofort, dass der Film erfolgreich gespeichert wurde.

`use:enhance` verbessert das Formular bei aktiviertem JavaScript: Der Speichern-
Button zeigt den laufenden Vorgang, und SvelteKit verarbeitet die Serverantwort.
Auch ohne JavaScript funktioniert das normale HTML-POST-Formular.

## h) Einen Film löschen (optionaler Teil)

Die Detailseite enthält ein zweites POST-Formular mit `action="?/delete"`.
Damit wird die benannte Action `delete` in der zugehörigen `+page.server.js`
aufgerufen. Bei aktiviertem JavaScript fragt die Oberfläche vor dem Absenden nach.

Die Action verwendet die ID aus der aktuellen URL:

```js
await db.deleteMovie(params.id);
redirect(303, '/movies');
```

`deleteMovie()` verwendet `deleteOne({ _id: new ObjectId(id) })`. Die vollständige
Action kontrolliert auch, ob der Film existierte und ob die Datenbank erreichbar
war. Die Weiterleitung steht nach dem `try/catch`, damit die von SvelteKit intern
verwendete Redirect-Ausnahme nicht als Datenbankfehler behandelt wird.

Die Zahl 303 bedeutet: Nach der POST-Anfrage die Zielseite per GET laden. Bei
einem anschließenden Neuladen wird dadurch nicht nochmals dasselbe Formular
abgesendet. Nach dem Löschen fragt die Übersicht ihre aktuelle Liste erneut ab.

## Was geprüft wurde

- Unit-Tests: Suche, Sortierung, MongoDB-Daten ohne Genre sowie gültige und
  ungültige Formulareingaben.
- `npm.cmd run check`: Svelte- und JavaScript-Typprüfung.
- `npm.cmd run build`: Produktionsbuild einschließlich Server- und Clientcode.
- HTTP-/Datenbanktest: Startseite, Übersicht, Detailseite, Formular, 404-Fälle,
  serverseitige Validierung sowie zwei vollständige Anlegen-/Löschen-Abläufe.
- Direkte Datenbankkontrolle: richtige Datentypen, leere Darstellerliste,
  `watchlist: false`, Standardposter und eigene Poster-URL.
- Die Testfilme werden anschließend entfernt; bestehende Filme bleiben erhalten.

Eine automatisierte Sichtprüfung im Browser war nicht möglich: Die verfügbare
Browsersteuerung hat den Zugriff beendet, weil sie die aktuelle Browseradresse
nicht sicher ermitteln konnte. Die Tests oben prüfen die Serverabläufe; sie
ersetzen keine manuelle Kontrolle der Darstellung und Browserinteraktionen.

## Was zur Abgabe gehört

`python scripts/package-submission.py` erzeugt das ZIP unter `output/`.
Quellcode, Bilder, Dokumentation, Tests und die Zugangsdaten-Vorlage sind enthalten.
Die echte `.env`, `node_modules` und generierte Build-Dateien werden ausgeschlossen.
Nach dem Entpacken eine eigene `.env` anlegen und `npm.cmd ci` ausführen.

Die Watchlist-Eigenschaft bleibt im Datenmodell erhalten. Das Bearbeiten eines
Films und das Umschalten der Watchlist gehören zum Ausblick der nächsten Übung.

## Offizielle Dokumentation

- [SvelteKit: Daten laden](https://svelte.dev/docs/kit/load)
- [SvelteKit: Routing und Pfadparameter](https://svelte.dev/docs/kit/routing)
- [SvelteKit: Form Actions, Validierung und Weiterleitungen](https://svelte.dev/docs/kit/form-actions)
- [MongoDB: CRUD-Operationen](https://www.mongodb.com/docs/drivers/node/current/crud/)
