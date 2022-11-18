import { createQuotation, deleteManyQuotation, deleteQuotation, findManyQuotation, getUniqueQuotation, updateQuotation } from "@/core/quotation";
import { createQuotationInputSchema, quotationIdSchema, quotationIdsSchema, updateQuotationInputSchema } from "@/core/quotation/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { QuotationFindManySchema } from "prisma/generated/schemas/findManyQuotation.schema";



export const quotationRouter = router({
    create: privateProcedureWithTx
        .input(createQuotationInputSchema)
        .mutation(({ input, ctx }) => createQuotation(input)),

    update: privateProcedureWithTx
        .input(updateQuotationInputSchema)
        .mutation((({ input, ctx }) => updateQuotation(input))),
    get: privateProcedureWithTx
    .input(quotationIdSchema)
    .query(({ input, ctx }) => getUniqueQuotation(input)),
    search: privateProcedureWithTx.input(QuotationFindManySchema)
    .query(({ input, ctx }) => findManyQuotation(input)),
    delete: privateProcedureWithTx
    .input(quotationIdSchema)
    .mutation(({ input, ctx }) => deleteQuotation(input)),
   deleteMany: privateProcedureWithTx
    .input(quotationIdsSchema)
    .mutation(({ input, ctx }) => deleteManyQuotation(input))
})