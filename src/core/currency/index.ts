import { prisma, } from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";

export type CreateCurrencyInput = {
    name: string
    code: string
    symbol: string
}
export const createCurrency = async (input: CreateCurrencyInput, ctx: TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "currency",
        action: "create"
    });

    return ctx.tx!.currency.create({
        data: { tenantId, ...input }
    })
}
export type UpdateCurrencyInput = {
    id: number
    name?: string
    code?: string
}
export const updateCurrency = async (input: UpdateCurrencyInput, ctx: TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "currency",
        action: "update"
    });
    const { id, ...data } = input;
    return ctx.tx!.currency.update({
        where: {
            id: id, recordStatus: RecordStatus.ACTIVE
        },
        data: { ...data }
    })
};
export type CurrencyId = number
export type CurrencyIds = Array<number>
export const getUniqueCurrency = async (id: CurrencyId, ctx: TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "currency",
        action: "view"
    });
    return ctx.tx!.currency.findUnique({
        where: {
            id: id, recordStatus: RecordStatus.ACTIVE
        }
    })
};
export const deleteCurrency = async (id: CurrencyId, ctx: TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "currency",
        action: "delete"
    });
    return ctx.tx!.currency.update({
        where: {
            id: id
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyCurrency = async (ids: CurrencyIds, ctx: TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "currency",
        action: "delete"
    });
    return ctx.tx!.currency.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCurrency = async (input: Omit<Prisma.CurrencyFindManyArgs, "select" | "include">, ctx: TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "currency",
        action: "view"
    });
    const { where, ...rest } = input;
    return ctx.tx!.currency.findMany(
        {
            where: { ...where, recordStatus: RecordStatus.ACTIVE },
            ...rest
        }
    );
}