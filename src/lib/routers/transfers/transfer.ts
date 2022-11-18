import { createTransfer, deleteManyTransfer, deleteTransfer, findManyTransfer, getUniqueTransfer, updateTransfer } from "@/core/transfer";
import { createTransferInputSchema, transferIdSchema, transferIdsSchema, updateTransferInputSchema } from "@/core/transfer/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { TransferFindManySchema } from "prisma/generated/schemas/findManyTransfer.schema";



export const transferRouter = router({
    create: privateProcedureWithTx
        .input(createTransferInputSchema)
        .mutation(({ input, ctx }) => createTransfer(input)),

    update: privateProcedureWithTx
        .input(updateTransferInputSchema)
        .mutation((({ input, ctx }) => updateTransfer(input))),
    get: privateProcedureWithTx
    .input(transferIdSchema)
    .query(({ input, ctx }) => getUniqueTransfer(input)),
    search: privateProcedureWithTx.input(TransferFindManySchema)
    .query(({ input, ctx }) => findManyTransfer(input)),
    delete: privateProcedureWithTx
    .input(transferIdSchema)
    .mutation(({ input, ctx }) => deleteTransfer(input)),
   deleteMany: privateProcedureWithTx
    .input(transferIdsSchema)
    .mutation(({ input, ctx }) => deleteManyTransfer(input))
})