import { getFetch, httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { AppRouter } from "@/lib/routers";
import { useMemo } from "react";
import { useHost } from "@/lib/hooks/useHost";
import superjson from 'superjson';

export function useTrpc(host: string) {
  const trpc = useMemo(() => {
    return createTRPCNext<AppRouter>({
    config({ ctx }) {
       const protocal = (new URL(process.env.NEXT_PUBLIC_HOST!)).protocol
      const url = `${protocal}//${host}/api/trpc`;
      
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
        transformer: superjson,
      };
    },
    ssr: true,});
  }
  
 , [host]); 
  return trpc;
}
