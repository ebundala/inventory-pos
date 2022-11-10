import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";

export type CreateCategoryInput = {
  name: string     
  code:  string
  tenantId: string
}
export const createCategory = async (input: CreateCategoryInput) => {
    const { tenantId, ...data } = input;
    return prisma!.category.create({
        data:{tenantId:tenantId,...data}
   })
}
export type UpdateCategoryInput = {
    id: number
    name?: string     
  code?:  string
}
export const updateCategory = async (input: UpdateCategoryInput) => {
    const { id, ...data } = input;
    return prisma!.category.update({
        where: {
            id: id
        },        
        data: { ...data }
    })
};
export type CategoryId = number
export type CategoryIds = Array<number>
export const getUniqueCategory = async (id: CategoryId) => {
    return prisma!.category.findUnique({
        where: {
            id: id
        }        
    })
};
export const deleteCategory = async (id: CategoryId) => {

    return prisma!.category.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyCategory = async (ids: CategoryIds) => {
    return prisma!.category.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCategory = async  (input: Omit<Prisma.CategoryFindManyArgs, "select"|"include"> ) => {
   
    return prisma!.category.findMany(
        input
    );
}