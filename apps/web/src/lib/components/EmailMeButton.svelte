<script lang="ts">
  import { PERSON } from "#lib/content/site.ts";
  import Icon from "./Icon.svelte";

  // Paper plane (Figma 121:3800, motion 123:8905): press → fly out → "Mail app opened" → back after 2 s.
  let phase = $state<"idle" | "flying" | "done">("idle");
  let returned = $state(false);
  let timers: ReturnType<typeof setTimeout>[] = [];

  function send() {
    if (phase !== "idle") return;
    timers.forEach(clearTimeout);
    phase = "flying";
    returned = false;
    // open mail ~120 ms after the press so the flight is visible before the mail app takes focus
    timers = [
      setTimeout(() => (window.location.href = `mailto:${PERSON.email}`), 120),
      setTimeout(() => (phase = "done"), 270),
      setTimeout(() => {
        phase = "idle";
        returned = true;
      }, 2270),
    ];
  }
</script>

<button type="button" class="email-me" data-phase={phase} data-returned={returned} onclick={send}>
  <span class="labels">
    <span class="label idle">Email me</span>
    <span class="label done" aria-hidden={phase !== "done"}>
      <Icon name="check" size={14} class="tick" />
      Mail app opened
    </span>
  </span>
  <span class="plane" aria-hidden="true">
    <span class="trail"></span>
    <Icon name="plane" size={14} />
  </span>
</button>
<span class="sr-only" role="status">{phase === "done" ? "Mail app opened" : ""}</span>

<style>
  .email-me {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 40px;
    border: 1px solid transparent;
    border-radius: var(--radius-email);
    background: var(--surface-inverse);
    color: var(--fg-on-inverse);
    font: 500 14px/1 var(--font-sans);
    overflow: hidden;
    transition: background-color 200ms var(--ease-out), scale var(--dur-release) var(--ease-out);
  }
  .email-me:active { scale: 0.96; transition-duration: var(--dur-press); }
  .labels { display: grid; }
  .label {
    grid-area: 1 / 1;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
  .label.done { opacity: 0; translate: 0 4px; }
  .label.idle { transition: opacity 150ms var(--ease-out), translate 150ms var(--ease-out); }
  .label.done { transition: opacity 200ms var(--ease-out), translate 200ms var(--ease-out); }
  .label.done :global(.tick) {
    scale: 0.25;
    filter: blur(4px);
    transition: scale 300ms var(--ease-out), filter 300ms var(--ease-out);
  }
  .plane {
    position: relative;
    display: grid;
    transition: translate 300ms var(--ease-out), rotate 300ms var(--ease-out), opacity 300ms var(--ease-out), scale 300ms var(--ease-out);
  }
  .trail {
    position: absolute;
    right: 100%;
    top: 50%;
    width: 14px;
    height: 1px;
    margin-right: 2px;
    background: repeating-linear-gradient(90deg, currentColor 0 3px, transparent 3px 5px);
    opacity: 0;
    transition: opacity 200ms var(--ease-out);
  }

  @media (hover: hover) and (pointer: fine) {
    .email-me[data-phase="idle"]:hover { background: color-mix(in srgb, var(--surface-inverse) 88%, var(--bg-page)); }
    .email-me[data-phase="idle"]:hover .plane { translate: 6px -3px; rotate: -12deg; transition-duration: 200ms; }
    .email-me[data-phase="idle"]:hover .trail { opacity: 0.55; }
  }

  /* flight: starts 80 ms after the press, 160 ms linear then 260 ms ease-flow */
  .email-me[data-phase="flying"] .plane,
  .email-me[data-phase="done"] .plane {
    translate: 70px -34px;
    rotate: -32deg;
    scale: 0.8;
    opacity: 0;
    transition: translate 420ms var(--ease-flow) 80ms, rotate 420ms var(--ease-flow) 80ms, scale 420ms var(--ease-flow) 80ms,
      opacity 260ms linear 240ms;
  }
  .email-me[data-phase="flying"] .label.idle,
  .email-me[data-phase="done"] .label.idle {
    opacity: 0;
    translate: 0 -4px;
    transition-delay: 120ms;
  }
  .email-me[data-phase="done"] .label.done { opacity: 1; translate: 0 0; }
  .email-me[data-phase="done"] .label.done :global(.tick) { scale: 1; filter: blur(0); }
  /* return: plane slides in from 8 px left (one-shot, guarded by the phase so it never retriggers mid-flight) */
  .email-me[data-returned="true"] .plane { animation: plane-in 300ms var(--ease-out); }
  @keyframes plane-in {
    from { translate: -8px 0; opacity: 0; }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* reduced motion ("Dikurangi"): no flight or rotation, labels crossfade 150 ms */
  @media (prefers-reduced-motion: reduce) {
    .email-me:active { scale: 1; }
    .plane, .email-me .plane { translate: none !important; rotate: none !important; scale: 1 !important; transition: opacity 150ms ease-out !important; }
    .label.idle, .label.done { translate: none !important; transition: opacity 150ms ease-out !important; }
    .label.done :global(.tick) { scale: 1; filter: none; }
  }
</style>
