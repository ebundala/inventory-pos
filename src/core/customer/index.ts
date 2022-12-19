import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";

export type CreateCustomerInput = {
    name         :string
    code         :number
    email        :string      
    country      :string
    city         ?:string
    phone        ?:string
    address      ?:string
  tenantId: string
}
export const createCustomer = async (input: CreateCustomerInput,ctx:TenantContext) => {
    const { tenantId, ...data } = input;
    return ctx.tx!.customer.create({
        data:{tenantId:tenantId,...data}
   })
}
export type UpdateCustomerInput = {
  id: number
  name         ?:string
  code         ?:number
  email        ?:string      
  country      ?:string
  city         ?:string
  phone        ?:string
  address      ?:string
}
export const updateCustomer = async (input: UpdateCustomerInput,ctx:TenantContext) => {
    const { id, ...data } = input;
    return ctx.tx!.customer.update({
        where: {
            id: id
        },        
        data: { ...data }
    })
};
export type CustomerId = number
export type CustomerIds = Array<number>
export const getUniqueCustomer = async (id: CustomerId,ctx:TenantContext) => {
    return ctx.tx!.customer.findUnique({
        where: {
            id: id
        }        
    })
};
export const deleteCustomer = async (id: CustomerId,ctx:TenantContext) => {

    return ctx.tx!.customer.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyCustomer = async (ids: CustomerIds,ctx:TenantContext) => {
    return ctx.tx!.customer.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCustomer = async  (input: Omit<Prisma.CustomerFindManyArgs, "select"|"include"> ) => {
    
    return prisma!.customer.findMany(
        input
    );
}