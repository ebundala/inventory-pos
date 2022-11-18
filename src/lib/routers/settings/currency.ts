import { createCurrency, deleteManyCurrency, deleteCurrency, findManyCurrency, getUniqueCurrency, updateCurrency } from "@/core/currency";
import { createCurrencyInputSchema, currencyIdSchema, currencyIdsSchema, updateCurrencyInputSchema } from "@/core/currency/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { CurrencyFindManySchema } from "prisma/generated/schemas/findManyCurrency.schema";



export const currencyRouter = router({
    create: privateProcedureWithTx
        .input(createCurrencyInputSchema)
        .mutation(({ input, ctx }) => createCurrency(input)),

    update: privateProcedureWithTx
        .input(updateCurrencyInputSchema)
        .mutation((({ input, ctx }) => updateCurrency(input))),
    get: privateProcedureWithTx
    .input(currencyIdSchema)
    .query(({ input, ctx }) => getUniqueCurrency(input)),
    search: privateProcedureWithTx.input(CurrencyFindManySchema)
    .query(({ input, ctx }) => findManyCurrency(input)),
    delete: privateProcedureWithTx
    .input(currencyIdSchema)
    .mutation(({ input, ctx }) => deleteCurrency(input)),
   deleteMany: privateProcedureWithTx
    .input(currencyIdsSchema)
    .mutation(({ input, ctx }) => deleteManyCurrency(input))
})