import { createProduct, deleteManyProduct, deleteProduct, findManyProduct, getUniqueProduct, updateProduct } from "@/core/product";
import { createProductInputSchema, productIdSchema, productIdsSchema, updateProductInputSchema } from "@/core/product/index.zod";
import { router, publicProcedure, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { ProductFindManySchema } from "prisma/generated/schemas/findManyProduct.schema";
import { brandRouter } from "./brand";
import { categoryRouter } from "./category";
import { unitRouter } from "./unit";



export const productRouter = router({
    create: privateProcedureWithTx
        .input(createProductInputSchema)
        .mutation(({ input, ctx }) => createProduct(input, ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateProductInputSchema)
        .mutation((({ input, ctx }) => updateProduct(input, ctx as TenantContext))),
    get: privateProcedureWithTx
        .input(productIdSchema)
        .query(({ input, ctx }) => getUniqueProduct(input, ctx as TenantContext)),
    search: privateProcedureWithTx.input(ProductFindManySchema)
        .query(({ input, ctx }) => findManyProduct(input, ctx as TenantContext)),
    delete: privateProcedureWithTx
        .input(productIdSchema)
        .mutation(({ input, ctx }) => deleteProduct(input, ctx as TenantContext)),
    deleteMany: privateProcedureWithTx
        .input(productIdsSchema)
        .mutation(({ input, ctx }) => deleteManyProduct(input, ctx as TenantContext)),
    brand: brandRouter,
    category: categoryRouter,
    unit: unitRouter
})