<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { inview } from "#lib/actions/inview.ts";
  import BackLink from "#lib/components/BackLink.svelte";
  import { allPosts, formatDate, postHref, shortReadingTime } from "#lib/content/posts.ts";
  import { WRITING_FILTERS, WRITING_INTRO, type WritingTag } from "#lib/content/site.ts";

  // Writing (Figma 67:2322). Filter lives in ?tag= so it can be shared and Back works.
  const posts = allPosts();

  let tag = $state<WritingTag>("All");
  $effect(() => {
    // client-only: prerendered pages can't read search params
    const q = page.url.searchParams.get("tag");
    tag = WRITING_FILTERS.find((f) => f.toLowerCase() === q?.toLowerCase()) ?? "All";
  });

  function select(t: WritingTag) {
    const url = new URL(page.url.href);
    if (t === "All") url.searchParams.delete("tag");
    else url.searchParams.set("tag", t.toLowerCase());
    goto(url.href, { reset: false });
  }

  const filtered = $derived(tag === "All" ? posts : posts.filter((p) => p.tags.includes(tag)));
  const years = $derived(
    Object.entries(
      filtered.reduce<Record<string, typeof posts>>((acc, p) => {
        (acc[p.date.slice(0, 4)] ??= []).push(p);
        return acc;
      }, {}),
    ).sort(([a], [b]) => b.localeCompare(a)),
  );
</script>

<svelte:head>
  <title>Writing · Febrian Bayu Nugroho</title>
  <meta name="description" content={WRITING_INTRO} />
</svelte:head>

<div class="page col-text">
  <header class="head">
    <div data-reveal use:inview><BackLink href="/" label="Home" /></div>
    <h1 data-reveal use:inview style:--reveal-delay="100ms">Writing</h1>
    <p class="body-text intro" data-reveal use:inview style:--reveal-delay="200ms">{WRITING_INTRO}</p>
  </header>

  {#if posts.length === 0}
    <p class="empty">No posts yet.</p>
  {:else}
    <div class="filters" role="group" aria-label="Filter posts" data-reveal use:inview style:--reveal-delay="300ms">
      {#each WRITING_FILTERS as f (f)}
        <button type="button" class="filter" aria-pressed={tag === f} onclick={() => select(f)}>{f}</button>
      {/each}
    </div>

    {#if filtered.length === 0}
      <div class="empty">
        <p>No posts in {tag} yet.</p>
        <button type="button" class="chip-button" onclick={() => select("All")}>Show all posts</button>
      </div>
    {:else}
      {#each years as [year, list], yi (year)}
        <section class="year" aria-labelledby="y-{year}">
          <h2 id="y-{year}" class="label-mono">{year}</h2>
          <ul>
            {#each list as post, i (post.slug)}
              {@const index = years.slice(0, yi).reduce((n, [, l]) => n + l.length, 0) + i}
              <li data-reveal use:inview style:--reveal-delay="{index < 6 ? index * 40 : 0}ms">
                {#if post.planned}
                  <div class="row planned">
                    <span class="title">{post.title}</span>
                    <span class="desc">{post.description}</span>
                    <span class="meta">{shortReadingTime(post.readingTime)} · {formatDate(post.date, "short")} · coming soon</span>
                  </div>
                {:else}
                  <a class="row" href={postHref(post.slug)}>
                    <span class="title">{post.title}</span>
                    <span class="desc">{post.description}</span>
                    <span class="meta"
                      >{shortReadingTime(post.readingTime)} · <time datetime={post.date}>{formatDate(post.date, "short")}</time></span
                    >
                  </a>
                {/if}
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    {/if}
  {/if}
</div>

<style>
  .page { padding-top: 160px; display: grid; gap: 40px; }
  .head { display: grid; gap: 12px; justify-items: start; }
  h1 { margin: 8px 0 0; font-size: 32px; font-weight: 600; line-height: 1.2; letter-spacing: -0.02em; }
  .intro { margin: 0; color: var(--fg-muted); }
  .filters { display: flex; flex-wrap: wrap; gap: 8px; }
  .filter {
    height: 32px;
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: var(--radius-pill);
    background: var(--surface-default);
    box-shadow: var(--shadow-button);
    color: var(--fg-secondary);
    font-size: 13px;
    transition: background-color var(--dur-hover) var(--ease-out), color var(--dur-hover) var(--ease-out), scale var(--dur-release) var(--ease-out);
  }
  .filter:active { scale: 0.96; transition-duration: var(--dur-press); }
  .filter[aria-pressed="true"] { background: var(--surface-inverse); color: var(--fg-on-inverse); }
  @media (hover: hover) and (pointer: fine) {
    .filter[aria-pressed="false"]:hover { background: var(--surface-muted); color: var(--fg-default); }
  }
  .year { display: grid; gap: 8px; }
  .year h2 { margin: 0; font-weight: 400; }
  ul { margin: 0; padding: 0; list-style: none; display: grid; }
  .row {
    display: grid;
    gap: 2px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border-default);
    color: inherit;
    text-decoration: none;
    transition: opacity var(--dur-press) var(--ease-out);
  }
  a.row:active { opacity: 0.64; }
  .title { font-size: 15px; font-weight: 500; line-height: 1.4; text-decoration: underline 1px transparent; text-underline-offset: 0.2em; transition: text-decoration-color var(--dur-hover) var(--ease-out); }
  .desc { font-size: 15px; line-height: 1.5; color: var(--fg-muted); }
  .meta { font: 12px/1.6 var(--font-mono); color: var(--fg-muted); }
  .planned .title { color: var(--fg-secondary); }
  @media (hover: hover) and (pointer: fine) {
    a.row:hover .title { text-decoration-color: currentColor; }
  }
  .empty { display: grid; gap: 12px; justify-items: start; color: var(--fg-muted); }
  .empty p { margin: 0; }
  @media (max-width: 767.98px) {
    .page { padding-top: 64px; }
    h1 { font-size: 28px; }
  }
</style>
