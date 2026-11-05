<script>
	import MovieCard from '#lib/components/MovieCard.svelte';
	import { filterMovies } from '#lib/filter-movies.js';
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
	let movies = $derived(data.movies);

	// State is data that can change while this page is open.
	let search = $state('');
	let selectedGenre = $state('All films');
	let sortBy = $state('collection');
	let genres = $derived(['All films', ...new Set(movies.flatMap((movie) => movie.genre ? [movie.genre] : []))]);

	// Recalculate this list whenever search, genre, or sorting changes.
	let visibleMovies = $derived(
		filterMovies(movies, { search, genre: selectedGenre, sort: sortBy })
	);

	function resetFilters() {
		search = '';
		selectedGenre = 'All films';
		sortBy = 'collection';
	}
</script>

<svelte:head>
	<title>The movie collection — ScreenStack</title>
	<meta name="description" content="Browse the ScreenStack collection. Search by title, actor, or year and add your next watch." />
</svelte:head>

<section class="movies-heading">
	<p class="eyebrow">YOUR NEXT FILM NIGHT STARTS HERE</p>
	<div class="heading-line"><h1>The movie <em>collection.</em></h1><a class="btn btn-accent" href="/movies/create">+ Add a movie</a></div>
	<p>Pick a mood. Find a story. Press pause on everything else.</p>
</section>

<section class="collection-controls" aria-label="Find movies">
	<div class="search-sort row g-3">
		<div class="col-md-8 col-lg-9">
			<label class="visually-hidden" for="movie-search">Search by title, actor, genre, or year</label>
			<div class="search-field">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
				<input id="movie-search" class="form-control" type="search" placeholder="Search a title, actor, or year…" bind:value={search} />
			</div>
		</div>
		<div class="col-md-4 col-lg-3">
			<label class="visually-hidden" for="movie-sort">Sort movies</label>
			<select id="movie-sort" class="form-select" bind:value={sortBy}>
				<option value="collection">Collection order</option><option value="title">Title: A to Z</option><option value="newest">Newest first</option>
			</select>
		</div>
	</div>
	<div class="filter-line">
		<div class="genre-filters" role="group" aria-label="Filter by genre">
			{#each genres as genre}
				<button type="button" class="genre-button" class:selected={selectedGenre === genre} aria-pressed={selectedGenre === genre} onclick={() => (selectedGenre = genre)}>{genre}</button>
			{/each}
		</div>
		<p class="result-count" role="status">{visibleMovies.length} of {movies.length} films</p>
	</div>
</section>

<section aria-label="Movie collection">
	<div class="row g-4 movie-grid">
		{#each visibleMovies as movie (movie._id)}
			<div class="col-12 col-sm-6 col-lg-3"><MovieCard {movie} /></div>
		{:else}
			<div class="col-12"><div class="empty-state"><span class="empty-symbol" aria-hidden="true">⌕</span><h2>No films found</h2><p>Try another title or choose a different genre.</p><button type="button" class="btn btn-accent" onclick={resetFilters}>Reset filters</button></div></div>
		{/each}
	</div>
</section>

<p class="collection-footnote">An imagined collection. All film stories, casts, and poster illustrations are fictional examples.</p>
