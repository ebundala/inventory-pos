import { PrismaClient } from '@prisma/client';
import { initTRPC, inferAsyncReturnType, TRPCError } from '@trpc/server';
import * as TRPCNext from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/core/prisma/prisma';

export async function createContext(opts: TRPCNext.CreateNextContextOptions) {
    const session = await getSession({ req: opts.req });
    //TODO get tenant here
    const tenantId = "xxxxx"
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
        e as Error;
        console.error(e)
        throw new TRPCError({ message: "Error", code: "INTERNAL_SERVER_ERROR" })
    }
    return result;
})
export const privateProcedure=t.procedure.use(isAuthed)
export const privateProcedureWithTx = privateProcedure.use(useInteractiveTransaction)
