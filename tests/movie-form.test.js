import test from 'node:test';
import assert from 'node:assert/strict';
import { validateMovieForm } from '../src/lib/server/movie-form.js';

function form(values) {
	const data = new FormData();
	for (const [key, value] of Object.entries(values)) data.set(key, value);
	return data;
}

test('valid form trims the title and converts year and duration for MongoDB', () => {
	const result = validateMovieForm(form({ title: '  Barbie  ', year: '2023', length: '114', poster: '' }));
	assert.deepEqual(result.errors, {});
	assert.deepEqual(result.movie, { title: 'Barbie', year: 2023, length: '114 Minuten', poster: '' });
});

test('invalid fields are rejected on the server and submitted values are retained', () => {
	const result = validateMovieForm(form({ title: '  ', year: '2023.5', length: '-10', poster: 'javascript:alert(1)' }));
	assert.deepEqual(Object.keys(result.errors).sort(), ['length', 'poster', 'title', 'year']);
	assert.equal(result.values.year, '2023.5');
	assert.equal(result.values.length, '-10');
});

test('oversized titles and out-of-range numbers are rejected', () => {
	const result = validateMovieForm(form({ title: 'x'.repeat(201), year: '9999', length: '1441' }));
	assert.deepEqual(Object.keys(result.errors).sort(), ['length', 'title', 'year']);
});

test('an optional https poster URL is preserved', () => {
	const result = validateMovieForm(form({ title: 'Test', year: '2026', length: '90', poster: 'https://example.com/poster.jpg' }));
	assert.deepEqual(result.errors, {});
	assert.equal(result.movie.poster, 'https://example.com/poster.jpg');
});
