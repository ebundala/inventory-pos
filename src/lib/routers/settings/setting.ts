import { createSetting, deleteManySetting, deleteSetting, findManySetting, getUniqueSetting, updateSetting,findFirstSetting } from "@/core/setting";
import { createSettingInputSchema, settingIdSchema, settingIdsSchema, updateSettingInputSchema } from "@/core/setting/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { SettingFindManySchema } from "prisma/generated/schemas/findManySetting.schema";
import { currencyRouter } from "./currency";
import { posSettingRouter } from "./pos.setting";
import { warehouseRouter } from "./warehouse";



export const settingRouter = router({
    create: privateProcedureWithTx
        .input(createSettingInputSchema)
        .mutation(({ input, ctx }) => createSetting(input,ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateSettingInputSchema)
        .mutation((({ input, ctx }) => updateSetting(input,ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(settingIdSchema)
    .query(({ input, ctx }) => getUniqueSetting(input,ctx as TenantContext)),
    search: privateProcedureWithTx.input(SettingFindManySchema)
    .query(({ input, ctx }) => findManySetting(input,ctx as TenantContext)),
    findFirst: privateProcedureWithTx.input(SettingFindManySchema)
    .query(({ input, ctx }) => findFirstSetting(input,ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(settingIdSchema)
    .mutation(({ input, ctx }) => deleteSetting(input,ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(settingIdsSchema)
    .mutation(({ input, ctx }) => deleteManySetting(input,ctx as TenantContext)),
    pos:posSettingRouter,
    currency:currencyRouter,
    warehouse:warehouseRouter
})