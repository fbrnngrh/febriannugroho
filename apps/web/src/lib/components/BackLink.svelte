<script lang="ts">
  import Icon from "./Icon.svelte";
  let { href, label }: { href: string; label: string } = $props();
</script>

<!-- The arrow stays still on hover; only colour and underline change. -->
<a {href} class="link back">
  <Icon name="arrow-left" size={12} />
  <span>{label}</span>
</a>

<style>
  .back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.4;
  }
</style>
