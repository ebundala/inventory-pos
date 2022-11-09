import { prisma, unimplimented } from "@/core";
import { Prisma, ProcessStatus, RecordStatus, Tenant } from "@prisma/client";
import cuid from "cuid";

export type TenantCreateInput = {
    /**
     * 
     * @maxLength 50
     */
    name: string;
    /**
     * 
     * @maxLength 160
     */
    description?: string;
    logo?: string;
    image?: string;
    imageBlurhash?: string;
    customDomain?: string;
    userId: string,
    /**
     * @minLength 2
     * @maxLength 50
     */
    subdomain: string
};
export const createTenant = async (input: TenantCreateInput) => {
    const { userId, ...data } = input;
    const id= cuid();
    await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${id}"`)

    return prisma!.tenant.create(
        {
            include: {
                members: true
            },
            data: {
                tenantId:id,
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


export type TenantUpdateInput = {
    tenantId: string
    /**
     * 
     * @maxLength 50
     */
    name?: string;
    /**
     * 
     * @maxLength 160
     */
    description?: string;
    logo?: string;
    image?: string;
    imageBlurhash?: string;
    customDomain?: string;
    /**
     * @minLength 2
     * @maxLength 50
     */
    subdomain?: string
}
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
export type TenantId = string;
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
export type TenantIds = Array<string>
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



export const findManyTenant = async (input: Pick<Prisma.TenantWhereInput, Prisma.TenantScalarFieldEnum> & {
    members?: Array<string>,
    orderBy?: [Pick<Prisma.TenantOrderByWithRelationInput, Prisma.TenantScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: string,
    search?: string,
}) => {
    const { members, orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.TenantWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.TenantScalarFieldEnum).filter((v)=>!["createdAt","updatedAt","recordStatus"].includes(v)).map((v) => ({
            [v]: { contains: search }
        }));

        query = {
            OR: terms
        };
    }

    return prisma!.tenant.findMany(
        {  include:{
            members:true
           },
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { tenantId: cursor } : undefined,


        }
    );
};
export type InviteMemberInput = {
    /**
     * 
     * @maxLength 160
     */
    message?: string,
    tenantId: string,
    userId: string,
    /**
     * 
     * @format email
     */
    email: string
}
export const inviteMember = async (input: InviteMemberInput) => {
    //Todo add message field
    const { tenantId, userId, email, message } = input;
    return prisma!.tenantInvite.create({
        include: {
            tenant: true,
            invitor: true
        },
        data: {
            tenantId: tenantId,
            invitorId: userId,
            email: email
        }
    })
};
export type TenantEmailWhereInput = {
    /**
     * 
     * @format email
     */
    email: string,
    tenantId: string
}
export const acceptInvite = async (input: TenantEmailWhereInput) => {
    //TODO link user to tenant
    return prisma!.tenantInvite.update({
        include: {
            tenant: true,
            invitor: true
        },
        where: {
            tenantId_email: input
        },
        data: {
            status: ProcessStatus.APPROVED
        }
    })
};
export const rejectInvite = async (input: TenantEmailWhereInput) => {
    return prisma!.tenantInvite.update({
        include: {
            tenant: true,
            invitor: true
        },
        where: {
            tenantId_email: input
        },
        data: {
            status: ProcessStatus.DENIED
        }
    })
};

export type TenantMemberWhereInput = {
    tenantId: string,
    userId: string
}

export const removeMember = async (input: TenantMemberWhereInput) => {
    const { tenantId, userId } = input;
    return prisma!.tenant.update({
        include: {
            members: true
        },
        where: {
            tenantId: tenantId
        },
        data: {
            members: {
                disconnect: {
                    id: userId
                }
            }
        }
    })
};

export const leaveTenant = async (input: TenantMemberWhereInput) => {
    const { tenantId, userId } = input;
    return prisma!.user.update({
        include: {
            tenants: true
        },
        where: {
            id: userId
        },
        data: {
            tenants: {
                disconnect: {
                    tenantId: tenantId
                }
            }
        }
    })
};

// TODO add billing and analytics for tenant
export const subscribeToPlan = unimplimented;
export const cancelSubscriptionPlan = unimplimented;

