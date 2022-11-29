import { Prisma, PrismaClient } from '@prisma/client';
import { initTRPC, inferAsyncReturnType, TRPCError } from '@trpc/server';
import * as TRPCNext from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/core/prisma/prisma';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth';
import { APP_HOST } from '@/lib/util';

export async function createContext({req,res}: TRPCNext.CreateNextContextOptions) {
    const session = await unstable_getServerSession(req,res,authOptions);
    const hostname = req?.headers?.host||APP_HOST!;
    const domains = hostname.replace(`.${APP_HOST}`, "")
    const mode = Prisma.QueryMode.insensitive;
    const tenant = await prismaAdmin!.tenant.findFirst({
        select: {
            tenantId: true,
            name: true,
            customDomain: true,
            subdomain: true,
            image:true,
            imageBlurhash:true
        },
        where: {
            AND: [
                // {
                //     members: {
                //         some: {
                //             id: session!.user!.id!
                //         }
                //     }
                // },
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
                }]
        }
    })
    const tenantId = tenant?.tenantId || "app";
    
    return {
        session, tenantId
    }
}
export type TenantContext = inferAsyncReturnType<typeof createContext> & {
    tx?: PrismaClient
};

const t = initTRPC.context<TenantContext>().create();
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure

export const isAuthed = middleware(({ next, ctx }) => {
    if (!ctx.session?.user) {
        //TODO uncomment below in production
       //  throw new TRPCError({code:'UNAUTHORIZED'});
    }
    return next({ ctx })
})

export const useInteractiveTransaction = middleware(async ({ next, ctx }) => {
   
    let result;
    try {
        result = await prisma!.$transaction(async (tx) => {
            await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${ctx.tenantId}"`)
            return next({ ctx: { tx, ...ctx } })
        },)
    }
    catch (e) {
        
        console.error(e)
        throw new TRPCError({ message: "Error", code: "INTERNAL_SERVER_ERROR" })
    }
    return result;
})
export const privateProcedure=t.procedure.use(isAuthed)
export const privateProcedureWithTx = privateProcedure.use(useInteractiveTransaction)
