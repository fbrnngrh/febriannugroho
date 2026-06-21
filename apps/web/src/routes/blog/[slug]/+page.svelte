<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const PostComponent = $derived(data.PostComponent);
</script>

<svelte:head>
  <title>{data.post.title} — Febrian Bayu Nugroho</title>
  <meta name="description" content={data.post.description} />
</svelte:head>

<article class="space-y-8">
  <!-- Back link -->
  <a
    href="/blog"
    class="inline-flex items-center gap-1 text-sm text-muted hover:text-fg transition-colors"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to blog
  </a>

  <!-- Title -->
  <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
    {data.post.title}
  </h1>

  <!-- Meta -->
  <div class="text-sm text-muted">
    {data.post.date} &bull; {data.post.readingTime}
  </div>

  <!-- Content -->
  <div class="prose-custom space-y-4 leading-relaxed">
    <PostComponent />
  </div>

  <!-- Footer -->
  <div class="border-t border-border pt-6">
    <a
      href="/blog"
      class="text-sm text-muted hover:text-fg transition-colors"
    >
      &larr; All posts
    </a>
  </div>
</article>

<style>
  .prose-custom :global(h2) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }

  .prose-custom :global(h3) {
    font-size: 1.125rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .prose-custom :global(p) {
    line-height: 1.75;
  }

  .prose-custom :global(ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
  }

  .prose-custom :global(li) {
    margin-top: 0.25rem;
  }

  .prose-custom :global(pre) {
    background: var(--color-secondary);
    border-radius: var(--radius-base);
    padding: 1rem;
    overflow-x: auto;
    font-size: 0.875rem;
  }

  .prose-custom :global(code) {
    font-size: 0.875rem;
    background: var(--color-secondary);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }

  .prose-custom :global(pre code) {
    background: transparent;
    padding: 0;
  }
</style>
