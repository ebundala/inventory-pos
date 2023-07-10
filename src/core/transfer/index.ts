import { prisma } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";
import {
  getOneProductWarehouse,
  getProductWarehouse,
} from "../util/getProductWarehouse";
const include = {
  fromWarehouse: true,
  toWarehouse: true,
  user: true,
  transferDetails: {
    include: {
      product: {
        include: {
          productWarehouse: true,
          productUnit:true,
          productsSaleUnit:true,
          productPurchaseUnit:true,
        },
      },
      productVariant: true,
      unit: true,
    },
  },
};
export type CreateTransferDetailInput = {
  productId: number;
  productVariantId?: number;
  cost: number;
  purchaseUnitId?: number;
  taxNet?: number;
  taxMethod?: string;
  discount?: number;
  discountMethod?: string;
  quantity: number;
  total: number;
};

export type CreateTransferInput = {
  userId: string;
  ref: string;
  date: Date;
  fromWarehouseId: number;
  toWarehouseId: number;
  items: number;
  taxRate?: number;
  taxNet?: number;
  discount?: number;
  shipping?: number;
  grandTotal: number;
  status: string;
  notes?: string;
  transferDetails?: Array<CreateTransferDetailInput>;
  tenantId: string;
};
export const createTransfer = async (
  input: CreateTransferInput,
  ctx: TenantContext
) => {
  const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "transfer",
    action: "create"
  });
  const { tenantId:_, transferDetails, ...data } = input;
  let details = {};
  if (transferDetails && transferDetails.length) {
    if (data.status === "Completed") {
      //remove from warehouse

      const productWarehouse = await getProductWarehouse(
        ctx,
        transferDetails,
        data.fromWarehouseId
      );

      const updatePw = transferDetails
        .map((v) => {
          const pw = getOneProductWarehouse(productWarehouse, {
            productId: v.productId,
            productVariantId: v.productVariantId,
            warehouseId: data.fromWarehouseId!,
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

    //Add to warehouse
    const productWarehouse2 = await getProductWarehouse(
      ctx,
      transferDetails,
      data.toWarehouseId
    );

    const updatePw2 = transferDetails
      .map((v) => {
        const pw = getOneProductWarehouse(productWarehouse2, {
          productId: v.productId,
          productVariantId: v.productVariantId,
          warehouseId: data.toWarehouseId!,
        });

        if (!pw) return null;
        //console.log("quantity",pw!.qty);
        return ctx.tx!.productWarehouse.update({
          where: { id: pw!.id },
          data: {
            qty: pw!.qty + v.quantity,
          },
        });
      })
      .filter((v) => v);
    await Promise.allSettled(updatePw2);

    details = {
      transferDetails: {
        createMany: {
          skipDuplicates: true,
          data: transferDetails.map((v) => ({
            ...v,
            tenantId,
          })),
        },
      },
    };
  }
  return ctx.tx!.transfer.create({
    include,
    data: { tenantId: tenantId, ...data, ...details },
  });
};
export type UpdateTransferDetailInput = {
  id?: number;
  productId?: number;
  productVariantId?: number;
  cost?: number;
  purchaseUnitId?: number;
  taxNet?: number;
  taxMethod?: string;
  discount?: number;
  discountMethod?: string;
  quantity?: number;
  total?: number;
};
export type UpdateTransferInput = {
  id: number;
  userId?: string;
  ref?: string;
  date?: Date;
  fromWarehouseId?: number;
  toWarehouseId?: number;
  items?: number;
  taxRate?: number;
  taxNet?: number;
  discount?: number;
  shipping?: number;
  grandTotal?: number;
  status: string;
  notes?: string;
  transferDetails?: Array<UpdateTransferDetailInput>;
  tenantId: string;
};
export const updateTransfer = async (
  input: UpdateTransferInput,
  ctx: TenantContext
) => {
  const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "transfer",
    action: "update"
  });
  const { tenantId:_, id, transferDetails, ...data } = input;

  const transfer = await ctx.tx!.transfer.findUnique({
    where: { id, recordStatus: RecordStatus.ACTIVE },
    include: {
      transferDetails: true,
    },
  });

  let details = {};
  if (transferDetails && transfer && transferDetails.length) {
    //revert old details
    if (transfer.status === "Completed") {
      //add from warehouse

      const oldProductWarehouse = await getProductWarehouse(
        ctx,
        transferDetails,
        transfer.fromWarehouseId!
      );

      const updatePw = transferDetails
        .map((v) => {
          const pw = getOneProductWarehouse(oldProductWarehouse, {
            productId: v.productId!,
            productVariantId: v.productVariantId,
            warehouseId: transfer.fromWarehouseId!,
          });

          if (!pw) return null;
          //console.log("quantity",pw!.qty);
          return ctx.tx!.productWarehouse.update({
            where: { id: pw!.id },
            data: {
              qty: pw!.qty + v.quantity!,
            },
          });
        })
        .filter((v) => v);
      await Promise.allSettled(updatePw);

      //remove to warehouse
      const oldProductWarehouse2 = await getProductWarehouse(
        ctx,
        transferDetails,
        transfer.toWarehouseId!
      );

      const updatePw2 = transferDetails
        .map((v) => {
          const pw = getOneProductWarehouse(oldProductWarehouse2, {
            productId: v.productId!,
            productVariantId: v.productVariantId,
            warehouseId: transfer.toWarehouseId!,
          });

          if (!pw) return null;
          //console.log("quantity",pw!.qty);
          return ctx.tx!.productWarehouse.update({
            where: { id: pw!.id },
            data: {
              qty: pw!.qty - v.quantity!,
            },
          });
        })
        .filter((v) => v);
      await Promise.allSettled(updatePw2);
    }

    //const savedDetails=transfer.transferDetails.map((v)=>v.id);
    const detailsToDelete = transfer.transferDetails
      /// .filter((v)=>!transferDetails.find((s)=>s.id===v.id))
      .map((v) => ({ id: v.id }));

    const detailsToCreate = transferDetails
      // .filter((v)=>!savedDetails.find((s)=>s===v.id))
      .map((v) => {
        const { id, ...rest } = v;
        return { ...rest, tenantId };
      });

    // const detailsToUpdate = transferDetails
    //     .filter((v) => savedDetails.find((s) => v.id === s))
    //     .map((v) => {
    //         const { id, productVariantId,...rest } = v;
    //         return { where: { id: id }, data: rest };
    //     })

    details = {
      transferDetails: {
        createMany: { data: detailsToCreate },
        deleteMany: detailsToDelete,
        //  updateMany:detailsToUpdate
      },
    };

    //add new details
    if (data.status === "Completed") {
      //remove from warehouse

      const productWarehouse = await getProductWarehouse(
        ctx,
        transferDetails,
        data.fromWarehouseId!
      );

      const updatePw = transferDetails
        .map((v) => {
          const pw = getOneProductWarehouse(productWarehouse, {
            productId: v.productId!,
            productVariantId: v.productVariantId,
            warehouseId: data.fromWarehouseId!,
          });

          if (!pw) return null;
          //console.log("quantity",pw!.qty);
          return ctx.tx!.productWarehouse.update({
            where: { id: pw!.id },
            data: {
              qty: pw!.qty - v.quantity!,
            },
          });
        })
        .filter((v) => v);
      await Promise.allSettled(updatePw);

      //add to warehouse
      const productWarehouse2 = await getProductWarehouse(
        ctx,
        transferDetails,
        data.toWarehouseId!
      );

      const updatePw2 = transferDetails
        .map((v) => {
          const pw = getOneProductWarehouse(productWarehouse2, {
            productId: v.productId!,
            productVariantId: v.productVariantId,
            warehouseId: data.toWarehouseId!,
          });

          if (!pw) return null;
          //console.log("quantity",pw!.qty);
          return ctx.tx!.productWarehouse.update({
            where: { id: pw!.id },
            data: {
              qty: pw!.qty + v.quantity!,
            },
          });
        })
        .filter((v) => v);
      await Promise.allSettled(updatePw2);
    }
  }
  return ctx.tx!.transfer.update({
    include,
    where: {
      id: id,
      recordStatus: RecordStatus.ACTIVE,
    },
    data: { ...data, ...details },
  });
};
export type TransferId = number;
export type TransferIds = Array<number>;
export const getUniqueTransfer = async (id: TransferId, ctx: TenantContext) => {
  const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "transfer",
    action: "view"
  });
  return ctx.tx!.transfer.findUnique({
    include,
    where: {
      id: id,
      recordStatus: RecordStatus.ACTIVE,
    },
  });
};
export const deleteTransfer = async (id: TransferId, ctx: TenantContext) => {
  const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "transfer",
    action: "delete"
  });
  return ctx.tx!.transfer.update({
    include,
    where: {
      id: id,
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};
export const deleteManyTransfer = async (
  ids: TransferIds,
  ctx: TenantContext
) => {
  const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "transfer",
    action: "delete"
  });
  return ctx.tx!.transfer.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};

export const findManyTransfer = async (
  input: Omit<Prisma.TransferFindManyArgs, "select" | "include">,
  ctx: TenantContext
) => {
  const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "transfer",
    action: "view"
  });
  const { where, ...rest } = input;
  return ctx.tx!.transfer.findMany({
    include,
    where: { ...where, recordStatus: RecordStatus.ACTIVE },
    ...rest,
  });
};
