<script>
	import MoviePoster from '#lib/components/MoviePoster.svelte';
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<svelte:head>
	<title>ScreenStack — Your next great watch</title>
	<meta name="description" content="A small collection of imagined films and big adventures. Find your next great watch on ScreenStack." />
</svelte:head>

<section class="home-hero row align-items-center g-5">
	<div class="col-lg-6 hero-copy">
		<p class="eyebrow"><span class="status-dot"></span> FOR THE LOVE OF FILM</p>
		<h1>Your next<br />great <em>watch.</em></h1>
		<p class="hero-description">Distant worlds. Unexpected journeys. Stories that stay with you. Make a little room for your next film night.</p>
		<a class="btn btn-accent" href="/movies">Explore the movies <span aria-hidden="true">↗</span></a>
		<div class="hero-note"><span class="tiny-line" aria-hidden="true"></span> A small collection. A world of stories.</div>
	</div>
	<div class="col-lg-6">
		<div class="poster-stage" aria-label="Three films from the collection">
			<div class="stage-orbit" aria-hidden="true"></div>
			{#each data.featured as movie, i (movie._id)}
				<MoviePoster class={`stage-poster stage-poster-${i}`} src={movie.poster} title={movie.title} loading="eager" />
			{/each}
			<div class="stage-caption"><span class="status-dot"></span> Your next escape is one film away.</div>
		</div>
	</div>
</section>

<section class="collection-intro row g-4" aria-label="About the collection">
	<div class="col-md-5"><p class="eyebrow">THE COLLECTION</p><h2>A film for every<br />kind of evening.</h2></div>
	<div class="col-md-4 intro-text"><p>From quiet mountain towns to the edge of the universe. Browse the collection, find your mood, and settle in.</p><a class="text-link" href="/movies">Find your next story <span aria-hidden="true">→</span></a></div>
	<div class="col-md-3 collection-stat"><strong>{String(data.movieCount).padStart(2, '0')}</strong><span>films to discover</span></div>
</section>
