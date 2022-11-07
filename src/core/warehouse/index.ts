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
type WarehouseId = number
type WarehousesId = Array<number>
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
export const deleteManyWarehouse = async (ids: WarehousesId) => {
    return prisma!.warehouse.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyWarehouse = async (input: Pick<Prisma.WarehouseWhereInput, Prisma.WarehouseScalarFieldEnum> & {
    
    orderBy?: [Pick<Prisma.WarehouseOrderByWithRelationInput, Prisma.WarehouseScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.WarehouseWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.WarehouseScalarFieldEnum).filter((v) => ["name", "email","phone","country","city","address"].includes(v)).map((v) => ({
            [v]: { contains: search }
        }));

        query = {
            OR: terms
        };
    };
    return prisma!.warehouse.findMany(
        {
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}