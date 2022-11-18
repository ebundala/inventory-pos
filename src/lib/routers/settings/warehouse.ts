import { createWarehouse, deleteManyWarehouse, deleteWarehouse, findManyWarehouse, getUniqueWarehouse, updateWarehouse } from "@/core/warehouse";
import { createWarehouseInputSchema, warehouseIdSchema, warehouseIdsSchema, updateWarehouseInputSchema } from "@/core/warehouse/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { WarehouseFindManySchema } from "prisma/generated/schemas/findManyWarehouse.schema";



export const warehouseRouter = router({
    create: privateProcedureWithTx
        .input(createWarehouseInputSchema)
        .mutation(({ input, ctx }) => createWarehouse(input)),

    update: privateProcedureWithTx
        .input(updateWarehouseInputSchema)
        .mutation((({ input, ctx }) => updateWarehouse(input))),
    get: privateProcedureWithTx
    .input(warehouseIdSchema)
    .query(({ input, ctx }) => getUniqueWarehouse(input)),
    search: privateProcedureWithTx.input(WarehouseFindManySchema)
    .query(({ input, ctx }) => findManyWarehouse(input)),
    delete: privateProcedureWithTx
    .input(warehouseIdSchema)
    .mutation(({ input, ctx }) => deleteWarehouse(input)),
   deleteMany: privateProcedureWithTx
    .input(warehouseIdsSchema)
    .mutation(({ input, ctx }) => deleteManyWarehouse(input))
})