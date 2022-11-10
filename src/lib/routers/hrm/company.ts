import { createCompany, deleteManyCompany, deleteCompany, findManyCompany, getUniqueCompany, updateCompany } from "@/core/company";
import { createCompanyInputSchema, companyIdSchema, companyIdsSchema, updateCompanyInputSchema } from "@/core/company/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { CompanyFindManySchema } from "prisma/generated/schemas/findManyCompany.schema";



export const companyRouter = router({
    create: privateProcedure
        .input(createCompanyInputSchema)
        .mutation(({ input, ctx }) => createCompany(input)),

    update: privateProcedure
        .input(updateCompanyInputSchema)
        .mutation((({ input, ctx }) => updateCompany(input))),
    get: privateProcedure
    .input(companyIdSchema)
    .query(({ input, ctx }) => getUniqueCompany(input)),
    search: privateProcedure.input(CompanyFindManySchema)
    .query(({ input, ctx }) => findManyCompany(input)),
    delete: privateProcedure
    .input(companyIdSchema)
    .mutation(({ input, ctx }) => deleteCompany(input)),
   deleteMany: privateProcedure
    .input(companyIdsSchema)
    .mutation(({ input, ctx }) => deleteManyCompany(input)),
})