import { prisma } from "@/core";
import { Prisma, ProductWarehouse, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";
import { getProductWarehouse,getOneProductWarehouse } from "../util/getProductWarehouse";
const include = {
  user: true,
  warehouse: true,
  adjustmentDetails: {
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

export type CreateAdjustmentDetailsInput = {
  productId: number;
  productVariantId?: number;
  quantity: number;
  type: string;
};
export type CreateAdjustmentInput = {
  date: Date;
  ref: string;
  warehouseId: number;
  items?: number;
  notes?: string;
  adjustmentDetails: Array<CreateAdjustmentDetailsInput>;
 
};
export const createAdjustment = async (
  input: CreateAdjustmentInput,
  ctx: TenantContext
) => {
  const {  adjustmentDetails, ...data } = input;
  const {enforcer,session,tenantId}=ctx
  const userId = session!.user.id!
  await enforceHelper({
    enforcer,
    tenantId,
    userId: session!.user.id!,
    resource: "adjustment",
    action: "create"
  })
  const adjustment = await ctx.tx!.adjustment.create({
    include,
    data: {
      tenantId: tenantId,
      userId,
      ...data,
      adjustmentDetails: {
        createMany: {
          data: adjustmentDetails.map((v) => ({ tenantId, ...v })),
        },
      },
    },
  });
  const productWarehouse = await getProductWarehouse(ctx,adjustmentDetails,data.warehouseId);


  const pwData = adjustmentDetails
    .map((d) => {
      const pw = getOneProductWarehouse(productWarehouse,{
        warehouseId:data.warehouseId,
        productId:d.productId,
        productVariantId:d.productVariantId
      })
      
      if (!pw) return null;
      if (d.type === "Addition") {
        return {
          where: { id: pw.id },
          data: {
            qty: pw!.qty + d.quantity,
          },
        };
      } else {
        return {
          where: { id: pw.id },
          data: {
            qty: pw!.qty - d.quantity,
          },
        };
      }
    })
    .filter((v) => v != null)
    .map((v) => ctx.tx!.productWarehouse.update(v!));
  await Promise.allSettled(pwData);
  return adjustment;
};

export type UpdateAdjustmentDetailsInput = {
  id: number;
  productId?: number;
  productVariantId?: number;
  quantity?: number;
  type?: string;
};
export type UpdateAdjustmentInput = {
  id: number;
  userId?: string;
  date?: Date;
  ref?: string;
  warehouseId?: number;
  items?: number;
  notes?: string;
  adjustmentDetails?: Array<UpdateAdjustmentDetailsInput>;
  // tenantId: string
};
export const updateAdjustment = async (
  input: UpdateAdjustmentInput,
  ctx: TenantContext
) => {
  const { id, adjustmentDetails, ...data } = input;
  const {enforcer,session,tenantId}=ctx
  await enforceHelper({
    enforcer,
    tenantId,
    userId: session!.user.id!,
    resource: "adjustment",
    action: "update"
  })
  const adjustment = await ctx.tx!.adjustment.findUnique({
    where: { id,recordStatus:RecordStatus.ACTIVE },
    include: {
      adjustmentDetails: {
        include: {
          product: true,
          productVariant: true,
        },
      },
    },
  });
  let details = {};
  if (
    adjustmentDetails &&
    adjustment &&
    adjustment.adjustmentDetails &&
    adjustment.adjustmentDetails.length
  ) {
    const productWarehouse = await getProductWarehouse(
      ctx,
      adjustmentDetails,
      data.warehouseId!
    );

    // const savedadjustments = adjustment.adjustmentDetails.map((v) => v.id);

    //revert old details
    const updateProductWarehouse = adjustment.adjustmentDetails
      .map((v) => {
        const productId = v.productId;
        const productVariantId = v.productVariantId;
        const warehouseId = adjustment.warehouseId;
        const pw = getOneProductWarehouse(productWarehouse,{warehouseId:data!.warehouseId!,productId,productVariantId});
        ;
        if (!pw) return null;

        if (v.type === "Addition") {
          return ctx.tx!.productWarehouse.update({
            where: { id: pw!.id },
            data: {
              qty: pw.qty - v.quantity,
            },
          });
        } else {
          return ctx.tx!.productWarehouse.update({
            where: { id: pw!.id },
            data: {
              qty: pw.qty + v.quantity,
            },
          });
        }
      })
      .filter((v) => v !== null);
    await Promise.allSettled(updateProductWarehouse);
    //
    const adjustmentToDelete = adjustment.adjustmentDetails
      //.filter((v) => !adjustmentDetails.find((s) => s.id === v.id))
      .map((v) => ({ id: v.id }));

    // const adjustmentToUpdate = adjustment.adjustmentDetails
    //   .filter((v) => adjustmentDetails.find((s) => s.id === v.id))
    //   .map((v) => {
    //     const { id, adjustmentId, productVariantId, ...rest } = v;

    //     return {
    //     where: { id: id },
    //     data: rest };
    //   });

    const adjustmentsToCreate = adjustmentDetails
      // .filter((v) => !savedadjustments.find((s) => s === v.id))
      .map((v) => {
        const { id, productVariantId: variantId, ...rest } = v;
        const productVariantId = variantId ? variantId : undefined;
        return { ...rest, productVariantId, tenantId };
      });

    details = {
      adjustmentDetails: {
        createMany: {
          skipDuplicates: true,
          data: adjustmentsToCreate,
        },
        deleteMany: adjustmentToDelete,
        // updateMany: adjustmentToUpdate,
      },
    };
    const productWarehouse2 = await getProductWarehouse(
      ctx,
      adjustmentDetails,
      data.warehouseId!
    );

    //update prod warehouse with new details
    const updateProductWarehouse2 = adjustmentsToCreate
      .map((v) => {
        const productId = v.productId!;
        const productVariantId = v.productVariantId;
        const warehouseId = adjustment.warehouseId!;
        const pw = getOneProductWarehouse(productWarehouse2,{warehouseId,productId,productVariantId});
        if (!pw) return null;
        if (v.type === "Addition") {
          return ctx.tx!.productWarehouse.update({
            where: { id: pw!.id },
            data: {
              qty: pw.qty + v.quantity!,
            },
          });
        } else {
          return ctx.tx!.productWarehouse.update({
            where: { id: pw!.id },
            data: {
              qty: pw.qty - v.quantity!,
            },
          });
        }
      })
      .filter((v) => v !== null);
    await Promise.allSettled(updateProductWarehouse2);
  }
  return ctx.tx!.adjustment.update({
    include,
    where: {
      id: id,recordStatus:RecordStatus.ACTIVE 
    },
    data: {
      ...data,
      ...details,
    },
  });
};

export type AdjustmentId = number;
export type AdjustmentIds = Array<number>;
export const getUniqueAdjustment = async (
  id: AdjustmentId,
  ctx: TenantContext
) => {
  const {enforcer,session,tenantId}=ctx

  await enforceHelper({
    enforcer,
    tenantId,
    userId: session!.user.id!,
    resource: "adjustment",
    action: "view"
  })
  return ctx.tx!.adjustment.findUnique({
    include,
    where: {
      id: id,recordStatus:RecordStatus.ACTIVE 
    },
  });
};
export const deleteAdjustment = async (
  id: AdjustmentId,
  ctx: TenantContext
) => {
  const {enforcer,session,tenantId}=ctx

  await enforceHelper({
    enforcer,
    tenantId,
    userId: session!.user.id!,
    resource: "adjustment",
    action: "delete"
  })
  return ctx.tx!.adjustment.update({
    include,
    where: {
      id: id,
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};
export const deleteManyAdjustment = async (
  ids: AdjustmentIds,
  ctx: TenantContext
) => {
  const {enforcer,session,tenantId}=ctx

  await enforceHelper({
    enforcer,
    tenantId,
    userId: session!.user.id!,
    resource: "adjustment",
    action: "delete"
  })
  return ctx.tx!.adjustment.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};

export const findManyAdjustment = async (
  input: Omit<Prisma.AdjustmentFindManyArgs, "select" | "include">,
  ctx: TenantContext
) => {
  const {enforcer,session,tenantId}=ctx

  await enforceHelper({
    enforcer,
    tenantId,
    userId: session!.user.id!,
    resource: "adjustment",
    action: "view"
  })
  const {where,...rest} = input
  return ctx.tx!.adjustment.findMany({
    where:{...where,recordStatus:RecordStatus.ACTIVE },
    include,
    ...rest,
  });
};

