import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";

export type CreateCategoryInput = {
  name: string     
  code:  string
  tenantId: string
}
export const createCategory = async (input: CreateCategoryInput,ctx:TenantContext) => {
    const { tenantId, ...data } = input;
    return ctx.tx!.category.create({
        data:{tenantId:tenantId,...data}
   })
}
export type UpdateCategoryInput = {
    id: number
    name?: string     
  code?:  string
}
export const updateCategory = async (input: UpdateCategoryInput,ctx:TenantContext) => {
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
    return ctx.tx!.category.findUnique({
        where: {
            id: id,recordStatus:RecordStatus.ACTIVE 
        }        
    })
};
export const deleteCategory = async (id: CategoryId,ctx:TenantContext) => {

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
   const {where,...rest}=input;
    return ctx.tx!.category.findMany({
        where:{...where,recordStatus:RecordStatus.ACTIVE },
        ...rest
      }
    );
}