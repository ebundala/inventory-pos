import { createCategory, deleteManyCategory, deleteCategory, findManyCategory, getUniqueCategory, updateCategory } from "@/core/category";
import { createCategoryInputSchema, categoryIdSchema, categoryIdsSchema, updateCategoryInputSchema } from "@/core/category/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { CategoryFindManySchema } from "prisma/generated/schemas/findManyCategory.schema";



export const categoryRouter = router({
    create: privateProcedureWithTx
        .input(createCategoryInputSchema)
        .mutation(({ input, ctx }) => createCategory(input, ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateCategoryInputSchema)
        .mutation((({ input, ctx }) => updateCategory(input, ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(categoryIdSchema)
    .query(({ input, ctx }) => getUniqueCategory(input, ctx as TenantContext)),
    search: privateProcedureWithTx.input(CategoryFindManySchema)
    .query(({ input, ctx }) => findManyCategory(input, ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(categoryIdSchema)
    .mutation(({ input, ctx }) => deleteCategory(input, ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(categoryIdsSchema)
    .mutation(({ input, ctx }) => deleteManyCategory(input, ctx as TenantContext))
})