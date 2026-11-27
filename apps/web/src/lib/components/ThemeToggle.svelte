<script lang="ts">
  import Icon from "./Icon.svelte";

  // Kept until Febrian decides (handoff §4.1): the design follows the system theme and has no toggle.
  // Delete this component and its use in +layout.svelte to follow the system only.
  let isDark = $state(false);

  $effect(() => {
    isDark = document.documentElement.classList.contains("dark");
  });

  function toggle() {
    const root = document.documentElement;
    // disableTransitionOnChange: no transitions for the frame the theme flips (04-motion.md §11)
    root.classList.add("theme-switching");
    isDark = root.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
  }
</script>

<button
  type="button"
  class="theme-toggle icon-button"
  onclick={toggle}
  aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
>
  <Icon name={isDark ? "sun" : "moon"} size={16} />
</button>

<style>
  .theme-toggle {
    position: fixed;
    right: calc(16px + env(safe-area-inset-right));
    bottom: calc(16px + env(safe-area-inset-bottom));
    z-index: 40;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    view-transition-name: theme-toggle;
  }
  @media (min-width: 768px) {
    .theme-toggle {
      right: calc(24px + env(safe-area-inset-right));
      bottom: calc(24px + env(safe-area-inset-bottom));
    }
  }
</style>
