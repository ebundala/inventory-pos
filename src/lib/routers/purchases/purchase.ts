import { createPurchase, deleteManyPurchase, deletePurchase, findManyPurchase, getUniquePurchase, updatePurchase } from "@/core/purchase";
import { createPurchaseInputSchema, purchaseIdSchema, purchaseIdsSchema, updatePurchaseInputSchema } from "@/core/purchase/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { PurchaseFindManySchema } from "prisma/generated/schemas/findManyPurchase.schema";



export const purchaseRouter = router({
    create: privateProcedure
        .input(createPurchaseInputSchema)
        .mutation(({ input, ctx }) => createPurchase(input)),

    update: privateProcedure
        .input(updatePurchaseInputSchema)
        .mutation((({ input, ctx }) => updatePurchase(input))),
    get: privateProcedure
    .input(purchaseIdSchema)
    .query(({ input, ctx }) => getUniquePurchase(input)),
    //TODO validate search inputs
    search: privateProcedure.input(PurchaseFindManySchema)
    .query(({ input, ctx }) => findManyPurchase(input)),
    delete: privateProcedure
    .input(purchaseIdSchema)
    .mutation(({ input, ctx }) => deletePurchase(input)),
   deleteMany: privateProcedure
    .input(purchaseIdsSchema)
    .mutation(({ input, ctx }) => deleteManyPurchase(input))
})