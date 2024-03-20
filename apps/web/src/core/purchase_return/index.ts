import { prisma } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";
import {
  getProductWarehouse,
  getOneProductWarehouse,
} from "../util/getProductWarehouse";
const include = {
  supplier: true,
  user: true,
  warehouse: true,
  paymentPurchaseReturns: {
    where:{recordStatus:RecordStatus.ACTIVE}
  },
  purchaseReturnDetails: {
    include: {
      product: {
        include: {
          productWarehouse: true,
          productUnit:true,
          productsSaleUnit:true,
          productPurchaseUnit:true
        },
      },
      productVariant: true,
    },
  },
};

export type CreatePurchaseReturnDetailInput = {
  cost: number;
  purchaseUnitId: number;
  taxNet: number;
  taxMethod: string;
  discount?: number;
  discountMethod: string;
  total: number;
  quantity: number;
  productId: number;
  productVariantId?: number;
  imeiNumber?: string;
};

export type CreatePaymentPurchaseReturnInput = {
  // userId           :string
  date: Date;
  ref: string;
  amount: number;
  change: number;
  reglement: string;
  notes?: string;
};

export type CreatePurchaseReturnInput = {
  //userId: string;
  date: Date;
  ref: string;
  supplierId: number;
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
  paymentPurchaseReturns: Array<CreatePaymentPurchaseReturnInput>;
  purchaseReturnDetails: Array<CreatePurchaseReturnDetailInput>;

};
export const createPurchaseReturn = async (
  input: CreatePurchaseReturnInput,
  ctx: TenantContext
) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "purchase-return",
    action: "create"
  });
  const {
    paymentPurchaseReturns,
    purchaseReturnDetails,
    ...data
  } = input;
  let details = {};
  if (purchaseReturnDetails && purchaseReturnDetails.length) {
    const productWarehouse = await getProductWarehouse(
      ctx,
      purchaseReturnDetails,
      data.warehouseId
    );
    if (data.status === "Received") {
      const updatePw = purchaseReturnDetails
        .map((v) => {
          const pw = getOneProductWarehouse(productWarehouse, {
            productId: v.productId,
            productVariantId: v.productVariantId,
            warehouseId: data.warehouseId!,
          });

          if (!pw) return null;
          //console.log("quantity",pw!.qty);
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

    details = {
      purchaseReturnDetails: {
        createMany: {
          skipDuplicates: true,
          data: purchaseReturnDetails.map((v) => ({
            ...v,
            tenantId,
          })),
        },
      },
    };
  }

  let paymentData = {};
  if (paymentPurchaseReturns && paymentPurchaseReturns.length) {
    paymentData = {
      paymentPurchaseReturns: {
        createMany: {
          skipDuplicates: true,
          data: paymentPurchaseReturns.map((v) => ({
            ...v,
            tenantId,
            userId,
          })),
        },
      },
    };
  }
  return ctx.tx!.purchaseReturn.create({
    include,
    data: { tenantId: tenantId, userId, ...data, ...details, ...paymentData },
  });
};

export type UpdatePurchaseReturnDetailInput = {
  id?: number;
  cost?: number;
  purchaseUnitId?: number;
  taxNet?: number;
  taxMethod?: string;
  discount?: number;
  discountMethod?: string;
  total?: number;
  quantity?: number;
  productId?: number;
  productVariantId?: number;
  imeiNumber?: string;
};

export type UpdatePaymentPurchaseReturnInput = {
  id?: number;
  userId?: string;
  date?: Date;
  ref?: string;
  amount?: number;
  change?: number;
  reglement?: string;
  notes?: string;
};

export type UpdatePurchaseReturnInput = {
  id: number;
  userId?: string;
  date?: Date;
  ref?: string;
  supplierId?: number;
  warehouseId?: number;
  taxRate?: number;
  taxNet?: number;
  discount?: number;
  shipping?: number;
  grandTotal?: number;
  paidAmount?: number;
  paymentStatus?: string;
  status?: string;
  notes?: string;
  paymentPurchaseReturns: Array<UpdatePaymentPurchaseReturnInput>;
  purchaseReturnDetails: Array<UpdatePurchaseReturnDetailInput>;

};
export const updatePurchaseReturn = async (
  input: UpdatePurchaseReturnInput,
  ctx: TenantContext
) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "purchase-return",
    action: "update"
  });
  const {
    id,
    paymentPurchaseReturns,
    purchaseReturnDetails,
    ...data
  } = input;
  const purchaseReturn = await ctx.tx!.purchaseReturn.findUnique({
    where: { id,recordStatus:RecordStatus.ACTIVE },
    include
  });
  let details = {};
  if (purchaseReturnDetails && purchaseReturn && purchaseReturnDetails.length) {
    const productWarehouse = await getProductWarehouse(
      ctx,
      purchaseReturn.purchaseReturnDetails,
      data.warehouseId!
    );
    //revert old details
    const updateProductWarehouse = purchaseReturn.purchaseReturnDetails
      .map((v) => {
        const productId = v.productId;
        const productVariantId = v.productVariantId;
        const warehouseId = purchaseReturn.warehouseId;
        const pw = getOneProductWarehouse(productWarehouse, {
          warehouseId: warehouseId,
          productId,
          productVariantId,
        });
        if (!pw || purchaseReturn.status !== "Received") return null;

        return ctx.tx!.productWarehouse.update({
          where: { id: pw!.id },
          data: {
            qty: pw.qty + v.quantity,
          },
        });
      })
      .filter((v) => v !== null);
    await Promise.allSettled(updateProductWarehouse);

    // const savedDetails = purchaseReturn.purchaseReturnDetails.map((v) => v.id);
    const detailsToDelete = purchaseReturn.purchaseReturnDetails //.filter((v) => !PurchaseReturnDetails.find((s)=>s.id===v.id))
      .map((v) => ({ id: v.id }));
    const detailsToCreate = purchaseReturnDetails //.filter((v) => !savedDetails.includes(v.id??-1))
      .map((v) => {
        const { id, ...rest } = v;
        return { ...rest, tenantId };
      });

    details = {
      purchaseReturnDetails: {
        createMany: { data: detailsToCreate },
        deleteMany: detailsToDelete,
      },
    };

    const productWarehouse2 = await getProductWarehouse(
      ctx,
      purchaseReturnDetails,
      data.warehouseId!
    );

    //update prod warehouse with new details
    const updateProductWarehouse2 = detailsToCreate.map((v) => {
      const productId = v.productId!;
      const productVariantId = v.productVariantId;
      const warehouseId = purchaseReturn.warehouseId!;
      const pw = getOneProductWarehouse(productWarehouse2, {
        warehouseId,
        productId,
        productVariantId,
      });
      if (!pw || data.status !== "Received") return null;

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
  if (
    paymentPurchaseReturns &&
    purchaseReturn &&
    paymentPurchaseReturns.length
  ) {
    const savedDetails = purchaseReturn.paymentPurchaseReturns.map((v) => v.id);
    const paymentToDelete = purchaseReturn.paymentPurchaseReturns
      .filter((v) => !paymentPurchaseReturns.find((s) => s.id === v.id))
      .map((v) => ({ id: v.id }));
    const detailsToCreate = paymentPurchaseReturns
      .filter((v) => !savedDetails.includes(v.id ?? -1))
      .map((v) => ({ ...v, tenantId }));
    paymentData = {
      paymentPurchaseReturns: {
        createMany: { data: detailsToCreate },
        deleteMany: paymentToDelete,
      },
    };
  }

  return ctx.tx!.purchaseReturn.update({
    include,
    where: {
      id: id,recordStatus:RecordStatus.ACTIVE
    },
    data: {
      ...data,
      ...details,
      ...paymentData,
    },
  });
};
export type PurchaseReturnId = number;
export type PurchaseReturnIds = Array<number>;
export const getUniquePurchaseReturn = async (
  id: PurchaseReturnId,
  ctx: TenantContext
) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "purchase-return",
    action: "view"
  });
  return ctx.tx!.purchaseReturn.findUnique({
    include,
    where: {
      id: id,recordStatus:RecordStatus.ACTIVE
    },
  });
};
export const deletePurchaseReturn = async (
  id: PurchaseReturnId,
  ctx: TenantContext
) => {
  return ctx.tx!.purchaseReturn.update({
    include,
    where: {
      id: id,
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};
export const deleteManyPurchaseReturn = async (
  ids: PurchaseReturnIds,
  ctx: TenantContext
) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "purchase-return",
    action: "delete"
  });
  return ctx.tx!.purchaseReturn.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};

export const findManyPurchaseReturn = async (
  input: Omit<Prisma.PurchaseReturnFindManyArgs, "select" | "include">,
  ctx: TenantContext
) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "purchase-return",
    action: "view"
  });
  const {where,...rest} = input;
  return ctx.tx!.purchaseReturn.findMany({
    include,
    where:{...where,recordStatus:RecordStatus.ACTIVE},
    ...rest,
  });
};
