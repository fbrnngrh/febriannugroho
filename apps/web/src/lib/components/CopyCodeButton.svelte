<script lang="ts">
  import { Copy, Check } from "lucide-svelte";

  let { code } = $props<{ code: string }>();

  let copied = $state(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>

<button
  type="button"
  onclick={handleCopy}
  class="copy-btn absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-secondary/80 hover:bg-secondary text-xs px-2.5 py-1.5 rounded-lg border border-border text-muted hover:text-fg font-sans cursor-pointer flex items-center gap-1.5 backdrop-blur-sm z-10 shadow-sm"
  aria-label={copied ? "Copied" : "Copy code"}
>
  {#if copied}
    <Check class="h-3.5 w-3.5 text-accent pop-in" />
    <span class="text-accent font-medium pop-in">Copied!</span>
  {:else}
    <Copy class="h-3.5 w-3.5" />
    <span>Copy</span>
  {/if}
</button>
