import { createPosSetting, deleteManyPosSetting, deletePosSetting, findManyPosSetting, getUniquePosSetting, updatePosSetting } from "@/core/pos_setting";
import { createPosSettingInputSchema, posSettingIdSchema, posSettingIdsSchema, updatePosSettingInputSchema } from "@/core/pos_setting/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { PosSettingFindManySchema } from "prisma/generated/schemas/findManyPosSetting.schema";



export const posSettingRouter = router({
    create: privateProcedure
        .input(createPosSettingInputSchema)
        .mutation(({ input, ctx }) => createPosSetting(input)),

    update: privateProcedure
        .input(updatePosSettingInputSchema)
        .mutation((({ input, ctx }) => updatePosSetting(input))),
    get: privateProcedure
    .input(posSettingIdSchema)
    .query(({ input, ctx }) => getUniquePosSetting(input)),
    search: privateProcedure.input(PosSettingFindManySchema)
    .query(({ input, ctx }) => findManyPosSetting(input)),
    delete: privateProcedure
    .input(posSettingIdSchema)
    .mutation(({ input, ctx }) => deletePosSetting(input)),
   deleteMany: privateProcedure
    .input(posSettingIdsSchema)
    .mutation(({ input, ctx }) => deleteManyPosSetting(input))
})