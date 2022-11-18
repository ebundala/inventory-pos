import { createPosSetting, deleteManyPosSetting, deletePosSetting, findManyPosSetting, getUniquePosSetting, updatePosSetting } from "@/core/pos_setting";
import { createPosSettingInputSchema, posSettingIdSchema, posSettingIdsSchema, updatePosSettingInputSchema } from "@/core/pos_setting/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { PosSettingFindManySchema } from "prisma/generated/schemas/findManyPosSetting.schema";



export const posSettingRouter = router({
    create: privateProcedureWithTx
        .input(createPosSettingInputSchema)
        .mutation(({ input, ctx }) => createPosSetting(input)),

    update: privateProcedureWithTx
        .input(updatePosSettingInputSchema)
        .mutation((({ input, ctx }) => updatePosSetting(input))),
    get: privateProcedureWithTx
    .input(posSettingIdSchema)
    .query(({ input, ctx }) => getUniquePosSetting(input)),
    search: privateProcedureWithTx.input(PosSettingFindManySchema)
    .query(({ input, ctx }) => findManyPosSetting(input)),
    delete: privateProcedureWithTx
    .input(posSettingIdSchema)
    .mutation(({ input, ctx }) => deletePosSetting(input)),
   deleteMany: privateProcedureWithTx
    .input(posSettingIdsSchema)
    .mutation(({ input, ctx }) => deleteManyPosSetting(input))
})