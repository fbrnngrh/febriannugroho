<script lang="ts" module>
  /** Cover tint per first tag; shared with the phone fan. */
  export const COVER_TINT: Record<string, string> = {
    Shipping: "var(--ci-subtle)",
    Agents: "var(--fleet-subtle)",
    Design: "var(--blue-subtle)",
  };
</script>

<script lang="ts">
  import type { PostSummary } from "#lib/content/posts.ts";
  import { formatDate, postHref } from "#lib/content/posts.ts";
  import { inview } from "#lib/actions/inview.ts";
  import CoverArt from "./CoverArt.svelte";

  // Writing on tablets and desktops: a row of tall cards like Molly's thesis row, starting on the text
  // column and running past the right edge. The stacked fan (WritingFan) is the phone layout only.
  let { posts }: { posts: PostSummary[] } = $props();
</script>

<ul class="row" aria-label="Writing" data-reveal use:inview>
  {#each posts as post (post.slug)}
    <li>
      <article class="card" style:--tint={COVER_TINT[post.tags[0] ?? ""] ?? "var(--surface-cover)"}>
        <div class="art"><CoverArt kind={post.tags[0] ?? ""} /></div>
        <div class="text">
          <h3 class="title">
            {#if post.planned}
              {post.title}
            {:else}
              <a href={postHref(post.slug)}>{post.title}</a>
            {/if}
          </h3>
          <p class="meta"><time datetime={post.date}>{formatDate(post.date)}</time>{#if post.planned}{" · coming soon"}{/if}</p>
        </div>
      </article>
    </li>
  {/each}
</ul>

<style>
  .row {
    --start: max(var(--gutter), (100% - var(--col-text)) / 2);
    display: flex;
    gap: 16px;
    margin: 0;
    /* room above and below for the hover lift and its shadow */
    padding: 12px var(--gutter) 32px var(--start);
    list-style: none;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--start) var(--gutter);
    overscroll-behavior-x: contain;
    scrollbar-width: none;
  }
  .row::-webkit-scrollbar { display: none; }
  li { flex: 0 0 300px; scroll-snap-align: start; }
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 400px;
    border: 1px solid transparent;
    border-radius: var(--radius-card);
    background: var(--tint);
    box-shadow: var(--shadow-ring-1);
    overflow: hidden;
    transition: box-shadow 200ms var(--ease-out);
  }
  .art { flex: 1; min-height: 0; padding: 28px 28px 8px; }
  .text { display: grid; gap: 6px; padding: 0 24px 24px; }
  .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.015em;
  }
  .title a { color: inherit; text-decoration: none; }
  /* the whole card is the link target */
  .title a::after { content: ""; position: absolute; inset: 0; z-index: 1; border-radius: inherit; }
  .title a:focus-visible { outline: none; }
  .card:has(a:focus-visible) { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
  .meta { margin: 0; font: 12px/1.4 var(--font-mono); color: var(--fg-secondary); }

  /* hover raises the card out of the row (Molly); "coming soon" cards answer too, without a pointer */
  @media (hover: hover) and (pointer: fine) {
    .card:hover { box-shadow: var(--shadow-hover-card), 0 24px 48px -16px rgb(0 0 0 / 0.22); }
    :global(.dark) .card:hover { box-shadow: var(--shadow-hover-card), 0 24px 48px -16px rgb(0 0 0 / 0.6); }
  }
  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .card { transition: translate 200ms var(--ease-out), scale 200ms var(--ease-out), box-shadow 200ms var(--ease-out); }
    .card:hover { translate: 0 -6px; scale: 1.02; }
  }
  .card:has(a):active { scale: 0.99; transition-duration: var(--dur-press); }
</style>
