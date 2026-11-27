<script lang="ts">
  import { mount, tick, unmount } from "svelte";
  import { inview } from "#lib/actions/inview.ts";
  import ArrowLink from "#lib/components/ArrowLink.svelte";
  import BackLink from "#lib/components/BackLink.svelte";
  import CopyButton from "#lib/components/CopyButton.svelte";
  import Icon from "#lib/components/Icon.svelte";
  import WorkCover from "#lib/components/work/WorkCover.svelte";
  import { allPosts, formatDate, postHref } from "#lib/content/posts.ts";
  import { DECISIONS, PROJECTS } from "#lib/content/site.ts";
  import type { PageProps } from "./$types";

  // Article (Figma 67:2438): sticky "On this page" on desktop, Copy on code blocks.
  let { data }: PageProps = $props();
  const PostComponent = $derived(data.PostComponent);
  const post = $derived(data.post);
  const ciProject = PROJECTS.find((p) => p.id === "ci-cd")!;

  const next = $derived.by(() => {
    const list = allPosts();
    const i = list.findIndex((p) => p.slug === post.slug);
    return i > 0 ? list[i - 1] : list[i + 1];
  });

  let prose = $state<HTMLElement>();
  let toc = $state<{ id: string; text: string }[]>([]);
  let activeId = $state("");

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  $effect(() => {
    void PostComponent;
    let mounted: ReturnType<typeof mount>[] = [];
    let io: IntersectionObserver | undefined;
    let cancelled = false;

    tick().then(() => {
      if (cancelled || !prose) return;
      const headings = [...prose.querySelectorAll<HTMLHeadingElement>("h2")];
      toc = headings.map((h) => {
        h.id ||= slugify(h.textContent ?? "");
        return { id: h.id, text: h.textContent ?? "" };
      });
      // mark the H2 being read
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) activeId = e.target.id;
        },
        { rootMargin: "0px 0px -70% 0px" },
      );
      headings.forEach((h) => io!.observe(h));

      prose.querySelectorAll("pre").forEach((pre) => {
        const code = pre.querySelector("code")?.innerText ?? pre.innerText;
        const slot = document.createElement("div");
        slot.className = "copy-slot";
        pre.prepend(slot);
        mounted.push(mount(CopyButton, { target: slot, props: { value: code, variant: "code" } }));
      });
    });

    return () => {
      cancelled = true;
      io?.disconnect();
      mounted.forEach((m) => unmount(m));
      prose?.querySelectorAll(".copy-slot").forEach((el) => el.remove());
    };
  });
</script>

<svelte:head>
  <title>{post.title} · Febrian Bayu Nugroho</title>
  <meta name="description" content={post.description} />
</svelte:head>

<article class="article">
  <header class="col-text head">
    <div data-reveal use:inview><BackLink href={DECISIONS.writingPath} label="Writing" /></div>
    <p class="meta" data-reveal use:inview style:--reveal-delay="100ms">
      {#each post.tags as t (t)}<span class="tag" class:shipping={t === "Shipping"}>{t}</span>{/each}
      <time datetime={post.date}>{formatDate(post.date)}</time> · {post.readingTime}
    </p>
    <h1 data-reveal use:inview style:--reveal-delay="200ms">{post.title}</h1>
    {#if post.lead}<p class="lead" data-reveal use:inview style:--reveal-delay="300ms">{post.lead}</p>{/if}
  </header>

  {#if post.cover === "ci-cd"}
    <div class="cover col-wide" data-reveal="fade" use:inview><WorkCover project={ciProject} variant="detail" /></div>
  {:else if post.coverImage}
    <div class="cover col-wide" data-reveal="fade" use:inview>
      <img src={post.coverImage} alt="" width="1200" height="545" />
    </div>
  {/if}

  <div class="body col-text">
    {#if toc.length > 1}
      <nav class="toc" aria-label="On this page">
        <div class="toc-inner">
        <p class="label-mono">On this page</p>
        <ul>
          {#each toc as item (item.id)}
            <li><a href="#{item.id}" aria-current={activeId === item.id ? "location" : undefined}>{item.text}</a></li>
          {/each}
        </ul>
        </div>
      </nav>
    {/if}
    <div class="prose" bind:this={prose}>
      <PostComponent />
    </div>

    {#if next}
      <div class="next">
        {#if next.planned}
          <div class="next-card planned">
            <span class="label-mono">Next post · coming soon</span>
            <span class="next-title">{next.title}</span>
          </div>
        {:else}
          <a class="next-card card" href={postHref(next.slug)}>
            <span class="label-mono">Next post</span>
            <span class="next-title">{next.title}<Icon name="arrow-right" size={14} /></span>
          </a>
        {/if}
      </div>
    {/if}
    <ArrowLink href={DECISIONS.writingPath} label="All writing" />
  </div>
</article>

<style>
  .article { padding-top: 160px; display: grid; gap: 40px; }
  .head { display: grid; gap: 12px; justify-items: start; }
  .meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 0; font: 12px/1.4 var(--font-mono); color: var(--fg-muted); }
  .shipping { background: var(--ci-subtle); color: var(--ci-text); }
  h1 { margin: 0; font-size: 32px; font-weight: 600; line-height: 1.2; letter-spacing: -0.02em; }
  .lead { margin: 0; font-size: 19px; line-height: 1.5; color: var(--fg-muted); }
  .cover { border-radius: var(--radius-card); overflow: hidden; }
  .cover img { display: block; width: 100%; height: auto; aspect-ratio: 2.2; object-fit: cover; background: var(--surface-placeholder); outline: 1px solid var(--image-outline); outline-offset: -1px; }

  .body { position: relative; display: grid; gap: 32px; justify-items: start; }
  .toc { display: none; }
  @media (min-width: 1100px) {
    .toc {
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      right: calc(100% + 48px);
      width: 212px;
    }
    .toc-inner { position: sticky; top: 72px; }
    .toc p { margin: 0 0 8px; }
  }
  .toc ul { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; }
  .toc a {
    display: block;
    padding-left: 10px;
    border-left: 2px solid transparent;
    font-size: 13px;
    line-height: 1.4;
    color: var(--fg-muted);
    text-decoration: none;
    transition: color var(--dur-hover) var(--ease-out), border-color var(--dur-hover) var(--ease-out);
  }
  .toc a[aria-current="location"] { color: var(--fg-default); border-color: var(--ci-solid); }
  @media (hover: hover) and (pointer: fine) {
    .toc a:hover { color: var(--fg-default); }
  }

  .prose { width: 100%; font-size: 16px; line-height: 1.7; }
  .prose :global(p) { margin: 0 0 20px; }
  .prose :global(h2) { margin: 40px 0 12px; font-size: 20px; font-weight: 600; line-height: 1.3; letter-spacing: -0.01em; }
  .prose :global(h3) { margin: 32px 0 8px; font-size: 17px; font-weight: 600; }
  .prose :global(a) { color: var(--blue-text); text-underline-offset: 0.2em; }
  .prose :global(ul), .prose :global(ol) { margin: 0 0 20px; padding-left: 20px; }
  .prose :global(li) { margin: 6px 0; }
  .prose :global(:not(pre) > code) { padding: 1px 5px; border-radius: 5px; background: var(--surface-muted); font-size: 0.875em; }
  .prose :global(pre) {
    position: relative;
    margin: 24px 0;
    padding: 16px;
    border-radius: 12px;
    background: var(--surface-muted);
    overflow-x: auto;
    font-size: 13px;
    line-height: 1.6;
  }
  .prose :global(pre code) { font-family: var(--font-mono); font-variant-ligatures: none; }
  .prose :global(.copy-slot) { position: sticky; left: 0; float: right; margin: -6px -6px 0 8px; }
  .prose :global(blockquote) { margin: 24px 0; padding: 0 0 0 16px; border-left: 2px solid var(--line-soft); color: var(--fg-muted); }
  .prose :global(img) { max-width: 100%; height: auto; border-radius: 12px; }
  @media (min-width: 768px) {
    .prose { font-size: 17px; }
    .prose :global(pre) { font-size: 14px; }
  }

  .next { width: 100%; margin-top: 16px; }
  .next-card {
    display: grid;
    gap: 4px;
    padding: 16px;
    border-radius: 14px;
    background: var(--surface-default);
    color: inherit;
    text-decoration: none;
  }
  .planned { box-shadow: var(--shadow-ring-1); }
  .next-title { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 15px; font-weight: 500; }
  @media (max-width: 767.98px) {
    .article { padding-top: 64px; }
    h1 { font-size: 28px; }
    .lead { font-size: 17px; }
  }
</style>
