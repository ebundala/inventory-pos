import { createSale, deleteManySale, deleteSale, findManySale, getUniqueSale, updateSale } from "@/core/sale";
import { createSaleInputSchema, saleIdSchema, saleIdsSchema, updateSaleInputSchema } from "@/core/sale/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { SaleFindManySchema } from "prisma/generated/schemas/findManySale.schema";



export const saleRouter = router({
    create: privateProcedure
        .input(createSaleInputSchema)
        .mutation(({ input, ctx }) => createSale(input)),

    update: privateProcedure
        .input(updateSaleInputSchema)
        .mutation((({ input, ctx }) => updateSale(input))),
    get: privateProcedure
    .input(saleIdSchema)
    .query(({ input, ctx }) => getUniqueSale(input)),
    search: privateProcedure.input(SaleFindManySchema)
    .query(({ input, ctx }) => findManySale(input)),
    delete: privateProcedure
    .input(saleIdSchema)
    .mutation(({ input, ctx }) => deleteSale(input)),
   deleteMany: privateProcedure
    .input(saleIdsSchema)
    .mutation(({ input, ctx }) => deleteManySale(input))
})