import { router, publicProcedure, privateProcedureWithTx, privateProcedure, TenantContext } from "@/core/trpc";
import { domainSearchInputSchema, inviteMemberInputSchema, tenantCreateInputSchema, tenantEmailWhereInputSchema, tenantIdSchema, tenantIdsSchema, tenantMemberWhereInputSchema, tenantUpdateInputSchema } from '@/core/tenant/index.zod'
import { acceptInvite, checkDomain, checkSubdomain, createTenant, deleteManyTenant, deleteTenant,  findFirstTenant, findManyTenant, getUniqueTenant, inviteMember, leaveTenant, rejectInvite, removeMember, updateTenant } from "@/core/tenant";
import { TenantFindManySchema } from "prisma/generated/schemas/findManyTenant.schema";

export const tenantRouter = router({
    create: privateProcedureWithTx
        .input(tenantCreateInputSchema)
        .mutation((({ input, ctx }) => createTenant(input,ctx as TenantContext))),
    update: privateProcedureWithTx
        .input(tenantUpdateInputSchema)
        .mutation((({ input, ctx }) => updateTenant(input,ctx as TenantContext))),
    get: privateProcedureWithTx.input(tenantIdSchema).query(({ input, ctx }) => getUniqueTenant(input,ctx as TenantContext)),
    search: privateProcedure.input(TenantFindManySchema).query(({ input, ctx }) => findManyTenant(input,ctx)),
    findFirst: privateProcedure.input(TenantFindManySchema).query(({ input, ctx }) => findFirstTenant(input,ctx)),

    inviteMember: privateProcedureWithTx
        .input(inviteMemberInputSchema)
        .mutation(({ input, ctx }) => inviteMember(input,ctx as TenantContext)),
    acceptInvite: privateProcedureWithTx
        .input(tenantEmailWhereInputSchema)
        .mutation(({ input, ctx }) => acceptInvite(input,ctx as TenantContext)),
    declineInvite: privateProcedureWithTx
        .input(tenantEmailWhereInputSchema)
        .mutation(({ input, ctx }) => rejectInvite(input,ctx as TenantContext)),
    removeMember: privateProcedureWithTx
        .input(tenantMemberWhereInputSchema)
        .mutation(({ input, ctx }) => removeMember(input,ctx as TenantContext)),
    leaveTenant: privateProcedureWithTx
        .input(tenantMemberWhereInputSchema)
        .mutation(({ input, ctx }) => leaveTenant(input,ctx as TenantContext)),
    delete: privateProcedureWithTx
        .input(tenantIdSchema)
        .mutation(({ input, ctx }) => deleteTenant(input,ctx as TenantContext)),
    deleteMany: privateProcedureWithTx
        .input(tenantIdsSchema)
        .mutation(({ input, ctx }) => deleteManyTenant(input,ctx as TenantContext)),
    checkDomain:publicProcedure.input(domainSearchInputSchema).query(({input})=>checkDomain(input)),
    checkSubDomain:publicProcedure.input(domainSearchInputSchema).query(({input})=>checkSubdomain(input))

})