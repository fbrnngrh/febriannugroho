<script lang="ts">
  import { page } from "$app/state";
  import BackLink from "#lib/components/BackLink.svelte";

  const notFound = $derived(page.status === 404);
</script>

<svelte:head>
  <title>{notFound ? "Page not found" : "Something went wrong"} · Febrian Bayu Nugroho</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="page col-text">
  <BackLink href="/" label="Home" />
  <h1>{notFound ? "Page not found" : "Something went wrong"}</h1>
  <p class="body-text">
    {notFound ? "The page you're looking for isn't here." : "Try again in a moment, or head back home."}
  </p>
</div>

<style>
  .page { display: grid; gap: 12px; justify-items: start; padding-top: 160px; }
  h1 { margin: 8px 0 0; font-size: 32px; font-weight: 600; line-height: 1.2; letter-spacing: -0.02em; }
  p { margin: 0; color: var(--fg-muted); }
  @media (max-width: 767.98px) {
    .page { padding-top: 64px; }
    h1 { font-size: 28px; }
  }
</style>
