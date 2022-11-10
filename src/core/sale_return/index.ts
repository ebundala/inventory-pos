import { prisma, } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
const include = {
    saleReturnDetails: true,
    paymentSaleReturns: true,
    warehouse: true,
    user: true,
    customer: true
};

export type CreateSaleReturnDetailInput = {

    productId: number
    price: number
    saleUnitId?: number
    taxNet?: number
    taxMethod?: string
    discount?: number
    discountMethod?: string
    productVariantId?: number
    imeiNumber?: string
    quantity: number
    total: number
}

export type CreatePaymentSaleReturnInput = {

    userId: string
    date: Date
    ref: string

    amount: number
    change: number
    reglement: string
    notes?: string
}

export type CreateSaleReturnInput = {
    userId: string
    date: Date
    ref: string
    clientId: number
    warehouseId: number
    taxRate?: number
    taxNet?: number
    discount?: number
    shipping?: number
    grandTotal: number
    paidAmount: number
    paymentStatus: string
    status: string
    notes?: string
    paymentSaleReturns: Array<CreatePaymentSaleReturnInput>
    saleReturnDetails: Array<CreateSaleReturnDetailInput>
    tenantId: string
}
export const createSaleReturn = async (input: CreateSaleReturnInput) => {
    const { tenantId, paymentSaleReturns, saleReturnDetails, ...data } = input;
    let details = {};
    if (saleReturnDetails && saleReturnDetails.length) {
        details = {
            saleReturnDetails: {
                createMany: {
                    skipDuplicates: true,
                    data: saleReturnDetails.map((v) => ({
                        ...v, tenantId
                    }))
                }
            }
        }

    }

    let paymentData = {};
    if (paymentSaleReturns && paymentSaleReturns.length) {
        paymentData = {
            paymentSaleReturns: {
                createMany: {
                    skipDuplicates: true,
                    data: paymentSaleReturns.map((v) => ({
                        ...v, tenantId
                    }))
                }
            }
        }

    }
    return prisma!.saleReturn.create({
        include,
        data: { tenantId: tenantId, ...data, ...details, ...paymentData }
    })
}
export type UpdateSaleReturnDetailInput = {
    id?: number
    productId?: number
    price?: number
    saleUnitId?: number
    taxNet?: number
    taxMethod?: string
    discount?: number
    discountMethod?: string
    productVariantId?: number
    imeiNumber?: string
    quantity?: number
    total?: number
}

export type UpdatePaymentSaleReturnInput = {
    id?: number
    userId?: string
    date?: Date
    ref?: string
    saleReturnId?: number
    amount?: number
    change?: number
    reglement?: string
    notes?: string
}

export type UpdateSaleReturnInput = {
    id: number
    userId?: string
    date?: Date
    ref?: string
    clientId?: number
    warehouseId?: number
    taxRate?: number
    taxNet?: number
    discount?: number
    shipping?: number
    grandTotal?: number
    paidAmount?: number
    paymentStatus?: string
    status?: string
    notes?: string
    paymentSaleReturns: Array<UpdatePaymentSaleReturnInput>
    saleReturnDetails: Array<UpdateSaleReturnDetailInput>
    tenantId: string
}
export const updateSaleReturn = async (input: UpdateSaleReturnInput) => {
    const { tenantId, id,  paymentSaleReturns,saleReturnDetails, ...data } = input;
    const saleReturn = await prisma!.saleReturn.findUnique({
        where: { id }, include: {
            saleReturnDetails: true,
            paymentSaleReturns:true
        }
    });
    let details = {};
    if (saleReturnDetails && saleReturn && saleReturnDetails.length) {
        const savedDetails = saleReturn.saleReturnDetails.map((v) => v.id);
        const detailsToDelete = saleReturn.saleReturnDetails.filter((v) => !saleReturnDetails.find((s)=>s.id===v.id))
            .map((v) => ({ id: v.id }));
        const detailsToCreate = paymentSaleReturns.filter((v) => !savedDetails.includes(v.id??-1)).map((v) => ({ ...v, tenantId }));
        details = {
            saleReturnDetails: {
                createMany: { data: detailsToCreate },
                deleteMany: detailsToDelete,

            }
        }
    }
    let paymentData = {};
    if (paymentSaleReturns && saleReturn && paymentSaleReturns.length) {
        const savedDetails = saleReturn.paymentSaleReturns.map((v) => v.id);
        const paymentToDelete = saleReturn.paymentSaleReturns.filter((v) => !paymentSaleReturns.find((s)=>s.id===v.id))
            .map((v) => ({ id: v.id }));
        const detailsToCreate = paymentSaleReturns.filter((v) => !savedDetails.includes(v.id??-1)).map((v) => ({ ...v, tenantId }));
        paymentData = {
            paymentSaleReturns: {
                createMany: { data: detailsToCreate },
                deleteMany: paymentToDelete,

            }
        }
    }

    return prisma!.saleReturn.update({
        include,
        where: {
            id: id
        },
        data: { 
            ...data, 
            ...details,
            ...paymentData }
    })
};
export type SaleReturnId = number
export type SaleReturnIds = Array<number>
export const getUniqueSaleReturn = async (id: SaleReturnId) => {

    return prisma!.saleReturn.findUnique({
        include,
        where: {
            id: id
        }
    })
};
export const deleteSaleReturn = async (id: SaleReturnId) => {

    return prisma!.saleReturn.update({
        include,
        where: {
            id: id
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManySaleReturn = async (ids: SaleReturnIds) => {
    return prisma!.saleReturn.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManySaleReturn =  (input: Omit<Prisma.SaleReturnFindManyArgs, "select"|"include"> ) => {
    
    return prisma!.saleReturn.findMany({
        include,
        ...input
     }
    );
}