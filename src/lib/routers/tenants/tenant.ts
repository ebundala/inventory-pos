import { router, publicProcedure, privateProcedure } from "@/core/trpc";
import { inviteMemberInputSchema, tenantCreateInputSchema, tenantEmailWhereInputSchema, tenantIdSchema, tenantIdsSchema, tenantMemberWhereInputSchema, tenantUpdateInputSchema } from '@/core/tenant/index.zod'
import { acceptInvite, createTenant, deleteManyTenant, deleteTenant, findManyTenant, getUniqueTenant, inviteMember, leaveTenant, rejectInvite, removeMember, updateTenant } from "@/core/tenant";
import { TenantFindManySchema } from "prisma/generated/schemas/findManyTenant.schema";

export const tenantRouter = router({
    create: publicProcedure
        .input(tenantCreateInputSchema)
        .mutation((({ input, ctx }) => createTenant(input))),
    update: privateProcedure
        .input(tenantUpdateInputSchema)
        .mutation((({ input, ctx }) => updateTenant(input))),
    get: privateProcedure.input(tenantIdSchema).query(({ input, ctx }) => getUniqueTenant(input)),
    search: privateProcedure.input(TenantFindManySchema).query(({ input, ctx }) => findManyTenant(input)),
    inviteMember: privateProcedure
        .input(inviteMemberInputSchema)
        .mutation(({ input, ctx }) => inviteMember(input)),
    acceptInvite: privateProcedure
        .input(tenantEmailWhereInputSchema)
        .mutation(({ input, ctx }) => acceptInvite(input)),
    declineInvite: privateProcedure
        .input(tenantEmailWhereInputSchema)
        .mutation(({ input, ctx }) => rejectInvite(input)),
    removeMember: privateProcedure
        .input(tenantMemberWhereInputSchema)
        .mutation(({ input, ctx }) => removeMember(input)),
    leaveTenant: privateProcedure
        .input(tenantMemberWhereInputSchema)
        .mutation(({ input, ctx }) => leaveTenant(input)),
    delete: privateProcedure
        .input(tenantIdSchema)
        .mutation(({ input, ctx }) => deleteTenant(input)),
    deleteMany: privateProcedure
        .input(tenantIdsSchema)
        .mutation(({ input, ctx }) => deleteManyTenant(input))

})