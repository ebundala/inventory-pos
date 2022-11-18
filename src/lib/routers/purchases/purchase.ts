import { createPurchase, deleteManyPurchase, deletePurchase, findManyPurchase, getUniquePurchase, updatePurchase } from "@/core/purchase";
import { createPurchaseInputSchema, purchaseIdSchema, purchaseIdsSchema, updatePurchaseInputSchema } from "@/core/purchase/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { PurchaseFindManySchema } from "prisma/generated/schemas/findManyPurchase.schema";



export const purchaseRouter = router({
    create: privateProcedureWithTx
        .input(createPurchaseInputSchema)
        .mutation(({ input, ctx }) => createPurchase(input)),

    update: privateProcedureWithTx
        .input(updatePurchaseInputSchema)
        .mutation((({ input, ctx }) => updatePurchase(input))),
    get: privateProcedureWithTx
    .input(purchaseIdSchema)
    .query(({ input, ctx }) => getUniquePurchase(input)),
    search: privateProcedureWithTx.input(PurchaseFindManySchema)
    .query(({ input, ctx }) => findManyPurchase(input)),
    delete: privateProcedureWithTx
    .input(purchaseIdSchema)
    .mutation(({ input, ctx }) => deletePurchase(input)),
   deleteMany: privateProcedureWithTx
    .input(purchaseIdsSchema)
    .mutation(({ input, ctx }) => deleteManyPurchase(input))
})