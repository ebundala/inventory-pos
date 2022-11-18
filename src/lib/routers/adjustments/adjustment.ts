import { createAdjustment, deleteManyAdjustment, deleteAdjustment, findManyAdjustment, getUniqueAdjustment, updateAdjustment } from "@/core/adjustment";
import { createAdjustmentInputSchema, adjustmentIdSchema, adjustmentIdsSchema, updateAdjustmentInputSchema } from "@/core/adjustment/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { AdjustmentFindManySchema } from "prisma/generated/schemas/findManyAdjustment.schema";



export const adjustmentRouter = router({
    create: privateProcedureWithTx
        .input(createAdjustmentInputSchema)
        .mutation(({ input, ctx }) => createAdjustment(input)),

    update: privateProcedureWithTx
        .input(updateAdjustmentInputSchema)
        .mutation((({ input, ctx }) => updateAdjustment(input))),
    get: privateProcedureWithTx
    .input(adjustmentIdSchema)
    .query(({ input, ctx }) => getUniqueAdjustment(input)),
    search: privateProcedureWithTx.input(AdjustmentFindManySchema)
    .query(({ input, ctx }) => findManyAdjustment(input)),
    delete: privateProcedureWithTx
    .input(adjustmentIdSchema)
    .mutation(({ input, ctx }) => deleteAdjustment(input)),
   deleteMany: privateProcedureWithTx
    .input(adjustmentIdsSchema)
    .mutation(({ input, ctx }) => deleteManyAdjustment(input))
})