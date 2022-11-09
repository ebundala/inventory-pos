import { prisma, } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
const include = {
    user: true,
    warehouse: true,
    adjustmentDetails: true
};

export type CreateAdjustmentDetailsInput = {
    productId: number
    productVariantId?: number
    quantity: number
    type: string
}
export type CreateAdjustmentInput = {
    userId: string
    date: Date
    ref: string
    warehouseId: number
    items?: number
    notes?: string
    adjustmentDetails: Array<CreateAdjustmentDetailsInput>
    tenantId: string
}
export const createAdjustment = async (input: CreateAdjustmentInput) => {
    const { tenantId, adjustmentDetails, ...data } = input;

    return prisma!.adjustment.create({
        include,
        data: {
            tenantId: tenantId, ...data,
            adjustmentDetails: {
                createMany: {
                    data: adjustmentDetails.map((v)=>({tenantId,...v}))
                }
            },
        },
    })
}
export type UpdateAdjustmentDetailsInput = {
    id: number
    productId?: number
    productVariantId?: number
    quantity?: number
    type?: string

}
export type UpdateAdjustmentInput = {
    id: number
    userId?: string
    date?: Date
    ref?: string
    warehouseId?: number
    items?: number
    notes?: string
    adjustmentDetails?: Array<UpdateAdjustmentDetailsInput>
   // tenantId: string
}
export const updateAdjustment = async (input: UpdateAdjustmentInput) => {
    const {id, adjustmentDetails, ...data } = input;
    let details = {};
    if (adjustmentDetails && adjustmentDetails.length) {
        details = {
            adjustmentDetails: {
                updateMany: adjustmentDetails.map((v) => {
                    const {id,...rest}=v;
                    return { where: { id: id }, data: rest };
                })
            }
        }
    }
    return prisma!.adjustment.update({
        include,
        where: {
            id: id
        },
        data: {
            ...data, ...details
        }
    })
};
type AdjustmentId = number
type AdjustmentsId = Array<number>
export const getUniqueAdjustment = async (id: AdjustmentId) => {

    return prisma!.adjustment.findUnique({
        include,
        where: {
            id: id
        }
    })
};
export const deleteAdjustment = async (id: AdjustmentId) => {

    return prisma!.adjustment.update({
        include,
        where: {
            id: id
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyAdjustment = async (ids: AdjustmentsId) => {
    return prisma!.adjustment.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyAdjustment = async (input: Pick<Prisma.AdjustmentWhereInput, Prisma.AdjustmentScalarFieldEnum> & {
    orderBy?: [Pick<Prisma.AdjustmentOrderByWithRelationInput, Prisma.AdjustmentScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.AdjustmentWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.AdjustmentScalarFieldEnum)
            .filter((v) => ["notes","ref"].includes(v))
            .map((v) => ({
                [v]: { contains: search }
            }));

        query = {
            OR: terms
        };
    };
    return prisma!.adjustment.findMany(
        {
            include,
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}