import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
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
    const { tenantId, ...data } = input;
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
    const { id, ...data } = input;
    return ctx.tx!.setting.update({
        include,
        where: {
            id: id
        },        
        data: { ...data }
    })
};
export type SettingId = number
export type SettingIds = Array<number>
export const getUniqueSetting = async (id: SettingId,ctx:TenantContext) => {
    return ctx.tx!.setting.findUnique({
        include,
        where: {
            id: id
        }        
    })
};
export const deleteSetting = async (id: SettingId,ctx:TenantContext) => {

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
    
    return ctx.tx!.setting.findMany(
      {...input,include}
    );
}

export const findFirstSetting = async  (input: Omit<Prisma.SettingFindManyArgs, "select"|"include">,ctx:TenantContext ) => {
    
    return ctx.tx!.setting.findFirst({
       ...input,include
    }
    );
}