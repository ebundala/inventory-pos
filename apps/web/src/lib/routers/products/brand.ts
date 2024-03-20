import { createBrand, deleteManyBrand, deleteBrand, findManyBrand, getUniqueBrand, updateBrand } from "@/core/brand";
import { createBrandInputSchema, brandIdSchema, brandIdsSchema, updateBrandInputSchema } from "@/core/brand/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { BrandFindManySchema } from "prisma/generated/schemas/findManyBrand.schema";



export const brandRouter = router({
    create: privateProcedureWithTx
        .input(createBrandInputSchema)
        .mutation(({ input, ctx }) => createBrand(input, ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateBrandInputSchema)
        .mutation((({ input, ctx }) => updateBrand(input, ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(brandIdSchema)
    .query(({ input, ctx }) => getUniqueBrand(input, ctx as TenantContext)),
    search: privateProcedureWithTx.input(BrandFindManySchema)
    .query(({ input, ctx }) => findManyBrand(input, ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(brandIdSchema)
    .mutation(({ input, ctx }) => deleteBrand(input, ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(brandIdsSchema)
    .mutation(({ input, ctx }) => deleteManyBrand(input, ctx as TenantContext))
})