import { router, publicProcedure, privateProcedureWithTx, privateProcedure } from "@/core/trpc";
import { domainSearchInputSchema, inviteMemberInputSchema, tenantCreateInputSchema, tenantEmailWhereInputSchema, tenantIdSchema, tenantIdsSchema, tenantMemberWhereInputSchema, tenantUpdateInputSchema } from '@/core/tenant/index.zod'
import { acceptInvite, checkDomain, checkSubdomain, createTenant, deleteManyTenant, deleteTenant, findManyTenant, getUniqueTenant, inviteMember, leaveTenant, rejectInvite, removeMember, updateTenant } from "@/core/tenant";
import { TenantFindManySchema } from "prisma/generated/schemas/findManyTenant.schema";

export const tenantRouter = router({
    create: publicProcedure
        .input(tenantCreateInputSchema)
        .mutation((({ input, ctx }) => createTenant(input))),
    update: privateProcedureWithTx
        .input(tenantUpdateInputSchema)
        .mutation((({ input, ctx }) => updateTenant(input))),
    get: privateProcedureWithTx.input(tenantIdSchema).query(({ input, ctx }) => getUniqueTenant(input)),
    search: privateProcedure.input(TenantFindManySchema).query(({ input, ctx }) => findManyTenant(input)),
    inviteMember: privateProcedureWithTx
        .input(inviteMemberInputSchema)
        .mutation(({ input, ctx }) => inviteMember(input)),
    acceptInvite: privateProcedureWithTx
        .input(tenantEmailWhereInputSchema)
        .mutation(({ input, ctx }) => acceptInvite(input)),
    declineInvite: privateProcedureWithTx
        .input(tenantEmailWhereInputSchema)
        .mutation(({ input, ctx }) => rejectInvite(input)),
    removeMember: privateProcedureWithTx
        .input(tenantMemberWhereInputSchema)
        .mutation(({ input, ctx }) => removeMember(input)),
    leaveTenant: privateProcedureWithTx
        .input(tenantMemberWhereInputSchema)
        .mutation(({ input, ctx }) => leaveTenant(input)),
    delete: privateProcedureWithTx
        .input(tenantIdSchema)
        .mutation(({ input, ctx }) => deleteTenant(input)),
    deleteMany: privateProcedureWithTx
        .input(tenantIdsSchema)
        .mutation(({ input, ctx }) => deleteManyTenant(input)),
    checkDomain:privateProcedure.input(domainSearchInputSchema).query(({input,ctx})=>checkDomain(input)),
    checkSubDomain:privateProcedure.input(domainSearchInputSchema).query(({input,ctx})=>checkSubdomain(input))

})