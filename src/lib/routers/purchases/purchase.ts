import { createPurchase, deleteManyPurchase, deletePurchase, findManyPurchase, getUniquePurchase, updatePurchase } from "@/core/purchase";
import { createPurchaseInputSchema, purchaseIdSchema, purchaseIdsSchema, updatePurchaseInputSchema } from "@/core/purchase/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { PurchaseFindManySchema } from "prisma/generated/schemas/findManyPurchase.schema";



export const purchaseRouter = router({
    create: privateProcedureWithTx
        .input(createPurchaseInputSchema)
        .mutation(({ input, ctx }) => createPurchase(input, ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updatePurchaseInputSchema)
        .mutation((({ input, ctx }) => updatePurchase(input, ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(purchaseIdSchema)
    .query(({ input, ctx }) => getUniquePurchase(input, ctx as TenantContext)),
    search: privateProcedureWithTx.input(PurchaseFindManySchema)
    .query(({ input, ctx }) => findManyPurchase(input, ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(purchaseIdSchema)
    .mutation(({ input, ctx }) => deletePurchase(input, ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(purchaseIdsSchema)
    .mutation(({ input, ctx }) => deleteManyPurchase(input, ctx as TenantContext))
})