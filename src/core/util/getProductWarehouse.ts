import { Prisma, ProductWarehouse } from "@prisma/client";
import { TenantContext } from "../trpc";

export async function getProductWarehouse(
  ctx: TenantContext,
  details: { productId?: number; productVariantId?: number | null; }[],
  warehouseId: number) {
  const distinct =  [
    Prisma.ProductWarehouseScalarFieldEnum.productId,
    Prisma.ProductWarehouseScalarFieldEnum.warehouseId,
    Prisma.ProductWarehouseScalarFieldEnum.productVariantId
  ];

const OR = details.map((d) => {
  if (d.productVariantId!=-1&&d.productVariantId!=null) {
    return {
      warehouseId: warehouseId,
      productId: d.productId,
      productVariantId: d.productVariantId,
    };
  }
  return {
    warehouseId: warehouseId,
    productId: d.productId,
  };
})
  return (
    await ctx.tx!.productWarehouse.findMany({
      distinct,
      where: {
      
        OR: OR,
      },
      select:{
        id:true,
        productId:true,
        product:true,
        warehouseId:true,
        warehouse:true,
        productVariant:true,
        productVariantId:true,
        qty:true,
        tenantId:true,
        createdAt:true, updatedAt:true, recordStatus:true
      }
    })
  ).reduce(
    (p, c, i, arr) =>{
       const key = `${warehouseId}-${c.productId}${c.productVariantId!=-1&&c.productVariantId!=null?`-${c.productVariantId}`:""}`
      return  p.set(key, c);
      },
    new Map<string, ProductWarehouse>()
  );
}

export function getOneProductWarehouse(data:Map<string,ProductWarehouse>,query:{warehouseId:number,productId:number,productVariantId?:number | null}){
  const key = `${query.warehouseId}-${query.productId}${query.productVariantId!=-1&&query.productVariantId!=null?`-${query.productVariantId}`:""}`;
  return data.get(key);
}
