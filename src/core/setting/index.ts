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
type SettingId = number
type SettingsId = Array<number>
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
export const deleteManySetting = async (ids: SettingsId) => {
    return prisma!.setting.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManySetting = async (input: Pick<Prisma.SettingWhereInput, Prisma.SettingScalarFieldEnum> & {
    
    orderBy?: [Pick<Prisma.SettingOrderByWithRelationInput, Prisma.SettingScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.SettingWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.SettingScalarFieldEnum)
        .filter((v) => ["email", "companyName","CompanyPhone","CompanyAdress","logo","footer","developedBy","defaultLanguage"].includes(v)).map((v) => ({
            [v]: { contains: search }
        }));

        query = {
            OR: terms
        };
    };
    return prisma!.setting.findMany(
        {
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}