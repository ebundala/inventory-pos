import { createWarehouse, deleteManyWarehouse, deleteWarehouse, findManyWarehouse, getUniqueWarehouse, updateWarehouse } from "@/core/warehouse";
import { createWarehouseInputSchema, warehouseIdSchema, warehouseIdsSchema, updateWarehouseInputSchema } from "@/core/warehouse/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { WarehouseFindManySchema } from "prisma/generated/schemas/findManyWarehouse.schema";



export const warehouseRouter = router({
    create: privateProcedureWithTx
        .input(createWarehouseInputSchema)
        .mutation(({ input, ctx }) => createWarehouse(input,ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateWarehouseInputSchema)
        .mutation((({ input, ctx }) => updateWarehouse(input,ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(warehouseIdSchema)
    .query(({ input, ctx }) => getUniqueWarehouse(input,ctx as TenantContext)),
    search: privateProcedureWithTx.input(WarehouseFindManySchema)
    .query(({ input, ctx }) => findManyWarehouse(input,ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(warehouseIdSchema)
    .mutation(({ input, ctx }) => deleteWarehouse(input,ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(warehouseIdsSchema)
    .mutation(({ input, ctx }) => deleteManyWarehouse(input,ctx as TenantContext))
})