import { prisma, } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
const include={
    fromWarehouse:true,
    toWarehouse:true,
    user:true,
    TransferDetails:true,    
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
export const createTransfer = async (input: CreateTransferInput) => {
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
    return prisma!.transfer.create({
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
export const updateTransfer = async (input: UpdateTransferInput) => {
    const {tenantId, id, transferDetails,...data} = input;
    const transfer = await prisma!.transfer.findUnique({where:{id},include:{
        transferDetails:true
    }});
   let details = {};
    if(transferDetails&&transfer&&transferDetails.length){
        const savedVariants=transfer.transferDetails.map((v)=>v.id);
        const variantToDelete = transfer.transferDetails.filter((v)=>!transferDetails.find((s)=>s.id===v.id??""))
        .map((v)=>({id:v.id}));
        const variantsToCreate = transferDetails.filter((v)=>!savedVariants.includes(v.id??-1)).map((v)=>({...v,tenantId}));
       details= { 
        transferDetails:{
            createMany:{data:variantsToCreate},
            deleteMany:variantToDelete,
            
        } }
    }
    return prisma!.transfer.update({
        include,
        where: {
            id: id
        },
        data: {...data,...details}
    })
};
type TransferId = number
type TransfersId = Array<number>
export const getUniqueTransfer = async (id: TransferId) => {

    return prisma!.transfer.findUnique({
        include,
        where: {
            id: id
        }
    })
};
export const deleteTransfer = async (id: TransferId) => {

    return prisma!.transfer.update({
        include,
        where: {
            id: id
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyTransfer = async (ids: TransfersId) => {
    return prisma!.transfer.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyTransfer = async (input: Pick<Prisma.TransferWhereInput, Prisma.TransferScalarFieldEnum> & {
    orderBy?: [Pick<Prisma.TransferOrderByWithRelationInput, Prisma.TransferScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.TransferWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.TransferScalarFieldEnum)
            .filter((v) => ["taxMethod", "discountMethod"].includes(v))
            .map((v) => ({
                [v]: { contains: search }
            }));

        query = {
            OR: terms
        };
    };
    return prisma!.transfer.findMany(
        { include,
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}