<script lang="ts">
  import { inview } from "#lib/actions/inview.ts";
  import { PROJECTS, type ProjectId } from "#lib/content/site.ts";
  import { prefersReducedMotion } from "#lib/motion.ts";
  import Icon from "../Icon.svelte";
  import WorkCover from "./WorkCover.svelte";

  let { onopen }: { onopen: (id: ProjectId, from: HTMLElement) => void } = $props();

  let track = $state<HTMLUListElement>();
  let atStart = $state(true);
  let atEnd = $state(false);

  function update() {
    if (!track) return;
    atStart = track.scrollLeft <= 4;
    atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  }

  function page(dir: 1 | -1) {
    if (!track) return;
    const card = track.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  // "drag for more": mouse drag scrolls the track; touch uses native scrolling + snap
  let drag: { x: number; left: number; moved: boolean } | null = null;
  function down(e: PointerEvent) {
    if (e.pointerType !== "mouse" || e.button !== 0 || !track) return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false };
  }
  function move(e: PointerEvent) {
    if (!drag || !track) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4 && !drag.moved) {
      drag.moved = true;
      track.setPointerCapture(e.pointerId);
      track.classList.add("dragging");
    }
    if (drag.moved) track.scrollLeft = drag.left - dx;
  }
  function up() {
    if (!track) return;
    track.classList.remove("dragging");
    // swallow the click that ends a drag
    if (drag?.moved) track.addEventListener("click", (ev) => ev.preventDefault(), { capture: true, once: true });
    drag = null;
  }
</script>

<div class="work">
  <div class="label-row col-text">
    <p class="label-mono">Selected work <span class="hint">drag for more</span></p>
    <div class="arrows">
      <button type="button" class="icon-button" aria-label="Previous project" disabled={atStart} onclick={() => page(-1)}>
        <Icon name="arrow-left" size={14} />
      </button>
      <button type="button" class="icon-button" aria-label="Next project" disabled={atEnd} onclick={() => page(1)}>
        <Icon name="arrow-right" size={14} />
      </button>
    </div>
  </div>

  <div class="viewport">
    <ul
      class="track"
      bind:this={track}
      onscroll={update}
      onpointerdown={down}
      onpointermove={move}
      onpointerup={up}
      onpointercancel={up}
      aria-label="Selected work"
      use:inview={{ class: "revealed" }}
    >
      {#each PROJECTS as p, i (p.id)}
        <li style:--reveal-delay="{[0, 60, 120, 120][i]}ms">
          {#if p.detail}
            <button type="button" class="work-card" onclick={(e) => onopen(p.id, e.currentTarget)} aria-haspopup="dialog">
              <span class="cover-wrap card"><WorkCover project={p} /></span>
              <span class="meta">
                <span class="title">{p.title}<Icon name="expand" size={14} class="expand" /></span>
                <span class="desc">{p.description}</span>
              </span>
            </button>
          {:else}
            <a href={p.href} class="work-card">
              <span class="cover-wrap card"><WorkCover project={p} /></span>
              <span class="meta">
                <span class="title">{p.title}<Icon name="arrow-up-right" size={14} class="expand" /></span>
                <span class="desc">{p.description}</span>
              </span>
            </a>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .label-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .label-row p { margin: 0; }
  .hint { margin-left: 12px; }
  .arrows { display: flex; gap: 12px; }

  .viewport {
    position: relative;
    width: min(var(--col-wide), 100%);
    margin-inline: auto;
  }
  /* fade the right edge so the peeking card never reads as cut text */
  .viewport::after {
    content: "";
    position: absolute;
    inset: 0 0 0 auto;
    width: 96px;
    background: linear-gradient(to right, transparent, var(--bg-page));
    pointer-events: none;
  }
  .track {
    display: flex;
    gap: 16px;
    margin: 0;
    padding: 4px var(--gutter) 8px;
    list-style: none;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--gutter);
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    cursor: grab;
  }
  .track::-webkit-scrollbar { display: none; }
  .track:global(.dragging) { cursor: grabbing; scroll-snap-type: none; }
  @media (min-width: 808px) {
    .track { padding-inline: 0; scroll-padding-inline: 0; }
  }
  /* cards reveal together when the list enters (off-screen cards are clipped, so per-card triggers never fire) */
  :global(.js) .track li { opacity: 0; translate: 0 12px; filter: blur(4px); }
  :global(.js) .track:global(.revealed) li {
    opacity: 1;
    translate: 0 0;
    filter: blur(0);
    transition: opacity var(--dur-reveal) var(--ease-out), translate var(--dur-reveal) var(--ease-out), filter var(--dur-reveal) var(--ease-out);
    transition-delay: var(--reveal-delay);
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.js) .track li { translate: none; filter: none; }
    :global(.js) .track:global(.revealed) li { transition: opacity 200ms ease-out; }
  }
  li {
    flex: 0 0 min(420px, 82vw);
    scroll-snap-align: start;
  }
  .work-card {
    display: grid;
    gap: 12px;
    width: 100%;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    text-decoration: none;
    user-select: none;
    -webkit-user-drag: none;
  }
  .work-card:focus-visible { outline: none; }
  .work-card:focus-visible .cover-wrap { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
  .cover-wrap {
    display: block;
    border-radius: var(--radius-card);
    overflow: hidden;
  }
  .meta { display: grid; gap: 2px; }
  .title {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.4;
  }
  .title :global(.expand) { flex: none; margin-top: 2px; color: var(--fg-muted); }
  .desc { font-size: 15px; line-height: 1.4; color: var(--fg-muted); }
  @media (hover: hover) and (pointer: fine) {
    .work-card:hover .cover-wrap { box-shadow: var(--shadow-ring-1), var(--shadow-hover-lift); }
    .work-card:hover .cover-wrap::before { opacity: 0.04; }
  }
  .work-card:active .cover-wrap::before { opacity: 0.08; transition-duration: var(--dur-press); }
</style>
