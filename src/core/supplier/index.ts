import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";

export type CreateSupplierInput = {
    name: string
    code: number
    email: string
    phone?: string
    country?: string
    city?: string
    address?: string
    tenantId: string
}
export const createSupplier = async (input: CreateSupplierInput) => {
    const { tenantId, ...data } = input;
    return prisma!.supplier.create({
        data:{tenantId:tenantId,...data}
   })
}
export type UpdateSupplierInput = {
    id: number
    name?: string
    code?: number
    email?: string
    phone?: string
    country?: string
    city?: string
    address?: string
}
export const updateSupplier = async (input: UpdateSupplierInput) => {
    const { id, ...data } = input;
    return prisma!.supplier.update({
        where: {
            id: id
        },        
        data: { ...data }
    })
};
type SupplierId = number
type SuppliersId = Array<number>
export const getUniqueSupplier = async (id: SupplierId) => {

    return prisma!.supplier.findUnique({
        where: {
            id: id
        }        
    })
};
export const deleteSupplier = async (id: SupplierId) => {

    return prisma!.supplier.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManySupplier = async (ids: SuppliersId) => {
    return prisma!.supplier.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManySupplier = async (input: Pick<Prisma.SupplierWhereInput, Prisma.SupplierScalarFieldEnum> & {
    
    orderBy?: [Pick<Prisma.SupplierOrderByWithRelationInput, Prisma.SupplierScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.SupplierWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.SupplierScalarFieldEnum).filter((v) => ["name", "email","phone","country","city","address"].includes(v)).map((v) => ({
            [v]: { contains: search }
        }));

        query = {
            OR: terms
        };
    };
    return prisma!.supplier.findMany(
        {
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}