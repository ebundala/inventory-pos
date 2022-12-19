import { createPosSetting, deleteManyPosSetting, deletePosSetting, findFirstPosSetting, findManyPosSetting, getUniquePosSetting, updatePosSetting } from "@/core/pos_setting";
import { createPosSettingInputSchema, posSettingIdSchema, posSettingIdsSchema, updatePosSettingInputSchema } from "@/core/pos_setting/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { PosSettingFindManySchema } from "prisma/generated/schemas/findManyPosSetting.schema";



export const posSettingRouter = router({
    create: privateProcedureWithTx
        .input(createPosSettingInputSchema)
        .mutation(({ input, ctx }) => createPosSetting(input,ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updatePosSettingInputSchema)
        .mutation((({ input, ctx }) => updatePosSetting(input,ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(posSettingIdSchema)
    .query(({ input, ctx }) => getUniquePosSetting(input,ctx as TenantContext)),
    search: privateProcedureWithTx.input(PosSettingFindManySchema)
    .query(({ input, ctx }) => findManyPosSetting(input,ctx as TenantContext)),
    findFirst: privateProcedureWithTx.input(PosSettingFindManySchema)
    .query(({ input, ctx }) => findFirstPosSetting(input,ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(posSettingIdSchema)
    .mutation(({ input, ctx }) => deletePosSetting(input,ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(posSettingIdsSchema)
    .mutation(({ input, ctx }) => deleteManyPosSetting(input,ctx as TenantContext))
})