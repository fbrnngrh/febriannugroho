<script lang="ts">
  import type { Snippet } from "svelte";
  import { goto } from "$app/navigation";
  import Icon from "./Icon.svelte";

  // Hover/focus preview (Figma 26:1171). Stays open while the pointer is on it, Esc dismisses (WCAG 1.4.13).
  let {
    href,
    label,
    meta,
    image,
    imageAlt = "",
    external = false,
    class: linkClass = "text-link",
    children,
  }: {
    href: string;
    label: string;
    meta: string;
    /** screenshot of the target, shown at 280×175 above the label */
    image?: string;
    imageAlt?: string;
    /** opens in a new tab; the card shows an external icon and screen readers hear it */
    external?: boolean;
    class?: string;
    /** custom trigger content (logos, icons); defaults to the label */
    children?: Snippet;
  } = $props();

  const CARD_W = { image: 296, text: 240 };
  const EDGE = 16;

  let hover = $state(false);
  let focus = $state(false);
  let dismissed = $state(false);
  let imageFailed = $state(false);
  let side = $state<"top" | "bottom">("top");
  let left = $state(0);
  let originX = $state(0);
  let width = $state(CARD_W.text);
  const open = $derived((hover || focus) && !dismissed);
  const showImage = $derived(!!image && !imageFailed);
  const id = $props.id();

  let wrap: HTMLElement;
  let link: HTMLAnchorElement;

  // Keep the card inside the viewport and grow it from the link: x clamps to the edges, y flips below near the top.
  function place() {
    const vw = document.documentElement.clientWidth;
    const w = (width = Math.min(showImage ? CARD_W.image : CARD_W.text, vw - 2 * EDGE));
    // first line box: a link that wraps measures from where it starts, and so does the absolute card
    const t = link.getClientRects()[0] ?? link.getBoundingClientRect();
    const box = wrap.getClientRects()[0] ?? wrap.getBoundingClientRect();
    const centre = t.left + t.width / 2;
    const x = Math.min(Math.max(centre - w / 2, EDGE), vw - EDGE - w);
    left = x - box.left;
    originX = centre - x;
    side = t.top < (showImage ? 270 : 140) ? "bottom" : "top";
  }

  function show(via: "hover" | "focus") {
    place();
    dismissed = false;
    if (via === "hover") hover = true;
    else focus = true;
  }

  function follow() {
    if (external) window.open(href, "_blank", "noopener,noreferrer");
    else goto(href);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && open) dismissed = true;
  }
</script>

<svelte:window {onkeydown} />

<span
  class="wrap"
  role="presentation"
  bind:this={wrap}
  onpointerenter={(e) => {
    if (e.pointerType === "mouse" && matchMedia("(hover: hover) and (pointer: fine)").matches) show("hover");
  }}
  onpointerleave={() => (hover = false)}
>
  <a
    {href}
    class={linkClass}
    aria-describedby={id}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    bind:this={link}
    onfocus={() => show("focus")}
    onblur={() => (focus = false)}
    >{#if children}{@render children()}{:else}{label}{/if}{#if external}<span class="sr-only">
        (opens in a new tab)</span
      >{/if}</a
  ><!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions --><span
    class="preview"
    {id}
    role="tooltip"
    data-open={open}
    data-side={side}
    style:--left="{left}px"
    style:--origin-x="{originX}px"
    style:--tilt="{(originX < width / 2 ? 2 : -2) * (side === 'top' ? 1 : -1)}deg"
    style:width="{width}px"
    onclick={follow}
  >
    {#if showImage}
      <img
        class="shot"
        src={image}
        alt={imageAlt}
        width="280"
        height="175"
        loading="lazy"
        decoding="async"
        onerror={() => (imageFailed = true)}
      />
    {:else if !image}
      <span class="art" aria-hidden="true"><span></span><span></span><span></span></span>
    {/if}
    <span class="p-text">
      <span class="p-title">{label}</span>
      <span class="p-meta">{meta} <Icon name={external ? "external" : "arrow-right"} size={12} /></span>
    </span>
  </span>
</span>

<style>
  /* one line: a trigger wrapped over two lines left the card unreachable from its second half (WCAG 1.4.13) */
  .wrap { position: relative; display: inline; white-space: nowrap; }
  .preview {
    position: absolute;
    left: var(--left);
    bottom: calc(100% + 8px);
    z-index: 5;
    /* closed cards leave the layout, so they never widen the page */
    display: none;
    gap: 6px;
    padding: 8px;
    border: 1px solid transparent;
    border-radius: var(--radius-round);
    background: var(--surface-default);
    box-shadow: var(--shadow-hover-card);
    transform-origin: var(--origin-x) bottom;
    opacity: 0;
    scale: 0.97;
    pointer-events: none;
    transition:
      opacity 150ms var(--ease-out),
      scale 150ms var(--ease-out),
      display 150ms allow-discrete;
  }
  .preview[data-side="bottom"] { bottom: auto; top: calc(100% + 8px); transform-origin: var(--origin-x) top; }
  /* bridge the 8 px gap so moving onto the preview keeps it open */
  .preview::after { content: ""; position: absolute; inset: 100% 0 -10px; }
  .preview[data-side="bottom"]::after { inset: -10px 0 100%; }
  .preview[data-open="true"] {
    display: grid;
    opacity: 1;
    scale: 1;
    pointer-events: auto;
    cursor: pointer;
    transition:
      opacity 200ms var(--ease-out),
      scale 200ms var(--ease-out),
      translate 200ms var(--ease-out),
      rotate 200ms var(--ease-out),
      display 200ms allow-discrete;
  }
  @starting-style {
    .preview[data-open="true"] { opacity: 0; scale: 0.97; }
  }
  /* the twist: the card rises out of the link with a slight tilt that settles level */
  @media (prefers-reduced-motion: no-preference) {
    @starting-style {
      .preview[data-open="true"][data-side="top"] { translate: 0 6px; rotate: var(--tilt); }
      .preview[data-open="true"][data-side="bottom"] { translate: 0 -6px; rotate: var(--tilt); }
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .preview, .preview[data-open="true"] { scale: 1; }
    @starting-style {
      .preview[data-open="true"] { scale: 1; }
    }
  }
  .shot {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 280 / 175;
    border-radius: var(--radius-button);
    object-fit: cover;
    object-position: top;
    background: var(--surface-muted);
    outline: 1px solid var(--image-outline);
    outline-offset: -1px;
  }
  .art {
    display: grid;
    gap: 6px;
    padding: 14px;
    border-radius: var(--radius-button);
    background: var(--ci-subtle);
  }
  .art span { height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--ci-solid) 45%, transparent); }
  .art span:nth-child(2) { width: 70%; }
  .art span:nth-child(3) { width: 45%; }
  .p-text { display: grid; gap: 2px; padding: 2px 4px; }
  .p-title { font-size: 14px; font-weight: 500; line-height: 1.4; color: var(--fg-default); }
  .p-meta { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; line-height: 1.4; color: var(--fg-muted); }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
