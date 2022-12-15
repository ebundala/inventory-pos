import { getFetch, httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { AppRouter } from "@/lib/routers";
import { useMemo } from "react";
import { useHost } from "@/lib/hooks/useHost";


export function useTrpc(url?: string | null) {
  const host = useHost()
  const trpc = /* useMemo(() =>  */createTRPCNext<AppRouter>({
    config({ ctx }) {

      const url = `http://${host}/api/trpc`;
      
      return {
        queryClientConfig: {
          defaultOptions: {
            queries: {
              staleTime: 5 * 1000,
            },
          },
        },
        headers() {
          if (ctx?.req) {
            return {
              ...ctx.req.headers,
              "x-ssr": "1",
            };
          }
          return {};
        },
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
  })/* , [host]); */
  return trpc;
}
