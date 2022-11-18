import { createCategory, deleteManyCategory, deleteCategory, findManyCategory, getUniqueCategory, updateCategory } from "@/core/category";
import { createCategoryInputSchema, categoryIdSchema, categoryIdsSchema, updateCategoryInputSchema } from "@/core/category/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { CategoryFindManySchema } from "prisma/generated/schemas/findManyCategory.schema";



export const categoryRouter = router({
    create: privateProcedureWithTx
        .input(createCategoryInputSchema)
        .mutation(({ input, ctx }) => createCategory(input)),

    update: privateProcedureWithTx
        .input(updateCategoryInputSchema)
        .mutation((({ input, ctx }) => updateCategory(input))),
    get: privateProcedureWithTx
    .input(categoryIdSchema)
    .query(({ input, ctx }) => getUniqueCategory(input)),
    search: privateProcedureWithTx.input(CategoryFindManySchema)
    .query(({ input, ctx }) => findManyCategory(input)),
    delete: privateProcedureWithTx
    .input(categoryIdSchema)
    .mutation(({ input, ctx }) => deleteCategory(input)),
   deleteMany: privateProcedureWithTx
    .input(categoryIdsSchema)
    .mutation(({ input, ctx }) => deleteManyCategory(input))
})