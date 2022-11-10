import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";

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
export const createPosSetting = async (input: CreatePosSettingInput) => {
    const { tenantId, ...data } = input;
    return prisma!.posSetting.create({
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
export const updatePosSetting = async (input: UpdatePosSettingInput) => {
    const { id, ...data } = input;
    return prisma!.posSetting.update({
        where: {
            id: id
        },        
        data: { ...data }
    })
};
export type PosSettingId = number
export type PosSettingIds = Array<number>
export const getUniquePosSetting = async (id: PosSettingId) => {
    return prisma!.posSetting.findUnique({
        where: {
            id: id
        }        
    })
};
export const deletePosSetting = async (id: PosSettingId) => {

    return prisma!.posSetting.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyPosSetting = async (ids: PosSettingIds) => {
    return prisma!.posSetting.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyPosSetting = async  (input: Omit<Prisma.PosSettingFindManyArgs, "select"|"include"> ) => {
    
    return prisma!.posSetting.findMany(
        input
    );
}