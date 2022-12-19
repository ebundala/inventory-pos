import { createTransfer, deleteManyTransfer, deleteTransfer, findManyTransfer, getUniqueTransfer, updateTransfer } from "@/core/transfer";
import { createTransferInputSchema, transferIdSchema, transferIdsSchema, updateTransferInputSchema } from "@/core/transfer/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { TransferFindManySchema } from "prisma/generated/schemas/findManyTransfer.schema";



export const transferRouter = router({
    create: privateProcedureWithTx
        .input(createTransferInputSchema)
        .mutation(({ input, ctx }) => createTransfer(input, ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateTransferInputSchema)
        .mutation((({ input, ctx }) => updateTransfer(input, ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(transferIdSchema)
    .query(({ input, ctx }) => getUniqueTransfer(input, ctx as TenantContext)),
    search: privateProcedureWithTx.input(TransferFindManySchema)
    .query(({ input, ctx }) => findManyTransfer(input, ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(transferIdSchema)
    .mutation(({ input, ctx }) => deleteTransfer(input, ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(transferIdsSchema)
    .mutation(({ input, ctx }) => deleteManyTransfer(input, ctx as TenantContext))
})