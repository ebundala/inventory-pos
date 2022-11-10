import { createTransfer, deleteManyTransfer, deleteTransfer, findManyTransfer, getUniqueTransfer, updateTransfer } from "@/core/transfer";
import { createTransferInputSchema, transferIdSchema, transferIdsSchema, updateTransferInputSchema } from "@/core/transfer/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { TransferFindManySchema } from "prisma/generated/schemas/findManyTransfer.schema";



export const transferRouter = router({
    create: privateProcedure
        .input(createTransferInputSchema)
        .mutation(({ input, ctx }) => createTransfer(input)),

    update: privateProcedure
        .input(updateTransferInputSchema)
        .mutation((({ input, ctx }) => updateTransfer(input))),
    get: privateProcedure
    .input(transferIdSchema)
    .query(({ input, ctx }) => getUniqueTransfer(input)),
    search: privateProcedure.input(TransferFindManySchema)
    .query(({ input, ctx }) => findManyTransfer(input)),
    delete: privateProcedure
    .input(transferIdSchema)
    .mutation(({ input, ctx }) => deleteTransfer(input)),
   deleteMany: privateProcedure
    .input(transferIdsSchema)
    .mutation(({ input, ctx }) => deleteManyTransfer(input))
})