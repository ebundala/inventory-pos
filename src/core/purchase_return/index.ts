import { prisma, } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
const include = {
    supplier: true,
    user: true,
    warehouse: true,
    paymentPurchaseReturns: true,
    purchaseReturnDetails: true
};

export type CreatePurchaseReturnDetailInput = {
    cost             :number         
    purchaseUnitId   :number
    taxNet           :number           
    taxMethod        :string        
    discount         ?:number         
    discountMethod   :string         
    total            :number
    quantity         :number
    productId        :number
    productVariantId ?:number
    imeiNumber       :string
}

export type CreatePaymentPurchaseReturnInput = {

  userId           :string
  date             :Date      
  ref              :string        
  amount           :number
  change           :number         
  reglement        :string
  notes            ?:string      
}

export type CreatePurchaseReturnInput = {
    userId                 :string
    date                   :Date              
    ref                    :string                  
    supplierId             :number
    warehouseId            :number
    taxRate                ?:number                 
    taxNet                 ?:number                 
    discount               ?:number                 
    shipping               ?:number                 
    grandTotal             :number
    paidAmount             :number                  
    paymentStatus          :string                  
    status                 :string                 
    notes                  ?:string 
    paymentPurchaseReturns: Array<CreatePaymentPurchaseReturnInput>
    purchaseReturnDetails: Array<CreatePurchaseReturnDetailInput>
    tenantId: string
}
export const createPurchaseReturn = async (input: CreatePurchaseReturnInput) => {
    const { tenantId, paymentPurchaseReturns, purchaseReturnDetails, ...data } = input;
    let details = {};
    if (purchaseReturnDetails && purchaseReturnDetails.length) {
        details = {
            PurchaseReturnDetails: {
                createMany: {
                    skipDuplicates: true,
                    data: purchaseReturnDetails.map((v) => ({
                        ...v, tenantId
                    }))
                }
            }
        }

    }

    let paymentData = {};
    if (paymentPurchaseReturns && paymentPurchaseReturns.length) {
        paymentData = {
            paymentPurchaseReturns: {
                createMany: {
                    skipDuplicates: true,
                    data: paymentPurchaseReturns.map((v) => ({
                        ...v, tenantId
                    }))
                }
            }
        }

    }
    return prisma!.purchaseReturn.create({
        include,
        data: { tenantId: tenantId, ...data, ...details, ...paymentData }
    })
}

export type UpdatePurchaseReturnDetailInput = {
    id?: number
    cost             ?:number         
    purchaseUnitId   ?:number
    taxNet           ?:number           
    taxMethod        ?:string        
    discount         ?:number         
    discountMethod   ?:string         
    total            ?:number
    quantity         ?:number
    productId        ?:number
    productVariantId ?:number
    imeiNumber       ?:string
}

export type UpdatePaymentPurchaseReturnInput = {
    id?: number 
    userId           ?:string
    date             ?:Date      
    ref              ?:string        
    amount           ?:number
    change           ?:number         
    reglement        ?:string
    notes            ?:string 
}

export type UpdatePurchaseReturnInput = {
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
    paymentPurchaseReturns: Array<UpdatePaymentPurchaseReturnInput>
    purchaseReturnDetails: Array<UpdatePurchaseReturnDetailInput>
    tenantId: string
}
export const updatePurchaseReturn = async (input: UpdatePurchaseReturnInput) => {
    const { tenantId, id,  paymentPurchaseReturns,purchaseReturnDetails: PurchaseReturnDetails, ...data } = input;
    const PurchaseReturn = await prisma!.purchaseReturn.findUnique({
        where: { id }, include: {
            purchaseReturnDetails: true,
            paymentPurchaseReturns:true
        }
    });
    let details = {};
    if (PurchaseReturnDetails && PurchaseReturn && PurchaseReturnDetails.length) {
        const savedDetails = PurchaseReturn.purchaseReturnDetails.map((v) => v.id);
        const detailsToDelete = PurchaseReturn.purchaseReturnDetails.filter((v) => !PurchaseReturnDetails.find((s)=>s.id===v.id))
            .map((v) => ({ id: v.id }));
        const detailsToCreate = paymentPurchaseReturns.filter((v) => !savedDetails.includes(v.id??-1)).map((v) => ({ ...v, tenantId }));
        details = {
            purchaseReturnDetails: {
                createMany: { data: detailsToCreate },
                deleteMany: detailsToDelete,

            }
        }
    }
    let paymentData = {};
    if (paymentPurchaseReturns && PurchaseReturn && paymentPurchaseReturns.length) {
        const savedDetails = PurchaseReturn.paymentPurchaseReturns.map((v) => v.id);
        const paymentToDelete = PurchaseReturn.paymentPurchaseReturns.filter((v) => !paymentPurchaseReturns.find((s)=>s.id===v.id))
            .map((v) => ({ id: v.id }));
        const detailsToCreate = paymentPurchaseReturns.filter((v) => !savedDetails.includes(v.id??-1)).map((v) => ({ ...v, tenantId }));
        paymentData = {
            paymentPurchaseReturns: {
                createMany: { data: detailsToCreate },
                deleteMany: paymentToDelete,

            }
        }
    }

    return prisma!.purchaseReturn.update({
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
type PurchaseReturnId = number
type PurchaseReturnsId = Array<number>
export const getUniquePurchaseReturn = async (id: PurchaseReturnId) => {

    return prisma!.purchaseReturn.findUnique({
        include,
        where: {
            id: id
        }
    })
};
export const deletePurchaseReturn = async (id: PurchaseReturnId) => {

    return prisma!.purchaseReturn.update({
        include,
        where: {
            id: id
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyPurchaseReturn = async (ids: PurchaseReturnsId) => {
    return prisma!.purchaseReturn.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyPurchaseReturn = async (input: Pick<Prisma.PurchaseReturnWhereInput, Prisma.PurchaseReturnScalarFieldEnum> & {
    orderBy?: [Pick<Prisma.PurchaseReturnOrderByWithRelationInput, Prisma.PurchaseReturnScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.PurchaseReturnWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.PurchaseReturnScalarFieldEnum)
            .filter((v) => ["ref", "userId", "status","paymentStatus", "notes"].includes(v))
            .map((v) => ({
                [v]: { contains: search }
            }));

        query = {
            OR: terms
        };
    };
    return prisma!.purchaseReturn.findMany(
        {
            include,
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}