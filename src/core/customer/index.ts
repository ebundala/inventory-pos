import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";

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
export const createCustomer = async (input: CreateCustomerInput) => {
    const { tenantId, ...data } = input;
    return prisma!.customer.create({
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
export const updateCustomer = async (input: UpdateCustomerInput) => {
    const { id, ...data } = input;
    return prisma!.customer.update({
        where: {
            id: id
        },        
        data: { ...data }
    })
};
export type CustomerId = number
export type CustomerIds = Array<number>
export const getUniqueCustomer = async (id: CustomerId) => {
    return prisma!.customer.findUnique({
        where: {
            id: id
        }        
    })
};
export const deleteCustomer = async (id: CustomerId) => {

    return prisma!.customer.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyCustomer = async (ids: CustomerIds) => {
    return prisma!.customer.updateMany({
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