import { prisma, } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";

const include = {
    supplier: true,
    user: true,
    warehouse: true,
    purchaseDetails: true,
    paymentPurchases: true
};
export type CreatePurchaseDetailsInput = {
    cost: number
    purchaseUnitId?: number
    taxNet?: number
    taxMethod?: string
    discount?: number
    discountMethod?: string
    productId: number
    productVariantId?: number
    imeiNumber?: string
    total: number
    quantity: number
}

export type CreatePaymentPurchaseInput = {
    date: Date
    ref: string
    amount: number
    change: number
    reglement: string
    notes?: string
}

export type CreatePurchaseInput = {
    userId: string
    ref: string
    date: Date
    supplierId: number
    warehouseId: number
    taxRate?: number
    taxNet?: number
    discount?: number
    shipping?: number
    grandTotal: number
    paidAmount: number
    status: string
    paymentStatus: string
    notes?: string
    paymentPurchases: Array<CreatePaymentPurchaseInput>
    purchaseDetails: Array<CreatePurchaseDetailsInput>
    tenantId: string
}
export const createPurchase = async (input: CreatePurchaseInput) => {
    const { tenantId, userId, paymentPurchases, purchaseDetails, ...data } = input;
    let purchaseData = {};
    if (purchaseDetails && purchaseDetails.length) {
        purchaseData = {
            purchaseDetails: {
                createMany: {
                    skipDuplicates: true,
                    data: purchaseDetails.map((v) => ({
                        ...v, tenantId
                    }))
                }
            }
        }
    }
    let paymentData = {};
    if (paymentPurchases && paymentPurchases.length) {
        paymentData = {
            paymentPurchases: {
                createMany: {
                    skipDuplicates: true,
                    data: paymentPurchases.map((v) => ({
                        ...v, userId, tenantId
                    }))
                }
            }
        }
    }


    return prisma!.purchase.create({
        include,
        data: {
            tenantId: tenantId,
            userId: userId,
            ...data,
            ...purchaseData,
            ...paymentData
        }
    })
}
export type UpdatePurchaseDetailsInput = {
    id?: number
    cost?: number
    purchaseUnitId?: number
    taxNet?: number
    taxMethod?: string
    discount?: number
    discountMethod?: string
    productId?: number
    productVariantId?: number
    imeiNumber?: string
    total?: number
    quantity?: number
}

export type UpdatePaymentPurchaseInput = {
    id?: number
    userId?: string
    date?: Date
    ref?: string
    amount?: number
    change?: number
    reglement?: string
    notes?: string
}

export type UpdatePurchaseInput = {
    id: number
    userId?: string
    ref?: string
    date?: Date
    supplierId?: number
    warehouseId?: number
    taxRate?: number
    taxNet?: number
    discount?: number
    shipping?: number
    grandTotal?: number
    paidAmount?: number
    status?: string
    paymentStatus?: string
    notes?: string
    paymentPurchases?: Array<UpdatePaymentPurchaseInput>
    purchaseDetails?: Array<UpdatePurchaseDetailsInput>
    tenantId: string
}
export const updatePurchase = async (input: UpdatePurchaseInput) => {
    const { tenantId, id, paymentPurchases, purchaseDetails, ...data } = input;
    const purchase = await prisma!.purchase.findUnique({
        where: { id }, include: {
            purchaseDetails: true,
            paymentPurchases: true,
        }
    });
    let details = {};
    if (purchaseDetails && purchase && purchaseDetails.length) {
        const savedDetails = purchase.purchaseDetails.map((v) => v.id);
        const detailsToDelete = purchase.purchaseDetails.filter((v) => !purchaseDetails.find((s) => s.id = v.id))
            .map((v) => ({ id: v.id }));

        const detailsToCreate = purchaseDetails
            .filter((v) => !savedDetails.find((s) => v.id === s))
            .map((v) => {
                const { id, ...rest } = v;
               return { ...rest, tenantId };
            });
        const detailsToUpdate = purchaseDetails
            .filter((v) => savedDetails.find((s) => v.id === s))
            .map((v) => {
                //TODO find why variant cant update
                const { id, productVariantId,...rest } = v;
                return { where: { id: id }, data: rest };
            })
        details = {
            purchaseDetails: {
                createMany: { data: detailsToCreate },
                deleteMany: detailsToDelete,
                updateMany: detailsToUpdate

            }
        }
    }
    let paymentDetails = {};
    if (paymentPurchases && purchase && paymentPurchases.length) {
        const savedDetails = purchase.paymentPurchases.map((v) => v.id);
        const detailsToDelete = purchase.paymentPurchases
            .filter((v) => !paymentPurchases.find((s) => s.id = v.id))
            .map((v) => ({ id: v.id }));

        const detailsToCreate = paymentPurchases
            .filter((v) => !savedDetails.find((s) => v.id === s))
            .map((v) => {
                const { id, ...rest } = v;
               return { ...rest, tenantId };
            });

        const detailsToUpdate = paymentPurchases
            .filter((v) => savedDetails.find((s) => v.id === s))
            .map((v) => {
                const { id, ...rest } = v;
                return { where: { id: id }, data: rest };
            })
        paymentDetails = {
            paymentPurchases: {
                createMany: { data: detailsToCreate },
                deleteMany: detailsToDelete,
                updateMany: detailsToUpdate
            }
        }
    }
    return prisma!.purchase.update({
        include,
        where: {
            id: id
        },
        data: { ...data, ...details, ...paymentDetails,
            
         }
    })
};
export type PurchaseId = number
export type PurchaseIds = Array<number>
export const getUniquePurchase = async (id: PurchaseId) => {

    return prisma!.purchase.findUnique({
        include,
        where: {
            id: id
        }
    })
};
export const deletePurchase = async (id: PurchaseId) => {

    return prisma!.purchase.update({
        include,
        where: {
            id: id
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyPurchase = async (ids: PurchaseIds) => {
    return prisma!.purchase.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyPurchase = async  (input: Omit<Prisma.PurchaseFindManyArgs, "select"|"include"> ) => {
   
    return prisma!.purchase.findMany(
        {
            include,
            ...input


        }
    );
}