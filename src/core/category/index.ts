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
type CategoryId = number
type CategorysId = Array<number>
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
export const deleteManyCategory = async (ids: CategorysId) => {
    return prisma!.category.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCategory = async (input: Pick<Prisma.CategoryWhereInput, Prisma.CategoryScalarFieldEnum> & {
   
    orderBy?: [Pick<Prisma.CategoryOrderByWithRelationInput, Prisma.CategoryScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.CategoryWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.CategoryScalarFieldEnum).filter((v) => ["name", "code"].includes(v)).map((v) => ({
            [v]: { contains: search }
        }));

        query = {
            OR: terms
        };
    };
    return prisma!.category.findMany(
        {
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}