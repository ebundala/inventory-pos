import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";

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
    const { tenantId, ...data } = input;
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
    const { id, ...data } = input;
    return ctx.tx!.posSetting.update({
        where: {
            id: id
        },        
        data: { ...data }
    })
};
export type PosSettingId = number
export type PosSettingIds = Array<number>
export const getUniquePosSetting = async (id: PosSettingId,ctx:TenantContext) => {
    return ctx.tx!.posSetting.findUnique({
        where: {
            id: id
        }        
    })
};
export const deletePosSetting = async (id: PosSettingId,ctx:TenantContext) => {

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
    
    return ctx.tx!.posSetting.findMany(
        input
    );
}

export const findFirstPosSetting = async  (input: Omit<Prisma.PosSettingFindManyArgs, "select"|"include"> ,ctx:TenantContext) => {
    
    return ctx.tx!.posSetting.findFirst(
        input
    );
}