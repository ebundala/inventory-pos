import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { getOneProductWarehouse, getProductWarehouse } from "../util/getProductWarehouse";
const include = {
    saleReturnDetails: {
        include:{
            product:{
                include: {
                  productWarehouse: true,
                },
              },
            productVariant:true
        }
    },
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

   // userId: string
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
export const createSaleReturn = async (input: CreateSaleReturnInput,ctx:TenantContext) => {
    const {tenantId, paymentSaleReturns,userId, saleReturnDetails, ...data } = input;
   // const {tenantId,session} = ctx;
    
    let details = {};
    if (saleReturnDetails && saleReturnDetails.length) {
        const productWarehouse = await getProductWarehouse(ctx,saleReturnDetails,data.warehouseId);


        if(data.status === "Received"){
            const updatePw = saleReturnDetails.map((v)=>{
                const pw = getOneProductWarehouse(productWarehouse,{
                  productId:v.productId,
                  productVariantId:v.productVariantId,
                  warehouseId:data.warehouseId!});
                 
                if(!pw) return null;
                
                return ctx.tx!.productWarehouse.update({
                  where:{id:pw!.id},data:{
                    qty:pw!.qty + v.quantity
                  }
                });
              }).filter((v)=>v)
              await Promise.allSettled(updatePw);
           
          }

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
                        ...v, tenantId,userId
                    }))
                }
            }
        }

    }
    return ctx.tx!.saleReturn.create({
        include,
        data: { tenantId: tenantId,userId, ...data, ...details, ...paymentData }
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
export const updateSaleReturn = async (input: UpdateSaleReturnInput,ctx:TenantContext) => {
    const { tenantId, id,  paymentSaleReturns,saleReturnDetails, ...data } = input;
    const saleReturn = await ctx.tx!.saleReturn.findUnique({
        where: { id }, include: {
            saleReturnDetails: true,
            paymentSaleReturns:true
        }
    });
    let details = {};
    if (saleReturnDetails && saleReturn && saleReturnDetails.length) {
      
        const productWarehouse = await getProductWarehouse(
            ctx,
            saleReturnDetails,
            data.warehouseId!
          );
         //revert old details
         const updateProductWarehouse = saleReturn.saleReturnDetails.map((v)=>{
          const productId = v.productId;
          const productVariantId = v.productVariantId;
          const warehouseId = saleReturn.warehouseId;
          const pw = getOneProductWarehouse(productWarehouse,{warehouseId:warehouseId,productId,productVariantId});
              if (!pw || saleReturn.status !== "Received") return null;
              
                return ctx.tx!.productWarehouse.update({
                  where:{id:pw!.id},data:{
                    qty:pw.qty - v.quantity
                  }
                })
              
         }).filter(v=>v!==null);
      await Promise.allSettled(updateProductWarehouse);
      
      
      
      
      
       // const savedDetails = saleReturn.saleReturnDetails.map((v) => v.id);
        const detailsToDelete = saleReturn.saleReturnDetails //.filter((v) => !saleReturnDetails.find((s)=>s.id===v.id))
            .map((v) => ({ id: v.id }));
        const detailsToCreate = saleReturnDetails //.filter((v) => !savedDetails.includes(v.id??-1))
        .map((v) => {
            const { id,...rest } = v;
            return { ...rest, tenantId };
        });

        details = {
            saleReturnDetails: {
                createMany: { data: detailsToCreate },
                deleteMany: detailsToDelete,

            }
        }

        const productWarehouse2 = await getProductWarehouse(
            ctx,
            saleReturnDetails,
            data.warehouseId!
          );
      
          //update prod warehouse with new details
          const updateProductWarehouse2 = detailsToCreate
          .map((v) => {
            const productId = v.productId!;
            const productVariantId = v.productVariantId;
            const warehouseId = saleReturn.warehouseId!;
            const pw = getOneProductWarehouse(productWarehouse2,{warehouseId,productId,productVariantId});
            if (!pw || data.status !== "Received") return null;
      
            return ctx.tx!.productWarehouse.update({
              where:{id:pw!.id},data:{
                qty:pw!.qty + v!.quantity!
              }
            })
          });
          await Promise.allSettled(updateProductWarehouse2);

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

    return ctx.tx!.saleReturn.update({
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
export const getUniqueSaleReturn = async (id: SaleReturnId,ctx:TenantContext) => {

    return ctx.tx!.saleReturn.findUnique({
        include,
        where: {
            id: id
        }
    })
};
export const deleteSaleReturn = async (id: SaleReturnId,ctx:TenantContext) => {

    return ctx.tx!.saleReturn.update({
        include,
        where: {
            id: id
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManySaleReturn = async (ids: SaleReturnIds,ctx:TenantContext) => {
    return ctx.tx!.saleReturn.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManySaleReturn =  (input: Omit<Prisma.SaleReturnFindManyArgs, "select"|"include">,ctx:TenantContext ) => {
    
    return ctx.tx!.saleReturn.findMany({
        include,
        ...input
     }
    );
}