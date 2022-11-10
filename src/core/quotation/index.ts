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
            quotationDetails: {
                createMany: {
                    data: quotationDetails.map((v)=>({tenantId,...v}))
                }
            },
        },
    })
}
export type UpdateQuotationDetailsInput = {
    id?: number
    price            ?:number 
  saleUnitId       ?:number 
  taxNet          ?:number 
  taxMethod        ?:string  
  discount         ?:number
  discountMethod   ?:string
  total            ?:number
  quantity         ?:number
  productId        ?:number
  productVariantId ?:number
  imeiNumber       ?:string 

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
    const quotation = await prisma!.quotation.findUnique({
        where: { id }, include: {
            quotationDetails: true,
        }
    });
    let details = {};
    if (quotationDetails &&quotation&& quotationDetails.length) {
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
            const { id, ...rest } = v;
            return { where: { id: id }, data: rest };
        })
        details = {
            quotationDetails: {
                updateMany: detailsToUpdate,
                deleteMany:detailsToDelete,
                createMany:{
                skipDuplicates:true,
                data:detailsToCreate
               }
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
export type QuotationId = number
export type QuotationIds = Array<number>
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
export const deleteManyQuotation = async (ids: QuotationIds) => {
    return prisma!.quotation.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyQuotation = async  (input: Omit<Prisma.QuotationFindManyArgs, "select"|"include"> ) => {
    
    return prisma!.quotation.findMany(
        {
            include,
           ...input
        }
    );
}