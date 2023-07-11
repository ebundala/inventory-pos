import { prisma } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";
import { getOneProductWarehouse, getProductWarehouse } from "../util/getProductWarehouse";

const include = {
  supplier: true,
  user: true,
  warehouse: true,
  purchaseDetails: {
    include: {
      product: {
        include: {
          productWarehouse: true,
          productUnit: true,
          productPurchaseUnit: true,
          productsSaleUnit: true,
        },
      },
      productVariant: true,
      unit: true,
    },
  },
  paymentPurchases: {
    where: { recordStatus: RecordStatus.ACTIVE }
  },
};
export type CreatePurchaseDetailsInput = {
  cost: number;
  purchaseUnitId?: number;
  taxNet?: number;
  taxMethod?: string;
  discount?: number;
  discountMethod?: string;
  productId: number;
  productVariantId?: number;
  imeiNumber?: string;
  total: number;
  quantity: number;
};

export type CreatePaymentPurchaseInput = {
  date: Date;
  ref: string;
  amount: number;
  change: number;
  reglement: string;
  notes?: string;
};

export type CreatePurchaseInput = {
  userId: string;
  ref: string;
  date: Date;
  supplierId: number;
  warehouseId: number;
  taxRate?: number;
  taxNet?: number;
  discount?: number;
  shipping?: number;
  grandTotal: number;
  paidAmount: number;
  status: string;
  paymentStatus: string;
  notes?: string;
  paymentPurchases: Array<CreatePaymentPurchaseInput>;
  purchaseDetails: Array<CreatePurchaseDetailsInput>;
};
export const createPurchase = async (
  input: CreatePurchaseInput,
  ctx: TenantContext
) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "purchase",
    action: "create"
  });
  const { userId:__, paymentPurchases, purchaseDetails, ...data } =
    input;
  let purchaseData = {};
  if (purchaseDetails && purchaseDetails.length) {
    const productWarehouse = await getProductWarehouse(ctx, purchaseDetails, data.warehouseId);
    if (data.status === "Received") {
      const updatePw = purchaseDetails.map((v) => {
        const pw = getOneProductWarehouse(productWarehouse, {
          productId: v.productId,
          productVariantId: v.productVariantId,
          warehouseId: data.warehouseId!
        });

        if (!pw) return null;
        return ctx.tx!.productWarehouse.update({
          where: { id: pw!.id }, data: {
            qty: pw!.qty + v.quantity
          }
        });
      }).filter((v) => v)
      await Promise.allSettled(updatePw);
    }
    purchaseData = {
      purchaseDetails: {
        createMany: {
          skipDuplicates: true,
          data: purchaseDetails.map((v) => ({
            ...v,
            tenantId,
          })),
        },
      },
    };
  }

  let paymentData = {};

  if (paymentPurchases && paymentPurchases.length) {
    paymentData = {
      paymentPurchases: {
        createMany: {
          skipDuplicates: true,
          data: paymentPurchases.map((v) => ({
            ...v,
            userId,
            tenantId,
          })),
        },
      },
    };
  }

  return ctx.tx!.purchase.create({
    include,
    data: {
      tenantId: tenantId,
      userId: userId,
      ...data,
      ...purchaseData,
      ...paymentData,
    },
  });

};

export type UpdatePurchaseDetailsInput = {
  id?: number;
  cost?: number;
  purchaseUnitId?: number;
  taxNet?: number;
  taxMethod?: string;
  discount?: number;
  discountMethod?: string;
  productId?: number;
  productVariantId?: number;
  imeiNumber?: string;
  total?: number;
  quantity?: number;
};

export type UpdatePaymentPurchaseInput = {
  id?: number;
  userId?: string;
  date?: Date;
  ref?: string;
  amount?: number;
  change?: number;
  reglement?: string;
  notes?: string;
};

export type UpdatePurchaseInput = {
  id: number;
  userId?: string;
  ref?: string;
  date?: Date;
  supplierId?: number;
  warehouseId?: number;
  taxRate?: number;
  taxNet?: number;
  discount?: number;
  shipping?: number;
  grandTotal?: number;
  paidAmount?: number;
  status?: string;
  paymentStatus?: string;
  notes?: string;
  paymentPurchases?: Array<UpdatePaymentPurchaseInput>;
  purchaseDetails?: Array<UpdatePurchaseDetailsInput>;
};
export const updatePurchase = async (
  input: UpdatePurchaseInput,
  ctx: TenantContext
) => {
  
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "purchase",
    action: "update"
  });
  const { id, paymentPurchases, purchaseDetails, ...data } = input;
  const purchase = await ctx.tx!.purchase.findUnique({
    where: { id, recordStatus: RecordStatus.ACTIVE },
    include
  });
  let details = {};
  if (purchaseDetails && purchase && purchaseDetails.length) {


    const productWarehouse = await getProductWarehouse(
      ctx,
      purchaseDetails,
      data.warehouseId!
    );
    //revert old details
    const updateProductWarehouse = purchase.purchaseDetails.map((v) => {
      const productId = v.productId;
      const productVariantId = v.productVariantId;
      const warehouseId = purchase.warehouseId;
      const pw = getOneProductWarehouse(productWarehouse, { warehouseId: warehouseId, productId, productVariantId });
      if (!pw || purchase.status !== "Received") return null;

      return ctx.tx!.productWarehouse.update({
        where: { id: pw!.id }, data: {
          qty: pw.qty - v.quantity
        }
      })

    }).filter(v => v !== null);
    await Promise.allSettled(updateProductWarehouse);

    // const savedDetails = purchase.purchaseDetails.map((v) => v.id);
    const detailsToDelete = purchase.purchaseDetails
      // .filter((v) => !purchaseDetails.find((s) => (s.id = v.id)))
      .map((v) => ({ id: v.id }));

    const detailsToCreate = purchaseDetails
      // .filter((v) => !savedDetails.find((s) => v.id === s))
      .map((v) => {
        const { id, ...rest } = v;
        return { ...rest, tenantId };
      });

    // const detailsToUpdate = purchaseDetails
    //   .filter((v) => savedDetails.find((s) => v.id === s))
    //   .map((v) => {
    //     //TODO find why variant cant update
    //     const { id, productVariantId, ...rest } = v;
    //     return { where: { id: id }, data: rest };
    //   });
    details = {
      purchaseDetails: {
        createMany: { data: detailsToCreate },
        deleteMany: detailsToDelete,
        // updateMany: detailsToUpdate,
      },
    };

    const productWarehouse2 = await getProductWarehouse(
      ctx,
      purchaseDetails,
      data.warehouseId!
    );

    //update prod warehouse with new details
    const updateProductWarehouse2 = detailsToCreate
      .map((v) => {
        const productId = v.productId!;
        const productVariantId = v.productVariantId;
        const warehouseId = purchase.warehouseId!;
        const pw = getOneProductWarehouse(productWarehouse2, { warehouseId, productId, productVariantId });
        if (!pw || data.status !== "Received") return null;

        return ctx.tx!.productWarehouse.update({
          where: { id: pw!.id }, data: {
            qty: pw!.qty + v!.quantity!
          }
        })
      });
    await Promise.allSettled(updateProductWarehouse2);
  }

  let paymentDetails = {};
  if (paymentPurchases && purchase && paymentPurchases.length) {
    const savedDetails = purchase.paymentPurchases.map((v) => v.id);
    const detailsToDelete = purchase.paymentPurchases
      .filter((v) => !paymentPurchases.find((s) => (s.id = v.id)))
      .map((v) => ({ id: v.id }));

    const detailsToCreate = paymentPurchases
      .filter((v) => !savedDetails.find((s) => v.id === s))
      .map((v) => {
        const { id, ...rest } = v;
        return { ...rest, tenantId };
      });

    const detailsToUpdate = paymentPurchases
      .filter((v) => savedDetails.find((s) => v.id === s))
      .map((v) => {
        const { id, ...rest } = v;
        return { where: { id: id }, data: rest };
      });
    paymentDetails = {
      paymentPurchases: {
        createMany: { data: detailsToCreate },
        deleteMany: detailsToDelete,
        updateMany: detailsToUpdate,
      },
    };
  }
  return ctx.tx!.purchase.update({
    include,
    where: {
      id: id, recordStatus: RecordStatus.ACTIVE
    },
    data: { ...data, ...details, ...paymentDetails },
  });
};
export type PurchaseId = number;
export type PurchaseIds = Array<number>;
export const getUniquePurchase = async (id: PurchaseId, ctx: TenantContext) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "purchase",
    action: "view"
  });
  return ctx.tx!.purchase.findUnique({
    include,
    where: {
      id: id,
    },
  });
};
export const deletePurchase = async (id: PurchaseId, ctx: TenantContext) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "purchase",
    action: "delete"
  });
  return ctx.tx!.purchase.update({
    include,
    where: {
      id: id,
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};
export const deleteManyPurchase = async (
  ids: PurchaseIds,
  ctx: TenantContext
) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "purchase",
    action: "delete"
  });
  return ctx.tx!.purchase.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};

export const findManyPurchase = async (
  input: Omit<Prisma.PurchaseFindManyArgs, "select" | "include">,
  ctx: TenantContext
) => {
  const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "purchase",
    action: "view"
  });
  const { where, ...rest } = input;
  return ctx.tx!.purchase.findMany({
    include,
    where: { ...where, recordStatus: RecordStatus.ACTIVE },
    ...rest,
  });
};
