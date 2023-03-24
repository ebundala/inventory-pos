import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "@/core/trpc";

const productIncludes = {
  productVariants: {
    where: { recordStatus: RecordStatus.ACTIVE },
  },
  productUnit: true,
  productPurchaseUnit: true,
  productsSaleUnit: true,
  category: true,
  brand: true,
  productWarehouse: true,
};

export type DateRangeInput = {
  startDate: Date;
  endDate: Date;
  take?: number;
  skip?: number;
  cursor?: number;
};
export const productTopSellers = async (
  { startDate, endDate, cursor, take, skip }: DateRangeInput,
  ctx: TenantContext
) => {
  const stats = await ctx.tx!.saleDetail.groupBy({
    by: [Prisma.SaleDetailScalarFieldEnum.productId],
    where: {
      date:{
        lte:endDate,
        gte:startDate
       },
      sale: {
        recordStatus: RecordStatus.ACTIVE,
        status: { equals: "Completed" },
      }
    },
    _sum: {
      quantity: true,
      total: true,
    },
    orderBy: {
      _sum: {
        quantity: Prisma.SortOrder.desc,
      },
    },
    take,
    skip,
  });
  const ids = stats.map((v) => v.productId);

  const products = await ctx.tx!.product.findMany({
    include: productIncludes,
    where: { id: { in: ids }, recordStatus: RecordStatus.ACTIVE },
  });
  const productMap = products.reduce(
    (p, v) => p.set(v.id, v),
    new Map<number, typeof products[0]>()
  );
  return stats.map((v) => {
    const product = productMap.get(v.productId)!;
    return { product, ...v };
  });
};

export const topCustomers = async (
  { startDate, endDate, cursor, take, skip }: DateRangeInput,
  ctx: TenantContext
) => {
  const stats = await ctx.tx!.sale.groupBy({
    where: {
      status: { equals: "Completed" },
      recordStatus: RecordStatus.ACTIVE,
      AND: [
        {
          date: {
            lte: endDate,
          },
        },
        {
          date: {
            gte: startDate,
          },
        },
      ],
    },
    by: [Prisma.SaleScalarFieldEnum.customerId],
    _sum: {
      grandTotal: true,
    },
    orderBy: {
      _sum: {
        grandTotal: Prisma.SortOrder.desc,
      },
    },
    take,
    skip,
  });
  const ids = stats.map((v) => v.customerId);

  const products = await ctx.tx!.customer.findMany({
    where: { id: { in: ids }, recordStatus: RecordStatus.ACTIVE },
  });
  return stats.map((v) => {
    const i = products.findIndex((e) => e.id === v.customerId);
    return { ...products.at(i), ...v };
  });
};

export const sales = async (
  { startDate, endDate, cursor, take, skip }: DateRangeInput,
  ctx: TenantContext
) => {
  return ctx.tx!.sale.groupBy({
    where: {
      status: { equals: "Completed" },
      recordStatus: RecordStatus.ACTIVE,
      AND: [
        {
          date: {
            lte: endDate,
          },
        },
        {
          date: {
            gte: startDate,
          },
        },
      ],
    },
    by: [Prisma.SaleScalarFieldEnum.date],
    _sum: {
      grandTotal: true,
    },
    orderBy: {
      date: Prisma.SortOrder.asc,
    },
    take,
    skip,
  });
};

export const purchases = async (
  { startDate, endDate, cursor, take, skip }: DateRangeInput,
  ctx: TenantContext
) => {
  return ctx.tx!.purchase.groupBy({
    where: {
      recordStatus: RecordStatus.ACTIVE,
      status: { equals: "Received" },
      AND: [
        {
          date: {
            lte: endDate,
          },
        },
        {
          date: {
            gte: startDate,
          },
        },
      ],
    },
    by: [Prisma.SaleScalarFieldEnum.date],
    _sum: {
      grandTotal: true,
    },
    orderBy: {
      date: Prisma.SortOrder.asc,
    },
    take,
    skip,
  });
};

export const saleReturns = async (
  { startDate, endDate, cursor, take, skip }: DateRangeInput,
  ctx: TenantContext
) => {
  return ctx.tx!.saleReturn.groupBy({
    where: {
      status: { equals: "Received" },
      recordStatus: RecordStatus.ACTIVE,
      AND: [
        {
          date: {
            lte: endDate,
          },
        },
        {
          date: {
            gte: startDate,
          },
        },
      ],
    },
    by: [Prisma.SaleScalarFieldEnum.date],
    _sum: {
      grandTotal: true,
    },
    orderBy: {
      date: Prisma.SortOrder.asc,
    },
    take,
    skip,
  });
};

export const purchaseReturns = async (
  { startDate, endDate, cursor, take, skip }: DateRangeInput,
  ctx: TenantContext
) => {
  return ctx.tx!.purchaseReturn.groupBy({
    where: {
      status: { equals: "Received" },
      recordStatus: RecordStatus.ACTIVE,
      AND: [
        {
          date: {
            lte: endDate,
          },
        },
        {
          date: {
            gte: startDate,
          },
        },
      ],
    },
    by: [Prisma.SaleScalarFieldEnum.date],
    _sum: {
      grandTotal: true,
    },
    orderBy: {
      date: Prisma.SortOrder.asc,
    },
    take,
    skip,
  });
};

export type StockAlertInput ={
  take?:number
  skip?:number
}
export const stockAlerts = async (input:StockAlertInput,ctx: TenantContext) => {
  const productMap = (
    await ctx.tx!.product.findMany({
      where: { recordStatus: RecordStatus.ACTIVE },
      select: { id: true, stockAlert: true, isVariant: true },
    })
  ).reduce((p, c) => {
    return p.set(c.id, c);
  }, new Map<number, { id: number; stockAlert: number | null }>());

  const stats = await ctx.tx!.productWarehouse.groupBy({
    where: {
      product: {
        recordStatus: RecordStatus.ACTIVE,
      },
    },
    by: [
      Prisma.ProductWarehouseScalarFieldEnum.productId,
      Prisma.ProductWarehouseScalarFieldEnum.warehouseId,
      Prisma.ProductWarehouseScalarFieldEnum.productVariantId,
    ],
    _sum: {
      qty: true,
    },
    orderBy: {
      _sum: {
        qty: Prisma.SortOrder.asc,
      },
    },
  });
  // const ids:number[]=[];
  // const warehouseIds:number[]=[];
  // for(let e of stats){

  //     const p = productMap.get(e.productId);
  //     if(p?.stockAlert&&e._sum){
  //       if(p.stockAlert>=(e._sum.qty??0))
  //         ids.push(e.productId);
  //         warehouseIds.push(e.warehouseId);

  //     }
  // }
  const alerts = stats.filter((e) => {
    const p = productMap.get(e.productId);
    if (p?.stockAlert && e._sum) {
      if (p.stockAlert >= (e._sum.qty ?? 0)) return true;
    }
    return false;
  });
  const warehouses = await ctx.tx!.warehouse.findMany({
    where: { recordStatus: RecordStatus.ACTIVE },
  });
  const warehousesMap = warehouses.reduce(
    (p, v) => p.set(v.id, v),
    new Map<number, typeof warehouses[0]>()
  );
  const products = await ctx.tx!.product.findMany({    
    where: {
      id: { in: alerts.map((stat) => stat.productId) },
      recordStatus: RecordStatus.ACTIVE,
    },

    include: productIncludes,
  });

  const prodMap = products.reduce(
    (p, v) => p.set(v.id, v as any),
    new Map<number, typeof products[0]>()
  );

  const results = alerts
    .map((alert) => {
      const product = prodMap.get(alert.productId)!;
      const productVariant = product.productVariants.find(
        (v) => alert.productVariantId === v.id
      );
      const warehouse = warehousesMap.get(alert.warehouseId)!;
      return { ...alert, product, productVariant, warehouse };
    })
    .filter((v) => {
      if (
        (v.product.isVariant && !v.productVariant) ||
        (!v.product.isVariant && v.productVariant)
      ) {
        return false;
      }
      if (
        v.productVariant &&
        v.productVariant?.recordStatus !== RecordStatus.ACTIVE
      ) {
        return false;
      }
      return true;
    })
    
      const {take,skip} = input;
      if(skip&&take){
        console.log("alerts all",input);

        return results.slice(skip,skip+take-1)
      }
      else if(skip&&!take){
        console.log("alerts skip",input);

        return results.slice(skip-1)


      }else if(take){
        console.log("alerts take",input);

        return results.slice(0,take)
      }    
      console.log("alerts main",input);

    return results;
};

export const paymentSale = async (
  { startDate, endDate, cursor, take, skip }: DateRangeInput,
  ctx: TenantContext
) => {
  return ctx.tx!.paymentSale.groupBy({
    where: {
      // status: { equals: "Received" },
      recordStatus: RecordStatus.ACTIVE,
      AND: [
        {
          date: {
            lte: endDate,
          },
        },
        {
          date: {
            gte: startDate,
          },
        },
      ],
    },
    by: [Prisma.SaleScalarFieldEnum.date],
    _sum: {
      amount: true,
    },
    orderBy: {
      date: Prisma.SortOrder.asc,
    },
    take,
    skip,
  });
};

export const paymentSaleReturns = async (
  { startDate, endDate, cursor, take, skip }: DateRangeInput,
  ctx: TenantContext
) => {
  return ctx.tx!.paymentSaleReturn.groupBy({
    where: {
      // status: { equals: "Received" },
      recordStatus: RecordStatus.ACTIVE,
      AND: [
        {
          date: {
            lte: endDate,
          },
        },
        {
          date: {
            gte: startDate,
          },
        },
      ],
    },
    by: [Prisma.SaleScalarFieldEnum.date],
    _sum: {
      amount: true,
    },
    orderBy: {
      date: Prisma.SortOrder.asc,
    },
    take,
    skip,
  });
};

export const paymentPurchase = async (
  { startDate, endDate, cursor, take, skip }: DateRangeInput,
  ctx: TenantContext
) => {
  return ctx.tx!.paymentPurchase.groupBy({
    where: {
      // status: { equals: "Received" },
      recordStatus: RecordStatus.ACTIVE,
      AND: [
        {
          date: {
            lte: endDate,
          },
        },
        {
          date: {
            gte: startDate,
          },
        },
      ],
    },
    by: [Prisma.SaleScalarFieldEnum.date],
    _sum: {
      amount: true,
    },
    orderBy: {
      date: Prisma.SortOrder.asc,
    },
    take,
    skip,
  });
};

export const paymentPurchaseReturn = async (
  { startDate, endDate, cursor, take, skip }: DateRangeInput,
  ctx: TenantContext
) => {
  return ctx.tx!.paymentPurchase.groupBy({
    where: {
      // status: { equals: "Received" },
      recordStatus: RecordStatus.ACTIVE,
      AND: [
        {
          date: {
            lte: endDate,
          },
        },
        {
          date: {
            gte: startDate,
          },
        },
      ],
    },
    by: [Prisma.SaleScalarFieldEnum.date],
    _sum: {
      amount: true,
    },
    orderBy: {
      date: Prisma.SortOrder.asc,
    },
    take,
    skip,
  });
};
