import { getSession } from "next-auth/react";
import { Prisma } from "@prisma/client";
import { NextPageContext } from "next";


export async function getTenantAsMemberByDomain(domains: string, ctx: NextPageContext) {
  const session = await getSession(ctx);
  if (!session?.user) {
    return null;
  }
  const mode = Prisma.QueryMode.insensitive;
  return prismaAdmin!.tenant.findFirst({
    select: {
      tenantId: true,
      name: true,
      customDomain: true,
      subdomain: true,
      image: true,
      imageBlurhash: true
    },
    where: {
      AND: [
        {
          members: {
            some: {
              id: session!.user!.id!
            }
          }
        },
        {
          OR: [
            {
              subdomain: {
                equals: domains, mode: mode
              }
            },
            {
              customDomain: {
                equals: domains, mode: mode
              }
            }
          ]
        }
      ]
    }
  });
}
