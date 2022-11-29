import type { NextApiRequest, NextApiResponse } from "next";
import type { OIDCAuthzResponsePayload } from "@boxyhq/saml-jackson";

import jackson from "@/core/auth/jackson";
import { APP_HOST } from "@/lib/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
   const jacksonConfig = await jackson();
   const[_,query]=req.url?.split("?")??[]
   console.log("callback called with \n",query);
   const url =  `http://${APP_HOST}/api/auth/callback/boxyhq-saml?${query}`;

  // const { redirect_url } = await jacksonConfig.oauthController.oidcAuthzResponse(
  //   req.query as unknown as OIDCAuthzResponsePayload
  // );
  

  // return res.redirect(302, redirect_url as string); 
 return res.send(query);
}