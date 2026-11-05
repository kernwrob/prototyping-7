<script>
	import { enhance } from '$app/forms';
	/** @type {import('./$types').PageProps} */
	let { form } = $props();
	let saving = $state(false);
</script>

<svelte:head>
	<title>Add a movie — ScreenStack</title>
	<meta name="description" content="Add a film to the ScreenStack collection with a title, year, duration and optional poster URL." />
</svelte:head>

<section class="create-page">
	<a class="text-link back-link" href="/movies">← Back to movies</a>
	<div class="form-intro">
		<p class="eyebrow">MAKE ROOM FOR A NEW STORY</p>
		<h1>Add a <em>movie.</em></h1>
		<p class="detail-muted">A title, a year, a little time. Your next film starts here.</p>
	</div>
	<form class="movie-form" method="POST" use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			try { await update(); } finally { saving = false; }
		};
	}}>
		{#if form?.message}<p class="form-message" role="alert">{form.message}</p>{/if}
		<div class="mb-4">
			<label class="form-label" for="title">Film title <span aria-hidden="true">*</span></label>
			<input class="form-control" id="title" name="title" type="text" maxlength="200" required value={form?.values.title ?? ''} placeholder="e.g. Barbie" aria-invalid={!!form?.errors.title} aria-describedby={form?.errors.title ? 'title-error' : undefined} />
			{#if form?.errors.title}<p class="field-error" id="title-error">{form.errors.title}</p>{/if}
		</div>
		<div class="row g-4 mb-4">
			<div class="col-sm-6">
				<label class="form-label" for="year">Release year <span aria-hidden="true">*</span></label>
				<input class="form-control" id="year" name="year" type="number" min="1888" max="2100" step="1" required value={form?.values.year ?? ''} placeholder="e.g. 2023" aria-invalid={!!form?.errors.year} aria-describedby={form?.errors.year ? 'year-error' : undefined} />
				{#if form?.errors.year}<p class="field-error" id="year-error">{form.errors.year}</p>{/if}
			</div>
			<div class="col-sm-6">
				<label class="form-label" for="length">Duration in minutes <span aria-hidden="true">*</span></label>
				<input class="form-control" id="length" name="length" type="number" min="1" max="1440" step="1" required value={form?.values.length ?? ''} placeholder="e.g. 114" aria-invalid={!!form?.errors.length} aria-describedby={form?.errors.length ? 'length-error' : undefined} />
				{#if form?.errors.length}<p class="field-error" id="length-error">{form.errors.length}</p>{/if}
			</div>
		</div>
		<div class="mb-4">
			<label class="form-label" for="poster">Poster URL <span class="optional-label">optional</span></label>
			<input class="form-control" id="poster" name="poster" type="url" maxlength="2048" value={form?.values.poster ?? ''} placeholder="https://example.com/poster.jpg" aria-invalid={!!form?.errors.poster} aria-describedby={form?.errors.poster ? 'poster-help poster-error' : 'poster-help'} />
			<p class="form-help" id="poster-help">Leave this blank to use the default movie poster.</p>
			{#if form?.errors.poster}<p class="field-error" id="poster-error">{form.errors.poster}</p>{/if}
		</div>
		<div class="form-actions">
			<button class="btn btn-accent" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save movie'}</button>
			<a class="text-link" href="/movies">Cancel</a>
		</div>
	</form>
</section>
