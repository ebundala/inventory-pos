import { prisma } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";

export type CreateBrandInput = {
  name: string;
  description?: string;
  image?: string;
  tenantId: string;
};
export const createBrand = async (
  input: CreateBrandInput,
  ctx: TenantContext
) => {
  const { tenantId, ...data } = input;
  return ctx.tx!.brand.create({
    data: { tenantId: tenantId, ...data },
  });
};
export type UpdateBrandInput = {
  id: number;
  name?: string;
  description?: string;
  image?: string;
};
export const updateBrand = async (
  input: UpdateBrandInput,
  ctx: TenantContext
) => {
  const { id, ...data } = input;
  return ctx.tx!.brand.update({
    where: {
      id: id,
      recordStatus: RecordStatus.ACTIVE,
    },
    data: { ...data },
  });
};
export type BrandId = number;
export type BrandIds = Array<number>;
export const getUniqueBrand = async (id: BrandId, ctx: TenantContext) => {
  return ctx.tx!.brand.findUnique({
    where: {
      id: id,
      recordStatus: RecordStatus.ACTIVE,
    },
  });
};
export const deleteBrand = async (id: BrandId, ctx: TenantContext) => {
  return ctx.tx!.brand.update({
    where: {
      id: id,
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};
export const deleteManyBrand = async (ids: BrandIds, ctx: TenantContext) => {
  return ctx.tx!.brand.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};

export const findManyBrand = async (
  input: Omit<Prisma.BrandFindManyArgs, "select" | "include">,
  ctx: TenantContext
) => {
  const { where, ...rest } = input;
  return ctx.tx!.brand.findMany({
    where: { ...where, recordStatus: RecordStatus.ACTIVE },
    ...rest,
  });
};
