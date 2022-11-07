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
type CompanyId = number
type CompanysId = Array<number>
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
export const deleteManyCompany = async (ids: CompanysId) => {
    return prisma!.company.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCompany = async (input: Pick<Prisma.CompanyWhereInput, Prisma.CompanyScalarFieldEnum> & {
    orderBy?: [Pick<Prisma.CompanyOrderByWithRelationInput, Prisma.CompanyScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const {  orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.CompanyWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.CompanyScalarFieldEnum).filter((v) => ["name", "phone","country","city","email","address"].includes(v)).map((v) => ({
            [v]: { contains: search }
        }));

        query = {
            OR: terms
        };
    };
    return prisma!.company.findMany(
        {
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,
        }
    );
}