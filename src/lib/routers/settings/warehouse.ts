import { createWarehouse, deleteManyWarehouse, deleteWarehouse, findManyWarehouse, getUniqueWarehouse, updateWarehouse } from "@/core/warehouse";
import { createWarehouseInputSchema, warehouseIdSchema, warehouseIdsSchema, updateWarehouseInputSchema } from "@/core/warehouse/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { WarehouseFindManySchema } from "prisma/generated/schemas/findManyWarehouse.schema";



export const warehouseRouter = router({
    create: privateProcedure
        .input(createWarehouseInputSchema)
        .mutation(({ input, ctx }) => createWarehouse(input)),

    update: privateProcedure
        .input(updateWarehouseInputSchema)
        .mutation((({ input, ctx }) => updateWarehouse(input))),
    get: privateProcedure
    .input(warehouseIdSchema)
    .query(({ input, ctx }) => getUniqueWarehouse(input)),
    search: privateProcedure.input(WarehouseFindManySchema)
    .query(({ input, ctx }) => findManyWarehouse(input)),
    delete: privateProcedure
    .input(warehouseIdSchema)
    .mutation(({ input, ctx }) => deleteWarehouse(input)),
   deleteMany: privateProcedure
    .input(warehouseIdsSchema)
    .mutation(({ input, ctx }) => deleteManyWarehouse(input))
})