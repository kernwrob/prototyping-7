import { fail, redirect } from '@sveltejs/kit';
import db from '#lib/db.js';
import { validateMovieForm } from '#lib/server/movie-form.js';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const { values, errors, movie } = validateMovieForm(await request.formData());
    if (Object.keys(errors).length) return fail(400, { values, errors, message: null });

    let id;
    try {
      id = await db.createMovie(movie);
    } catch {
      return fail(503, { values, errors, message: 'Der Film konnte nicht gespeichert werden. Bitte versuche es erneut.' });
    }
    redirect(303, `/movies/${id}`);
  }
};
