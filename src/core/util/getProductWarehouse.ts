import { Prisma, ProductWarehouse } from "@prisma/client";
import { TenantContext } from "../trpc";

export async function getProductWarehouse(
  ctx: TenantContext,
  details: { productId?: number; productVariantId?: number | null; }[],
  warehouseId: number) {
  return (
    await ctx.tx!.productWarehouse.findMany({
      distinct: [
        Prisma.ProductWarehouseScalarFieldEnum.productId,
        Prisma.ProductWarehouseScalarFieldEnum.warehouseId,
        Prisma.ProductWarehouseScalarFieldEnum.productVariantId,
      ],
      where: {
        OR: details.map((d) => {
          if (!!d.productVariantId) {
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
        }),
      },
    })
  ).reduce(
    (p, c, i, arr) => p.set(`${warehouseId}-${c.productId}-${c.productVariantId}`, c),
    new Map<string, ProductWarehouse>()
  );
}

export function getOneProductWarehouse(data:Map<string,ProductWarehouse>,query:{warehouseId:number,productId:number,productVariantId?:number | null}){
return data.get(`${query.warehouseId}-${query.productId}-${query.productVariantId}`)
}
