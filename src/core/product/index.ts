import { prisma } from "@/core";
import { Prisma, Product, ProductVariant, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";
const include = {  
  productUnit: true,
  productPurchaseUnit: true,
  productsSaleUnit: true,
  category: true,
  brand: true,
  productVariants: {
    where:{recordStatus:RecordStatus.ACTIVE}
  },
  productWarehouse:{
    where:{recordStatus:RecordStatus.ACTIVE},
    include:{
      warehouse:true
    }
  },
};
export type CreateProductVariantInput = {
  name?: string;
  qty?: number;
};
export type CreateProductInput = {
  name: string;
  code: string;
  typeBarcode: string;
  note?: string;
  image?: string;
  cost: number;
  price: number;
  categoryId: number;
  brandId?: number;
  unitId?: number;
  unitSaleId?: number;
  unitPurchaseId?: number;
  taxNet?: number;
  taxMethod?: string;
  stockAlert?: number;
  isVariant: boolean;
  isImei: boolean;
  isActive?: boolean;
  productVariants?: Array<CreateProductVariantInput>;
  tenantId: string;
};
export const createProduct = async (
  input: CreateProductInput,
  ctx: TenantContext
) => {
  const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "product",
      action: "create"
    });
  const { tenantId:_, productVariants, ...data } = input;
  let variants = {};
  if (productVariants && productVariants.length) {
    variants = {
      productVariants: {
        createMany: {
          skipDuplicates: true,
          data: productVariants.map((v) => ({ ...v, tenantId })),
        },
      },
    };
  }
  const product = await ctx.tx!.product.create({
    include,
    data: { tenantId: tenantId, ...data, ...variants },
  });
  const warehouses = await ctx.tx!.warehouse.findMany({ select: { id: true } });
  const productWarehouseData = warehouses.flatMap((w) => {
    if (product.isVariant) {
      return product.productVariants.map((v) => {
        return {
          productId: product.id,
          tenantId: ctx.tenantId,
          productVariantId: v.id,
          qty: 0,
          warehouseId: w.id,
        };
      });
    } else {
      return [
        {
          productId: product.id,
          tenantId: ctx.tenantId,
          qty: 0,
          warehouseId: w.id,
        },
      ];
    }
  });
  await ctx.tx!.productWarehouse.createMany({
    data: productWarehouseData,
  });
  return product;
};
export type UpdateProductVariantInput = {
  id?: number;
  name?: string;
  qty?: number;
};
export type UpdateProductInput = {
  id: number;
  name?: string;
  code?: string;
  typeBarcode?: string;
  note?: string;
  image?: string;
  cost?: number;
  price?: number;
  categoryId?: number;
  brandId?: number;
  unitId?: number;
  unitSaleId?: number;
  unitPurchaseId?: number;
  taxNet?: number;
  taxMethod?: string;
  stockAlert?: number;
  isVariant?: boolean;
  isImei?: boolean;
  isActive?: boolean;
  productVariants?: Array<UpdateProductVariantInput>;
  tenantId: string;
};
export const updateProduct = async (
  input: UpdateProductInput,
  ctx: TenantContext
) => {
  const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "product",
      action: "update"
    });
  const { tenantId:_, id, productVariants, ...data } = input;
  const product = await ctx.tx!.product.findUnique({
    where: { id ,recordStatus:{equals:RecordStatus.ACTIVE}},
    include: {
      productVariants: {
        where:{recordStatus:{equals:RecordStatus.ACTIVE}}
      },
    },
  });
  let variants={},productWarehouse = {};
  if (
    productVariants &&
    product &&
    product.productVariants &&
    product.productVariants.length
  ) {
    const savedVariants = product.productVariants.map((v) => v.id);
    const variantToDelete = product.productVariants
      .filter((v) => !productVariants.find((s) => s.id === v.id))
      .map((v) => ({where:{ id: v.id },data:{recordStatus:RecordStatus.DELETED}}));

    const variantToUpdate = product.productVariants
      .filter((v) => productVariants.find((s) => s.id === v.id))
      .map((v) => {
        const { id, productId, ...rest } = v;
        return { where: { id: id }, data: rest };
      });

    const variantsToCreate = productVariants
      .filter((v) => !savedVariants.find((s) => s === v.id))
      .map((v) => {
        const { id, ...rest } = v;
        return { ...rest, tenantId };
      });
    variants = {
      productVariants: {
        createMany: {
          skipDuplicates: true,
          data: variantsToCreate,
        },
      //  deleteMany: variantToDelete,
        updateMany: [...variantToDelete,...variantToUpdate],
      },
    };
    productWarehouse = {
        // createMany:{
        //     skipDuplicates:true,
        //     data:variantsToCreate.map((v)=>({
        //         warehouseId:0,productVariantId:v.,qty:0,tenantId
        //     }))
        // },
        updateMany:variantToDelete.map((v)=>({where:{productVariantId:v.where.id},data:v.data}))
        // deleteMany:variantToDelete.map((v)=>({
        //     productVariantId:{equals:v.id}
        // }))
       }
    
  }
  
  const updatedProduct = await ctx.tx!.product.update({
    include,
    where: {
      id: id,
    },
    data: { ...data, ...variants,productWarehouse},
  });
  const newVariantsNames = productVariants?.filter((v)=>v.id).map((v)=>v.name)
if(newVariantsNames && newVariantsNames.length>0){
  const warehouses = await ctx.tx!.warehouse.findMany({where:{recordStatus:RecordStatus.ACTIVE}});
  const newVariants = updatedProduct.productVariants.filter((v)=>newVariantsNames?.includes(v.name!))
  //get new variants
 const productWarehouseData= warehouses.flatMap((v)=>{
    return newVariants.flatMap((pv)=>{
        return {
            productId:updatedProduct.id,
            warehouseId:v.id,productVariantId:pv.id,tenantId,qty:0
        }
    })
  })
   await ctx.tx!.productWarehouse.createMany({data:productWarehouseData});
}
return await ctx.tx!.product.findUnique({
    where: { id,recordStatus:RecordStatus.ACTIVE },
    include
  });
};

export type ProductId = number;
export type ProductIds = Array<number>;
export const getUniqueProduct = async (id: ProductId, ctx: TenantContext) => {
  return ctx.tx!.product.findUnique({
    include,
    where: {
      id,recordStatus:RecordStatus.ACTIVE
    },
  });
};
export const deleteProduct = async (id: ProductId, ctx: TenantContext) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "product",
    action: "delete"
  });
  return ctx.tx!.product.update({
    include,
    where: {
      id: id,
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};
export const deleteManyProduct = async (
  ids: ProductIds,
  ctx: TenantContext
) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "product",
    action: "delete"
  });
  return ctx.tx!.product.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};

export const findManyProduct = async (
  input: Omit<Prisma.ProductFindManyArgs, "select" | "include">,
  ctx: TenantContext
) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "product",
    action: "view"
  });
  const {where,...rest}=input
  return ctx.tx!.product.findMany({
    where:{...where,recordStatus:RecordStatus.ACTIVE},
    include,
    ...rest,
  });
};
