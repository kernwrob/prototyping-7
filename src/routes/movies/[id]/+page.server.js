import { error, fail, redirect } from '@sveltejs/kit';
import db from '#lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  let movie;
  try {
    movie = await db.getMovie(params.id);
  } catch {
    error(503, 'Der Film konnte nicht geladen werden. Bitte versuche es später erneut.');
  }
  if (!movie) error(404, 'Dieser Film existiert nicht.');
  return { movie };
}

/** @type {import('./$types').Actions} */
export const actions = {
  delete: async ({ params }) => {
    let deletedId;
    try {
      deletedId = await db.deleteMovie(params.id);
    } catch {
      return fail(503, { message: 'Der Film konnte nicht gelöscht werden. Bitte versuche es erneut.' });
    }
    if (!deletedId) return fail(404, { message: 'Dieser Film existiert nicht mehr.' });
    redirect(303, '/movies');
  }
};
