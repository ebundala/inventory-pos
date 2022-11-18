import { createCompany, deleteManyCompany, deleteCompany, findManyCompany, getUniqueCompany, updateCompany } from "@/core/company";
import { createCompanyInputSchema, companyIdSchema, companyIdsSchema, updateCompanyInputSchema } from "@/core/company/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { CompanyFindManySchema } from "prisma/generated/schemas/findManyCompany.schema";



export const companyRouter = router({
    create: privateProcedureWithTx
        .input(createCompanyInputSchema)
        .mutation(({ input, ctx }) => createCompany(input)),

    update: privateProcedureWithTx
        .input(updateCompanyInputSchema)
        .mutation((({ input, ctx }) => updateCompany(input))),
    get: privateProcedureWithTx
    .input(companyIdSchema)
    .query(({ input, ctx }) => getUniqueCompany(input)),
    search: privateProcedureWithTx.input(CompanyFindManySchema)
    .query(({ input, ctx }) => findManyCompany(input)),
    delete: privateProcedureWithTx
    .input(companyIdSchema)
    .mutation(({ input, ctx }) => deleteCompany(input)),
   deleteMany: privateProcedureWithTx
    .input(companyIdsSchema)
    .mutation(({ input, ctx }) => deleteManyCompany(input)),
})