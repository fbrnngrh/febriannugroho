<script lang="ts">
  import Icon from "./Icon.svelte";

  let {
    value,
    label = "Copy",
    selectOnFail,
    variant = "chip",
  }: {
    value: string;
    label?: string;
    /** element whose text gets selected when the clipboard is refused */
    selectOnFail?: () => HTMLElement | null | undefined;
    variant?: "chip" | "code";
  } = $props();

  let state = $state<"idle" | "copied" | "failed">("idle");
  let timer: ReturnType<typeof setTimeout> | undefined;
  $effect(() => () => clearTimeout(timer));

  async function copy() {
    clearTimeout(timer);
    try {
      await navigator.clipboard.writeText(value);
      state = "copied";
    } catch {
      state = "failed";
      const el = selectOnFail?.();
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
    timer = setTimeout(() => (state = "idle"), state === "failed" ? 4000 : 2000);
  }
</script>

<button type="button" class={variant === "chip" ? "chip-button copy" : "chip-button copy code"} onclick={copy}>
  <span class="icon" aria-hidden="true">
    <span class="swap" class:on={state !== "copied"}><Icon name="copy" size={14} /></span>
    <span class="swap" class:on={state === "copied"}><Icon name="check" size={14} /></span>
  </span>
  <span>{state === "copied" ? "Copied" : label}</span>
</button>
<span class={state === "failed" ? "fail" : "sr-only"} role="status">
  {state === "copied" ? "Copied" : state === "failed" ? variant === "code" ? "Couldn't copy. Select the text to copy it." : "Couldn't copy. Select the address to copy it." : ""}
</span>

<style>
  .copy { white-space: nowrap; }
  .code {
    height: 26px;
    padding: 0 8px;
    font-size: 12px;
  }
  .icon {
    display: grid;
    width: 14px;
    height: 14px;
  }
  .swap {
    grid-area: 1 / 1;
    display: grid;
    opacity: 0;
    scale: 0.25;
    filter: blur(4px);
    transition: opacity 300ms var(--ease-flow), scale 300ms var(--ease-flow), filter 300ms var(--ease-flow);
  }
  .swap.on { opacity: 1; scale: 1; filter: blur(0); }
  .fail {
    display: block;
    margin-top: 6px;
    font-size: 13px;
    color: var(--fg-muted);
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  @media (prefers-reduced-motion: reduce) {
    .swap { scale: 1; filter: none; transition: opacity 150ms ease-out; }
  }
</style>
