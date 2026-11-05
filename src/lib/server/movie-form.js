/** @typedef {{ title: string, year: string, length: string, poster: string }} MovieFormValues */

/** @param {FormData} formData */
export function validateMovieForm(formData) {
  /** @param {string} key */
  const text = (key) => {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
  };
  const values = { title: text('title'), year: text('year'), length: text('length'), poster: text('poster') };
  /** @type {Partial<Record<keyof MovieFormValues, string>>} */
  const errors = {};
  const year = Number(values.year);
  const minutes = Number(values.length);

  if (!values.title || values.title.length > 200) {
    errors.title = 'Bitte gib einen Filmtitel mit höchstens 200 Zeichen ein.';
  }
  if (!/^\d{4}$/.test(values.year) || year < 1888 || year > 2100) {
    errors.year = 'Bitte gib ein ganzzahliges Jahr zwischen 1888 und 2100 ein.';
  }
  if (!/^\d+$/.test(values.length) || !Number.isInteger(minutes) || minutes < 1 || minutes > 1440) {
    errors.length = 'Bitte gib eine Dauer zwischen 1 und 1440 ganzen Minuten ein.';
  }
  if (values.poster) {
    try {
      const url = new URL(values.poster);
      if (!['http:', 'https:'].includes(url.protocol) || values.poster.length > 2048) throw new Error();
    } catch {
      errors.poster = 'Bitte gib eine vollständige http://- oder https://-Bildadresse ein.';
    }
  }

  return {
    values,
    errors,
    movie: { title: values.title, year, length: `${minutes} Minuten`, poster: values.poster }
  };
}
