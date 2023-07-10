import { prisma } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { text } from "stream/consumers";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";
import {
  getProductWarehouse,
  getOneProductWarehouse,
} from "../util/getProductWarehouse";
const include = {
  user: true,
  warehouse: true,
  customer: true,
  saleDetails: {
    include: {
      product: {
        include: {
          productWarehouse: true,
          productsSaleUnit:true,
          productPurchaseUnit:true,
          productUnit:true
        },
      },
      productVariant: true,
    },
  },
  paymentSales: {
    where:{  recordStatus:RecordStatus.ACTIVE,}
  },
  shipments: {
    where:{  recordStatus:RecordStatus.ACTIVE,}
  },
};

export type CreateSaleDetailsInput = {
  date: Date;
  //saleId: number
  productId: number;
  productVariantId?: number;
  imeiNumber?: string;
  price: number;
  saleUnitId?: number;
  taxNet: number;
  taxMethod?: string;
  discount?: number;
  discountMethod?: string;
  total: number;
  quantity: number;
};

export type CreatePaymentSaleInput = {
  // userId: string
  date: Date;
  ref: string;
  // saleId: number
  amount: number;
  change: number;
  reglement: string;
  notes?: string;
};
export type CreateShipmentInput = {
  // userId: string
  date: Date;
  ref: string;
  // saleId: number
  deliveredTo?: string;
  shippingAddress?: string;
  status: string;
  shippingDetails?: string;
};

export type CreateSaleInput = {
  userId: string;
  date: Date;
  ref: string;
  isPos?: boolean;
  customerId: number;
  warehouseId: number;
  taxRate?: number;
  taxNet?: number;
  discount?: number;
  shipping?: number;
  grandTotal: number;
  paidAmount: number;
  paymentStatus: string;
  status: string;
  notes?: string;
  saleDetails?: Array<CreateSaleDetailsInput>;
  paymentSales?: Array<CreatePaymentSaleInput>;
  shipments?: Array<CreateShipmentInput>;
  tenantId: string;
};
export const createSale = async (
  input: CreateSaleInput,
  ctx: TenantContext
) => {
  const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "sale",
    action: "create"
  });
  const { tenantId:_, userId:__, saleDetails, paymentSales, shipments, ...data } =
    input;
  let saleData = {};
  if (saleDetails && saleDetails.length) {
    const productWarehouse = await getProductWarehouse(
      ctx,
      saleDetails,
      data.warehouseId
    );

    if (data.status === "Completed") {
      const updatePw = saleDetails
        .map((v) => {
          const pw = getOneProductWarehouse(productWarehouse, {
            productId: v.productId,
            productVariantId: v.productVariantId,
            warehouseId: data.warehouseId!,
          });

          if (!pw) return null;

          return ctx.tx!.productWarehouse.update({
            where: { id: pw!.id },
            data: {
              qty: pw!.qty - v.quantity,
            },
          });
        })
        .filter((v) => v);
      await Promise.allSettled(updatePw);
    }

    saleData = {
      saleDetails: {
        createMany: {
          skipDuplicates: true,
          data: saleDetails.map((v) => ({
            ...v,
            tenantId,
          })),
        },
      },
    };
  }
  let paymentData = {};
  if (paymentSales && paymentSales.length) {
    paymentData = {
      paymentSales: {
        createMany: {
          skipDuplicates: true,
          data: paymentSales.map((v) => ({
            ...v,
            tenantId,
            userId,
          })),
        },
      },
    };
  }
  let shipmentData = {};
  if (shipments && shipments.length) {
    shipmentData = {
      shipments: {
        createMany: {
          skipDuplicates: true,
          data: shipments.map((v) => ({
            ...v,
            tenantId,
            userId,
          })),
        },
      },
    };
  }
  return ctx.tx!.sale.create({
    include,
    data: {
      tenantId,
      userId,
      ...data,
      ...saleData,
      ...paymentData,
      ...shipmentData,
    },
  });
};

export type UpdateSaleDetailsInput = {
  id?: number;
  date?: Date;
  saleId?: number;
  productId?: number;
  productVariantId?: number;
  imeiNumber?: string;
  price?: number;
  saleUnitId?: number;
  taxNet?: number;
  taxMethod?: string;
  discount?: number;
  discountMethod?: string;
  total?: number;
  quantity?: number;
};

export type UpdatePaymentSaleInput = {
  id?: number;
  userId?: string;
  date?: Date;
  ref?: string;
  // saleId       :number
  amount?: number;
  change?: number;
  reglement?: string;
  notes?: string;
};
export type UpdateShipmentInput = {
  id?: number;
  userId?: string;
  date?: Date;
  ref?: string;
  //saleId ?         :number
  deliveredTo?: string;
  shippingAddress?: string;
  status?: string;
  shippingDetails?: string;
};
export type UpdateSaleInput = {
  id: number;
  userId?: string;
  date?: Date;
  ref?: string;
  isPos?: boolean;
  customerId?: number;
  warehouseId?: number;
  taxRate?: number;
  taxNet?: number;
  discount?: number;
  shipping?: number;
  grandTotal?: number;
  paidAmount?: number;
  paymentStatus: string;
  status?: string;
  notes?: string;
  saleDetails?: Array<UpdateSaleDetailsInput>;
  paymentSales?: Array<UpdatePaymentSaleInput>;
  shipments?: Array<UpdateShipmentInput>;
  tenantId: string;
};
export const updateSale = async (
  input: UpdateSaleInput,
  ctx: TenantContext
) => {
  const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "sale",
    action: "update"
  });
  const {
    tenantId:_,
    id,
    userId:__,
    saleDetails,
    shipments,
    paymentSales,
    ...data
  } = input;
  const sale = await ctx.tx!.sale.findUnique({
    where: { id,  recordStatus:RecordStatus.ACTIVE, },
    include: {
      shipments: true,
      saleDetails: true,
      paymentSales: true,
    },
  });
  let details = {};
  if (saleDetails && sale && saleDetails.length) {
    const productWarehouse = await getProductWarehouse(
      ctx,
      saleDetails,
      data.warehouseId!
    );
    //revert old details
    const updateProductWarehouse = sale.saleDetails
      .map((v) => {
        const productId = v.productId;
        const productVariantId = v.productVariantId;
        const warehouseId = sale.warehouseId;
        const pw = getOneProductWarehouse(productWarehouse, {
          warehouseId: warehouseId,
          productId,
          productVariantId,
        });
        if (!pw || sale.status !== "Completed") return null;

        return ctx.tx!.productWarehouse.update({
          where: { id: pw!.id },
          data: {
            qty: pw.qty + v.quantity,
          },
        });
      })
      .filter((v) => v !== null);
    await Promise.allSettled(updateProductWarehouse);

    //  const savedDetails = sale.saleDetails.map((v) => v.id);
    const detailsToDelete = sale.saleDetails
      //.filter((v) => !saleDetails.find((s) => s.id = v.id))
      .map((v) => ({ id: v.id }));

    const detailsToCreate = saleDetails
      //.filter((v) => !savedDetails.find((s) => s === v.id))
      .map((v) => {
        const { id, saleId, ...rest } = v;
        return { ...rest, tenantId };
      });
    // const detailsToUpdate = saleDetails.filter((v) => !!savedDetails.find((s) => s === v.id))
    //     .map((v) => {
    //         const { id, productVariantId, ...rest } = v;
    //         return { where: { id }, data: { ...rest, tenantId } };
    //     });

    details = {
      saleDetails: {
        createMany: {
          data: detailsToCreate,
        },
        deleteMany: detailsToDelete,
        // updateMany: detailsToUpdate
      },
    };

    const productWarehouse2 = await getProductWarehouse(
      ctx,
      saleDetails,
      data.warehouseId!
    );

    //update prod warehouse with new details
    const updateProductWarehouse2 = detailsToCreate.map((v) => {
      const productId = v.productId!;
      const productVariantId = v.productVariantId;
      const warehouseId = sale.warehouseId!;
      const pw = getOneProductWarehouse(productWarehouse2, {
        warehouseId,
        productId,
        productVariantId,
      });
      if (!pw || data.status !== "Completed") return null;

      return ctx.tx!.productWarehouse.update({
        where: { id: pw!.id },
        data: {
          qty: pw!.qty - v!.quantity!,
        },
      });
    });
    await Promise.allSettled(updateProductWarehouse2);
  }

  let paymentData = {};
  if (paymentSales && sale && paymentSales.length) {
    const savedDetails = sale.paymentSales.map((v) => v.id);
    const detailsToDelete = sale.paymentSales
      .filter((v) => !paymentSales.find((s) => (s.id = v.id)))
      .map((v) => ({ id: v.id }));
    const detailsToCreate = paymentSales
      .filter((v) => !savedDetails.find((s) => s === v.id))
      .map((v) => {
        const { id, ...rest } = v;
        return { ...rest, userId, tenantId };
      });
    const detailsToUpdate = paymentSales
      .filter((v) => savedDetails.find((s) => s === v.id))
      .map((v) => {
        const { id, ...rest } = v;
        return { where: { id }, data: { ...rest, tenantId } };
      });
    paymentData = {
      paymentSales: {
        createMany: {
          data: detailsToCreate,
        },
        deleteMany: detailsToDelete,
        updateMany: detailsToUpdate,
      },
    };
  }

  let shipmentData = {};
  if (shipments && sale && shipments.length) {
    const savedDetails = sale.shipments.map((v) => v.id);
    const detailsToDelete = sale.shipments
      .filter((v) => !shipments.find((s) => (s.id = v.id)))
      .map((v) => ({ id: v.id }));
    const detailsToCreate = shipments
      .filter((v) => !savedDetails.includes(v.id ?? -1))
      .map((v) => {
        const { id, ...rest } = v;
        return { ...rest, userId, tenantId };
      });
    const detailsToUpdate = shipments
      .filter((v) => savedDetails.find((s) => s === v.id))
      .map((v) => {
        const { id, ...rest } = v;
        return { where: { id }, data: { ...rest, tenantId } };
      });
    shipmentData = {
      shipments: {
        createMany: {
          data: detailsToCreate,
        },
        deleteMany: detailsToDelete,
        updateMany: detailsToUpdate,
      },
    };
  }
  return ctx.tx!.sale.update({
    include,
    where: {
      id: id,  recordStatus:RecordStatus.ACTIVE,
    },
    data: {
      ...data,
      ...details,
      ...paymentData,
      ...shipmentData,
    },
  });
};

export type SaleId = number;
export type SaleIds = Array<number>;
export const getUniqueSale = async (id: SaleId, ctx: TenantContext) => {
  const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "sale",
    action: "view"
  });
  return ctx.tx!.sale.findUnique({
    include,
    where: {
      id: id,  recordStatus:RecordStatus.ACTIVE,
    },
  });
};
export const deleteSale = async (id: SaleId, ctx: TenantContext) => {
  const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "sale",
    action: "delete"
  });
  return ctx.tx!.sale.update({
    include,
    where: {
      id: id,  
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};
export const deleteManySale = async (ids: SaleIds, ctx: TenantContext) => {
  const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "sale",
    action: "delete"
  });
  return ctx.tx!.sale.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};

export const findManySale = async (
  input: Omit<Prisma.SaleFindManyArgs, "select" | "include">,
  ctx: TenantContext
) => {
  const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "sale",
    action: "view"
  });
  const {where,...rest}=input
  return ctx.tx!.sale.findMany({
    where:{...where,  recordStatus:RecordStatus.ACTIVE,},
    include,
    ...rest,
  });
};


