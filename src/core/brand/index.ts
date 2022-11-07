import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";

export type CreateBrandInput = {
  name: string     
  description?:  string  
  image?: string
  tenantId: string
}
export const createBrand = async (input: CreateBrandInput) => {
    const { tenantId, ...data } = input;
    return prisma!.brand.create({
        data:{tenantId:tenantId,...data}
   })
}
export type UpdateBrandInput = {
  id: number
  name?: string     
  description?:  string  
  image?: string
}
export const updateBrand = async (input: UpdateBrandInput) => {
    const { id, ...data } = input;
    return prisma!.brand.update({
        where: {
            id: id
        },        
        data: { ...data }
    })
};
type BrandId = number
type BrandsId = Array<number>
export const getUniqueBrand = async (id: BrandId) => {
    return prisma!.brand.findUnique({
        where: {
            id: id
        }        
    })
};
export const deleteBrand = async (id: BrandId) => {

    return prisma!.brand.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyBrand = async (ids: BrandsId) => {
    return prisma!.brand.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyBrand = async (input: Pick<Prisma.BrandWhereInput, Prisma.BrandScalarFieldEnum> & {
    
    orderBy?: [Pick<Prisma.BrandOrderByWithRelationInput, Prisma.BrandScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.BrandWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.BrandScalarFieldEnum).filter((v) => ["name", "description","image"].includes(v)).map((v) => ({
            [v]: { contains: search }
        }));

        query = {
            OR: terms
        };
    };
    return prisma!.brand.findMany(
        {
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}