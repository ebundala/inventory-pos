import {initTRPC,inferAsyncReturnType, TRPCError} from '@trpc/server';
import * as TRPCNext from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';


export async function createContext(opts:TRPCNext.CreateNextContextOptions){
    const session = await getSession({req:opts.req});
    //TODO get tenant here
    const tenantId= "xxxxx"
    return {
        session,tenantId
    }
}
export type TenantContext = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<TenantContext>().create();
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure
 
export const isAuthed = middleware(({next,ctx})=>{
    if(!ctx.session?.user){
        throw new TRPCError({code:'UNAUTHORIZED'});
    }
    return next({ctx})
})

export const privateProcedure = t.procedure.use(isAuthed)
