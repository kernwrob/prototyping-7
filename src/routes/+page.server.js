import { error } from '@sveltejs/kit';
import db from '#lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    const movies = await db.getMovies();
    return { featured: movies.slice(0, 3), movieCount: movies.length };
  } catch {
    error(503, 'Die Filme konnten nicht geladen werden. Bitte versuche es später erneut.');
  }
}
