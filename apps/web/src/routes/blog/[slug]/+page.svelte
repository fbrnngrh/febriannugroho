<script lang="ts">
  import { mount, unmount, tick } from "svelte";
  import BackLink from "$lib/components/BackLink.svelte";
  import CopyCodeButton from "$lib/components/CopyCodeButton.svelte";
  import { inview } from "$lib/actions/inview";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const PostComponent = $derived(data.PostComponent);

  let scrollProgress = $state(0);
  function handleScroll() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      scrollProgress = (window.scrollY / totalHeight) * 100;
    }
  }

  $effect(() => {
    void PostComponent;

    let mounted: Array<ReturnType<typeof mount>> = [];
    let cancelled = false;

    tick().then(() => {
      if (cancelled) return;

      const preBlocks = document.querySelectorAll(".prose-custom pre");

      preBlocks.forEach((pre) => {
        if (pre.querySelector(".copy-btn")) return;

        const codeElement = pre.querySelector("code");
        const codeText = codeElement?.innerText || "";

        pre.classList.add("relative", "group");

        const instance = mount(CopyCodeButton, {
          target: pre,
          props: { code: codeText },
        });
        mounted.push(instance);
      });
    });

    return () => {
      cancelled = true;
      for (const instance of mounted) {
        unmount(instance);
      }
    };
  });
</script>

<svelte:window onscroll={handleScroll} />

<div class="fixed top-0 left-0 right-0 h-1 bg-secondary/50 z-50">
  <div
    class="h-full bg-accent transition-all duration-75 ease-out"
    style="width: {scrollProgress}%"
  ></div>
</div>

<svelte:head>
  <title>{data.post.title} — Febrian Bayu Nugroho</title>
  <meta name="description" content={data.post.description} />
</svelte:head>

<article class="space-y-8 reveal">
  <BackLink href="/blog" label="Back to blog" />

  {#if data.post.coverImage}
    <div class="overflow-hidden rounded-2xl border border-border/60 shadow-sm aspect-[2.2/1]">
      <img
        src={data.post.coverImage}
        alt={data.post.title}
        class="w-full h-full object-cover select-none"
      />
    </div>
  {/if}

  <div class="space-y-3">
    <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight">
      {data.post.title}
    </h1>

    <div class="flex flex-wrap items-center gap-2 text-sm text-muted pt-1">
      <time datetime={data.post.date}>{data.post.date}</time>
      <span class="text-neutral-300 dark:text-neutral-700 font-normal">&bull;</span>
      <span>{data.post.readingTime}</span>
      {#if data.post.tags && data.post.tags.length > 0}
        <span class="text-neutral-300 dark:text-neutral-700 font-normal">&bull;</span>
        <div class="flex flex-wrap gap-1.5">
          {#each data.post.tags as tag}
            <span
              class="inline-flex items-center px-2 py-0.5 rounded bg-secondary text-muted text-xs font-medium"
            >
              {tag}
            </span>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <hr class="border-border/60" />

  <div class="prose-custom prose-heading-hidden leading-relaxed scroll-reveal" use:inview>
    <PostComponent />
  </div>

  <div class="border-t border-border pt-6 mt-12 flex justify-between items-center">
    <BackLink href="/blog" label="All posts" />
  </div>
</article>

<style>
  .prose-custom :global(p) {
    font-size: 1.0625rem;
    line-height: 1.8;
    color: var(--color-fg);
    margin-bottom: 1.5rem;
    opacity: 0.95;
  }

  .prose-custom :global(h2) {
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: -0.015em;
    margin-top: 2.5rem;
    margin-bottom: 0.75rem;
    color: var(--color-fg);
  }

  .prose-custom :global(h3) {
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    color: var(--color-fg);
  }

  .prose-custom :global(ul) {
    list-style-type: none;
    padding-left: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .prose-custom :global(ul li) {
    position: relative;
    padding-left: 1rem;
    margin-top: 0.5rem;
    font-size: 1.0625rem;
    color: var(--color-fg);
  }

  .prose-custom :global(ul li::before) {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--color-accent);
    font-weight: bold;
  }

  .prose-custom :global(a) {
    color: var(--color-accent);
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .prose-custom :global(a:hover) {
    opacity: 0.8;
    text-decoration: underline;
  }

  .prose-custom :global(blockquote) {
    border-left: 3px solid var(--color-accent);
    padding: 0.5rem 0 0.5rem 1.25rem;
    margin: 1.75rem 0;
    font-style: italic;
    color: var(--color-muted);
  }

  .prose-custom :global(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.875rem;
    background: var(--color-secondary);
    padding: 0.15rem 0.35rem;
    border-radius: 0.375rem;
    border: 1px solid var(--color-border);
    color: var(--color-fg);
  }

  .prose-custom :global(pre) {
    background: var(--color-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
    padding: 1.25rem;
    margin: 1.75rem 0;
    overflow-x: auto;
    font-size: 0.875rem;
    line-height: 1.6;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .prose-custom :global(pre code) {
    background: transparent;
    border: none;
    padding: 0;
    color: inherit;
    font-size: inherit;
  }
</style>
