import { createSale, deleteManySale, deleteSale, findManySale, getUniqueSale, updateSale } from "@/core/sale";
import { createSaleInputSchema, saleIdSchema, saleIdsSchema, updateSaleInputSchema } from "@/core/sale/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { SaleFindManySchema } from "prisma/generated/schemas/findManySale.schema";



export const saleRouter = router({
    create: privateProcedureWithTx
        .input(createSaleInputSchema)
        .mutation(({ input, ctx }) => createSale(input,ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateSaleInputSchema)
        .mutation((({ input, ctx }) => updateSale(input,ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(saleIdSchema)
    .query(({ input, ctx }) => getUniqueSale(input,ctx as TenantContext)),
    search: privateProcedureWithTx.input(SaleFindManySchema)
    .query(({ input, ctx }) => findManySale(input,ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(saleIdSchema)
    .mutation(({ input, ctx }) => deleteSale(input,ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(saleIdsSchema)
    .mutation(({ input, ctx }) => deleteManySale(input,ctx as TenantContext))
})