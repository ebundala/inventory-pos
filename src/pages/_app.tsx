import App, { AppContext } from 'next/app'
import { Session } from "next-auth";

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { getTenantAsMemberByDomain } from "../lib/util/getTenantAsMemberByDomain";
import { TenantProp } from "@/types/TenantProp";
import { useAppProviders } from "../lib/hooks/useAppProviders";
import { useChangeTheme } from '@/lib/hooks/useChangeTheme';

export default function Index({ pageProps, ...rest }: AppProps<{ session: Session, host: string, tenant: TenantProp }>) {
  useChangeTheme();
  const AppWrapper = useAppProviders(pageProps.host);
  const props = { ...rest, pageProps };
  return (<AppWrapper  {...props as any} />);
};


Index.getInitialProps = async (ctx: AppContext) => {
  const { pageProps, ...rest } = await App.getInitialProps(ctx);
  const host = new URL(`http://${ctx.ctx.req!.headers.host}`);
  const domain = host.hostname.split(".").slice(0, -2).join(".");
  const tenant = await getTenantAsMemberByDomain(domain, ctx.ctx);
  return { ...rest, pageProps: { ...pageProps, host: host.hostname, tenant } };
}


