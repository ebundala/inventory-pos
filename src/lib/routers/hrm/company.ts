import { createCompany, deleteManyCompany, deleteCompany, findManyCompany, getUniqueCompany, updateCompany } from "@/core/company";
import { createCompanyInputSchema, companyIdSchema, companyIdsSchema, updateCompanyInputSchema } from "@/core/company/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { CompanyFindManySchema } from "prisma/generated/schemas/findManyCompany.schema";



export const companyRouter = router({
    create: privateProcedureWithTx
        .input(createCompanyInputSchema)
        .mutation(({ input, ctx }) => createCompany(input,ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateCompanyInputSchema)
        .mutation((({ input, ctx }) => updateCompany(input,ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(companyIdSchema)
    .query(({ input, ctx }) => getUniqueCompany(input,ctx as TenantContext)),
    search: privateProcedureWithTx.input(CompanyFindManySchema)
    .query(({ input, ctx }) => findManyCompany(input,ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(companyIdSchema)
    .mutation(({ input, ctx }) => deleteCompany(input,ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(companyIdsSchema)
    .mutation(({ input, ctx }) => deleteManyCompany(input,ctx as TenantContext)),
})