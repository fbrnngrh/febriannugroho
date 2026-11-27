<script lang="ts" module>
  import type { PostSummary } from "#lib/content/posts.ts";

  const tokens = (name: string) => ({ bg: `var(--cover-${name}-bg)`, accent: `var(--cover-${name}-accent)` });

  /** Card colour and illustration accent per post (adjacent posts never share a hue); shared with the phone fan. */
  export const COVERS: Record<string, { bg: string; accent: string }> = {
    "how-my-agent-fleet-ships-code": tokens("fleet"),
    "redesigning-this-site-with-claude": tokens("redesign"),
    "from-manual-pulls-to-ci-cd": tokens("cicd"),
    "building-a-saas-with-nextjs-16": tokens("saas"),
    "a-practical-guide-to-react-19-actions": tokens("react"),
    "mastering-tailwind-css-v4-with-oklch": tokens("oklch"),
  };
  const TAG_COVERS: Record<string, { bg: string; accent: string }> = {
    Shipping: COVERS["from-manual-pulls-to-ci-cd"]!,
    Agents: COVERS["how-my-agent-fleet-ships-code"]!,
    Design: COVERS["redesigning-this-site-with-claude"]!,
  };

  /** Unknown slugs fall back to their first tag, then to the grey cover. */
  export function coverOf(post: PostSummary) {
    return COVERS[post.slug] ?? TAG_COVERS[post.tags[0] ?? ""] ?? { bg: "var(--surface-cover)", accent: "var(--fg-default)" };
  }

  export const finePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
</script>

<script lang="ts">
  import { formatDate, postHref } from "#lib/content/posts.ts";
  import { inview } from "#lib/actions/inview.ts";
  import CoverArt from "./CoverArt.svelte";

  // Writing on tablets and desktops: a row of tall cards like Molly's thesis row, starting on the text
  // column and running past the right edge. The stacked fan (WritingFan) is the phone layout only.
  let { posts }: { posts: PostSummary[] } = $props();

  // Each cover plays once when its card is half in view, then again on hover or keyboard focus.
  let plays = $state<Record<string, number>>({});
  let delays = $state<Record<string, number>>({});
  // cards entering together start in a wave after the row's own reveal, gaps shrinking
  const WAVE = [150, 230, 290, 330, 350, 360];

  // a replay inside the 1.4 s motion budget would snap a running cover back to frame 0 (hover out and in)
  const lastPlay: Record<string, number> = {};
  function replay(slug: string, delay = 0) {
    const now = performance.now();
    if (now - (lastPlay[slug] ?? -1e4) < 1400) return;
    lastPlay[slug] = now;
    delays[slug] = delay;
    plays[slug] = (plays[slug] ?? 0) + 1;
  }

  function observe(ul: HTMLElement) {
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, i) => {
            io.unobserve(e.target);
            const slug = (e.target as HTMLElement).dataset.slug!;
            if (!plays[slug]) replay(slug, WAVE[Math.min(i, WAVE.length - 1)]);
          });
        // only the cards revealed with the row's own fade autoplay; a card already showing its final
        // frame (scrolled in sideways later) would visibly snap to frame 0, so it waits for hover/focus
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    ul.querySelectorAll("article").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }
</script>

<ul class="row" aria-label="Writing" data-reveal use:inview {@attach observe}>
  {#each posts as post (post.slug)}
    {@const cover = coverOf(post)}
    <li>
      <article
        class="card"
        data-slug={post.slug}
        style:--cover-bg={cover.bg}
        style:--cover-accent={cover.accent}
        style:--play-delay="{delays[post.slug] ?? 0}ms"
        onpointerenter={(e) => e.pointerType === "mouse" && finePointer() && replay(post.slug)}
        onfocusin={(e) => (e.target as Element).matches(":focus-visible") && replay(post.slug)}
      >
        <div class="art"><CoverArt kind={post.tags[0] ?? ""} slug={post.slug} play={plays[post.slug] ?? 0} /></div>
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
    background: var(--cover-bg);
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
