import { createAdjustment, deleteManyAdjustment, deleteAdjustment, findManyAdjustment, getUniqueAdjustment, updateAdjustment } from "@/core/adjustment";
import { createAdjustmentInputSchema, adjustmentIdSchema, adjustmentIdsSchema, updateAdjustmentInputSchema } from "@/core/adjustment/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { AdjustmentFindManySchema } from "prisma/generated/schemas/findManyAdjustment.schema";



export const adjustmentRouter = router({
    create: privateProcedureWithTx
        .input(createAdjustmentInputSchema)
        .mutation(({ input, ctx }) => createAdjustment(input,ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateAdjustmentInputSchema)
        .mutation((({ input, ctx }) => updateAdjustment(input,ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(adjustmentIdSchema)
    .query(({ input, ctx }) => getUniqueAdjustment(input,ctx as TenantContext)),
    search: privateProcedureWithTx.input(AdjustmentFindManySchema)
    .query(({ input, ctx }) => findManyAdjustment(input,ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(adjustmentIdSchema)
    .mutation(({ input, ctx }) => deleteAdjustment(input,ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(adjustmentIdsSchema)
    .mutation(({ input, ctx }) => deleteManyAdjustment(input,ctx as TenantContext))
})