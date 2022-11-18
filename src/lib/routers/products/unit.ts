import { createUnit, deleteManyUnit, deleteUnit, findManyUnit, getUniqueUnit, updateUnit } from "@/core/unit";
import { createUnitInputSchema, unitIdSchema, unitIdsSchema, updateUnitInputSchema } from "@/core/unit/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { UnitFindManySchema } from "prisma/generated/schemas/findManyUnit.schema";



export const unitRouter = router({
    create: privateProcedureWithTx
        .input(createUnitInputSchema)
        .mutation(({ input, ctx }) => createUnit(input)),

    update: privateProcedureWithTx
        .input(updateUnitInputSchema)
        .mutation((({ input, ctx }) => updateUnit(input))),
    get: privateProcedureWithTx
    .input(unitIdSchema)
    .query(({ input, ctx }) => getUniqueUnit(input)),
    search: privateProcedureWithTx.input(UnitFindManySchema)
    .query(({ input, ctx }) => findManyUnit(input)),
    delete: privateProcedureWithTx
    .input(unitIdSchema)
    .mutation(({ input, ctx }) => deleteUnit(input)),
   deleteMany: privateProcedureWithTx
    .input(unitIdsSchema)
    .mutation(({ input, ctx }) => deleteManyUnit(input))
})