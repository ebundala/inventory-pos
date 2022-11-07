import { prisma, } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
const include = {
    user: true,
    warehouse: true,
    quotationDetails: true,
    customer: true
};

export type CreateQuotationDetailsInput = {
  price            :number 
  saleUnitId       ?:number 
  taxNet          :number 
  taxMethod        ?:string  
  discount         ?:number
  discountMethod   ?:string
  total            :number
  quantity         :number
  productId        :number
  productVariantId ?:number
  imeiNumber       ?:string  
  tenantId: string
}
export type CreateQuotationInput = {
    userId: string
    date: Date
    ref: string
    customerId: number
    warehouseId: number
    taxRate?: number
    taxNet?:number
    discount?:number
    shipping?:number
    grandTotal:number
    status: string
    notes?: string
    quotationDetails: Array<CreateQuotationDetailsInput>
    tenantId: string
}
export const createQuotation = async (input: CreateQuotationInput) => {
    const { tenantId, quotationDetails, ...data } = input;

    return prisma!.quotation.create({
        include,
        data: {
            tenantId: tenantId, ...data,
            quotationDetail: {
                createMany: {
                    data: quotationDetails
                }
            },
        },
    })
}
export type UpdateQuotationDetailsInput = {
    id: number
    productId?: number
    productVariantId?: number
    quantity?: number
    type?: string

}
export type UpdateQuotationInput = {
    id: number
    userId?: string
    date?: Date
    ref?: string
    customerId?: number
    warehouseId?: number
    taxRate?: number
    taxNet?:number
    discount?:number
    shipping?:number
    grandTotal?:number
    status?: string
    notes?: string
    quotationDetails?: Array<UpdateQuotationDetailsInput>
    tenantId: string
}
export const updateQuotation = async (input: UpdateQuotationInput) => {
    const { tenantId, id, quotationDetails, ...data } = input;
    let details = {};
    if (quotationDetails && quotationDetails.length) {
        details = {
            QuotationDetails: {
                updateMany: quotationDetails.map((v) => ({ where: { id: v.id }, data: v }))
            }
        }
    }
    return prisma!.quotation.update({
        include,
        where: {
            id: id
        },
        data: {
            ...data, ...details
        }
    })
};
type QuotationId = number
type QuotationsId = Array<number>
export const getUniqueQuotation = async (id: QuotationId) => {

    return prisma!.quotation.findUnique({
        include,
        where: {
            id: id
        }
    })
};
export const deleteQuotation = async (id: QuotationId) => {

    return prisma!.quotation.update({
        include,
        where: {
            id: id
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyQuotation = async (ids: QuotationsId) => {
    return prisma!.quotation.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyQuotation = async (input: Pick<Prisma.QuotationWhereInput, Prisma.QuotationScalarFieldEnum> & {
    orderBy?: [Pick<Prisma.QuotationOrderByWithRelationInput, Prisma.QuotationScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.QuotationWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.QuotationScalarFieldEnum)
            .filter((v) => ["ref","userId","notes"].includes(v))
            .map((v) => ({
                [v]: { contains: search }
            }));

        query = {
            OR: terms
        };
    };
    return prisma!.quotation.findMany(
        {
            include,
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}