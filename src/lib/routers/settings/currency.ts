import { createCurrency, deleteManyCurrency, deleteCurrency, findManyCurrency, getUniqueCurrency, updateCurrency } from "@/core/currency";
import { createCurrencyInputSchema, currencyIdSchema, currencyIdsSchema, updateCurrencyInputSchema } from "@/core/currency/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { CurrencyFindManySchema } from "prisma/generated/schemas/findManyCurrency.schema";



export const currencyRouter = router({
    create: privateProcedureWithTx
        .input(createCurrencyInputSchema)
        .mutation(({ input, ctx }) => createCurrency(input,ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateCurrencyInputSchema)
        .mutation((({ input, ctx }) => updateCurrency(input,ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(currencyIdSchema)
    .query(({ input, ctx }) => getUniqueCurrency(input,ctx as TenantContext)),
    search: privateProcedureWithTx.input(CurrencyFindManySchema)
    .query(({ input, ctx }) => findManyCurrency(input,ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(currencyIdSchema)
    .mutation(({ input, ctx }) => deleteCurrency(input,ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(currencyIdsSchema)
    .mutation(({ input, ctx }) => deleteManyCurrency(input,ctx as TenantContext))
})