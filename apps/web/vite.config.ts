import adapter from "@sveltejs/adapter-static";
import { mdsvex } from "mdsvex";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    mdsvex({ extensions: [".md"] }),
    sveltekit({
      adapter: adapter({ fallback: "404.html" }),
      prerender: {
        // /#work/<id> opens the project dialog; it is not an element id
        handleMissingId: ({ id, message }) => {
          if (id.startsWith("work/")) return;
          throw new Error(message);
        },
      },
    }),
  ],
});
