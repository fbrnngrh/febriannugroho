import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

type PostMetadata = {
  title: string;
  description: string;
  date: string;
  readingTime: string;
  slug: string;
};

type PostModule = {
  default: import("svelte").Component;
  metadata: PostMetadata;
};

const posts = import.meta.glob("/src/content/blog/*.md", {
  eager: true,
}) as Record<string, PostModule>;

export const load: PageLoad = async ({ params }) => {
  const match = Object.entries(posts).find(
    ([, mod]) => mod.metadata.slug === params.slug,
  );

  if (!match) {
    error(404, "Post not found");
  }

  const { metadata, default: PostComponent } = match[1];
  return { post: metadata, PostComponent };
};

export const entries = () => {
  return Object.values(posts).map((mod) => ({
    slug: mod.metadata.slug,
  }));
};
