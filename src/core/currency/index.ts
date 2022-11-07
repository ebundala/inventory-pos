import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";

export type CreateCurrencyInput = {
  name: string     
  code:  string
  symbol: string
  tenantId: string
}
export const createCurrency = async (input: CreateCurrencyInput) => {
    const { tenantId, ...data } = input;
    return prisma!.currency.create({
        data:{tenantId:tenantId,...data}
   })
}
export type UpdateCurrencyInput = {
    id: number
    name?: string     
  code?:  string
}
export const updateCurrency = async (input: UpdateCurrencyInput) => {
    const { id, ...data } = input;
    return prisma!.currency.update({
        where: {
            id: id
        },        
        data: { ...data }
    })
};
type CurrencyId = number
type CurrencysId = Array<number>
export const getUniqueCurrency = async (id: CurrencyId) => {
    return prisma!.currency.findUnique({
        where: {
            id: id
        }        
    })
};
export const deleteCurrency = async (id: CurrencyId) => {

    return prisma!.currency.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyCurrency = async (ids: CurrencysId) => {
    return prisma!.currency.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCurrency = async (input: Pick<Prisma.CurrencyWhereInput, Prisma.CurrencyScalarFieldEnum> & {
    
    orderBy?: [Pick<Prisma.CurrencyOrderByWithRelationInput, Prisma.CurrencyScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.CurrencyWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.CurrencyScalarFieldEnum).filter((v) => ["name", "code"].includes(v)).map((v) => ({
            [v]: { contains: search }
        }));

        query = {
            OR: terms
        };
    };
    return prisma!.currency.findMany(
        {
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}