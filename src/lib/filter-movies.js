/**
 * Select and sort movies without changing the original collection.
 * @param {import('./types.js').Movie[]} movies
 * @param {{ search: string, genre: string, sort: string }} options
 * @returns {import('./types.js').Movie[]}
 */
export function filterMovies(movies, { search, genre, sort }) {
	const query = search.trim().toLocaleLowerCase();
	const filtered = movies.filter((movie) => {
		const matchesGenre = genre === 'All films' || movie.genre === genre;
		const searchableText = `${movie.title} ${movie.genre ?? ''} ${movie.year} ${movie.actors.join(' ')}`;
		return matchesGenre && searchableText.toLocaleLowerCase().includes(query);
	});
	if (sort === 'title') return filtered.sort((a, b) => a.title.localeCompare(b.title));
	if (sort === 'newest') return filtered.sort((a, b) => b.year - a.year);
	return filtered;
}
