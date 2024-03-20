import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";

export type CreateCategoryInput = {
  name: string     
  code:  string
}
export const createCategory = async (input: CreateCategoryInput,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "category",
    action: "create"
  });
    return ctx.tx!.category.create({
        data:{tenantId,...input}
   })
}
export type UpdateCategoryInput = {
    id: number
    name?: string     
  code?:  string
}
export const updateCategory = async (input: UpdateCategoryInput,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "category",
      action: "update"
    });
    const { id, ...data } = input;
    return ctx.tx!.category.update({
        where: {
            id: id,recordStatus:RecordStatus.ACTIVE 
        },        
        data: { ...data }
    })
};
export type CategoryId = number
export type CategoryIds = Array<number>
export const getUniqueCategory = async (id: CategoryId,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "category",
      action: "view"
    });
    return ctx.tx!.category.findUnique({
        where: {
            id: id,recordStatus:RecordStatus.ACTIVE 
        }        
    })
};
export const deleteCategory = async (id: CategoryId,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "category",
      action: "delete"
    });
    return ctx.tx!.category.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyCategory = async (ids: CategoryIds,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "category",
      action: "delete"
    });
    return ctx.tx!.category.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCategory = async  (input: Omit<Prisma.CategoryFindManyArgs, "select"|"include">,ctx:TenantContext ) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "category",
      action: "view"
    });
   const {where,...rest}=input;
    return ctx.tx!.category.findMany({
        where:{...where,recordStatus:RecordStatus.ACTIVE },
        ...rest
      }
    );
}