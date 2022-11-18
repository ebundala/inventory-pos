import PlausibleProvider from "next-plausible";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { trpc } from "src/utils/trpc";

export default trpc.withTRPC(function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <PlausibleProvider domain="demo.vercel.pub">
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </PlausibleProvider>
  );
})
