<script>
	import { page } from '$app/state';
</script>

<svelte:head><title>{page.status} — ScreenStack</title></svelte:head>

<section class="error-page">
	<p class="eyebrow">SCREENSTACK / {page.status}</p>
	<h1>{page.status === 404 ? 'Film nicht gefunden.' : 'Etwas ist schiefgelaufen.'}</h1>
	<p class="detail-muted" role="alert">{page.error?.message}</p>
	<a class="btn btn-accent" href="/movies">Zur Filmübersicht</a>
</section>
