import { createBrand, deleteManyBrand, deleteBrand, findManyBrand, getUniqueBrand, updateBrand } from "@/core/brand";
import { createBrandInputSchema, brandIdSchema, brandIdsSchema, updateBrandInputSchema } from "@/core/brand/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { BrandFindManySchema } from "prisma/generated/schemas/findManyBrand.schema";



export const brandRouter = router({
    create: privateProcedure
        .input(createBrandInputSchema)
        .mutation(({ input, ctx }) => createBrand(input)),

    update: privateProcedure
        .input(updateBrandInputSchema)
        .mutation((({ input, ctx }) => updateBrand(input))),
    get: privateProcedure
    .input(brandIdSchema)
    .query(({ input, ctx }) => getUniqueBrand(input)),
    search: privateProcedure.input(BrandFindManySchema)
    .query(({ input, ctx }) => findManyBrand(input)),
    delete: privateProcedure
    .input(brandIdSchema)
    .mutation(({ input, ctx }) => deleteBrand(input)),
   deleteMany: privateProcedure
    .input(brandIdsSchema)
    .mutation(({ input, ctx }) => deleteManyBrand(input))
})