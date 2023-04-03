import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "@/core/trpc";
import { z } from "zod";
import { SaleDetailWhereInputObjectSchema } from "prisma/generated/schemas/objects/SaleDetailWhereInput.schema";
import { SaleWhereInputObjectSchema } from "prisma/generated/schemas/objects/SaleWhereInput.schema";
import { PurchaseWhereInputObjectSchema } from "prisma/generated/schemas/objects/PurchaseWhereInput.schema";
import { SaleReturnWhereInputObjectSchema } from "prisma/generated/schemas/objects/SaleReturnWhereInput.schema";
import { PurchaseReturnWhereInputObjectSchema } from "prisma/generated/schemas/objects/PurchaseReturnWhereInput.schema";
import { PaymentSaleWhereInputObjectSchema } from "prisma/generated/schemas/objects/PaymentSaleWhereInput.schema";
import { PaymentSaleReturnWhereInputObjectSchema } from "prisma/generated/schemas/objects/PaymentSaleReturnWhereInput.schema";
import { PaymentPurchaseWhereInputObjectSchema } from "prisma/generated/schemas/objects/PaymentPurchaseWhereInput.schema";
import { PaymentPurchaseReturnWhereInputObjectSchema } from "prisma/generated/schemas/objects/PaymentPurchaseReturnWhereInput.schema";

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

export type WhereInput<T> = {
  where?: T
  take?: number;
  skip?: number;
  cursor?: number;
};

export const ProductTopSellersSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.number().optional(),
  where: SaleDetailWhereInputObjectSchema.optional()
});

export const productTopSellers = async (
  { where, cursor, take, skip }: WhereInput<Prisma.SaleDetailWhereInput>,
  ctx: TenantContext
) => {
  const stats = await ctx.tx!.saleDetail.groupBy({
    by: [Prisma.SaleDetailScalarFieldEnum.productId],
    where: {
      ...where,
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

export const TopCustomersSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.number().optional(),
  where: SaleWhereInputObjectSchema.optional()
});
export const topCustomers = async (
  { where, cursor, take, skip }: WhereInput<Prisma.SaleWhereInput>,
  ctx: TenantContext
) => {
  const stats = await ctx.tx!.sale.groupBy({
    where: {
      ...where,
      status: { equals: "Completed" },
      recordStatus: RecordStatus.ACTIVE,

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


export const SalesSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.number().optional(),
  where: SaleWhereInputObjectSchema.optional()
});
export const sales = async (
  { where, cursor, take, skip }: WhereInput<Prisma.SaleWhereInput>,
  ctx: TenantContext
) => {
  return ctx.tx!.sale.groupBy({
    where: {
      ...where,
      status: { equals: "Completed" },
      recordStatus: RecordStatus.ACTIVE,
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

export const PurchasesSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.number().optional(),
  where: PurchaseWhereInputObjectSchema.optional()
});
export const purchases = async (
  { where, cursor, take, skip }: WhereInput<Prisma.PurchaseWhereInput>,
  ctx: TenantContext
) => {
  return ctx.tx!.purchase.groupBy({
    where: {
      ...where,
      recordStatus: RecordStatus.ACTIVE,
      status: { equals: "Received" },

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

export const SaleReturnSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.number().optional(),
  where: SaleReturnWhereInputObjectSchema.optional()
});

export const saleReturns = async (
  { where, cursor, take, skip }: WhereInput<Prisma.SaleReturnWhereInput>,
  ctx: TenantContext
) => {
  return ctx.tx!.saleReturn.groupBy({
    where: {
      ...where,
      status: { equals: "Received" },
      recordStatus: RecordStatus.ACTIVE,

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


export const PurchaseReturnSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.number().optional(),
  where: PurchaseReturnWhereInputObjectSchema.optional()
});
export const purchaseReturns = async (
  { where, cursor, take, skip }: WhereInput<Prisma.PurchaseReturnWhereInput>,
  ctx: TenantContext
) => {
  return ctx.tx!.purchaseReturn.groupBy({
    where: {
      ...where,
      status: { equals: "Received" },
      recordStatus: RecordStatus.ACTIVE,
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

export type StockAlertInput = {
  take?: number
  skip?: number
}
export const stockAlerts = async (input: StockAlertInput, ctx: TenantContext) => {
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
      if (!v.warehouse) {
        return false
      }
      return true;
    })

  const { take, skip } = input;
  if (skip && take) {
    return results.slice(skip, skip + take - 1)
  }
  else if (skip && !take) {
    return results.slice(skip - 1)
  } else if (take) {
    return results.slice(0, take)
  }

  return results;
};


export const PaymentSaleSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.number().optional(),
  where: PaymentSaleWhereInputObjectSchema.optional()
});
export const paymentSale = async (
  { where, cursor, take, skip }: WhereInput<Prisma.PaymentSaleWhereInput>,
  ctx: TenantContext
) => {
  return ctx.tx!.paymentSale.groupBy({
    where: {
      ...where,
      recordStatus: RecordStatus.ACTIVE,

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


export const PaymentSaleReturnSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.number().optional(),
  where: PaymentSaleReturnWhereInputObjectSchema.optional()
});
export const paymentSaleReturns = async (
  { where, cursor, take, skip }: WhereInput<Prisma.PaymentSaleReturnWhereInput>,
  ctx: TenantContext
) => {
  return ctx.tx!.paymentSaleReturn.groupBy({
    where: {
      ...where, recordStatus: RecordStatus.ACTIVE,

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



export const PaymentPurchaseSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.number().optional(),
  where: PaymentPurchaseWhereInputObjectSchema.optional()
});
export const paymentPurchase = async ({ where, cursor, take, skip }: WhereInput<Prisma.PaymentPurchaseWhereInput>,
  ctx: TenantContext
) => {
  return ctx.tx!.paymentPurchase.groupBy({
    where: {
      ...where,
      recordStatus: RecordStatus.ACTIVE,

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


export const PaymentPurchaseReturnSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.number().optional(),
  where: PaymentPurchaseReturnWhereInputObjectSchema.optional()
});
export const paymentPurchaseReturn = async (
  { where, cursor, take, skip }: WhereInput<Prisma.PaymentPurchaseReturnWhereInput>,
  ctx: TenantContext
) => {
  return ctx.tx!.paymentPurchaseReturn.groupBy({
    where: {
      ...where, recordStatus: RecordStatus.ACTIVE,

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

export const CustomerSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.number().optional(),
  where: SaleWhereInputObjectSchema.optional()
});
export const customerReport = async ({where}: WhereInput<Prisma.SaleWhereInput>, ctx: TenantContext) => {

  const stats = (await ctx.tx!.sale.groupBy({
    where: {
      ...where,
      recordStatus: RecordStatus.ACTIVE
    },
    by: [Prisma.SaleScalarFieldEnum.customerId],
    _count: {
      id: true
    },
    _sum: {
      paidAmount: true,
      grandTotal: true,
      discount: true,
      shipping: true
    }
  }));
  const statMap: Map<number, typeof stats[0]> = stats.reduce((p, c, i) => p.set(c.customerId, c), new Map())
  const result = (await ctx.tx!.customer.findMany({ where: { recordStatus: RecordStatus.ACTIVE } })).map((v) => ({ ...v, ...statMap.get(v.id) })).filter((v)=>v._sum);
  return result;
}

export const SupplierSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.number().optional(),
  where: PurchaseWhereInputObjectSchema.optional()
});
export const suppliersReport = async ({where}:WhereInput<Prisma.PurchaseWhereInput>,ctx: TenantContext) => {
  const stats = (await ctx.tx!.purchase.groupBy({
    where: {
      ...where,
      recordStatus: RecordStatus.ACTIVE
    },
    by: [Prisma.PurchaseScalarFieldEnum.supplierId],
    _count: {
      id: true
    },
    _sum: {
      paidAmount: true,
      discount: true,
      grandTotal: true,
    }
  }))
  const statMap: Map<number, typeof stats[0]> = stats.reduce((p, c, i) => p.set(c.supplierId, c), new Map());
  const result = (await ctx.tx!.supplier.findMany()).map((v) => ({ ...v, ...statMap.get(v.id) }));
  return result;
}