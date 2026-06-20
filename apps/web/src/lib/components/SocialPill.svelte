<script lang="ts">
  let {
    href,
    label,
    bgColor = "var(--color-secondary)",
  } = $props<{
    href: string;
    label: string;
    bgColor?: string;
  }>();
</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-105"
  style="background-color: {bgColor}"
  aria-label={label}
>
  {label}
</a>
