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
type CustomerId = number
type CustomersId = Array<number>
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
export const deleteManyCustomer = async (ids: CustomersId) => {
    return prisma!.customer.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCustomer = async (input: Pick<Prisma.CustomerWhereInput, Prisma.CustomerScalarFieldEnum> & {
    
    orderBy?: [Pick<Prisma.CustomerOrderByWithRelationInput, Prisma.CustomerScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.CustomerWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.CustomerScalarFieldEnum)
        .filter((v) => ["name", "email","country","city","phone","address"].includes(v)).map((v) => ({
            [v]: { contains: search }
        }));

        query = {
            OR: terms
        };
    };
    return prisma!.customer.findMany(
        {
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}