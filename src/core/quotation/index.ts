import { prisma, } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";
const include = {
    user: true,
    warehouse: true,
    quotationDetails: {
        include: {
            product: {
                include: {
                    productWarehouse: true,
                    productUnit: true,
                    productsSaleUnit: true,
                    productPurchaseUnit: true
                },
            },
            productVariant: true, unit: true,
        },
    },
    customer: true
};

export type CreateQuotationDetailsInput = {
    price: number
    saleUnitId?: number
    taxNet: number
    taxMethod?: string
    discount?: number
    discountMethod?: string
    total: number
    quantity: number
    productId: number
    productVariantId?: number
    imeiNumber?: string
}
export type CreateQuotationInput = {
    userId: string
    date: Date
    ref: string
    customerId: number
    warehouseId: number
    taxRate?: number
    taxNet?: number
    discount?: number
    shipping?: number
    grandTotal: number
    status: string
    notes?: string
    quotationDetails: Array<CreateQuotationDetailsInput>
    tenantId: string
}
export const createQuotation = async (input: CreateQuotationInput, ctx: TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "quotation",
        action: "create"
    });
    const { tenantId:_, quotationDetails, ...data } = input;

    return ctx.tx!.quotation.create({
        include,
        data: {
            tenantId: tenantId, ...data,
            quotationDetails: {
                createMany: {
                    data: quotationDetails.map((v) => ({ tenantId, ...v }))
                }
            },
        },
    })
}
export type UpdateQuotationDetailsInput = {
    id?: number
    price?: number
    saleUnitId?: number
    taxNet?: number
    taxMethod?: string
    discount?: number
    discountMethod?: string
    total?: number
    quantity?: number
    productId?: number
    productVariantId?: number
    imeiNumber?: string

}
export type UpdateQuotationInput = {
    id: number
    userId?: string
    date?: Date
    ref?: string
    customerId?: number
    warehouseId?: number
    taxRate?: number
    taxNet?: number
    discount?: number
    shipping?: number
    grandTotal?: number
    status?: string
    notes?: string
    quotationDetails?: Array<UpdateQuotationDetailsInput>
    tenantId: string
}
export const updateQuotation = async (input: UpdateQuotationInput, ctx: TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "quotation",
        action: "update"
    });
    const { tenantId: _, id, quotationDetails, ...data } = input;
    const quotation = await ctx.tx!.quotation.findUnique({
        where: { id, recordStatus: RecordStatus.ACTIVE }, include: {
            quotationDetails: true,
        }
    });
    let details = {};
    if (quotationDetails && quotation && quotationDetails.length) {
        const savedDetails = quotation.quotationDetails.map((v) => v.id);
        const detailsToDelete = quotation.quotationDetails.filter((v) => !quotationDetails.find((s) => s.id = v.id))
            .map((v) => ({ id: v.id }));
        const detailsToCreate = quotationDetails
            .filter((v) => !savedDetails.find((s) => v.id === s))
            .map((v) => {
                const { id, ...rest } = v;
                return { ...rest, tenantId };
            });
        const detailsToUpdate = quotationDetails
            .filter((v) => savedDetails.find((s) => v.id === s))
            .map((v) => {
                const { id, productVariantId, ...rest } = v;
                return { where: { id: id }, data: rest };
            })
        details = {
            quotationDetails: {
                updateMany: detailsToUpdate,
                deleteMany: detailsToDelete,
                createMany: {
                    skipDuplicates: true,
                    data: detailsToCreate
                }
            }
        }
    }
    return ctx.tx!.quotation.update({
        include,
        where: {
            id: id, recordStatus: RecordStatus.ACTIVE
        },
        data: {
            ...data, ...details
        }
    })
};
export type QuotationId = number
export type QuotationIds = Array<number>
export const getUniqueQuotation = async (id: QuotationId, ctx: TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "quotation",
        action: "view"
    });
    return ctx.tx!.quotation.findUnique({
        include,
        where: {
            id: id, recordStatus: RecordStatus.ACTIVE
        }
    })
};
export const deleteQuotation = async (id: QuotationId, ctx: TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "quotation",
        action: "delete"
    });
    return ctx.tx!.quotation.update({
        include,
        where: {
            id: id
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyQuotation = async (ids: QuotationIds, ctx: TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "quotation",
        action: "delete"
    });
    return ctx.tx!.quotation.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyQuotation = async (input: Omit<Prisma.QuotationFindManyArgs, "select" | "include">, ctx: TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "quotation",
        action: "view"
    });
    const { where, ...rest } = input;
    return ctx.tx!.quotation.findMany(
        {
            include,
            where: { ...where, recordStatus: RecordStatus.ACTIVE },
            ...rest
        }
    );
}