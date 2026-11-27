<script lang="ts">
  import { PERSON } from "#lib/content/site.ts";
  let { label = PERSON.now }: { label?: string } = $props();
</script>

<p class="status">
  <span class="dot" aria-hidden="true"></span>
  <span>{label}</span>
</p>

<style>
  .status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.4;
    color: var(--fg-secondary);
  }
  .dot {
    position: relative;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--ci-solid) 22%, transparent);
  }
  .dot::after {
    content: "";
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: var(--ci-solid);
    animation: status-pulse 2.4s var(--ease-in-out) infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .dot::after { animation: none; }
  }
</style>
