import { createSetting, deleteManySetting, deleteSetting, findManySetting, getUniqueSetting, updateSetting } from "@/core/setting";
import { createSettingInputSchema, settingIdSchema, settingIdsSchema, updateSettingInputSchema } from "@/core/setting/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { SettingFindManySchema } from "prisma/generated/schemas/findManySetting.schema";
import { currencyRouter } from "./currency";
import { posSettingRouter } from "./pos.setting";
import { warehouseRouter } from "./warehouse";



export const settingRouter = router({
    create: privateProcedureWithTx
        .input(createSettingInputSchema)
        .mutation(({ input, ctx }) => createSetting(input)),

    update: privateProcedureWithTx
        .input(updateSettingInputSchema)
        .mutation((({ input, ctx }) => updateSetting(input))),
    get: privateProcedureWithTx
    .input(settingIdSchema)
    .query(({ input, ctx }) => getUniqueSetting(input)),
    search: privateProcedureWithTx.input(SettingFindManySchema)
    .query(({ input, ctx }) => findManySetting(input)),
    delete: privateProcedureWithTx
    .input(settingIdSchema)
    .mutation(({ input, ctx }) => deleteSetting(input)),
   deleteMany: privateProcedureWithTx
    .input(settingIdsSchema)
    .mutation(({ input, ctx }) => deleteManySetting(input)),
    pos:posSettingRouter,
    currency:currencyRouter,
    warehouse:warehouseRouter
})