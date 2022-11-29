import PlausibleProvider from "next-plausible";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { AppProps } from "next/app";
import { useTrpc } from "@/lib/hooks/useTrpc";
import React from "react";
import { TenantProvider } from "@/lib/providers/TenantProvider";
import { HostProvider } from "@/lib/providers/HostProvider";
import { TenantProp } from "@/types/TenantProp";



export function useAppProviders(host: string) {

  const trpcWithHost = useTrpc(host);
  return trpcWithHost.withTRPC(({
    Component, pageProps: { session, host, tenant, ...pageProps },
  }: AppProps<{ session: Session; host: string; tenant: TenantProp; }>) => {

    return (
      <PlausibleProvider domain={host}>
        <HostProvider host={host}>
          <SessionProvider session={session}>
            <TenantProvider tenant={tenant}>
              <Component {...pageProps} />
            </TenantProvider>
          </SessionProvider>
        </HostProvider>
      </PlausibleProvider>
    );
  });
}
