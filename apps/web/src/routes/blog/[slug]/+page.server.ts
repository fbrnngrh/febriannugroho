import { createRouterClient } from "@orpc/server";
import { appRouter } from "@febriannugroho/api/routers/index";
import { createContext } from "@febriannugroho/api/context";
import { error } from "@sveltejs/kit";
import { marked } from "marked";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const serverClient = createRouterClient(appRouter, {
    context: async () =>
      createContext({ headers: event.request.headers }),
  });

  const post = await serverClient.blog.bySlug({
    slug: event.params.slug,
  });

  if (!post) {
    error(404, "Post not found");
  }

  const htmlContent = await marked(post.content);

  return { post: { ...post, htmlContent } };
};

export const prerender = false;
