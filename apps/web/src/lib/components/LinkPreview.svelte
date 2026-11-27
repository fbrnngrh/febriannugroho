<script lang="ts">
  import { goto } from "$app/navigation";
  import Icon from "./Icon.svelte";

  // Hover/focus preview (Figma 26:1171). Stays open while the pointer is on it, Esc dismisses (WCAG 1.4.13).
  let { href, label, meta }: { href: string; label: string; meta: string } = $props();

  let hover = $state(false);
  let focus = $state(false);
  let dismissed = $state(false);
  const open = $derived((hover || focus) && !dismissed);
  const id = `preview-${Math.random().toString(36).slice(2, 8)}`;

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && open) dismissed = true;
  }
</script>

<svelte:window {onkeydown} />

<span
  class="wrap"
  role="presentation"
  onpointerenter={(e) => {
    if (e.pointerType === "mouse") {
      hover = true;
      dismissed = false;
    }
  }}
  onpointerleave={() => (hover = false)}
>
  <a
    {href}
    class="text-link"
    aria-describedby={id}
    onfocus={() => {
      focus = true;
      dismissed = false;
    }}
    onblur={() => (focus = false)}>{label}</a
  >
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
  <span class="preview" {id} role="tooltip" data-open={open} onclick={() => goto(href)}>
    <span class="art" aria-hidden="true"><span></span><span></span><span></span></span>
    <span class="p-title">{label}</span>
    <span class="p-meta">{meta} <Icon name="arrow-right" size={12} /></span>
  </span>
</span>

<style>
  .wrap { position: relative; display: inline; }
  .preview {
    position: absolute;
    left: 50%;
    bottom: calc(100% + 8px);
    z-index: 5;
    display: grid;
    gap: 4px;
    width: 240px;
    padding: 10px;
    border: 1px solid transparent;
    border-radius: 14px;
    background: var(--surface-default);
    box-shadow: var(--shadow-hover-card);
    translate: -50% 0;
    transform-origin: bottom center;
    opacity: 0;
    scale: 0.98;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 100ms var(--ease-out), scale 100ms var(--ease-out), visibility 0s linear 100ms;
  }
  /* bridge the 8 px gap so moving onto the preview keeps it open */
  .preview::after { content: ""; position: absolute; inset: 100% 0 -10px; }
  .preview[data-open="true"] {
    opacity: 1;
    scale: 1;
    visibility: visible;
    pointer-events: auto;
    cursor: pointer;
    transition: opacity 150ms var(--ease-out), scale 150ms var(--ease-out), visibility 0s;
  }
  .art {
    display: grid;
    gap: 6px;
    padding: 14px;
    margin-bottom: 6px;
    border-radius: 8px;
    background: var(--ci-subtle);
  }
  .art span { height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--ci-solid) 45%, transparent); }
  .art span:nth-child(2) { width: 70%; }
  .art span:nth-child(3) { width: 45%; }
  .p-title { font-size: 14px; font-weight: 500; line-height: 1.4; color: var(--fg-default); }
  .p-meta { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--fg-muted); }
  @media (hover: none) {
    .preview:not(:focus-within) { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .preview, .preview[data-open="true"] { scale: 1; }
  }
</style>
