import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";
const include = {
    customer:true,
    currency:true,
    warehouse:true,
   }
   
export type CreateSettingInput = {
    email           :string
    currencyId      ?:number
    companyName     :string
    companyPhone    :string
    companyAddress   :string
    logo            ?:string   
    footer          :string      
    developedBy     :string       
    customerId      ?:number
    warehouseId     ?:number
    defaultLanguage :string 
    tenantId: string
}
export const createSetting = async (input: CreateSettingInput,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "setting",
      action: "update"
    });
    const { tenantId:_, ...data } = input;
    return ctx.tx!.setting.create({
        include,
        data:{tenantId:tenantId,...data}
   })
}
export type UpdateSettingInput = {
  id: number
  email           ?:string
  currencyId      ?:number
  companyName     ?:string
  companyPhone    ?:string
  companyAddress   ?:string
  logo            ?:string   
  footer          ?:string      
  developedBy     ?:string       
  customerId      ?:number
  warehouseId     ?:number
  defaultLanguage ?:string
}
export const updateSetting = async (input: UpdateSettingInput,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "setting",
      action: "update"
    });
    const { id, ...data } = input;
    return ctx.tx!.setting.update({
        include,
        where: {
            id: id,  recordStatus:RecordStatus.ACTIVE,
        },        
        data: { ...data }
    })
};
export type SettingId = number
export type SettingIds = Array<number>
export const getUniqueSetting = async (id: SettingId,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "setting",
      action: "view"
    });
    return ctx.tx!.setting.findUnique({
        include,
        where: {
            id: id,  recordStatus:RecordStatus.ACTIVE,
        }        
    })
};
export const deleteSetting = async (id: SettingId,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "setting",
      action: "update"
    });
    return ctx.tx!.setting.update({
        include,
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManySetting = async (ids: SettingIds,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "setting",
      action: "update"
    });
    return ctx.tx!.setting.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManySetting = async  (input: Omit<Prisma.SettingFindManyArgs, "select"|"include">, ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "setting",
      action: "view"
    });
    const {where,...rest}=input;
    return ctx.tx!.setting.findMany(
      {...rest,where:{...where,  recordStatus:RecordStatus.ACTIVE,},include}
    );
}

export const findFirstSetting = async  (input: Omit<Prisma.SettingFindManyArgs, "select"|"include">,ctx:TenantContext ) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "setting",
      action: "view"
    });
    const {where,...rest}=input;

    return ctx.tx!.setting.findFirst({
       ...rest,where:{...where,  recordStatus:RecordStatus.ACTIVE,},include
    }
    );
}