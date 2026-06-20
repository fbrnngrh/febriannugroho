<script lang="ts">
  let { src, alt = "Profile photo" } = $props<{
    src: string;
    alt?: string;
  }>();
</script>

<div class="group relative inline-block align-middle">
  <img
    {src}
    {alt}
    class="h-12 w-12 rounded-full border border-border object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-transform duration-200 group-hover:scale-110"
    width="48"
    height="48"
  />
  <span
    class="pointer-events-none absolute -right-1 -top-1 text-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-safe:group-hover:animate-[wave_0.5s_ease-in-out_infinite]"
    aria-hidden="true"
  >
    👋
  </span>
</div>

<style>
  @keyframes wave {
    0%,
    100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(20deg);
    }
    75% {
      transform: rotate(-20deg);
    }
  }
</style>
