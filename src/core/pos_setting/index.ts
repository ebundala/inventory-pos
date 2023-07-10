import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";

export type CreatePosSettingInput = {
    noteCustomer ?:string      
    showNote     ?:boolean      
    showBarcode  ?:boolean      
    showDiscount ?:boolean     
    showCustomer ?:boolean      
    showEmail    ?:boolean      
    showPhone    ?:boolean      
    showAddress  ?:boolean 
    tenantId: string
}
export const createPosSetting = async (input: CreatePosSettingInput,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "pos-setting",
      action: "update"
    });
    const { tenantId:_, ...data } = input;
    return ctx.tx!.posSetting.create({
        data:{tenantId:tenantId,...data}
   })
}
export type UpdatePosSettingInput = {
  id: number
  noteCustomer ?:string      
  showNote     ?:boolean      
  showBarcode  ?:boolean      
  showDiscount ?:boolean     
  showCustomer ?:boolean      
  showEmail    ?:boolean      
  showPhone    ?:boolean      
  showAddress  ?:boolean 
}
export const updatePosSetting = async (input: UpdatePosSettingInput,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "pos-setting",
      action: "update"
    });
    const { id, ...data } = input;
    return ctx.tx!.posSetting.update({
        where: {
            id: id,recordStatus:RecordStatus.ACTIVE 
        },        
        data: { ...data }
    })
};
export type PosSettingId = number
export type PosSettingIds = Array<number>
export const getUniquePosSetting = async (id: PosSettingId,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "pos-setting",
      action: "view"
    });
    return ctx.tx!.posSetting.findUnique({
        where: {
            id: id,recordStatus:RecordStatus.ACTIVE 
        }        
    })
};
export const deletePosSetting = async (id: PosSettingId,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "pos-setting",
      action: "update"
    });
    return ctx.tx!.posSetting.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyPosSetting = async (ids: PosSettingIds,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "pos-setting",
      action: "update"
    });
    return ctx.tx!.posSetting.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyPosSetting = async  (input: Omit<Prisma.PosSettingFindManyArgs, "select"|"include">,ctx:TenantContext ) => {
    const {where,...rest}=input;
    return ctx.tx!.posSetting.findMany(
        {
            where:{...where,recordStatus:RecordStatus.ACTIVE },
            ...rest
        }
    );
}

export const findFirstPosSetting = async  (input: Omit<Prisma.PosSettingFindManyArgs, "select"|"include"> ,ctx:TenantContext) => {
    const {where,...rest}=input;

    return ctx.tx!.posSetting.findFirst(
        {
            where:{...where,recordStatus:RecordStatus.ACTIVE },
            ...rest
        }
    );
}