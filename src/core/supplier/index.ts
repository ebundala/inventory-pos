import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";

export type CreateSupplierInput = {
    name: string
    code: number
    email: string
    phone?: string
    country?: string
    city?: string
    address?: string
    tenantId: string
}
export const createSupplier = async (input: CreateSupplierInput,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "supplier",
      action: "create"
    });
    const { tenantId:_, ...data } = input;
    return ctx.tx!.supplier.create({
        data:{tenantId:tenantId,...data}
   })
}
export type UpdateSupplierInput = {
    id: number
    name?: string
    code?: number
    email?: string
    phone?: string
    country?: string
    city?: string
    address?: string
}
export const updateSupplier = async (input: UpdateSupplierInput,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "supplier",
      action: "update"
    });
    const { id, ...data } = input;
    return ctx.tx!.supplier.update({
        where: {
            id: id,  recordStatus:RecordStatus.ACTIVE,
        },        
        data: { ...data }
    })
};
export type SupplierId = number
export type SupplierIds = Array<number>
export const getUniqueSupplier = async (id: SupplierId,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "supplier",
      action: "view"
    });
    return ctx.tx!.supplier.findUnique({
        where: {
            id: id,  recordStatus:RecordStatus.ACTIVE,
        }        
    })
};
export const deleteSupplier = async (id: SupplierId,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "supplier",
      action: "delete"
    });
    return ctx.tx!.supplier.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManySupplier = async (ids: SupplierIds,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "supplier",
      action: "delete"
    });
    return ctx.tx!.supplier.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManySupplier = async (input: Omit<Prisma.SupplierFindManyArgs, "select"|"include"> ,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "supplier",
      action: "view"
    });
    const {where,...rest}=input;
    return ctx.tx!.supplier.findMany(
        {
            ...rest, where:{...where,  recordStatus:RecordStatus.ACTIVE,}
        }
    );
}