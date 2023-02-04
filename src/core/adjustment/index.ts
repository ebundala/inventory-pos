import { prisma } from "@/core";
import { Prisma, ProductWarehouse, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
const include = {
  user: true,
  warehouse: true,
  adjustmentDetails: {
    include: {
      product: {
        include:{
          productWarehouse:true
        }
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
  userId: string;
  date: Date;
  ref: string;
  warehouseId: number;
  items?: number;
  notes?: string;
  adjustmentDetails: Array<CreateAdjustmentDetailsInput>;
  tenantId: string;
};
export const createAdjustment = async (
  input: CreateAdjustmentInput,
  ctx: TenantContext
) => {
  const { tenantId, adjustmentDetails, ...data } = input;

  const adjustment = await ctx.tx!.adjustment.create({
    include,
    data: {
      tenantId: tenantId,
      ...data,
      adjustmentDetails: {
        createMany: {
          data: adjustmentDetails.map((v) => ({ tenantId, ...v })),
        },
      },
    },
  });
  const productWarehouse = (
    await ctx.tx!.productWarehouse.findMany({
      distinct: [
        Prisma.ProductWarehouseScalarFieldEnum.productId,
        Prisma.ProductWarehouseScalarFieldEnum.warehouseId,
        Prisma.ProductWarehouseScalarFieldEnum.productVariantId,
      ],
      where: {
        OR: adjustmentDetails.map((d) => ({
          warehouseId: data.warehouseId,
          productId: d.productId,
          productVariantId: d.productVariantId,
        })),
      },
    })
  ).reduce(
    (p, c, i, arr) => p.set(`${c.productId}-${c.productVariantId}`, c),
    new Map<string, ProductWarehouse>()
  );

  const pwData = adjustmentDetails
    .map((d) => {
      const pw = productWarehouse.get(`${d.productId}-${d.productVariantId}`);
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
  const { tenantId } = ctx;
  const adjustment = await ctx.tx!.adjustment.findUnique({
    where: { id },
    include: {
      adjustmentDetails: true,
    },
  });
  let details = {};
  if (
    adjustmentDetails &&
    adjustment &&
    adjustment.adjustmentDetails &&
    adjustment.adjustmentDetails.length
  ) {
    const savedadjustments = adjustment.adjustmentDetails.map((v) => v.id);
    const adjustmentToDelete = adjustment.adjustmentDetails
      .filter((v) => !adjustmentDetails.find((s) => s.id === v.id))
      .map((v) => ({ id: v.id }));

    const adjustmentToUpdate = adjustment.adjustmentDetails
      .filter((v) => adjustmentDetails.find((s) => s.id === v.id))
      .map((v) => {
        const { id, adjustmentId, productVariantId, ...rest } = v;

        return { where: { id: id }, data: rest };
      });

    const adjustmentsToCreate = adjustmentDetails
      .filter((v) => !savedadjustments.find((s) => s === v.id))
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
        updateMany: adjustmentToUpdate,
      },
    };
  }
  return ctx.tx!.adjustment.update({
    include,
    where: {
      id: id,
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
  return ctx.tx!.adjustment.findUnique({
    include,
    where: {
      id: id,
    },
  });
};
export const deleteAdjustment = async (
  id: AdjustmentId,
  ctx: TenantContext
) => {
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
  return ctx.tx!.adjustment.findMany({
    include,
    ...input,
  });
};
