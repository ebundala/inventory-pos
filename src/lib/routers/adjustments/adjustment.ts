import { createAdjustment, deleteManyAdjustment, deleteAdjustment, findManyAdjustment, getUniqueAdjustment, updateAdjustment } from "@/core/adjustment";
import { createAdjustmentInputSchema, adjustmentIdSchema, adjustmentIdsSchema, updateAdjustmentInputSchema } from "@/core/adjustment/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { AdjustmentFindManySchema } from "prisma/generated/schemas/findManyAdjustment.schema";



export const adjustmentRouter = router({
    create: privateProcedure
        .input(createAdjustmentInputSchema)
        .mutation(({ input, ctx }) => createAdjustment(input)),

    update: privateProcedure
        .input(updateAdjustmentInputSchema)
        .mutation((({ input, ctx }) => updateAdjustment(input))),
    get: privateProcedure
    .input(adjustmentIdSchema)
    .query(({ input, ctx }) => getUniqueAdjustment(input)),
    //TODO validate search inputs
    search: privateProcedure.input(AdjustmentFindManySchema)
    .query(({ input, ctx }) => findManyAdjustment(input)),
    delete: privateProcedure
    .input(adjustmentIdSchema)
    .mutation(({ input, ctx }) => deleteAdjustment(input)),
   deleteMany: privateProcedure
    .input(adjustmentIdsSchema)
    .mutation(({ input, ctx }) => deleteManyAdjustment(input))
})