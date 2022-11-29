import jackson, {
    type IOAuthController,
    type JacksonOption,
  } from "@boxyhq/saml-jackson";
import { inferAsyncReturnType } from "@trpc/server";
import jwtSigningKeys from 'keys/openid_key.json';  
  const samlAudience = "https://saml.boxyhq.com";
  const samlPath = "/api/auth/saml/acs";
  const oidcPath ="/api/outh/oidc/callback"
  const opts: JacksonOption = {
    externalUrl: `${process.env.NEXTAUTH_URL}`,
   // samlAudience,
    samlPath,
    oidcPath,
     openid:{
      jwtSigningKeys
     },
    db: {
     // encryptionKey:process.env.DB_ENCRYPTION_KEY,
      engine: "sql",
      type: "postgres",
      url: process.env.DATABASE_URL,
    },
  };
  
  let jacksonConfig: inferAsyncReturnType<typeof jackson>;
  
  const g = global as any;
  
  export default async function init() {
    if (!g.jacksonConfig) {
      const ret = await jackson(opts);
  
      jacksonConfig = ret;
      g.jacksonConfig = jacksonConfig;
    } else {
      jacksonConfig = g.jacksonConfig;
    }
  
    return jacksonConfig;
  }