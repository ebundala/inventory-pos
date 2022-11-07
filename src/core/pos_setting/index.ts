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
type PosSettingId = number
type PosSettingsId = Array<number>
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
export const deleteManyPosSetting = async (ids: PosSettingsId) => {
    return prisma!.posSetting.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyPosSetting = async (input: Pick<Prisma.PosSettingWhereInput, Prisma.PosSettingScalarFieldEnum> & {
    
    orderBy?: [Pick<Prisma.PosSettingOrderByWithRelationInput, Prisma.PosSettingScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.PosSettingWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.PosSettingScalarFieldEnum)
        .filter((v) => ["noteCustomer"].includes(v)).map((v) => ({
            [v]: { contains: search }
        }));

        query = {
            OR: terms
        };
    };
    return prisma!.posSetting.findMany(
        {
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}