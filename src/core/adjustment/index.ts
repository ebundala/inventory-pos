import { prisma, } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
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
export const createAdjustment = async (input: CreateAdjustmentInput,ctx:TenantContext) => {
    const { tenantId, adjustmentDetails, ...data } = input;

    return ctx.tx!.adjustment.create({
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
export const updateAdjustment = async (input: UpdateAdjustmentInput,ctx:TenantContext) => {
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
    return ctx.tx!.adjustment.update({
        include,
        where: {
            id: id
        },
        data: {
            ...data, ...details
        }
    })
};
export type AdjustmentId = number
export type AdjustmentIds = Array<number>
export const getUniqueAdjustment = async (id: AdjustmentId,ctx:TenantContext) => {

    return ctx.tx!.adjustment.findUnique({
        include,
        where: {
            id: id
        }
    })
};
export const deleteAdjustment = async (id: AdjustmentId,ctx:TenantContext) => {

    return ctx.tx!.adjustment.update({
        include,
        where: {
            id: id
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyAdjustment = async (ids: AdjustmentIds,ctx:TenantContext) => {
    return ctx.tx!.adjustment.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyAdjustment = async  (input: Omit<Prisma.AdjustmentFindManyArgs, "select"|"include">,ctx:TenantContext ) => {
   
    return ctx.tx!.adjustment.findMany(
        {
            include,
            ...input
        }
    );
}