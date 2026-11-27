<script lang="ts">
  import Icon from "./Icon.svelte";
  let { href, label, size = "md" }: { href: string; label: string; size?: "sm" | "md" } = $props();
</script>

<a {href} class="arrow-link" class:sm={size === "sm"}>
  <span>{label}</span>
  <Icon name="arrow-right" size={size === "sm" ? 12 : 14} />
</a>

<style>
  .arrow-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding-bottom: 4px;
    font-size: 15px;
    line-height: 1.4;
    color: var(--fg-default);
    text-decoration: none;
    border-bottom: 1px solid var(--line-soft);
    transition: border-color var(--dur-hover) var(--ease-out), opacity var(--dur-press) var(--ease-out);
  }
  .sm { font-size: 13px; }
  .arrow-link:active { opacity: 0.64; }
  @media (hover: hover) and (pointer: fine) {
    .arrow-link:hover { border-color: var(--fg-default); }
  }
</style>
