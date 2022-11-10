import { createCategory, deleteManyCategory, deleteCategory, findManyCategory, getUniqueCategory, updateCategory } from "@/core/category";
import { createCategoryInputSchema, categoryIdSchema, categoryIdsSchema, updateCategoryInputSchema } from "@/core/category/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { CategoryFindManySchema } from "prisma/generated/schemas/findManyCategory.schema";



export const categoryRouter = router({
    create: privateProcedure
        .input(createCategoryInputSchema)
        .mutation(({ input, ctx }) => createCategory(input)),

    update: privateProcedure
        .input(updateCategoryInputSchema)
        .mutation((({ input, ctx }) => updateCategory(input))),
    get: privateProcedure
    .input(categoryIdSchema)
    .query(({ input, ctx }) => getUniqueCategory(input)),
    search: privateProcedure.input(CategoryFindManySchema)
    .query(({ input, ctx }) => findManyCategory(input)),
    delete: privateProcedure
    .input(categoryIdSchema)
    .mutation(({ input, ctx }) => deleteCategory(input)),
   deleteMany: privateProcedure
    .input(categoryIdsSchema)
    .mutation(({ input, ctx }) => deleteManyCategory(input))
})