<script>
	import { enhance } from '$app/forms';
	import MoviePoster from '#lib/components/MoviePoster.svelte';
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
	let movie = $derived(data.movie);
	let deleting = $state(false);
</script>

<svelte:head>
	<title>{movie.title} — ScreenStack</title>
	<meta name="description" content={`${movie.title}, ${movie.year}, ${movie.length}. View the cast and film information on ScreenStack.`} />
</svelte:head>

<section class="detail-page">
	<a class="text-link back-link" href="/movies">← Back to movies</a>
	<div class="row g-5 align-items-start">
		<div class="col-md-5 col-lg-4">
			<MoviePoster class="detail-poster" src={movie.poster} title={movie.title} loading="eager" />
		</div>
		<div class="col-md-7 col-lg-8 detail-copy">
			<p class="eyebrow">THE COLLECTION / FILM DETAILS</p>
			<h1>{movie.title}</h1>
			<p class="detail-subtitle">{movie.year} <span aria-hidden="true">·</span> {movie.length}</p>
			{#if movie.description}<p class="detail-description">{movie.description}</p>{/if}
			<dl class="film-facts">
				<div><dt>Year</dt><dd>{movie.year}</dd></div>
				<div><dt>Duration</dt><dd>{movie.length}</dd></div>
				{#if movie.genre}<div><dt>Genre</dt><dd>{movie.genre}</dd></div>{/if}
				<div><dt>Cast</dt><dd>{movie.actors.length ? movie.actors.join(', ') : 'No cast information yet.'}</dd></div>
			</dl>
			<div class="delete-section">
				{#if form?.message}<p class="form-message" role="alert">{form.message}</p>{/if}
				<form
					method="POST"
					action="?/delete"
					use:enhance={({ cancel }) => {
						if (!window.confirm(`Delete “${movie.title}” from the collection?`)) {
							cancel();
							return;
						}
						deleting = true;
						return async ({ update }) => {
							try { await update(); } finally { deleting = false; }
						};
					}}
				>
					<button class="btn btn-delete" type="submit" disabled={deleting}>{deleting ? 'Deleting…' : 'Delete movie'}</button>
				</form>
			</div>
		</div>
	</div>
</section>
