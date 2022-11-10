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
export type CurrencyId = number
export type CurrencyIds = Array<number>
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
export const deleteManyCurrency = async (ids: CurrencyIds) => {
    return prisma!.currency.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCurrency = async  (input: Omit<Prisma.CurrencyFindManyArgs, "select"|"include"> ) => {
    
    return prisma!.currency.findMany(
       input
    );
}