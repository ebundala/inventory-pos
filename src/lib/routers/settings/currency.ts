import { createCurrency, deleteManyCurrency, deleteCurrency, findManyCurrency, getUniqueCurrency, updateCurrency } from "@/core/currency";
import { createCurrencyInputSchema, currencyIdSchema, currencyIdsSchema, updateCurrencyInputSchema } from "@/core/currency/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { CurrencyFindManySchema } from "prisma/generated/schemas/findManyCurrency.schema";



export const currencyRouter = router({
    create: privateProcedure
        .input(createCurrencyInputSchema)
        .mutation(({ input, ctx }) => createCurrency(input)),

    update: privateProcedure
        .input(updateCurrencyInputSchema)
        .mutation((({ input, ctx }) => updateCurrency(input))),
    get: privateProcedure
    .input(currencyIdSchema)
    .query(({ input, ctx }) => getUniqueCurrency(input)),
    search: privateProcedure.input(CurrencyFindManySchema)
    .query(({ input, ctx }) => findManyCurrency(input)),
    delete: privateProcedure
    .input(currencyIdSchema)
    .mutation(({ input, ctx }) => deleteCurrency(input)),
   deleteMany: privateProcedure
    .input(currencyIdsSchema)
    .mutation(({ input, ctx }) => deleteManyCurrency(input))
})