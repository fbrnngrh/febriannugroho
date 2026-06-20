import type { RouterClient } from "@orpc/server";

import { publicProcedure } from "../index";
import { blogRouter } from "./blog";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  blog: blogRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
