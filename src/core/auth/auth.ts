import { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
//import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

import BoxyHQSAMLProvider from 'next-auth/providers/boxyhq-saml';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/core";
import { googleOidcDiscoveryUrl, secrets } from "@/core/util/oidcConfig";
import googleCfg from 'keys/google-openid-configuration.json';
import { APP_HOST } from "@/lib/util";
import { Prisma } from "@prisma/client";

const  useSecureCookies = false;//process.env.NODE_ENV === 'production';
const cookieBuilder = (name:string)=>({
  name:`${useSecureCookies?'__Secure-':''}next-auth.${name}`,
  options:{
    httpOnly:true,
    sameSite: 'Lax',
    path:'/',
    domain: `.${(new URL(process.env.NEXTAUTH_URL!)).hostname}`,
    secure:useSecureCookies
  }
})

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET)
  throw new Error("Failed to initialize Github authentication");

if (!process.env.NEXTAUTH_SECRET)
  throw new Error("Auth secret is required");

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({     
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          gh_username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    BoxyHQSAMLProvider({         
      issuer: googleCfg.issuer,
      wellKnown: googleOidcDiscoveryUrl,
      authorization: {
        params: {
          scope: "openid email profile"
        }
      },
      token:googleCfg.token_endpoint,
      userinfo:googleCfg.userinfo_endpoint,   
      clientId: "dummy",//secrets.client_id,
      clientSecret: "dummy",//secrets.client_secret,
      client: {        
        client_id: secrets.client_id,
        client_secret: secrets.client_secret,
        redirect_uris: ["http://ebundala.dev:3000/api/auth/callback/boxyhq-saml"]
      },
      idToken: true,
      checks: [ "pkce", "state" ],
      allowDangerousEmailAccountLinking:true,
      
      profile(profile,tokens) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        };
      },
      },
    )
  ],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  debug:true,
  useSecureCookies:useSecureCookies,
  cookies:{
    sessionToken:cookieBuilder("session-token"),
    csrfToken:cookieBuilder('csrf-token'),
    state:cookieBuilder('state'),
    nonce:cookieBuilder("nonce"),
    callbackUrl:cookieBuilder("calback-url"),
    pkceCodeVerifier:cookieBuilder("pkce-code-verifier")
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
     
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
     
      const urlObj= new URL(url);
      const appURL = new URL(process.env.NEXTAUTH_URL!);
      const host = urlObj.hostname
      // Allows callback URLs on the same origin
       if (urlObj.origin === baseUrl) return url
      // allows url from tenants configured url
      const tenantDomain = host.replace(`.${appURL.hostname}`,"");
      const tenant = await getTenantByDomain(tenantDomain)
      if(tenant){
       
        return url;
      }
      return baseUrl
    },
    session: ({ session, user,token }) => ({
      ...session,
      token,
      user: {
        ...session.user,
        id: user.id,
        username: user.username,
      },
    }),
  },
};


const getTenantByDomain = async (domain:string) => {
  if(!domain) return null;
  const mode = Prisma.QueryMode.insensitive;
    return  prismaAdmin!.tenant.findFirst({
        select: {
            tenantId: true,
            name: true,
            customDomain: true,
            subdomain: true,            
        },
        where: {
            
                    OR: [
                        {
                            subdomain: {
                                equals: domain, mode: mode
                            }
                        },
                        {
                            customDomain: {
                                equals: domain, mode: mode
                            }
                        }
                    ]
                }
        }
    )
}


