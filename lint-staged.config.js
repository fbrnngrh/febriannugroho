// A function ignores the staged file list: svelte-check checks the whole web app in one run.
export default {
  "**/*.{ts,svelte,js}": () => "bun run check-types",
};
