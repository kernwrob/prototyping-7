import { error } from '@sveltejs/kit';
import db from '#lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    return { movies: await db.getMovies() };
  } catch {
    error(503, 'Die Filme konnten nicht geladen werden. Bitte versuche es später erneut.');
  }
}
