import type { NextApiRequest, NextApiResponse } from "next";

import jackson from "@/core/auth/jackson";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jacksonConfig = await jackson();

  const result = await jacksonConfig.oauthController.userInfo(
    req.query.token as unknown as string
  );

  return res.json(result);
}