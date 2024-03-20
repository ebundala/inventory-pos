import { createQuotation, deleteManyQuotation, deleteQuotation, findManyQuotation, getUniqueQuotation, updateQuotation } from "@/core/quotation";
import { createQuotationInputSchema, quotationIdSchema, quotationIdsSchema, updateQuotationInputSchema } from "@/core/quotation/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { QuotationFindManySchema } from "prisma/generated/schemas/findManyQuotation.schema";



export const quotationRouter = router({
    create: privateProcedureWithTx
        .input(createQuotationInputSchema)
        .mutation(({ input, ctx }) => createQuotation(input, ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateQuotationInputSchema)
        .mutation((({ input, ctx }) => updateQuotation(input, ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(quotationIdSchema)
    .query(({ input, ctx }) => getUniqueQuotation(input, ctx as TenantContext)),
    search: privateProcedureWithTx.input(QuotationFindManySchema)
    .query(({ input, ctx }) => findManyQuotation(input, ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(quotationIdSchema)
    .mutation(({ input, ctx }) => deleteQuotation(input, ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(quotationIdsSchema)
    .mutation(({ input, ctx }) => deleteManyQuotation(input, ctx as TenantContext))
})