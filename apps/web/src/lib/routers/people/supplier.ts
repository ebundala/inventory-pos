import { createSupplier, deleteManySupplier, deleteSupplier, findManySupplier, getUniqueSupplier, updateSupplier } from "@/core/supplier";
import { createSupplierInputSchema, supplierIdSchema, supplierIdsSchema, updateSupplierInputSchema } from "@/core/supplier/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { SupplierFindManySchema } from "prisma/generated/schemas/findManySupplier.schema";



export const supplierRouter = router({
    create: privateProcedureWithTx
        .input(createSupplierInputSchema)
        .mutation(({ input, ctx }) => createSupplier(input, ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateSupplierInputSchema)
        .mutation((({ input, ctx }) => updateSupplier(input, ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(supplierIdSchema)
    .query(({ input, ctx }) => getUniqueSupplier(input, ctx as TenantContext)),
    search: privateProcedureWithTx.input(SupplierFindManySchema)
    .query(({ input, ctx }) => findManySupplier(input, ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(supplierIdSchema)
    .mutation(({ input, ctx }) => deleteSupplier(input, ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(supplierIdsSchema)
    .mutation(({ input, ctx }) => deleteManySupplier(input, ctx as TenantContext))
})