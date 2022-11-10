import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";

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
export const createSetting = async (input: CreateSettingInput) => {
    const { tenantId, ...data } = input;
    return prisma!.setting.create({
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
export const updateSetting = async (input: UpdateSettingInput) => {
    const { id, ...data } = input;
    return prisma!.setting.update({
        where: {
            id: id
        },        
        data: { ...data }
    })
};
export type SettingId = number
export type SettingIds = Array<number>
export const getUniqueSetting = async (id: SettingId) => {
    return prisma!.setting.findUnique({
        where: {
            id: id
        }        
    })
};
export const deleteSetting = async (id: SettingId) => {

    return prisma!.setting.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManySetting = async (ids: SettingIds) => {
    return prisma!.setting.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManySetting = async  (input: Omit<Prisma.SettingFindManyArgs, "select"|"include"> ) => {
    
    return prisma!.setting.findMany(
       input
    );
}