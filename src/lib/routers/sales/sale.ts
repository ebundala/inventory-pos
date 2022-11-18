import { createSale, deleteManySale, deleteSale, findManySale, getUniqueSale, updateSale } from "@/core/sale";
import { createSaleInputSchema, saleIdSchema, saleIdsSchema, updateSaleInputSchema } from "@/core/sale/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { SaleFindManySchema } from "prisma/generated/schemas/findManySale.schema";



export const saleRouter = router({
    create: privateProcedureWithTx
        .input(createSaleInputSchema)
        .mutation(({ input, ctx }) => createSale(input)),

    update: privateProcedureWithTx
        .input(updateSaleInputSchema)
        .mutation((({ input, ctx }) => updateSale(input))),
    get: privateProcedureWithTx
    .input(saleIdSchema)
    .query(({ input, ctx }) => getUniqueSale(input)),
    search: privateProcedureWithTx.input(SaleFindManySchema)
    .query(({ input, ctx }) => findManySale(input)),
    delete: privateProcedureWithTx
    .input(saleIdSchema)
    .mutation(({ input, ctx }) => deleteSale(input)),
   deleteMany: privateProcedureWithTx
    .input(saleIdsSchema)
    .mutation(({ input, ctx }) => deleteManySale(input))
})