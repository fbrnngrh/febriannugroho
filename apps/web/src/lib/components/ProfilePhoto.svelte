<script lang="ts">
  let { src, alt = "Profile photo" } = $props<{
    src: string;
    alt?: string;
  }>();
</script>

<span class="group relative inline-block align-middle">
  <img
    {src}
    {alt}
    class="h-12 w-12 rounded-full border border-border object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-transform duration-200 group-hover:scale-110"
    width="48"
    height="48"
  />
  <span
    class="wave-emoji pointer-events-none absolute -right-3 -top-3 text-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    aria-hidden="true"
  >
    👋
  </span>
</span>

<style>
  .wave-emoji {
    transform-origin: 70% 70%;
  }

  :global(.group:hover) .wave-emoji {
    animation: wave 0.4s ease-in-out 2;
  }

  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }
    15% {
      transform: rotate(14deg);
    }
    30% {
      transform: rotate(-8deg);
    }
    45% {
      transform: rotate(14deg);
    }
    60% {
      transform: rotate(-4deg);
    }
    75% {
      transform: rotate(10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>
