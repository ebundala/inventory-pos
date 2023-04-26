import { addRole, assignPermisionsToRole, assignRole, getPolicies, getRoles } from "@/core/authorization";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import {addRoleInputSchema, assignPermisionInputSchema, assignRoleInputSchema, } from "@/core/authorization/index.zod"


export const authorizationRouter = router({
    getPolicies: privateProcedureWithTx
        .query(({ ctx }) => getPolicies(ctx as TenantContext)),

    getRoles: privateProcedureWithTx
        .query((({ctx }) => getRoles(ctx as TenantContext))),
    addRole: privateProcedureWithTx
    .input(addRoleInputSchema)
    .mutation(({ input, ctx }) => addRole(input,ctx as TenantContext)),
    assignRole: privateProcedureWithTx
    .input(assignRoleInputSchema)
    .mutation(({ input, ctx }) => assignRole(input,ctx as TenantContext)),
    assignPermisionsToRole: privateProcedureWithTx
    .input(assignPermisionInputSchema)
    .mutation(({ input, ctx }) => assignPermisionsToRole(input,ctx as TenantContext)),
  })