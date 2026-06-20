<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  import BlogListItem from "$lib/components/BlogListItem.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Blog — Febrian Bayu Nugroho</title>
  <meta
    name="description"
    content="Thoughts on software engineering, design, and building products."
  />
</svelte:head>

<div class="space-y-8">
  <!-- Back link -->
  <a
    href="/"
    class="inline-flex items-center gap-1 text-sm text-muted hover:text-fg transition-colors"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to home
  </a>

  <!-- Header -->
  <div>
    <h1 class="text-3xl font-semibold tracking-tight">Blog</h1>
    <p class="mt-2 text-muted">
      Thoughts on software engineering, design, and building products.
    </p>
  </div>

  <!-- Post list -->
  <div class="space-y-1">
    {#each data.posts as post, i (post.slug)}
      <BlogListItem
        date={post.date}
        title={post.title}
        description={post.description}
        slug={post.slug}
        index={i}
      />
    {/each}
  </div>
</div>
