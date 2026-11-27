import { error } from "@sveltejs/kit";
import { getPost, publishedSlugs } from "#lib/content/posts.ts";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  const mod = getPost(params.slug);
  if (!mod) error(404, "Post not found");
  return { post: mod.metadata, PostComponent: mod.default };
};

export const entries = () => publishedSlugs().map((slug) => ({ slug }));
