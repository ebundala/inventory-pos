import { createSetting, deleteManySetting, deleteSetting, findManySetting, getUniqueSetting, updateSetting } from "@/core/setting";
import { createSettingInputSchema, settingIdSchema, settingIdsSchema, updateSettingInputSchema } from "@/core/setting/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { SettingFindManySchema } from "prisma/generated/schemas/findManySetting.schema";
import { currencyRouter } from "./currency";
import { posSettingRouter } from "./pos.setting";
import { warehouseRouter } from "./warehouse";



export const settingRouter = router({
    create: privateProcedure
        .input(createSettingInputSchema)
        .mutation(({ input, ctx }) => createSetting(input)),

    update: privateProcedure
        .input(updateSettingInputSchema)
        .mutation((({ input, ctx }) => updateSetting(input))),
    get: privateProcedure
    .input(settingIdSchema)
    .query(({ input, ctx }) => getUniqueSetting(input)),
    search: privateProcedure.input(SettingFindManySchema)
    .query(({ input, ctx }) => findManySetting(input)),
    delete: privateProcedure
    .input(settingIdSchema)
    .mutation(({ input, ctx }) => deleteSetting(input)),
   deleteMany: privateProcedure
    .input(settingIdsSchema)
    .mutation(({ input, ctx }) => deleteManySetting(input)),
    pos:posSettingRouter,
    currency:currencyRouter,
    warehouse:warehouseRouter
})