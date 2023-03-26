import { NextRequest, NextResponse } from "next/server";
import { APP_HOST } from "@/lib/util";
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from "./lib/routers";
import superjson from "superjson";
 
// Notice the <AppRouter> generic here.
const trpc = createTRPCProxyClient<AppRouter>({
  transformer:superjson,
  links: [
    httpBatchLink({
      url: `http://localhost:${process.env.APP_PORT}/api/trpc`,
    }),
  ],
});

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|fonts|img|examples|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  debugger;
  const url = req.nextUrl;
  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host") || APP_HOST;

  // Only for demo purposes - remove this if you want to use your root domain as the landing page
  // if (hostname === APP_HOST) {
  //   return NextResponse.redirect("https://demo.vercel.pub");
  // }

  /*  You have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */
  
    // process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
    //   ? hostname
    //       .replace(`.vercel.pub`, "")
    //       .replace(`.platformize.vercel.app`, "")
    //   :
    const currentHost =hostname.replace(`.${APP_HOST}`, "");
  // rewrites for app pages
  if (currentHost == "app") {
    if (
      url.pathname === "/login" &&
      (req.cookies.get("next-auth.session-token") ||
        req.cookies.get("__Secure-next-auth.session-token"))
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    url.pathname = `/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

 

  // rewrite root application to `/home` folder
  if (hostname === APP_HOST) {
    url.pathname = `/home${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  

  const tenant = await trpc.tenant.checkSubDomain.query(currentHost);
  if(tenant&&tenant.subdomain.length>0){
  // rewrite everything else to `/_tenants/[tenant] dynamic route
    url.pathname = `/_tenants/${currentHost}${url.pathname}`
    return NextResponse.rewrite(url);
  }
  // unknown tenant 
  url.pathname="/404"
  return NextResponse.rewrite(url);
}
