import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";

export type CreateWarehouseInput = {
    name: string
    city?: string
    email?: string
    mobile?: string
    country?: string
    zip?: string
    tenantId: string
}
export const createWarehouse = async (input: CreateWarehouseInput) => {
    const { tenantId, ...data } = input;
    return prisma!.warehouse.create({
        data:{tenantId:tenantId,...data}
   })
}
export type UpdateWarehouseInput = {
    id: number
    name?: string
    city?: string
    email?: string
    mobile?: string
    country?: string
    zip?: string
   
}
export const updateWarehouse = async (input: UpdateWarehouseInput) => {
    const { id, ...data } = input;
    return prisma!.warehouse.update({
        where: {
            id: id
        },        
        data: { ...data }
    })
};
export type WarehouseId = number
export type WarehouseIds = Array<number>
export const getUniqueWarehouse = async (id: WarehouseId) => {

    return prisma!.warehouse.findUnique({
        where: {
            id: id
        }        
    })
};
export const deleteWarehouse = async (id: WarehouseId) => {

    return prisma!.warehouse.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyWarehouse = async (ids: WarehouseIds) => {
    return prisma!.warehouse.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyWarehouse = async (input: Omit<Prisma.WarehouseFindManyArgs,"select"|"include">) => {

   
    return prisma!.warehouse.findMany(
        input
    );
}