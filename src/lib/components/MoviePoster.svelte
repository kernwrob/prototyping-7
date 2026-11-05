<script>
	/** @type {{ src: string, title: string, class?: string, loading?: 'eager' | 'lazy' }} */
	let { src, title, class: className = '', loading = 'lazy' } = $props();
</script>

<img
	class={className}
	src={src || '/images/placeholder.jpg'}
	alt={`Poster for ${title}`}
	width="480"
	height="720"
	{loading}
	onerror={(event) => {
		// Some demo records reference posters not supplied with the exercise.
		if (event.currentTarget instanceof HTMLImageElement && event.currentTarget.getAttribute('src') !== '/images/placeholder.jpg') {
			event.currentTarget.src = '/images/placeholder.jpg';
		}
	}}
/>
