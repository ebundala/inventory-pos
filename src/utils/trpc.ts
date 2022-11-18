import { getFetch, httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
//import superjson from "superjson";
import { AppRouter } from "@/lib/routers";

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    
    // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
    const hostname = ctx?.req?.headers?.host??"app.localhost:3000";
    const url = `http://${hostname}/api/trpc/`;
// TODO use context to construct url
    return {
    //   queryClientConfig: {
    //     defaultOptions: {
    //       queries: {
    //         staleTime: 5 * 1000,
    //       },
    //     },
    //   },
    //   headers() {
    //     if (ctx?.req) {
    //       return {
    //         ...ctx.req.headers,
    //         "x-ssr": "1",
    //       };
    //     }
    //     return {};
    //   },
      links: [
        httpBatchLink({
          url,
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
              credentials: "include",
            });
          },
        }),
      ],
    //   transformer: superjson,
    };
  },
  ssr: true,
});
