import { Session } from "next-auth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { useAppProviders } from "@/lib/hooks/useAppProviders";
import { Provider as AppContextProvider } from "@/lib/context";
import { useChangeTheme } from '@/lib/hooks/useChangeTheme';

export default function Index({ pageProps, ...rest }: AppProps<{ session: Session, }>) {
  const props = { ...rest, pageProps };
  return (
    <AppContextProvider>
      <WrappedApp {...props} />
    </AppContextProvider>);
}

function WrappedApp({ ...props }: AppProps<{ session: Session }>) {
  useChangeTheme();
  const AppWrapper = useAppProviders();
  return (
    <AppWrapper  {...props as any} />
  );
};


// Index.getInitialProps = async (ctx: AppContext) => {
//   const { pageProps, ...rest } = await App.getInitialProps(ctx);

//  // if (ctx.ctx?.req) {
//     const host = new URL(`http://${ctx.ctx.req!.headers.host}`);
//     const domain = host.hostname.split(".").slice(0, -2).join(".");
//     const tenant = await getTenantAsMemberByDomain(domain, ctx.ctx);
//     return { ...rest, pageProps: { ...pageProps, host: host.hostname, tenant } };
//  // }
//  // return { ...rest, pageProps }
// }


