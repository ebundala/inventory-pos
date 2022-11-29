import type { NextApiRequest, NextApiResponse } from "next";
import type { OAuthTokenReq } from "@boxyhq/saml-jackson";

import jackson from "@/core/auth/jackson";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jacksonConfig = await jackson();

  const result = await jacksonConfig.oauthController.token(
    req.query as unknown as OAuthTokenReq
  );

  return res.json(result);
}