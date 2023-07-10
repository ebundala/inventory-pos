import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { SaleWhereInputObjectSchema } from "prisma/generated/schemas/objects/SaleWhereInput.schema";
import { enforceHelper } from "../util/enforcerUtil";

export type CreateWarehouseInput = {
    name: string
    city?: string
    email?: string
    mobile?: string
    country?: string
    zip?: string
    tenantId: string
}
export const createWarehouse = async (input: CreateWarehouseInput,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "warehouse",
    action: "create"
  });
    const { tenantId:_, ...data } = input;
    const {user} = ctx.session??{};
    const products = await ctx.tx!.product.findMany({select:{id:true}});
    
    return ctx.tx!.warehouse.create({
        data:{
            tenantId:tenantId,
            ...data,
            user_warehouse:{
                create:{
                    userId:user!.id!,
                    tenantId:tenantId
                }
            },
            productWarehouses:{
                createMany:{
                    skipDuplicates:true,
                        data:products.map((v)=>(                            {
                           tenantId:tenantId,
                          productId:v.id,
                          qty:0
                        }))
                    }
                
            }
        }
   })
}
export type UpdateWarehouseInput = {
    id: number
    name?: string
    city?: string
    email?: string
    mobile?: string
    country?: string
    zip?: string
   
}
export const updateWarehouse = async (input: UpdateWarehouseInput,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "warehouse",
      action: "create"
    });
    const { id, ...data } = input;
    return ctx.tx!.warehouse.update({
        where: {
            id: id,  recordStatus:RecordStatus.ACTIVE,
        },        
        data: { ...data }
    })
};
export type WarehouseId = number
export type WarehouseIds = Array<number>
export const getUniqueWarehouse = async (id: WarehouseId,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "warehouse",
      action: "view"
    });
    return ctx.tx!.warehouse.findUnique({
        where: {
            id: id,  recordStatus:RecordStatus.ACTIVE,
        }        
    })
};
export const deleteWarehouse = async (id: WarehouseId,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "warehouse",
      action: "delete"
    });
    return ctx.tx!.warehouse.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyWarehouse = async (ids: WarehouseIds,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "warehouse",
      action: "delete"
    });
    return ctx.tx!.warehouse.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyWarehouse = async (input: Omit<Prisma.WarehouseFindManyArgs,"select"|"include">,ctx:TenantContext) => {   
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "warehouse",
      action: "view"
    });
    const {where,...rest}=input;
    return ctx.tx!.warehouse.findMany(
        {
            where:{...where,  recordStatus:RecordStatus.ACTIVE,},...rest
        }
    );
}