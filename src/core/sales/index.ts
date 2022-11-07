import { prisma, } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
const include = {
    user: true,
    warehouse: true,
    customer: true,
    saleDetails: true,
    paymentSales: true,
};

export type CreateSaleDetailsInput = {
    date: Date
    saleId: number
    productId: number
    productVariantId?: number
    imeiNumber?: string
    price: number
    saleUnitId?: number
    taxNet: number
    taxMethod?: string
    discount?: number
    discountMethod?: string
    total: number
    quantity: number

}

export type CreatePaymentSaleInput = {
    userId: string
    date: Date
    ref: string
    saleId: number
    amount: number
    change: number
    reglement: string
    notes?: string
}
export type CreateShipmentInput = {
    userId: string
    date: Date
    ref: string
    saleId: number
    deliveredTo?: string
    shippingAddress?: string
    status: string
    shippingDetails?: string
}

export type CreateSaleInput = {
    userId: string
    date: Date
    ref: string
    isPos?: boolean
    customerId: number
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
    saleDetails: Array<CreateSaleDetailsInput>
    paymentSales: Array<CreatePaymentSaleInput>
    shipments: Array<CreateShipmentInput>
    tenantId: string
}
export const createSale = async (input: CreateSaleInput) => {
    const { tenantId, saleDetails, paymentSales, shipments, ...data } = input;
    let saleData = {};
    if (saleDetails && saleDetails.length) {
        saleData = {
            saleDetails: {
                createMany: {
                    skipDuplicates: true,
                    data: saleDetails.map((v) => ({
                        ...v, tenantId
                    }))
                }
            }
        }
    }
    let paymentData = {};
    if (paymentSales && paymentSales.length) {
        paymentData = {
            paymentSales: {
                createMany: {
                    skipDuplicates: true,
                    data: paymentSales.map((v) => ({
                        ...v, tenantId
                    }))
                }
            }
        }
    }
    let shipmentData = {};
    if (shipments && shipments.length) {
        shipmentData = {
            shipment: {
                createMany: {
                    skipDuplicates: true,
                    data: shipments.map((v) => ({
                        ...v, tenantId
                    }))
                }
            }
        }
    }
    return prisma!.sale.create({
        include,
        data: {
            tenantId: tenantId,
            ...data,
            ...saleData,
            ...paymentData,
            ...shipments

        },
    })
}

export type UpdateSaleDetailsInput = {
    id?: number
    date?: Date
    saleId?: number
    productId?: number
    productVariantId?: number
    imeiNumber?: string
    price?: number
    saleUnitId?: number
    taxNet?: number
    taxMethod?: string
    discount?: number
    discountMethod?: string
    total?: number
    quantity?: number

}

export type UpdatePaymentSaleInput = {
    id?: number
    userId?: string
    date?: Date
    ref?: string
    // saleId       :number
    amount?: number
    change?: number
    reglement?: string
    notes?: string
}
export type UpdateShipmentInput = {
    id?: number
    userId?: string
    date?: Date
    ref?: string
    //saleId ?         :number
    deliveredTo?: string
    shippingAddress?: string
    status?: string
    shippingDetails?: string
}
export type UpdateSaleInput = {
    id: number
    userId: string
    date: Date
    ref: string
    isPos?: boolean
    customerId: number
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
    saleDetails: Array<UpdateSaleDetailsInput>
    paymentSales: Array<UpdatePaymentSaleInput>
    shipments: Array<UpdateShipmentInput>
    tenantId: string
}
export const updateSale = async (input: UpdateSaleInput) => {
    const { tenantId, id, saleDetails, shipments, paymentSales, ...data } = input;
    const sale = await prisma!.sale.findUnique({
        where: { id }, include: {
            shipments: true,
            saleDetails: true,
            paymentSales: true
        }
    });
    let details = {};
    if (saleDetails && sale && saleDetails.length) {
        const savedDetails = sale.saleDetails.map((v) => v.id);
        const detailsToDelete = sale.saleDetails.filter((v) => !saleDetails.find((s) => s.id = v.id))
            .map((v) => ({ id: v.id }));
        const detailsToCreate = saleDetails.filter((v) => !savedDetails.includes(v.id ?? -1))
            .map((v) => ({ ...v, tenantId }));
        details = {
            saleDetails: {
                createMany: {
                    data: detailsToCreate
                },
                deleteMany: detailsToDelete,

            }
        }
    }


    let paymentData = {};
    if (paymentSales && sale && paymentSales.length) {
        const savedDetails = sale.paymentSales.map((v) => v.id);
        const detailsToDelete = sale.paymentSales.filter((v) => !paymentSales.find((s) => s.id = v.id))
            .map((v) => ({ id: v.id }));
        const detailsToCreate = paymentSales.filter((v) => !savedDetails.includes(v.id ?? -1))
            .map((v) => ({ ...v, tenantId }));
        paymentData = {
            paymentSales: {
                createMany: {
                    data: detailsToCreate
                },
                deleteMany: detailsToDelete,

            }
        }
    }


    let shipmentData = {};
    if (shipments && sale && shipments.length) {
        const savedDetails = sale.shipments.map((v) => v.id);
        const detailsToDelete = sale.shipments.filter((v) => !shipments.find((s) => s.id = v.id))
            .map((v) => ({ id: v.id }));
        const detailsToCreate = shipments.filter((v) => !savedDetails.includes(v.id ?? -1))
            .map((v) => ({ ...v, tenantId }));
        shipmentData = {
            shipments: {
                createMany: {
                    data: detailsToCreate
                },
                deleteMany: detailsToDelete,

            }
        }
    }
    return prisma!.sale.update({
        include,
        where: {
            id: id
        },
        data: {
            ...data,
            ...details,
            ...paymentData,
            ...shipmentData,

        }
    })
}

type SaleId = number
type SalesId = Array<number>
export const getUniqueSale = async (id: SaleId) => {

    return prisma!.sale.findUnique({
        include,
        where: {
            id: id
        }
    })
};
export const deleteSale = async (id: SaleId) => {

    return prisma!.sale.update({
        include,
        where: {
            id: id
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManySale = async (ids: SalesId) => {
    return prisma!.sale.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManySale = async (input: Pick<Prisma.SaleWhereInput, Prisma.SaleScalarFieldEnum> & {
    orderBy?: [Pick<Prisma.SaleOrderByWithRelationInput, Prisma.SaleScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.SaleWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.SaleScalarFieldEnum)
            .filter((v) => ["ref", "userId", "notes","paymentStatus","status","shippingStatus"].includes(v))
            .map((v) => ({
                [v]: { contains: search }
            }));

        query = {
            OR: terms
        };
    };
    return prisma!.sale.findMany(
        {
            include,
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}