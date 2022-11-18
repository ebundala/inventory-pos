import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import BoxyHQSAMLProvider from 'next-auth/providers/boxyhq-saml';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/core";
import { oidcDiscoveryUrl, secrets } from "../util";

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
      issuer:process.env.NEXTAUTH_URL,
      wellKnown:oidcDiscoveryUrl,
      clientId: secrets.client_id,
      clientSecret:secrets.client_secret,
      
    })
  ],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        username: user.username,
      },
    }),
  },
};


// http://app.localhost:3000/api/auth/callback/boxyhq-saml