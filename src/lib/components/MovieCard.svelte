<script>
	import MoviePoster from './MoviePoster.svelte';
	/** @type {{ movie: import('#lib/types.js').Movie }} */
	let { movie } = $props();
</script>

<article class="movie-card card h-100">
	<div class="poster-wrap">
		<a href={`/movies/${movie._id}`} aria-label={`View ${movie.title}`}>
			<MoviePoster class="card-img-top movie-poster" src={movie.poster} title={movie.title} />
		</a>
	</div>
	<div class="card-body px-0">
		<div class="movie-meta"><span>{movie.genre || 'FILM'}</span><span>{movie.year} <span aria-hidden="true">·</span> {movie.length}</span></div>
		<h2 class="card-title"><a href={`/movies/${movie._id}`}>{movie.title}</a></h2>
		{#if movie.description}<p class="movie-description">{movie.description}</p>{/if}
	</div>
</article>
