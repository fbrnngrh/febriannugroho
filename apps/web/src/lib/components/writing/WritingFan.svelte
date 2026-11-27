<script lang="ts">
  import { flushSync, tick } from "svelte";
  import type { PostSummary } from "#lib/content/posts.ts";
  import { formatDate, postHref } from "#lib/content/posts.ts";
  import { inview } from "#lib/actions/inview.ts";
  import { prefersReducedMotion } from "#lib/motion.ts";
  import Icon from "../Icon.svelte";
  import CoverArt from "./CoverArt.svelte";
  import { coverOf, finePointer } from "./WritingRow.svelte";

  // Writing on phones: a looping stack (molly.studio). The front card sits in the middle, the next ones peek out
  // behind it on the right. Swiped either way, the front card swings out to that side and slides in behind the
  // stack while the others step forward. Wider screens use WritingRow.
  let { posts }: { posts: PostSummary[] } = $props();

  let active = $state(0);
  let released = $state(false);
  let fanEl = $state<HTMLElement>();
  let stackEl = $state<HTMLElement>();
  const n = $derived(posts.length);
  const mod = (i: number) => ((i % n) + n) % n;
  // place in the stack: 0 is the front card, n − 1 the back one
  const dist = (i: number, a = active) => mod(i - a);

  // Pose per place: three peek out on the right, the rest wait hidden behind the third.
  type Pose = { x: number; r: number; s: number; o: number };
  const POSES: Pose[] = [
    { x: 0, r: 0, s: 1, o: 1 },
    { x: 18, r: 3, s: 0.95, o: 1 },
    { x: 34, r: 6, s: 0.9, o: 1 },
    { x: 48, r: 9, s: 0.85, o: 1 },
    { x: 48, r: 9, s: 0.85, o: 0 },
  ];
  const poseAt = (d: number) => POSES[Math.max(0, Math.min(POSES.length - 1, d))]!;
  const poseTransform = (p: Pose, dx = 0, dr = 0) => `translate(${p.x + dx}px, 0) rotate(${p.r + dr}deg) scale(${p.s})`;
  const restTransform = (d: number) => poseTransform(poseAt(d));
  const zOf = (d: number) => 100 - Math.min(d, 9);

  // Gesture constants (px, ms)
  const SLOP = 6;
  const DIST = 0.35; // of the card width
  const FLICK = 0.11; // px/ms, average over the drag (Sonner)
  const RUBBER = 0.2;
  const TILT = 10; // deg the front card leans per card width dragged
  const APEX = 0.72; // of the card width: how far out a card swings before it goes behind
  const BACK = 440; // ms: from the side into its new place

  let plays = $state<Record<string, number>>({});
  let delays = $state<Record<string, number>>({});
  let seen = false;
  // bookkeeping only, nothing renders from it
  const played = new Set<string>();

  // a replay inside the 1.4 s motion budget would restart a running cover from frame 0
  const lastPlay: Record<string, number> = {};
  function replay(slug: string, delay = 0) {
    const now = performance.now();
    if (now - (lastPlay[slug] ?? -1e4) < 1400) return;
    lastPlay[slug] = now;
    delays[slug] = delay;
    plays[slug] = (plays[slug] ?? 0) + 1;
  }

  function autoplay(delay: number) {
    const slug = posts[active]?.slug;
    if (!seen || !slug || played.has(slug)) return;
    played.add(slug);
    // already armed and paused: becoming the front card resumes it from frame 0
    if (plays[slug]) return;
    replay(slug, delay);
  }

  function arm() {
    for (const post of posts) if (post.slug !== posts[active]?.slug && !plays[post.slug]) replay(post.slug, 200);
  }

  function observe(stack: HTMLElement) {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        seen = true;
        autoplay(150);
        arm();
      },
      { threshold: 0.5 },
    );
    io.observe(stack);
    return () => io.disconnect();
  }

  const cards = () => [...(stackEl?.querySelectorAll<HTMLElement>(".post-card") ?? [])];

  // A card going round the loop never cuts across the deck: on next it swings out to `side` above the stack, then
  // slides in under it to the back; on previous the back card comes out from under the stack and lands on top.
  // WAAPI over the rest pose Svelte already wrote, so it ends exactly there; the slot's z-index flips at the apex.
  let flight: Animation[] = [];
  const finishFlight = () => {
    for (const f of flight) f.finish();
    flight = [];
  };

  function swing(el: HTMLElement, from: string, fromO: number, side: 1 | -1, to: Pose, toBack: boolean, out: number) {
    const total = out + BACK;
    const k = out / total;
    const apex = poseTransform({ x: side * el.offsetWidth * APEX, r: side * 12, s: 0.94, o: 1 });
    const card = el.animate(
      [
        { transform: from, opacity: fromO, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" },
        { transform: apex, opacity: 1, offset: k, easing: "cubic-bezier(0.32, 0.72, 0, 1)" },
        { transform: poseTransform(to), opacity: to.o },
      ],
      { duration: total },
    );
    const [first, last] = toBack ? [200, 0] : [0, 200];
    const z = el.parentElement!.animate(
      [{ zIndex: first }, { zIndex: first, offset: k }, { zIndex: last, offset: k }, { zIndex: last }],
      { duration: total },
    );
    // its own CSS transition stays off until the swing is over, or it would replay the jump underneath
    card.onfinish = card.oncancel = () => (el.style.transition = "");
    flight = [card, z];
  }

  // step: +1 next, −1 previous. `from` is where a released drag left the front card and how long its swing out takes.
  function go(step: 1 | -1, fromSwipe = false, side: 1 | -1 = -1, from?: { t: string; out: number }) {
    if (n < 2) return;
    finishFlight();
    const old = active;
    const el = cards()[step > 0 ? old : mod(old - 1)]!;
    const motion = !prefersReducedMotion();
    if (motion) el.style.transition = "none";
    released = fromSwipe;
    active = mod(old + step);
    if (motion) {
      flushSync();
      if (step > 0) swing(el, from?.t ?? restTransform(0), 1, side, poseAt(n - 1), true, from?.out ?? 240);
      else swing(el, restTransform(n - 1), poseAt(n - 1).o, side, POSES[0]!, false, 240);
    }
    autoplay(200);
  }

  // Cards follow the finger 1:1: transforms written on each card in the window, no Svelte state per move.
  type Drag = {
    id: number;
    x: number;
    y: number;
    t: number;
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
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: e.timeStamp, dx: 0, lastX: e.clientX, lastT: e.timeStamp, dir: 0, w: 0, all: [] };
  }

  // cards a drag paints and a release hands back
  const near = (all: HTMLElement[]) => all.filter((_, i) => dist(i) < POSES.length);

  function lock(e: PointerEvent) {
    if (!drag || !stackEl) return;
    stackEl.setPointerCapture(drag.id);
    // a card still swinging to the back lands at once: the new front card is the one under the finger
    finishFlight();
    const all = (drag.all = cards());
    drag.w = all[active]!.offsetWidth;
    for (const el of near(all)) el.style.transition = "none";
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
    drag.dx = e.clientX - drag.x;
    drag.lastT = e.timeStamp;
    paint(drag.all, drag.dx, drag.w);
  }

  // The front card is the finger, leaning toward it; the cards behind step forward by the drag's progress.
  function paint(all: HTMLElement[], dx: number, w: number) {
    // a single card has nowhere to go: it gives a little and stops
    const x = n < 2 ? dx * RUBBER : dx;
    const f = n < 2 ? 0 : Math.min(1, Math.abs(dx) / w);
    // reduced motion: the card slides with the finger but does not tilt
    const tilt = prefersReducedMotion() ? 0 : TILT;
    for (let i = 0; i < n; i++) {
      const d = dist(i);
      if (d >= POSES.length) continue;
      const el = all[i]!;
      if (d === 0) {
        el.style.transform = poseTransform(POSES[0]!, x, (x / w) * tilt);
        continue;
      }
      const p = poseAt(d);
      const q = poseAt(d - 1);
      const mix = (u: number, v: number) => u + (v - u) * f;
      el.style.transform = `translate(${mix(p.x, q.x)}px, 0) rotate(${mix(p.r, q.r)}deg) scale(${mix(p.s, q.s)})`;
      el.style.opacity = String(mix(p.o, q.o));
    }
  }

  function up(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    const { dx, w, all, t, lastT, dir } = drag;
    drag = null;
    if (!all.length) return;
    swallow = true;
    const ms = Math.max(1, e.timeStamp - t);
    // a finger held still before lifting is not a flick
    const flick = e.timeStamp - lastT < 100 && Math.abs(dx) > 12 && Math.abs(dx) / ms > FLICK;
    const side = Math.sign(dx);
    const thrown = n > 1 && e.type !== "pointercancel" && side !== 0 && (Math.abs(dx) > w * DIST || (flick && dir === side));
    const front = all[active]!;
    const hand = near(all).filter((el) => !thrown || el !== front);
    // hand the cards back to CSS: same strings Svelte renders, so a spring-back also gets its transition
    for (const el of hand) el.style.transition = "";
    if (thrown) {
      // the card keeps the speed it left the finger with on its way out to the side
      const left = Math.max(0, w * APEX - Math.abs(dx));
      const out = Math.round(Math.min(280, Math.max(140, left / Math.max(Math.abs(dx) / ms, 0.5))));
      go(1, true, side > 0 ? 1 : -1, { t: front.style.transform, out });
    } else released = true;
    for (const el of hand) {
      const d = dist(all.indexOf(el));
      el.style.transform = restTransform(d);
      el.style.opacity = String(poseAt(d).o);
    }
  }

  function onclickcapture(e: MouseEvent) {
    if (!swallow) return;
    swallow = false;
    e.preventDefault();
    e.stopPropagation();
  }

  // single-pointer alternative to the drag: a tap on a peeking card sends the front one to the back
  function onclick(e: MouseEvent) {
    const front = cards()[active];
    if (!front || front.contains(e.target as Node)) return;
    go(1);
  }

  async function onkeydown(e: KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const inCard = (e.target as HTMLElement).closest(".post-card");
    go(e.key === "ArrowRight" ? 1 : -1);
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
      {@const d = dist(i)}
      {@const cover = coverOf(post)}
      <div
        class="slot"
        data-reveal
        use:inview
        style:z-index={zOf(d)}
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
      onclick={() => go(-1)}
    >
      <Icon name="arrow-left" size={14} />
    </button>
    <span class="label-mono-sm count" aria-hidden="true">{active + 1} / {n}</span>
    <p class="sr" aria-live="polite">{posts[active]?.title}, post {active + 1} of {n}</p>
    <button
      type="button"
      class="icon-button nav"
      aria-label="Next post"
      onclick={() => go(1)}
    >
      <Icon name="arrow-right" size={14} />
    </button>
  </div>
</div>

<style>
  /* full-bleed so a swinging card reaches the screen edge, clipped here so the page never scrolls sideways */
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
  .post-card:not([data-front]) :global(.art *) { animation-play-state: paused; }
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
