<script lang="ts">
  import { tick } from "svelte";
  import type { PostSummary } from "#lib/content/posts.ts";
  import { formatDate, postHref } from "#lib/content/posts.ts";
  import { inview } from "#lib/actions/inview.ts";
  import { prefersReducedMotion } from "#lib/motion.ts";
  import Icon from "../Icon.svelte";
  import CoverArt from "./CoverArt.svelte";
  import { coverOf, finePointer } from "./WritingRow.svelte";

  // Writing on phones: a deck. The front card sits in the middle, the next ones peek behind it on the right,
  // read ones are thrown onto a pile on the left. Wider screens use WritingRow.
  let { posts }: { posts: PostSummary[] } = $props();

  let active = $state(0);
  // the index the deck is moving away from (settle) or towards (drag); keeps the moving card above its pile
  let from = $state<number | null>(null);
  let released = $state(false);
  let fanEl = $state<HTMLElement>();
  let stackEl = $state<HTMLElement>();
  const n = $derived(posts.length);

  // Pose per distance from the front (d = index − active). x = k × card width + px.
  // Left pile (d < 0) rests over the deck, so a thrown card stays on top; ±4 is the hidden end of the window.
  type Pose = { k: number; px: number; r: number; s: number; o: number };
  const POSES: Pose[] = [
    { k: -1, px: -24, r: -13, s: 0.86, o: 0 },
    { k: -1, px: -24, r: -13, s: 0.86, o: 1 },
    { k: -1, px: -12, r: -11, s: 0.9, o: 1 },
    { k: -1, px: 0, r: -9, s: 0.94, o: 1 },
    { k: 0, px: 0, r: 0, s: 1, o: 1 },
    { k: 0, px: 18, r: 3, s: 0.95, o: 1 },
    { k: 0, px: 34, r: 6, s: 0.9, o: 1 },
    { k: 0, px: 48, r: 9, s: 0.85, o: 1 },
    { k: 0, px: 48, r: 9, s: 0.85, o: 0 },
  ];
  const poseAt = (d: number) => POSES[Math.max(-4, Math.min(4, d)) + 4]!;
  const restTransform = (d: number) => {
    const p = poseAt(d);
    return `translate(calc(var(--w) * ${p.k} + ${p.px}px), 0) rotate(${p.r}deg) scale(${p.s})`;
  };
  const zOf = (d: number) => (d < 0 ? 110 + Math.max(d, -9) : 100 - Math.min(d, 9));

  // Gesture constants (px, ms)
  const SLOP = 6;
  const DIST = 0.35; // of the card width
  const FLICK = 0.11; // px/ms, average over the drag (Sonner)
  const RUBBER = 0.2;

  // Only the front cover plays: once when the deck is half in view, once per card the first time it comes to the
  // front, and again on hover or keyboard focus.
  let plays = $state<Record<string, number>>({});
  let delays = $state<Record<string, number>>({});
  let seen = false;
  // bookkeeping only, nothing renders from it
  const played = new Set<string>();

  function replay(slug: string, delay = 0) {
    delays[slug] = delay;
    plays[slug] = (plays[slug] ?? 0) + 1;
  }

  function autoplay(delay: number) {
    const slug = posts[active]?.slug;
    if (!seen || !slug || played.has(slug)) return;
    played.add(slug);
    replay(slug, delay);
  }

  function observe(stack: HTMLElement) {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        seen = true;
        autoplay(150);
      },
      { threshold: 0.5 },
    );
    io.observe(stack);
    return () => io.disconnect();
  }

  let settle: ReturnType<typeof setTimeout> | undefined;
  function go(i: number, fromSwipe = false) {
    if (i < 0 || i >= n || i === active) return;
    released = fromSwipe;
    from = active;
    active = i;
    settleSoon();
    autoplay(200);
  }
  function settleSoon() {
    clearTimeout(settle);
    settle = setTimeout(() => (from = null), 600);
  }

  const cards = () => [...(stackEl?.querySelectorAll<HTMLElement>(".post-card") ?? [])];

  // Cards follow the finger 1:1: transforms written on each card in the window, no Svelte state per move.
  type Drag = {
    id: number;
    x: number;
    y: number;
    t: number;
    seed: number;
    dx: number;
    lastX: number;
    lastT: number;
    dir: number;
    w: number;
    all: HTMLElement[];
  };
  let drag: Drag | null = null;
  let swallow = false;

  function down(e: PointerEvent) {
    if (drag || (e.pointerType === "mouse" && e.button !== 0)) return;
    swallow = false;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: e.timeStamp, seed: 0, dx: 0, lastX: e.clientX, lastT: e.timeStamp, dir: 0, w: 0, all: [] };
  }

  function lock(e: PointerEvent) {
    if (!drag || !stackEl) return;
    stackEl.setPointerCapture(drag.id);
    const all = (drag.all = cards());
    const front = all[active]!;
    // a card pulled back from the pile and caught mid-flight stays where it is instead of snapping back to rest
    drag.seed = Math.min(0, new DOMMatrix(getComputedStyle(front).transform).m41);
    drag.w = front.offsetWidth;
    for (let i = Math.max(0, active - 5); i <= Math.min(n - 1, active + 5); i++) all[i]!.style.transition = "none";
    drag.x = drag.lastX = e.clientX;
  }

  function move(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.all.length) {
      const ax = Math.abs(e.clientX - drag.x);
      const ay = Math.abs(e.clientY - drag.y);
      if (ax < SLOP && ay < SLOP) return;
      // vertical intent: leave it to the page scroll (touch-action: pan-y)
      if (ay > ax) return void (drag = null);
      lock(e);
    }
    if (e.clientX !== drag.lastX) drag.dir = Math.sign(e.clientX - drag.lastX);
    drag.lastX = e.clientX;
    drag.dx = e.clientX - drag.x + drag.seed;
    drag.lastT = e.timeStamp;
    // past the ends too, so the front card rubber-bands over the left pile, not under it
    const side = drag.dx < 0 ? active + 1 : active - 1;
    if (from !== side) from = side;
    paint(drag.all, drag.dx, drag.w);
  }

  function paint(all: HTMLElement[], dx: number, w: number) {
    let f = -dx / w;
    let rubber = 0;
    // no card past the end: the front card gives a little and stops
    if ((f > 0 && active === n - 1) || (f < 0 && active === 0)) {
      rubber = dx * RUBBER;
      f = 0;
    } else if (Math.abs(f) > 1) f = Math.sign(f) * (1 + (Math.abs(f) - 1) * RUBBER);
    const reduce = prefersReducedMotion();
    for (let i = Math.max(0, active - 5); i <= Math.min(n - 1, active + 5); i++) {
      const d = Math.max(-4, Math.min(4, i - active - f));
      const lo = Math.floor(d);
      const t = d - lo;
      const a = poseAt(lo);
      const b = poseAt(lo + 1);
      const mix = (p: number, q: number) => p + (q - p) * t;
      const x = mix(a.k * w + a.px, b.k * w + b.px) + (i === active ? rubber : 0);
      // reduced motion: the card slides with the finger but does not tilt
      const r = reduce ? poseAt(Math.round(d)).r : mix(a.r, b.r);
      all[i]!.style.transform = `translate(${x}px, 0) rotate(${r}deg) scale(${mix(a.s, b.s)})`;
      all[i]!.style.opacity = String(mix(a.o, b.o));
    }
  }

  function up(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    const { dx, w, all, t, lastT, dir } = drag;
    drag = null;
    if (!all.length) return;
    swallow = true;
    // a finger held still before lifting is not a flick
    const flick = e.timeStamp - lastT < 100 && Math.abs(dx) > 12 && Math.abs(dx) / (e.timeStamp - t) > FLICK;
    const cancel = e.type === "pointercancel";
    const before = active;
    if (!cancel && dx < 0 && (dx < -w * DIST || (flick && dir < 0))) go(active + 1, true);
    else if (!cancel && dx > 0 && (dx > w * DIST || (flick && dir > 0))) go(active - 1, true);
    else {
      released = true;
      settleSoon();
    }
    // hand the cards back to CSS: same strings Svelte renders, so a spring-back also gets its transition
    for (let i = Math.max(0, before - 5); i <= Math.min(n - 1, before + 5); i++) {
      const el = all[i]!;
      el.style.transition = "";
      el.style.transform = restTransform(i - active);
      el.style.opacity = String(poseAt(i - active).o);
    }
  }

  function onclickcapture(e: MouseEvent) {
    if (!swallow) return;
    swallow = false;
    e.preventDefault();
    e.stopPropagation();
  }

  // single-pointer alternative to the drag: a tap on a peeking card brings it forward
  function onclick(e: MouseEvent) {
    const front = cards()[active];
    if (!front || front.contains(e.target as Node)) return;
    const r = front.getBoundingClientRect();
    go(e.clientX < r.left + r.width / 2 ? active - 1 : active + 1);
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
        fanEl?.querySelector<HTMLElement>(".post-card[data-front] a") ??
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
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div
    class="stack"
    bind:this={stackEl}
    {@attach observe}
    onpointerdown={down}
    onpointermove={move}
    onpointerup={up}
    onpointercancel={up}
    {onclickcapture}
    {onclick}
  >
    {#each posts as post, i (post.slug)}
      {@const d = i - active}
      {@const cover = coverOf(post)}
      <div
        class="slot"
        data-reveal
        use:inview
        style:z-index={Math.max(zOf(d), zOf(i - (from ?? active)))}
        style:--reveal-delay={d === 0 ? "0ms" : "60ms"}
      >
        <article
          class="post-card"
          class:released
          data-front={d === 0 || undefined}
          style:transform={restTransform(d)}
          style:opacity={poseAt(d).o}
          style:--cover-bg={cover.bg}
          style:--cover-accent={cover.accent}
          style:--play-delay="{delays[post.slug] ?? 0}ms"
          inert={d !== 0}
          onpointerenter={d === 0 ? (e) => e.pointerType === "mouse" && finePointer() && replay(post.slug) : undefined}
          onfocusin={d === 0 ? (e) => (e.target as Element).matches(":focus-visible") && replay(post.slug) : undefined}
        >
          <div class="art"><CoverArt kind={post.tags[0] ?? ""} slug={post.slug} play={plays[post.slug] ?? 0} /></div>
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
    <button
      type="button"
      class="icon-button nav"
      aria-label="Previous post"
      aria-disabled={active === 0}
      onclick={() => go(active - 1)}
    >
      <Icon name="arrow-left" size={14} />
    </button>
    <span class="label-mono-sm count" aria-hidden="true">{active + 1} / {n}</span>
    <p class="sr" aria-live="polite">{posts[active]?.title}, post {active + 1} of {n}</p>
    <button
      type="button"
      class="icon-button nav"
      aria-label="Next post"
      aria-disabled={active === n - 1}
      onclick={() => go(active + 1)}
    >
      <Icon name="arrow-right" size={14} />
    </button>
  </div>
</div>

<style>
  /* full-bleed so the piles reach the screen edge, clipped here so the page never scrolls sideways */
  .stack {
    position: relative;
    display: grid;
    place-items: center;
    height: 380px;
    margin-inline: calc(var(--gutter) * -1);
    overflow-x: clip;
    touch-action: pan-y;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  /* slots overlap the front card: only the cards themselves take pointer events */
  .slot { grid-area: 1 / 1; pointer-events: none; }
  .post-card {
    --w: 236px;
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--w);
    height: 330px;
    border: 1px solid transparent;
    border-radius: var(--radius-card);
    background: var(--cover-bg);
    box-shadow: var(--shadow-post-card);
    overflow: hidden;
    pointer-events: auto;
    transition: transform 500ms var(--spring-fan), opacity 500ms var(--spring-fan), translate 200ms var(--ease-out),
      box-shadow var(--dur-card) var(--ease-out);
  }
  /* after a drag the card leaves with the force it was given: the release spring overshoots by 3% */
  .post-card.released { transition-duration: 550ms, 550ms, 200ms, var(--dur-card); transition-timing-function: var(--spring-fan-release), var(--spring-fan-release), var(--ease-out), var(--ease-out); }
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
  .post-card[data-front]:has(a):active::before { opacity: 0.08; transition-duration: var(--dur-press); }
  /* every front card answers hover, "coming soon" ones too (without the link's pointer) */
  @media (hover: hover) and (pointer: fine) {
    .post-card[data-front]:hover { box-shadow: var(--shadow-hover-card); }
    .post-card[data-front]:hover::before { opacity: 0.04; }
  }
  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .post-card[data-front]:hover { translate: 0 -4px; }
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
    gap: 16px;
    margin-top: 20px;
  }
  .nav { width: 40px; height: 40px; border-radius: 20px; }
  .count { min-width: 6ch; text-align: center; font-variant-numeric: tabular-nums; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

  /* reduced motion: cards change place instantly and the new front card fades in */
  @media (prefers-reduced-motion: reduce) {
    .post-card, .post-card.released { transition: opacity 200ms ease-out, box-shadow var(--dur-card) ease-out; }
    .post-card[data-front] { animation: deck-fade 200ms ease-out; }
    @keyframes deck-fade { from { opacity: 0; } }
  }
</style>
