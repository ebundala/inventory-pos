import { createSupplier, deleteManySupplier, deleteSupplier, findManySupplier, getUniqueSupplier, updateSupplier } from "@/core/supplier";
import { createSupplierInputSchema, supplierIdSchema, supplierIdsSchema, updateSupplierInputSchema } from "@/core/supplier/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { SupplierFindManySchema } from "prisma/generated/schemas/findManySupplier.schema";



export const supplierRouter = router({
    create: privateProcedure
        .input(createSupplierInputSchema)
        .mutation(({ input, ctx }) => createSupplier(input)),

    update: privateProcedure
        .input(updateSupplierInputSchema)
        .mutation((({ input, ctx }) => updateSupplier(input))),
    get: privateProcedure
    .input(supplierIdSchema)
    .query(({ input, ctx }) => getUniqueSupplier(input)),
    search: privateProcedure.input(SupplierFindManySchema)
    .query(({ input, ctx }) => findManySupplier(input)),
    delete: privateProcedure
    .input(supplierIdSchema)
    .mutation(({ input, ctx }) => deleteSupplier(input)),
   deleteMany: privateProcedure
    .input(supplierIdsSchema)
    .mutation(({ input, ctx }) => deleteManySupplier(input))
})