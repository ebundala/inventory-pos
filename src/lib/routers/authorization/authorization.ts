import { createRole, assignRole, deleteRole, getPolicies, getRole, getRoles, getUserPermissions, removeRole, updateRole } from "@/core/authorization";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { assignRoleInputSchema, roleInputSchema, tRoleWithPermisionSchema, } from "@/core/authorization/index.zod"


export const authorizationRouter = router({
    getPolicies: privateProcedureWithTx
        .query(({ ctx }) => getPolicies(ctx as TenantContext)),

    getRoles: privateProcedureWithTx
        .query((({ctx }) => getRoles(ctx as TenantContext))),
    getRole: privateProcedureWithTx
    .input(roleInputSchema)
    .query((({ctx,input }) => getRole(input,ctx as TenantContext))),
    createRole: privateProcedureWithTx
    .input(tRoleWithPermisionSchema)
    .mutation(({ input, ctx }) => createRole(input,ctx as TenantContext)),
    updateRole: privateProcedureWithTx
    .input(tRoleWithPermisionSchema)
    .mutation(({ input, ctx }) => updateRole(input,ctx as TenantContext)),
    removeRole: privateProcedureWithTx
    .input(assignRoleInputSchema)
    .mutation(({ input, ctx }) => removeRole(input,ctx as TenantContext)),
    deleteRole: privateProcedureWithTx
    .input(roleInputSchema)
    .mutation(({ input, ctx }) => deleteRole(input,ctx as TenantContext)),
   
    assignRole: privateProcedureWithTx
    .input(assignRoleInputSchema)
    .mutation(({ input, ctx }) => assignRole(input,ctx as TenantContext)),
    getUserPermissions:privateProcedureWithTx
    .query(({ ctx }) => getUserPermissions(ctx as TenantContext)),
  })