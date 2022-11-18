import { createSupplier, deleteManySupplier, deleteSupplier, findManySupplier, getUniqueSupplier, updateSupplier } from "@/core/supplier";
import { createSupplierInputSchema, supplierIdSchema, supplierIdsSchema, updateSupplierInputSchema } from "@/core/supplier/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { SupplierFindManySchema } from "prisma/generated/schemas/findManySupplier.schema";



export const supplierRouter = router({
    create: privateProcedureWithTx
        .input(createSupplierInputSchema)
        .mutation(({ input, ctx }) => createSupplier(input)),

    update: privateProcedureWithTx
        .input(updateSupplierInputSchema)
        .mutation((({ input, ctx }) => updateSupplier(input))),
    get: privateProcedureWithTx
    .input(supplierIdSchema)
    .query(({ input, ctx }) => getUniqueSupplier(input)),
    search: privateProcedureWithTx.input(SupplierFindManySchema)
    .query(({ input, ctx }) => findManySupplier(input)),
    delete: privateProcedureWithTx
    .input(supplierIdSchema)
    .mutation(({ input, ctx }) => deleteSupplier(input)),
   deleteMany: privateProcedureWithTx
    .input(supplierIdsSchema)
    .mutation(({ input, ctx }) => deleteManySupplier(input))
})