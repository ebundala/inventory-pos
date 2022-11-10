import { createQuotation, deleteManyQuotation, deleteQuotation, findManyQuotation, getUniqueQuotation, updateQuotation } from "@/core/quotation";
import { createQuotationInputSchema, quotationIdSchema, quotationIdsSchema, updateQuotationInputSchema } from "@/core/quotation/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { QuotationFindManySchema } from "prisma/generated/schemas/findManyQuotation.schema";



export const quotationRouter = router({
    create: privateProcedure
        .input(createQuotationInputSchema)
        .mutation(({ input, ctx }) => createQuotation(input)),

    update: privateProcedure
        .input(updateQuotationInputSchema)
        .mutation((({ input, ctx }) => updateQuotation(input))),
    get: privateProcedure
    .input(quotationIdSchema)
    .query(({ input, ctx }) => getUniqueQuotation(input)),
    search: privateProcedure.input(QuotationFindManySchema)
    .query(({ input, ctx }) => findManyQuotation(input)),
    delete: privateProcedure
    .input(quotationIdSchema)
    .mutation(({ input, ctx }) => deleteQuotation(input)),
   deleteMany: privateProcedure
    .input(quotationIdsSchema)
    .mutation(({ input, ctx }) => deleteManyQuotation(input))
})