import { createUnit, deleteManyUnit, deleteUnit, findManyUnit, getUniqueUnit, updateUnit } from "@/core/unit";
import { createUnitInputSchema, unitIdSchema, unitIdsSchema, updateUnitInputSchema } from "@/core/unit/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { UnitFindManySchema } from "prisma/generated/schemas/findManyUnit.schema";



export const unitRouter = router({
    create: privateProcedure
        .input(createUnitInputSchema)
        .mutation(({ input, ctx }) => createUnit(input)),

    update: privateProcedure
        .input(updateUnitInputSchema)
        .mutation((({ input, ctx }) => updateUnit(input))),
    get: privateProcedure
    .input(unitIdSchema)
    .query(({ input, ctx }) => getUniqueUnit(input)),
    search: privateProcedure.input(UnitFindManySchema)
    .query(({ input, ctx }) => findManyUnit(input)),
    delete: privateProcedure
    .input(unitIdSchema)
    .mutation(({ input, ctx }) => deleteUnit(input)),
   deleteMany: privateProcedure
    .input(unitIdsSchema)
    .mutation(({ input, ctx }) => deleteManyUnit(input))
})