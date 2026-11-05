import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { filterMovies } from '../src/lib/filter-movies.js';

// Keep the original sample collection as a fixed test fixture, using MongoDB-style IDs.
const movies = JSON.parse(readFileSync(new URL('../src/lib/data/movies.json', import.meta.url), 'utf8'))
	.map(({ id, ...movie }) => ({ ...movie, _id: String(id), watchlist: false }));
const defaults = { search: '', genre: 'All films', sort: 'collection' };

test('default filters show all eight films in collection order', () => {
	assert.deepEqual(filterMovies(movies, defaults), movies);
});
test('search ignores case and surrounding spaces', () => {
	assert.deepEqual(filterMovies(movies, { ...defaults, search: '  STERNENWANDERER  ' }).map((m) => m._id), ['1']);
});
test('search includes actors, genres and years', () => {
	assert.equal(filterMovies(movies, { ...defaults, search: 'Mara Winter' })[0]._id, '1');
	assert.equal(filterMovies(movies, { ...defaults, search: 'Sci-Fi' }).length, 2);
	assert.equal(filterMovies(movies, { ...defaults, search: '2026' }).length, 2);
});
test('genre and search are applied together', () => {
	assert.deepEqual(filterMovies(movies, { ...defaults, genre: 'Drama', search: '2025' }).map((m) => m._id), ['8']);
});
test('no matching film returns an empty list', () => {
	assert.deepEqual(filterMovies(movies, { ...defaults, search: 'not-a-film-123' }), []);
});
test('newest first sorts years descending, retaining collection order for ties', () => {
	const result = filterMovies(movies, { ...defaults, sort: 'newest' });
	assert.deepEqual(result.map((m) => m._id), ['3', '7', '1', '5', '8', '2', '6', '4']);
});
test('alphabetical sorting leaves the source collection untouched', () => {
	const before = JSON.stringify(movies);
	const result = filterMovies(movies, { ...defaults, sort: 'title' });
	assert.equal(result[0].title, 'Als die Stadt schlief');
	assert.equal(JSON.stringify(movies), before);
});
test('each film has a unique ID and an existing local SVG poster', () => {
	assert.equal(new Set(movies.map((m) => m._id)).size, movies.length);
	for (const movie of movies) {
		assert.ok(movie.title && movie.genre && movie.year && movie.length && movie.actors.length);
		const source = readFileSync(new URL(`../static${movie.poster}`, import.meta.url), 'utf8');
		assert.ok(source.includes('<svg'));
	}
});

test('MongoDB films without genre, description or cast entries remain searchable and sortable', () => {
	const minimal = [
		{ _id: '6630e72c95e12055f661ff13', title: 'Altura', year: 2024, length: '120 Minuten', actors: [], poster: '', watchlist: false },
		{ _id: '6630e72c95e12055f661ff14', title: 'Neuer Film', year: 2026, length: '90 Minuten', actors: [], poster: '', watchlist: false }
	];
	assert.equal(filterMovies(minimal, { ...defaults, search: 'altura' })[0]._id, minimal[0]._id);
	assert.deepEqual(filterMovies(minimal, { ...defaults, sort: 'newest' }).map((movie) => movie.title), ['Neuer Film', 'Altura']);
});
