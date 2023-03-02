import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";

export type CreateCompanyInput = {
  name: string     
  email?:  string
  phone?: string
  country?: string
  city?: string
  address?: string
  tenantId: string
}
export const createCompany = async (input: CreateCompanyInput,ctx:TenantContext) => {
    const { tenantId, ...data } = input;
    return ctx.tx!.company.create({
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
export const updateCompany = async (input: UpdateCompanyInput,ctx:TenantContext) => {
    const { id, ...data } = input;
    return ctx.tx!.company.update({
        where: {
            id: id,recordStatus:RecordStatus.ACTIVE 
        },        
        data: { ...data }
    })
};
export type CompanyId = number
export type CompanyIds = Array<number>
export const getUniqueCompany = async (id: CompanyId,ctx:TenantContext) => {
    return ctx.tx!.company.findUnique({
        where: {
            id: id,recordStatus:RecordStatus.ACTIVE 
        }        
    })
};
export const deleteCompany = async (id: CompanyId,ctx:TenantContext) => {

    return ctx.tx!.company.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyCompany = async (ids: CompanyIds,ctx:TenantContext) => {
    return ctx.tx!.company.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCompany = async  (input: Omit<Prisma.CompanyFindManyArgs, "select"|"include">,ctx:TenantContext ) => {
   const {where,...rest} = input
    return ctx.tx!.company.findMany({
        where:{...where,recordStatus:RecordStatus.ACTIVE },
        ...rest
      }
    );
}