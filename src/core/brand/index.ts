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
export type BrandId = number
export type BrandIds = Array<number>
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
export const deleteManyBrand = async (ids: BrandIds) => {
    return prisma!.brand.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyBrand = async  (input: Omit<Prisma.BrandFindManyArgs, "select"|"include"> ) => {
    
    return prisma!.brand.findMany(
       input
    );
}