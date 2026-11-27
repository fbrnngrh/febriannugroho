<script lang="ts">
  import { tick } from "svelte";
  import type { PostSummary } from "#lib/content/posts.ts";
  import { formatDate, postHref } from "#lib/content/posts.ts";
  import { inview } from "#lib/actions/inview.ts";
  import Icon from "../Icon.svelte";
  import CoverArt from "./CoverArt.svelte";

  // Writing fan C1 (Figma 241:16652, notes 216:17059, motion 04-motion.md §7).
  let { posts }: { posts: PostSummary[] } = $props();

  let active = $state(0);
  let released = $state(false);
  let fanEl = $state<HTMLElement>();
  const n = $derived(posts.length);

  const COVER_TINT: Record<string, string> = {
    Shipping: "var(--ci-subtle)",
    Agents: "var(--fleet-subtle)",
    Design: "var(--blue-subtle)",
  };

  function go(i: number, fromSwipe = false) {
    released = fromSwipe;
    active = (i + n) % n;
  }

  // slot 0 = front, 1 = right (next), n-1 = left (previous)
  function slot(i: number) {
    return (i - active + n) % n;
  }

  // The front card follows the finger 1:1: transform written on the element, no easing, no Svelte state per move.
  let drag: { x: number; dx: number; t: number; lastX: number; v: number; id: number; width: number; el: HTMLElement } | null =
    null;
  let swallow = false;

  function down(e: PointerEvent) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const el = e.currentTarget as HTMLElement;
    swallow = false;
    el.style.transition = "none";
    drag = { x: e.clientX, dx: 0, lastX: e.clientX, t: e.timeStamp, v: 0, id: e.pointerId, width: el.offsetWidth, el };
  }
  function move(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x;
    if (Math.abs(drag.dx) > 6 && !drag.el.hasPointerCapture(drag.id)) drag.el.setPointerCapture(drag.id);
    const dt = e.timeStamp - drag.t;
    if (dt > 0) drag.v = ((e.clientX - drag.lastX) / dt) * 1000;
    drag.lastX = e.clientX;
    drag.t = e.timeStamp;
    drag.el.style.translate = `${drag.dx}px 0`;
  }
  function up(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    const { el, dx, width } = drag;
    // finger held still before lifting = no fling
    const v = e.timeStamp - drag.t > 80 ? 0 : drag.v;
    drag = null;
    swallow = Math.abs(dx) > 6;
    el.style.transition = "";
    el.style.translate = "";
    // swipe left = next, swipe right = previous
    if (e.type !== "pointercancel" && (dx < -width * 0.3 || v < -500)) go(active + 1, true);
    else if (e.type !== "pointercancel" && (dx > width * 0.3 || v > 500)) go(active - 1, true);
    else released = true;
  }
  function onclickcapture(e: MouseEvent) {
    if (!swallow) return;
    swallow = false;
    e.preventDefault();
  }

  async function onkeydown(e: KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const inCard = (e.target as HTMLElement).closest(".post-card");
    go(active + (e.key === "ArrowRight" ? 1 : -1));
    // the old front card turns inert: keep focus on the new front card's link
    if (inCard) {
      await tick();
      (
        fanEl?.querySelector<HTMLElement>('.post-card[data-pos="front"] a') ??
        fanEl?.querySelector<HTMLElement>('[aria-label="Next post"]')
      )?.focus();
    }
  }
</script>

<div
  class="fan"
  role="group"
  aria-roledescription="carousel"
  aria-label="Writing"
  bind:this={fanEl}
  {@attach (el) => {
    el.addEventListener("keydown", onkeydown);
    return () => el.removeEventListener("keydown", onkeydown);
  }}
>
  <div class="stack">
    {#each posts as post, i (post.slug)}
      {@const s = slot(i)}
      {@const pos = s === 0 ? "front" : s === 1 ? "right" : "left"}
      <div class="slot" data-pos={pos} data-reveal use:inview style:--reveal-delay={pos === "front" ? "0ms" : "60ms"}>
      <article
        class="post-card"
        class:released
        data-pos={pos}
        style:--tint={COVER_TINT[post.tags[0] ?? ""] ?? "var(--surface-cover)"}
        inert={pos !== "front"}
        aria-hidden={pos !== "front"}
        onpointerdown={pos === "front" ? down : undefined}
        onpointermove={pos === "front" ? move : undefined}
        onpointerup={pos === "front" ? up : undefined}
        onpointercancel={pos === "front" ? up : undefined}
        onclickcapture={pos === "front" ? onclickcapture : undefined}
      >
        <div class="art"><CoverArt kind={post.tags[0] ?? ""} /></div>
        <div class="text">
          <h3 class="title">
            {#if post.planned}
              {post.title}
            {:else}
              <a href={postHref(post.slug)} draggable="false">{post.title}</a>
            {/if}
          </h3>
          <p class="meta">Written by Febrian</p>
          <p class="meta"><time datetime={post.date}>{formatDate(post.date)}</time>{#if post.planned}{" · coming soon"}{/if}</p>
        </div>
      </article>
      </div>
    {/each}
  </div>

  <div class="controls">
    <button type="button" class="icon-button nav" aria-label="Previous post" onclick={() => go(active - 1)}>
      <Icon name="arrow-left" size={14} />
    </button>
    <div class="dots">
      {#each posts as post, i (post.slug)}
        <button
          type="button"
          class="dot"
          aria-label="Show post {i + 1} of {n}"
          aria-current={i === active ? "true" : undefined}
          onclick={() => go(i)}
        ><span></span></button>
      {/each}
    </div>
    <span class="label-mono-sm" aria-live="polite">{active + 1} / {n}</span>
    <button type="button" class="icon-button nav" aria-label="Next post" onclick={() => go(active + 1)}>
      <Icon name="arrow-right" size={14} />
    </button>
  </div>
</div>

<style>
  .stack {
    position: relative;
    display: grid;
    place-items: center;
    height: 420px;
  }
  .slot { grid-area: 1 / 1; z-index: 1; }
  .slot[data-pos="front"] { z-index: 3; }
  .post-card {
    --w: 280px;
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--w);
    height: 370px;
    border: 1px solid transparent;
    border-radius: var(--radius-card);
    background: var(--tint);
    box-shadow: var(--shadow-post-card);
    overflow: hidden;
    touch-action: pan-y;
    user-select: none;
    transition: translate 500ms var(--spring-fan), rotate 500ms var(--spring-fan), scale 500ms var(--spring-fan),
      box-shadow var(--dur-card) var(--ease-out);
  }
  .post-card.released { transition-duration: 550ms; transition-timing-function: var(--spring-fan-release); }
  /* the front card follows the finger 1:1 while dragged (no easing) */
  .post-card[data-pos="front"] { translate: 0 0; }
  .post-card[data-pos="left"] { translate: calc(var(--w) * -0.86) 14px; rotate: -6deg; scale: 0.96; }
  .post-card[data-pos="right"] { translate: calc(var(--w) * 0.86) 14px; rotate: 6deg; scale: 0.96; }
  .post-card::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    border-radius: inherit;
    background: var(--fg-default);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--dur-card) var(--ease-out);
  }
  .post-card[data-pos="front"]:has(a):active::before { opacity: 0.08; transition-duration: var(--dur-press); }
  @media (hover: hover) and (pointer: fine) {
    .post-card[data-pos="front"]:has(a):hover { box-shadow: var(--shadow-hover-card); }
    .post-card[data-pos="front"]:has(a):hover::before { opacity: 0.04; }
  }
  .art { flex: 1; padding: 24px 28px 8px; min-height: 0; }
  .text { display: grid; gap: 4px; padding: 0 22px 22px; }
  .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
    margin: 0 0 8px;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.18;
    letter-spacing: -0.015em;
  }
  .title a { color: inherit; text-decoration: none; }
  /* whole card is the link target */
  .title a::after { content: ""; position: absolute; inset: 0; z-index: 3; border-radius: inherit; }
  .title a:focus-visible { outline: none; }
  .post-card:has(a:focus-visible) { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
  .meta { margin: 0; font: 12px/1.4 var(--font-mono); color: var(--fg-secondary); }

  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 24px;
  }
  .nav { width: 40px; height: 40px; border-radius: 20px; }
  .dots { display: flex; }
  .dot {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    background: none;
  }
  .dot span {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: var(--line-strong);
    transition: scale var(--dur-card) var(--ease-out), background-color var(--dur-card) var(--ease-out);
  }
  .dot[aria-current="true"] span { background: var(--fg-default); scale: 3 1; }
  .dot[aria-current="true"] { width: 30px; }

  @media (max-width: 767.98px) {
    .stack { height: 380px; }
    .post-card { --w: 236px; height: 330px; }
    .post-card[data-pos="left"], .post-card[data-pos="right"] { scale: 0.92; }
  }
  @media (prefers-reduced-motion: reduce) {
    .post-card, .post-card.released { transition: opacity 200ms ease-out, box-shadow var(--dur-card) ease-out; }
    .dot span { transition: background-color 200ms ease-out; }
    .post-card[data-pos="front"] { animation: fan-fade 200ms ease-out; }
    @keyframes fan-fade { from { opacity: 0; } }
  }
</style>
