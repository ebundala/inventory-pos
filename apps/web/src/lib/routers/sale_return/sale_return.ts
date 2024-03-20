import { createSaleReturn, deleteManySaleReturn, deleteSaleReturn, findManySaleReturn, getUniqueSaleReturn, updateSaleReturn } from "@/core/sale_return";
import { createSaleReturnInputSchema, saleReturnIdSchema, saleReturnIdsSchema, updateSaleReturnInputSchema } from "@/core/sale_return/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { SaleReturnFindManySchema } from "prisma/generated/schemas/findManySaleReturn.schema";



export const saleReturnRouter = router({
    create: privateProcedureWithTx
        .input(createSaleReturnInputSchema)
        .mutation(({ input, ctx }) => createSaleReturn(input, ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateSaleReturnInputSchema)
        .mutation((({ input, ctx }) => updateSaleReturn(input, ctx as TenantContext))),
    get: privateProcedureWithTx
        .input(saleReturnIdSchema)
        .query(({ input, ctx }) => getUniqueSaleReturn(input, ctx as TenantContext)),
    search: privateProcedureWithTx.input(SaleReturnFindManySchema)
        .query(({ input, ctx }) => findManySaleReturn(input, ctx as TenantContext)),
    delete: privateProcedureWithTx
        .input(saleReturnIdSchema)
        .mutation(({ input, ctx }) => deleteSaleReturn(input, ctx as TenantContext)),
    deleteMany: privateProcedureWithTx
        .input(saleReturnIdsSchema)
        .mutation(({ input, ctx }) => deleteManySaleReturn(input, ctx as TenantContext))
})