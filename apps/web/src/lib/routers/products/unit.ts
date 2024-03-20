import { createUnit, deleteManyUnit, deleteUnit, findManyUnit, getUniqueUnit, updateUnit } from "@/core/unit";
import { createUnitInputSchema, unitIdSchema, unitIdsSchema, updateUnitInputSchema } from "@/core/unit/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { UnitFindManySchema } from "prisma/generated/schemas/findManyUnit.schema";



export const unitRouter = router({
    create: privateProcedureWithTx
        .input(createUnitInputSchema)
        .mutation(({ input, ctx }) => createUnit(input, ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateUnitInputSchema)
        .mutation((({ input, ctx }) => updateUnit(input, ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(unitIdSchema)
    .query(({ input, ctx }) => getUniqueUnit(input, ctx as TenantContext)),
    search: privateProcedureWithTx.input(UnitFindManySchema)
    .query(({ input, ctx }) => findManyUnit(input, ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(unitIdSchema)
    .mutation(({ input, ctx }) => deleteUnit(input, ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(unitIdsSchema)
    .mutation(({ input, ctx }) => deleteManyUnit(input, ctx as TenantContext))
})