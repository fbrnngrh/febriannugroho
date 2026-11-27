<script lang="ts">
  import type { Component } from "svelte";
  import { STAGE_CHAPTERS } from "#lib/content/site.ts";
  import { EASE_OUT, cubicBezier, prefersReducedMotion } from "#lib/motion.ts";
  import ArrowLink from "../ArrowLink.svelte";
  import "./scenes/scene.css";
  import CiDocker from "./scenes/CiDocker.svelte";
  import CiGates from "./scenes/CiGates.svelte";
  import CiLive from "./scenes/CiLive.svelte";
  import CiManual from "./scenes/CiManual.svelte";
  import FleetAgents from "./scenes/FleetAgents.svelte";
  import FleetIssue from "./scenes/FleetIssue.svelte";
  import FleetMerged from "./scenes/FleetMerged.svelte";
  import FleetSplit from "./scenes/FleetSplit.svelte";
  import SiteFigma from "./scenes/SiteFigma.svelte";
  import SiteLive from "./scenes/SiteLive.svelte";
  import SitePr from "./scenes/SitePr.svelte";
  import SiteSvelte from "./scenes/SiteSvelte.svelte";

  // One media card that plays 12 shots in 3 chapters as a single looping video (07-panggung-v3).
  // No slide UI: the card itself is the pause button; colour changes inside the chapter crossfade.
  const SHOTS: { chapter: number; scene: Component }[] = [
    { chapter: 0, scene: FleetIssue },
    { chapter: 0, scene: FleetSplit },
    { chapter: 0, scene: FleetAgents },
    { chapter: 0, scene: FleetMerged },
    { chapter: 1, scene: CiManual },
    { chapter: 1, scene: CiGates },
    { chapter: 1, scene: CiDocker },
    { chapter: 1, scene: CiLive },
    { chapter: 2, scene: SiteFigma },
    { chapter: 2, scene: SiteSvelte },
    { chapter: 2, scene: SitePr },
    { chapter: 2, scene: SiteLive },
  ];
  const SHOT_MS = 1800;
  const LAST_SHOT_MS = 2200;
  const isLastOfChapter = (i: number) => SHOTS[i + 1]?.chapter !== SHOTS[i]!.chapter;
  const durationOf = (i: number) => (isLastOfChapter(i) ? LAST_SHOT_MS : SHOT_MS);
  const lastShotOf = (c: number) => SHOTS.findLastIndex((s) => s.chapter === c);
  const ease = cubicBezier(...EASE_OUT);

  // No JS / before the first view: the last shot of chapter 1, animations off (= final frame).
  const START = lastShotOf(0);
  let index = $state(START);
  let still = $state(true);
  let paused = $state(false);
  let focusHold = $state(false);
  let reduced = $state(false);
  let visible = $state(false);
  let tabHidden = $state(false);
  let seen = $state(false);
  let section = $state<HTMLElement>();
  /** time left in the current shot, kept across pauses so play resumes where it stopped */
  let remaining = durationOf(START);

  const stopped = $derived(paused || focusHold);
  const running = $derived(!still && !stopped && visible && !tabHidden);
  const chapter = $derived(SHOTS[index]!.chapter);
  const current = $derived(STAGE_CHAPTERS[chapter]!);
  const Scene = $derived(SHOTS[index]!.scene);
  const shotInChapter = $derived(index - SHOTS.findIndex((s) => s.chapter === chapter));

  // The chapter tone lives on <html>, so hero aura, page glow, frame and scene move together.
  $effect(() => {
    document.documentElement.dataset.stage = current.id;
  });
  $effect(() => () => {
    delete document.documentElement.dataset.stage;
  });

  $effect(() => {
    const r = prefersReducedMotion();
    reduced = r;
    const onVis = () => (tabHidden = document.visibilityState === "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) seen = true;
        visible = entry.intersectionRatio >= 0.1;
        // the stage is always below the fold: the video starts at shot 1 the first time it is seen
        if (visible && still && !r) {
          still = false;
          index = 0;
          remaining = durationOf(0);
        }
      },
      { threshold: [0, 0.1] },
    );
    if (section) io.observe(section);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  });

  // One clock for the active shot. Stopping keeps the time left; playing continues from there.
  $effect(() => {
    if (!running) return;
    void index;
    const t0 = performance.now();
    let fired = false;
    const id = setTimeout(() => {
      fired = true;
      index = (index + 1) % SHOTS.length;
      remaining = durationOf(index);
    }, remaining);
    return () => {
      clearTimeout(id);
      if (!fired) remaining = Math.max(0, remaining - (performance.now() - t0));
    };
  });

  function toggle() {
    if (reduced) {
      index = lastShotOf((chapter + 1) % STAGE_CHAPTERS.length);
      return;
    }
    if (stopped) {
      paused = false;
      focusHold = false;
    } else {
      paused = true;
    }
  }

  function shotIn(_: Element) {
    if (reduced) return { duration: 200, css: (t: number) => `opacity: ${t}` };
    return { duration: 240, css: (t: number) => `opacity: ${ease(t)}; translate: 0 ${(1 - ease(t)) * 8}px` };
  }
  function shotOut(_: Element) {
    if (reduced) return { duration: 200, css: (t: number) => `opacity: ${t}` };
    return { duration: 240, css: (_t: number, u: number) => `opacity: ${1 - ease(u)}; translate: 0 ${-8 * ease(u)}px` };
  }
</script>

<section class="stage-section" bind:this={section} aria-label="Showcase">
  <!-- One glow set in the chapter colour (--stage-c / --stage-c2 on :root): 6 blurred layers.
       --glow-shift lives here, not on the section, so a shot change restyles 6 nodes instead of the scene. -->
  <div class="glows" aria-hidden="true" style:--glow-shift={reduced ? 0 : shotInChapter}>
    <span class="tint"></span>
    <span class="orb o1"></span>
    <span class="orb o2"></span>
    <span class="orb o3"></span>
    <span class="cloud c1"></span>
    <span class="cloud c2"></span>
  </div>

  <div class="col-stage inner" class:seen>
    <button
      type="button"
      class="frame"
      class:still
      class:halt={!running && !still}
      aria-pressed={reduced ? undefined : stopped}
      aria-label={reduced ? "Show next scene" : "Pause showcase"}
      onclick={toggle}
      onfocusin={(e) => {
        // keyboard focus holds the video (WCAG 2.2.2); a mouse click does not
        if (!reduced && e.currentTarget.matches(":focus-visible")) focusHold = true;
      }}
      onfocusout={() => (focusHold = false)}
    >
      <span class="screen">
        {#key index}
          <span class="shot" in:shotIn out:shotOut>
            <Scene />
          </span>
        {/key}
      </span>
      <span class="badge paused-label" class:on={stopped && !reduced} aria-hidden="true">Paused</span>
      <span class="badge hover-hint" class:off={stopped} aria-hidden="true">{reduced ? "Next scene" : "Click to pause"}</span>
    </button>

    <div class="caption" aria-live={running ? "off" : "polite"}>
      {#key chapter}
        <div class="caption-text" in:shotIn out:shotOut>
          <h2 class="cap-title">{current.title}</h2>
          <p class="cap-body">{current.caption}</p>
          {#if "link" in current}
            <ArrowLink href={current.link.href} label={current.link.label} size="sm" />
          {/if}
        </div>
      {/key}
    </div>
  </div>
</section>

<style>
  .stage-section {
    position: relative;
    isolation: isolate;
    /* the blurred glow may pass the viewport edge; never a horizontal scrollbar */
    overflow-x: clip;
  }

  .glows {
    position: absolute;
    inset: -320px 0 -260px;
    z-index: -1;
    pointer-events: none;
    /* soft top and bottom edge instead of a clipped box */
    mask-image: linear-gradient(to bottom, transparent, #000 20%, #000 75%, transparent);
  }
  .tint {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent, var(--tint) 30%, var(--tint) 70%, transparent);
    --tint: color-mix(in oklab, var(--stage-c) 22%, var(--bg-page));
    opacity: 0.5;
  }
  .orb, .cloud { position: absolute; border-radius: 50%; }
  /* slow drift per shot inside a chapter: up to 90 px desktop, 40 px on phones */
  .orb {
    --drift: 90px;
    will-change: translate;
    translate: calc(var(--glow-shift) / 3 * var(--drift)) calc(var(--glow-shift) / 3 * var(--drift) * -0.4);
    transition: translate 1.8s var(--ease-stage);
  }
  .o1 { left: 8%; top: 18%; width: 62%; height: 52%; background: var(--stage-c); opacity: var(--stage-glow-opacity-1); filter: blur(160px); }
  .o2 { right: 2%; top: 34%; width: 44%; height: 42%; background: var(--stage-c2); opacity: var(--stage-glow-opacity-2); filter: blur(120px); }
  .o3 { left: 30%; top: 48%; width: 40%; height: 34%; background: var(--stage-c); opacity: var(--stage-glow-opacity-3); filter: blur(90px); }
  .c1 { left: -6%; top: 6%; width: 50%; height: 30%; background: var(--stage-c2); opacity: var(--stage-cloud-opacity-1); filter: blur(200px); }
  .c2 { right: -8%; bottom: 6%; width: 55%; height: 30%; background: var(--stage-c); opacity: var(--stage-cloud-opacity-2); filter: blur(110px); }
  @media (max-width: 767.98px) {
    .glows { inset: -200px 0 -160px; }
    .orb { --drift: 40px; }
  }

  .frame {
    --pad: clamp(16px, 3.8vw, 40px);
    position: relative;
    display: block;
    width: 100%;
    padding: var(--pad);
    border: 1px solid transparent;
    border-radius: var(--radius-stage);
    background: color-mix(in oklab, var(--stage-c) 70%, var(--surface-default));
    box-shadow: var(--shadow-ring-1);
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: default;
    transition: translate 200ms var(--ease-out), scale 150ms var(--ease-out);
  }
  /* dark mode is not designed yet (07 §4): provisional 38% frame */
  :global(.dark) .frame { background: color-mix(in oklab, var(--stage-c) 38%, var(--surface-default)); }
  /* press is quicker than the release (100 / 150 ms) */
  .frame:active { scale: 0.99; transition-duration: 200ms, var(--dur-press); }

  .screen {
    /* chapter colours for the scene; the dark values are provisional until Febrian reviews them */
    --s-bg: var(--scene-bg);
    --s-soft: var(--scene-soft);
    --s-mid: var(--scene-mid);
    --s-acc: var(--scene-acc);
    --s-ink: var(--scene-ink);
    --s-muted: var(--scene-muted);
    --s-paper: #fff;
    --s-on-acc: #fff;
    --s-deep: var(--scene-ink);
    --s-on-deep: var(--scene-soft);
    position: relative;
    display: grid;
    overflow: hidden;
    aspect-ratio: 720 / 420;
    border-radius: var(--radius-card);
    /* one background layer: shots never paint their own, so a chapter crossfade never mixes two */
    background: var(--s-bg);
  }
  :global(.dark) .screen {
    --s-bg: color-mix(in oklab, var(--scene-bg) 18%, var(--surface-default));
    --s-soft: color-mix(in oklab, var(--scene-mid) 28%, var(--surface-default));
    --s-mid: color-mix(in oklab, var(--scene-mid) 50%, var(--surface-default));
    --s-ink: var(--scene-soft);
    --s-muted: color-mix(in oklab, var(--scene-soft) 72%, var(--surface-default));
    --s-paper: color-mix(in oklab, var(--scene-bg) 6%, var(--surface-default));
  }
  .shot { grid-area: 1 / 1; display: block; min-width: 0; min-height: 0; }
  .halt :global(.scene *) { animation-play-state: paused !important; }
  .still :global(.scene *) { animation: none !important; }

  .badge {
    position: absolute;
    right: 14px;
    bottom: 14px;
    z-index: 1;
    padding: 6px 10px;
    border-radius: var(--radius-pill);
    background: var(--surface-default);
    box-shadow: var(--shadow-button);
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1;
    color: var(--fg-default);
    opacity: 0;
    pointer-events: none;
    transition: opacity 150ms var(--ease-out);
  }
  .paused-label.on { opacity: 1; }

  @media (hover: hover) and (pointer: fine) {
    .frame { cursor: pointer; }
    .frame:hover .hover-hint:not(.off) { opacity: 1; }
  }
  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .frame:hover { translate: 0 -2px; }
  }

  .caption { display: grid; margin-top: 16px; }
  .caption-text { grid-area: 1 / 1; display: grid; gap: 4px; justify-items: start; align-content: start; max-width: 380px; }
  .cap-title { margin: 0; font-size: 13px; font-weight: 500; line-height: 1.4; }
  .cap-body { margin: 0 0 6px; font-size: 13px; line-height: 1.4; color: var(--fg-muted); }

  /* Scroll: the card grows 0.8 → 1 and the glow opens while it enters (Chrome); fallback below */
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .inner {
        transform-origin: 50% 0;
        animation: stage-grow linear both;
        animation-timeline: view();
        animation-range: entry 0% cover 45%;
      }
      .glows {
        animation: glow-open linear both;
        animation-timeline: view();
        animation-range: entry 0% cover 40%;
      }
    }
  }
  @keyframes stage-grow { from { scale: 0.8; } }
  @keyframes glow-open { from { opacity: 0; scale: 0.7; } }

  @supports not (animation-timeline: view()) {
    :global(.js) .inner:not(.seen) { opacity: 0; scale: 0.92; }
    .inner { transform-origin: 50% 0; transition: opacity 500ms var(--ease-out), scale 500ms var(--ease-out); }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.js) .inner:not(.seen) { scale: 1; }
    .inner { transition: opacity 200ms ease-out; }
  }

  @media (max-width: 767.98px) {
    /* phones: square card, the 720 × 420 scene is cropped to its centre (x 150–570) */
    .screen { aspect-ratio: 1; border-radius: calc(var(--radius-stage) - 16px); }
  }
</style>
