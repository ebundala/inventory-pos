import { prisma, unimplimented } from "@/core";
import { Prisma, ProcessStatus, RecordStatus, Tenant } from "@prisma/client";

 type TenantExclude = "tenantId" | "createdAt" | "updatedAt" | "recordStatus";
export type TenantCreateInput = Partial<Omit<Tenant, TenantExclude>> & {
    userId: string,
    subdomain: string
};
export type CreateTenantResult = ReturnType<typeof createTenant>;
export const createTenant = async (input: TenantCreateInput) => {
    const { userId, ...data } = input;
    return prisma!.tenant.create(
        {
            include: {
                members: true
            },
            data: {
                ...data,
                members: {
                    connect: {
                        id: userId
                    }
                }
            }
        }
    )
};


type TenantUpdateExclude = "createdAt" | "updatedAt" | "recordStatus";
export type TenantUpdateInput = Partial<Omit<Tenant, TenantUpdateExclude>> & {
    tenantId: string
}
export type UpdateTenantResult = ReturnType<typeof updateTenant>;
export const updateTenant = async (input: TenantUpdateInput) => {
    const { tenantId, ...data } = input;
    //TODO handle images uploads
    return prisma!.tenant.update(
        {
            include: {
                members: true
            },
            where: {
                tenantId: tenantId,
            },
            data
        }
    )
}
export type TenantId=string;
export type UniqueTenantResult = ReturnType<typeof getUniqueTenant>;
export const getUniqueTenant = async (id: TenantId) => {
    return prisma!.tenant.findUnique(
        {
            include: {
                members: true,
            },
            where: {
                tenantId: id
            },

        }
    )
};

export type DeleteTenantResult = ReturnType<typeof deleteTenant>;
export const deleteTenant = async (id: TenantId) => {
    return prisma!.tenant.update(
        {
            include: {
                members: true
            },
            where: {
                tenantId: id
            },
            data: {
                recordStatus: RecordStatus.DELETED
            }
        }
    )
};
export type TenantIds=Array<string>
export type DeleteManyTenantResult = ReturnType<typeof deleteManyTenant>;
export const deleteManyTenant = async (ids: TenantIds) => {
    return prisma!.tenant.updateMany(
        {

            where: {
                tenantId: {
                    in: ids
                }
            },
            data: {
                recordStatus: RecordStatus.DELETED
            }
        }
    )
};


export type TenantSeachInput = Pick<Prisma.TenantWhereInput, Prisma.TenantScalarFieldEnum> & {
    members?: Array<string>,
    orderBy?: [Pick<Prisma.TenantOrderByWithRelationInput, Prisma.TenantScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: string,
    search?: string,
};
export type FindManyTenantResult = ReturnType<typeof findManyTenant>;
export const findManyTenant = async (input: TenantSeachInput) => {
    const { members, orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.TenantWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.TenantScalarFieldEnum).map((v) => ({
            [v]: { contains: search }
        }));

        query = {
            OR: terms
        };
    }

    return prisma!.tenant.findMany(
        {
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { tenantId: cursor } : undefined,


        }
    );
};
export type InviteMemberInput = {
    message?:string,
    tenantId:string,userId:string,email:string
}
export type InviteMemberResult = ReturnType<typeof inviteMember>
export const inviteMember = async(input:InviteMemberInput)=>{
//Todo add message field
const {tenantId,userId,email,message} = input;
return prisma!.tenantInvite.create({
    include:{
        tenant:true,
        invitor:true
    },
    data:{
        tenantId:tenantId,
        invitorId:userId,
        email:email
    }
})
};
export type TenantEmailWhereInput = {
    email: string,
    tenantId: string
}
export type AcceptInviteResult = ReturnType<typeof acceptInvite>
export const acceptInvite = async(input:TenantEmailWhereInput)=>{
    //TODO link user to tenant
    return prisma!.tenantInvite.update({
        include:{
            tenant:true,
            invitor:true
        },
        where:{
            tenantId_email:input
        },
        data:{
            status:ProcessStatus.APPROVED
        }
    })
};
export const rejectInvite = async(input:TenantEmailWhereInput)=>{
    return prisma!.tenantInvite.update({
        include:{
            tenant:true,
            invitor:true
        },
        where:{
            tenantId_email:input
        },
        data:{
            status:ProcessStatus.DENIED
        }
    })
};

export type TenantMemberWhereInput = {
    tenantId:string,userId:string
}

export type RemoveTenantMemberReault = ReturnType<typeof removeMember>
export const removeMember = async(input:TenantMemberWhereInput)=>{
    const {tenantId,userId}=input;
return prisma!.tenant.update({
    include:{
        members:true
    },
    where:{
        tenantId:tenantId
    },
    data:{
        members:{
            disconnect:{
                id:userId
            }
        }
    }
})
};

export type LeaveTenantResult = ReturnType<typeof leaveTenant> 
export const leaveTenant = async(input:TenantMemberWhereInput)=>{
    const {tenantId,userId}=input;
return prisma!.user.update({
    include:{
        tenants:true
    },
    where:{
        id:userId
    },
    data:{
        tenants:{
            disconnect:{
                tenantId:tenantId
            }
        }
    }
})
};

export const subscribeToPlan = unimplimented;
export const cancelSubscriptionPlan = unimplimented;
// TODO add billing and analytics for tenant
