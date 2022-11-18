import { createBrand, deleteManyBrand, deleteBrand, findManyBrand, getUniqueBrand, updateBrand } from "@/core/brand";
import { createBrandInputSchema, brandIdSchema, brandIdsSchema, updateBrandInputSchema } from "@/core/brand/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { BrandFindManySchema } from "prisma/generated/schemas/findManyBrand.schema";



export const brandRouter = router({
    create: privateProcedureWithTx
        .input(createBrandInputSchema)
        .mutation(({ input, ctx }) => createBrand(input)),

    update: privateProcedureWithTx
        .input(updateBrandInputSchema)
        .mutation((({ input, ctx }) => updateBrand(input))),
    get: privateProcedureWithTx
    .input(brandIdSchema)
    .query(({ input, ctx }) => getUniqueBrand(input)),
    search: privateProcedureWithTx.input(BrandFindManySchema)
    .query(({ input, ctx }) => findManyBrand(input)),
    delete: privateProcedureWithTx
    .input(brandIdSchema)
    .mutation(({ input, ctx }) => deleteBrand(input)),
   deleteMany: privateProcedureWithTx
    .input(brandIdsSchema)
    .mutation(({ input, ctx }) => deleteManyBrand(input))
})