<script lang="ts">
  import { ArrowLeft, Search, X } from "lucide-svelte";
  import BlogListItem from "$lib/components/BlogListItem.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  // Active state for search and tag filtering
  let searchQuery = $state("");
  let selectedTag = $state("All");

  // Extract unique tags and count their occurrences
  let tagCounts = $derived.by(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    
    data.posts.forEach(post => {
      total++;
      if (post.tags) {
        post.tags.forEach(tag => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });
    
    return { counts, total };
  });

  let uniqueTags = $derived(["All", ...Object.keys(tagCounts.counts).sort()]);

  // Filter posts based on search and selected tag
  let filteredPosts = $derived.by(() => {
    return data.posts.filter(post => {
      const matchesSearch = searchQuery.trim() === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = selectedTag === "All" || 
        (post.tags && post.tags.includes(selectedTag));
      
      return matchesSearch && matchesTag;
    });
  });
</script>

<svelte:head>
  <title>Blog — Febrian Bayu Nugroho</title>
  <meta
    name="description"
    content="Thoughts on software engineering, design, and building products."
  />
</svelte:head>

<div class="space-y-8 reveal">
  <!-- Back link -->
  <a
    href="/"
    class="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to home
  </a>

  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
    <p class="mt-2 text-muted leading-relaxed">
      Thoughts on software engineering, design, and building products.
    </p>
  </div>

  <!-- Search & Tag filters -->
  <div class="space-y-5 pt-2">
    <!-- Search input -->
    <div class="relative w-full">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
        <Search class="h-4.5 w-4.5" />
      </div>
      <input
        type="text"
        placeholder="Search articles by title or description..."
        bind:value={searchQuery}
        class="block w-full pl-10 pr-10 py-2.5 bg-secondary/30 hover:bg-secondary/50 focus:bg-secondary/40 border border-border focus:border-accent/40 rounded-xl text-sm placeholder:text-muted/60 focus:outline-none transition-all duration-200"
      />
      {#if searchQuery !== ""}
        <button
          onclick={() => searchQuery = ""}
          class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-fg transition-colors"
          aria-label="Clear search"
        >
          <X class="h-4.5 w-4.5" />
        </button>
      {/if}
    </div>

    <!-- Tag pills -->
    <div class="flex flex-wrap gap-2" role="tablist" aria-label="Filter blog posts by tag">
      {#each uniqueTags as tag}
        {@const count = tag === "All" ? tagCounts.total : tagCounts.counts[tag]}
        <button
          onclick={() => selectedTag = tag}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 cursor-pointer
            {selectedTag === tag 
              ? 'bg-accent/10 border-accent/25 text-accent dark:bg-accent/20 dark:border-accent/35' 
              : 'bg-secondary/20 hover:bg-secondary/50 border-border text-muted hover:text-fg'}"
          role="tab"
          aria-selected={selectedTag === tag}
        >
          {tag}
          <span class="text-[10px] opacity-75 font-normal">({count})</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Post list -->
  <div class="space-y-4 pt-2">
    {#if filteredPosts.length > 0}
      <div class="grid grid-cols-1 gap-4">
        {#each filteredPosts as post, i (post.slug)}
          <BlogListItem
            date={post.date}
            title={post.title}
            description={post.description}
            slug={post.slug}
            tags={post.tags}
            readingTime={post.readingTime}
            index={i}
          />
        {/each}
      </div>
    {:else}
      <div class="py-12 text-center space-y-3 border border-dashed border-border rounded-2xl bg-secondary/10">
        <p class="text-sm font-medium text-muted">No articles found</p>
        <p class="text-xs text-muted/65 max-w-sm mx-auto px-4">
          We couldn't find any articles matching your search or filters. Try adjusting your terms.
        </p>
        <button
          onclick={() => { searchQuery = ""; selectedTag = "All"; }}
          class="inline-flex items-center text-xs font-semibold text-accent hover:underline cursor-pointer"
        >
          Reset all filters
        </button>
      </div>
    {/if}
  </div>
</div>
