import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";

export type CreateCurrencyInput = {
  name: string     
  code:  string
  symbol: string
  tenantId: string
}
export const createCurrency = async (input: CreateCurrencyInput,ctx:TenantContext) => {
    const { tenantId, ...data } = input;
    return ctx.tx!.currency.create({
        data:{tenantId:tenantId,...data}
   })
}
export type UpdateCurrencyInput = {
    id: number
    name?: string     
  code?:  string
}
export const updateCurrency = async (input: UpdateCurrencyInput,ctx:TenantContext) => {
    const { id, ...data } = input;
    return ctx.tx!.currency.update({
        where: {
            id: id,recordStatus:RecordStatus.ACTIVE 
        },        
        data: { ...data }
    })
};
export type CurrencyId = number
export type CurrencyIds = Array<number>
export const getUniqueCurrency = async (id: CurrencyId,ctx:TenantContext) => {
    return ctx.tx!.currency.findUnique({
        where: {
            id: id,recordStatus:RecordStatus.ACTIVE 
        }        
    })
};
export const deleteCurrency = async (id: CurrencyId,ctx:TenantContext) => {

    return ctx.tx!.currency.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyCurrency = async (ids: CurrencyIds,ctx:TenantContext) => {
    return ctx.tx!.currency.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCurrency = async  (input: Omit<Prisma.CurrencyFindManyArgs, "select"|"include"> ,ctx:TenantContext) => {
    const {where,...rest}=input;
    return ctx.tx!.currency.findMany(
       {
        where:{...where,recordStatus:RecordStatus.ACTIVE },
        ...rest
       }
    );
}