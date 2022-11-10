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
export type SupplierId = number
export type SupplierIds = Array<number>
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
export const deleteManySupplier = async (ids: SupplierIds) => {
    return prisma!.supplier.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManySupplier = async (input: Omit<Prisma.SupplierFindManyArgs, "select"|"include"> ) => {
   
    return prisma!.supplier.findMany(
        input
    );
}