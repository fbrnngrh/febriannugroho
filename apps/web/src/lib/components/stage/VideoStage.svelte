<script lang="ts">
  import { untrack } from "svelte";
  import { STAGE_SLIDES } from "#lib/content/site.ts";
  import { EASE_OUT, cubicBezier, prefersReducedMotion } from "#lib/motion.ts";
  import ArrowLink from "../ArrowLink.svelte";
  import Icon from "../Icon.svelte";
  import StageScene from "./StageScene.svelte";

  // Video stage (Figma 205:18366, notes 207:1660, motion 04-motion.md §6).
  const SHOT_MS = 1800;
  const LAST_SHOT_MS = 2200;
  const SHOTS = 4;
  const ease = cubicBezier(...EASE_OUT);

  // No-JS / SSR shows the last shot of slide 1 (03-ux-pages.md §5).
  let slide = $state(0);
  let shot = $state(SHOTS - 1);
  let started = false;
  let paused = $state(false);
  let reduced = $state(false);
  let hovering = $state(false);
  let focusedWithin = $state(false);
  let visible = $state(false);
  let tabHidden = $state(false);
  let runToken = $state(0);
  let section = $state<HTMLElement>();

  const running = $derived(!paused && !hovering && !focusedWithin && visible && !tabHidden);
  const current = $derived(STAGE_SLIDES[slide]!);
  const tone = $derived(current.tones[shot] ?? current.tones[0]);
  const duration = $derived(shot === SHOTS - 1 ? LAST_SHOT_MS : SHOT_MS);

  $effect(() => {
    const r = prefersReducedMotion();
    reduced = r;
    if (r) paused = true;
    const onVis = () => (tabHidden = document.visibilityState === "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry && entry.intersectionRatio >= 0.1;
        // first time it is seen (always below the fold), start the story from shot 1
        if (visible && !started && !r) {
          started = true;
          shot = 0;
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

  // One timer. Stopping clears it; resuming restarts the current shot (handoff allows a full restart).
  $effect(() => {
    if (!running) return;
    untrack(() => runToken++);
    const last = shot === SHOTS - 1;
    const id = setTimeout(() => {
      if (last) {
        slide = (slide + 1) % STAGE_SLIDES.length;
        shot = reduced ? SHOTS - 1 : 0;
      } else {
        shot += 1;
      }
    }, duration);
    return () => clearTimeout(id);
  });

  function goTo(i: number) {
    slide = i;
    shot = reduced ? SHOTS - 1 : 0;
  }

  function shotIn(_: Element) {
    if (reduced) return { duration: 200, css: (t: number) => `opacity: ${t}` };
    return { duration: 240, css: (t: number) => `opacity: ${ease(t)}; translate: 0 ${(1 - ease(t)) * 8}px` };
  }
  function shotOut(_: Element) {
    if (reduced) return { duration: 200, css: (t: number) => `opacity: ${t}` };
    return { duration: 240, css: (_t: number, u: number) => `opacity: ${1 - ease(u)}; translate: 0 ${-8 * ease(u)}px` };
  }

  const pad = (n: number) => String(n).padStart(2, "0");
</script>

<section
  class="stage-section"
  bind:this={section}
  aria-roledescription="carousel"
  aria-label="Showcase"
  style:--accent="var(--stage-accent-{tone})"
  style:--glow-shift={reduced ? 0 : shot}
  onpointerenter={(e) => e.pointerType === "mouse" && (hovering = true)}
  onpointerleave={() => (hovering = false)}
  onfocusin={() => (focusedWithin = true)}
  onfocusout={(e) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) focusedWithin = false;
  }}
>
  <!-- Page glow follows the slide colour: stacked sets crossfade on opacity (no background-color paint). -->
  <div class="glows" aria-hidden="true">
    {#each ["merged", "fail", "pass", "claude"] as t (t)}
      <div class="glow-set" class:active={t === tone} style:--g1="var(--stage-glow-{t})" style:--g2="var(--stage-glow-{t}-2)" style:--tint="var(--stage-tint-{t})">
        <span class="tint"></span>
        <span class="orb o1"></span>
        <span class="orb o2"></span>
        <span class="orb o3"></span>
        <span class="cloud c1"></span>
        <span class="cloud c2"></span>
      </div>
    {/each}
  </div>

  <div class="col-stage inner">
    <div class="frame">
      {#each ["merged", "fail", "pass", "claude"] as t (t)}
        <span class="frame-tint" class:active={t === tone} style:--frame="var(--stage-glow-{t})" aria-hidden="true"></span>
      {/each}
      <div class="screen">
        {#key `${slide}-${shot}`}
          <div class="shot" in:shotIn out:shotOut>
            <StageScene {slide} {shot} />
          </div>
        {/key}
      </div>
    </div>

    <div class="caption">
      <div class="caption-text">
        <h2 class="cap-title">{current.title}</h2>
        <p class="cap-body">{current.caption}</p>
        {#if current.link}
          <ArrowLink href={current.link.href} label={current.link.label} size="sm" />
        {/if}
      </div>
      <div class="controls">
        <span class="label-mono-sm counter" aria-live={running ? "off" : "polite"}>{pad(slide + 1)} / {pad(STAGE_SLIDES.length)}</span>
        <div class="segments">
          {#each STAGE_SLIDES as s, i (s.title)}
            <button
              type="button"
              class="segment"
              aria-label="Show slide {i + 1} of {STAGE_SLIDES.length}: {s.title}"
              aria-current={i === slide ? "true" : undefined}
              onclick={() => goTo(i)}
            >
              <span class="track">
                {#if i < slide}
                  <span class="fill full"></span>
                {:else if i === slide}
                  {#key `${slide}-${shot}-${runToken}`}
                    <span
                      class="fill"
                      class:still={reduced}
                      style:--from={shot / SHOTS}
                      style:--to={(shot + 1) / SHOTS}
                      style:--dur="{duration}ms"
                      style:animation-play-state={running ? "running" : "paused"}
                    ></span>
                  {/key}
                {/if}
              </span>
            </button>
          {/each}
        </div>
        <button
          type="button"
          class="icon-button pause"
          aria-label={paused ? "Play showcase" : "Pause showcase"}
          aria-pressed={paused}
          onclick={() => (paused = !paused)}
        >
          <Icon name={paused ? "play" : "pause"} size={12} />
        </button>
      </div>
    </div>
  </div>
</section>

<style>
  .stage-section {
    position: relative;
    isolation: isolate;
  }

  .glows {
    position: absolute;
    inset: -320px 0 -260px;
    z-index: -1;
    pointer-events: none;
    overflow: hidden;
    contain: strict;
  }
  .glow-set {
    position: absolute;
    inset: 0;
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--dur-stage-bg) var(--ease-stage), visibility 0s linear var(--dur-stage-bg);
  }
  .glow-set.active {
    opacity: 1;
    visibility: visible;
    transition: opacity var(--dur-stage-bg) var(--ease-stage), visibility 0s;
  }
  .tint {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent, var(--tint) 30%, var(--tint) 70%, transparent);
    opacity: 0.5;
  }
  .orb, .cloud { position: absolute; border-radius: 50%; }
  .orb { will-change: transform; transition: translate 1.8s var(--ease-stage); }
  /* slow drift per shot: up to 90 px desktop, 45% of that on phones */
  .orb {
    --drift: 90px;
    translate: calc(var(--glow-shift) / 3 * var(--drift)) calc(var(--glow-shift) / 3 * var(--drift) * -0.4);
  }
  .o1 { left: 8%; top: 18%; width: 62%; height: 52%; background: var(--g1); opacity: var(--stage-glow-opacity-1); filter: blur(160px); }
  .o2 { right: 2%; top: 34%; width: 44%; height: 42%; background: var(--g2); opacity: var(--stage-glow-opacity-2); filter: blur(120px); }
  .o3 { left: 30%; top: 48%; width: 40%; height: 34%; background: var(--g1); opacity: var(--stage-glow-opacity-3); filter: blur(90px); }
  .c1 { left: -6%; top: 6%; width: 50%; height: 30%; background: var(--g2); opacity: var(--stage-cloud-opacity-1); filter: blur(200px); }
  .c2 { right: -8%; bottom: 6%; width: 55%; height: 30%; background: var(--g1); opacity: var(--stage-cloud-opacity-2); filter: blur(110px); }
  @media (max-width: 767.98px) {
    .glows { inset: -200px 0 -160px; }
    .orb { --drift: 40px; }
  }

  .frame {
    padding: clamp(16px, 3.8vw, 40px);
    border-radius: var(--radius-stage);
    position: relative;
    isolation: isolate;
    background: var(--surface-default);
    box-shadow: var(--shadow-ring-1);
  }
  /* the incoming tone fades in on top; the outgoing one drops out only after it is covered */
  .frame-tint {
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background: color-mix(in srgb, var(--frame) 70%, var(--surface-default));
    opacity: 0;
    transition: opacity 0s linear var(--dur-stage-bg);
  }
  .frame-tint.active {
    z-index: 0;
    opacity: 1;
    transition: opacity var(--dur-stage-bg) var(--ease-stage);
  }
  .screen {
    position: relative;
    z-index: 1;
    display: grid;
    aspect-ratio: 960 / 560;
    min-height: 320px;
  }
  .shot {
    grid-area: 1 / 1;
    min-width: 0;
    min-height: 0;
  }
  @media (max-width: 767.98px) {
    .screen { aspect-ratio: auto; height: 470px; }
  }

  .caption {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    margin-top: 16px;
  }
  .caption-text { display: grid; gap: 4px; justify-items: start; max-width: 380px; }
  .cap-title { margin: 0; font-size: 13px; font-weight: 500; line-height: 1.4; }
  .cap-body { margin: 0 0 6px; font-size: 13px; line-height: 1.4; color: var(--fg-muted); }
  .controls { display: flex; align-items: center; gap: 10px; flex: none; }
  .segments { display: flex; }
  .segment {
    display: grid;
    align-items: center;
    width: 28px;
    height: 32px;
    padding: 0 2px;
    border: 0;
    background: none;
  }
  .track {
    position: relative;
    display: block;
    height: 2px;
    border-radius: var(--radius-xs);
    background: var(--line-strong);
    overflow: hidden;
  }
  .fill {
    position: absolute;
    inset: 0;
    background: var(--accent);
    transform-origin: left;
    scale: var(--to) 1;
    animation: seg-fill var(--dur) linear both;
  }
  .fill.full { scale: 1 1; animation: none; }
  .fill.still { animation: none; scale: 1 1; transition: background-color 200ms ease-out; }
  @keyframes seg-fill {
    from { scale: var(--from) 1; }
    to { scale: var(--to) 1; }
  }
  .pause { width: 32px; height: 32px; }
  @media (prefers-reduced-motion: reduce) {
    .stage-section { --dur-stage-bg: 200ms; }
  }
  @media (max-width: 767.98px) {
    .caption { flex-direction: column; gap: 12px; }
    .pause { width: 44px; height: 44px; border-radius: 22px; }
  }
</style>
