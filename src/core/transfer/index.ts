import { prisma, } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
const include={
    fromWarehouse:true,
    toWarehouse:true,
    user:true,
    transferDetails:true,    
};
export type CreateTransferDetailInput = {
  productId        :number
  productVariantId ?:number
  cost             :number
  purchaseUnitId   ?:number
  taxNet           ?:number
  taxMethod        ?:string        
  discount         ?:number
  discountMethod   ?:string        
  quantity         :number
  total            :number
}

export type CreateTransferInput = {
  userId          :string
  ref             :string          
  date            :Date        
  fromWarehouseId :number
  toWarehouseId   :number
  items           :number
  taxRate         ?:number          
  taxNet          ?:number          
  discount        ?:number          
  shipping        ?:number          
  grandTotal       :number          
  status          :string          
  notes           ?:string         
  transferDetails?: Array<CreateTransferDetailInput>
  tenantId: string
}
export const createTransfer = async (input: CreateTransferInput,ctx:TenantContext) => {
    const { tenantId, transferDetails, ...data } = input;
    let details={};
    if(transferDetails&&transferDetails.length){
        details={
            transferDetails:{
            createMany:{
            skipDuplicates:true,
            data:transferDetails.map((v)=>({
                ...v,tenantId
            }))
        }   
    }}
        
    }
    return ctx.tx!.transfer.create({
       include,
        data: { tenantId: tenantId, ...data, ...details}})
}
export type UpdateTransferDetailInput = {
    id?:number 
    productId        ?:number
    productVariantId ?:number
    cost             ?:number
    purchaseUnitId   ?:number
    taxNet           ?:number
    taxMethod        ?:string        
    discount         ?:number
    discountMethod   ?:string        
    quantity         ?:number
    total            ?:number
  }
export type UpdateTransferInput = {
    id: number
    userId          ?:string
    ref             ?:string          
    date            ?:Date        
    fromWarehouseId ?:number
    toWarehouseId   ?:number
    items           ?:number
    taxRate         ?:number          
    taxNet          ?:number          
    discount        ?:number          
    shipping        ?:number          
    grandTotal      ? :number          
    status          :string          
    notes           ?:string         
    transferDetails?: Array<UpdateTransferDetailInput>
    tenantId: string
}
export const updateTransfer = async (input: UpdateTransferInput,ctx:TenantContext) => {
    const {tenantId, id, transferDetails,...data} = input;

    const transfer = await ctx.tx!.transfer.findUnique({where:{id},include:{
        transferDetails:true
    }});

   let details = {};
    if(transferDetails&&transfer&&transferDetails.length){
        const savedDetails=transfer.transferDetails.map((v)=>v.id);
        const detailsToDelete = transfer.transferDetails
        .filter((v)=>!transferDetails.find((s)=>s.id===v.id))
        .map((v)=>({id:v.id}));

        const detailsToCreate = transferDetails
        .filter((v)=>!savedDetails.find((s)=>s===v.id))
        .map((v) => {
            const { id, ...rest } = v;
           return { ...rest, tenantId };
        });

    const detailsToUpdate = transferDetails
        .filter((v) => savedDetails.find((s) => v.id === s))
        .map((v) => {
            const { id, productVariantId,...rest } = v;
            return { where: { id: id }, data: rest };
        })
      
        details= { 
        transferDetails:{
            createMany:{data:detailsToCreate},
            deleteMany:detailsToDelete,
            updateMany:detailsToUpdate
            
        } }
    }
    return ctx.tx!.transfer.update({
        include,
        where: {
            id: id
        },
        data: {...data,...details}
    })
};
export type TransferId = number
export type TransferIds = Array<number>
export const getUniqueTransfer = async (id: TransferId,ctx:TenantContext) => {

    return ctx.tx!.transfer.findUnique({
        include,
        where: {
            id: id
        }
    })
};
export const deleteTransfer = async (id: TransferId,ctx:TenantContext) => {

    return ctx.tx!.transfer.update({
        include,
        where: {
            id: id
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyTransfer = async (ids: TransferIds,ctx:TenantContext) => {
    return ctx.tx!.transfer.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyTransfer = async (input: Omit<Prisma.TransferFindManyArgs, "select"|"include"> ,ctx:TenantContext) => {
    
    return ctx.tx!.transfer.findMany(
        { include,
           ...input
        }
    );
}