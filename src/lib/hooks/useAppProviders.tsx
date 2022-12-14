import PlausibleProvider from "next-plausible";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { AppProps } from "next/app";
import { useTrpc } from "@/lib/hooks/useTrpc";
import React, { ReactNode } from "react";
import { NextComponentType, NextPageContext } from "next/types";
import { useHost } from "@/lib/hooks/useHost";
import { useChangeTheme } from "./useChangeTheme";

export function useAppProviders() {
 
  useChangeTheme();
  const host = useHost();
  const trpcWithHost = useTrpc(host);
  return trpcWithHost.withTRPC(({
    Component, pageProps: { session, ...pageProps },
  }: AppProps<{ session: Session; }> & {
    Component: NextComponentType<NextPageContext, any, any> & { getLayout?: (page: ReactNode) => ReactNode }
  }) => {
    const getLayout = Component.getLayout || ((page) => page)
   
    return (
      <PlausibleProvider domain={host??""}>        
            <SessionProvider session={session}>              
                  {getLayout(<Component {...pageProps} />)}
            </SessionProvider>
      </PlausibleProvider>
    );
  });
}
