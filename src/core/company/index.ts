import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";

export type CreateCompanyInput = {
  name: string     
  email?:  string
  phone?: string
  country?: string
  city?: string
  address?: string
  tenantId: string
}
export const createCompany = async (input: CreateCompanyInput) => {
    const { tenantId, ...data } = input;
    return prisma!.company.create({
        data:{tenantId:tenantId,...data}
   })
}
export type UpdateCompanyInput = {
    id: number
    name?: string     
    email?:  string
    phone?: string
    country?: string
    city?: string
    address?: string
}
export const updateCompany = async (input: UpdateCompanyInput) => {
    const { id, ...data } = input;
    return prisma!.company.update({
        where: {
            id: id
        },        
        data: { ...data }
    })
};
export type CompanyId = number
export type CompanyIds = Array<number>
export const getUniqueCompany = async (id: CompanyId) => {
    return prisma!.company.findUnique({
        where: {
            id: id
        }        
    })
};
export const deleteCompany = async (id: CompanyId) => {

    return prisma!.company.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyCompany = async (ids: CompanyIds) => {
    return prisma!.company.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCompany = async  (input: Omit<Prisma.CompanyFindManyArgs, "select"|"include"> ) => {
   
    return prisma!.company.findMany(
        input
    );
}