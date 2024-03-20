import { createPurchaseReturn, deleteManyPurchaseReturn, deletePurchaseReturn, findManyPurchaseReturn, getUniquePurchaseReturn, updatePurchaseReturn } from "@/core/purchase_return";
import { createPurchaseReturnInputSchema, purchaseReturnIdSchema, purchaseReturnIdsSchema, updatePurchaseReturnInputSchema } from "@/core/purchase_return/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { PurchaseReturnFindManySchema } from "prisma/generated/schemas/findManyPurchaseReturn.schema";



export const purchaseReturnRouter = router({
    create: privateProcedureWithTx
        .input(createPurchaseReturnInputSchema)
        .mutation(({ input, ctx }) => createPurchaseReturn(input,ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updatePurchaseReturnInputSchema)
        .mutation((({ input, ctx }) => updatePurchaseReturn(input,ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(purchaseReturnIdSchema)
    .query(({ input, ctx }) => getUniquePurchaseReturn(input,ctx as TenantContext)),
    search: privateProcedureWithTx.input(PurchaseReturnFindManySchema)
    .query(({ input, ctx }) => findManyPurchaseReturn(input,ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(purchaseReturnIdSchema)
    .mutation(({ input, ctx }) => deletePurchaseReturn(input,ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(purchaseReturnIdsSchema)
    .mutation(({ input, ctx }) => deleteManyPurchaseReturn(input,ctx as TenantContext))
})