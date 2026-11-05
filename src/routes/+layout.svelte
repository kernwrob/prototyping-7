<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import '../app.css';
	import { page } from '$app/state';

	/** @type {{ children: import('svelte').Snippet }} */
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>
<header class="site-header">
	<nav class="navbar container shell" aria-label="Main navigation">
		<a class="navbar-brand brand" href="/" aria-label="ScreenStack home">
			<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
			ScreenStack<span class="brand-dot">.</span>
		</a>
		<div class="nav-links">
			<a class:active={page.url.pathname === '/'} href="/" aria-current={page.url.pathname === '/' ? 'page' : undefined}>Home</a>
			<a class:active={page.url.pathname.startsWith('/movies')} href="/movies" aria-current={page.url.pathname === '/movies' ? 'page' : undefined}>Movies</a>
		</div>
	</nav>
</header>

<main id="main-content" class="container shell">
	{@render children()}
</main>

<footer class="site-footer container shell">
	<p>Good stories deserve a spot on your list.</p>
	<span>ScreenStack <span aria-hidden="true">/</span> A little cinema, anywhere.</span>
</footer>
