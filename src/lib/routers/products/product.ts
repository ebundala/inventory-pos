import { createProduct, deleteManyProduct, deleteProduct, findManyProduct, getUniqueProduct, updateProduct } from "@/core/product";
import { createProductInputSchema, productIdSchema, productIdsSchema, updateProductInputSchema } from "@/core/product/index.zod";
import { router, publicProcedure, privateProcedure } from "@/core/trpc";
import { ProductFindManySchema } from "prisma/generated/schemas/findManyProduct.schema";
import { brandRouter } from "./brand";
import { categoryRouter } from "./category";
import { unitRouter } from "./unit";



export const productRouter = router({
    create: privateProcedure
        .input(createProductInputSchema)
        .mutation(({ input, ctx }) => createProduct(input)),

    update: privateProcedure
        .input(updateProductInputSchema)
        .mutation((({ input, ctx }) => updateProduct(input))),
    get: privateProcedure
    .input(productIdSchema)
    .query(({ input, ctx }) => getUniqueProduct(input)),
    //TODO validate search inputs
    search: privateProcedure.input(ProductFindManySchema)
    .query(({ input, ctx }) => findManyProduct(input)),
    delete: privateProcedure
    .input(productIdSchema)
    .mutation(({ input, ctx }) => deleteProduct(input)),
   deleteMany: privateProcedure
    .input(productIdsSchema)
    .mutation(({ input, ctx }) => deleteManyProduct(input)),
    brand:brandRouter,
    category:categoryRouter,
    unit:unitRouter
})