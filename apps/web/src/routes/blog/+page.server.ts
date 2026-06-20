import { createRouterClient } from "@orpc/server";
import { appRouter } from "@febriannugroho/api/routers/index";
import { createContext } from "@febriannugroho/api/context";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const serverClient = createRouterClient(appRouter, {
    context: async () =>
      createContext({ headers: event.request.headers }),
  });

  const posts = await serverClient.blog.list();
  return { posts };
};

export const prerender = false;
