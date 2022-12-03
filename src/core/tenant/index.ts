import { prisma, prismaAdmin, unimplimented } from "@/core";
import { Prisma, ProcessStatus, RecordStatus } from "@prisma/client";
import cuid from "cuid";
import { TenantContext } from "@/core/trpc";


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
export const createTenant = async (input: TenantCreateInput, ctx: TenantContext) => {
    const { userId, ...data } = input;
    const { tx } = ctx;
    const id = cuid();

    await tx!.$queryRawUnsafe(`SET "app.CurrentTenant"="${id}"`)
    return tx!.tenant.create(
        {
            include: {
                members: true
            },
            data: {
                tenantId: id,
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
    // tenantId: string
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
export const updateTenant = async (input: TenantUpdateInput, ctx: TenantContext) => {
    const { ...data } = input;
    const { tx, tenantId } = ctx;
    //TODO handle images uploads
    return tx!.tenant.update(
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
export const getUniqueTenant = async (id: TenantId, ctx: TenantContext) => {
    const { tx } = ctx;
    return tx!.tenant.findUnique(
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

export const deleteTenant = async (id: TenantId, ctx: TenantContext) => {
    const { tx } = ctx;
    return tx!.tenant.update(
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
export const deleteManyTenant = async (ids: TenantIds, ctx: TenantContext) => {
    const { tx } = ctx;
    return tx!.tenant.updateMany(
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



export const findManyTenant = async (input: Omit<Prisma.TenantFindManyArgs, "select" | "include">, ctx: TenantContext) => {
    const { session } = ctx;
    const { where, ...rest } = input;
    return prismaAdmin!.tenant.findMany(
        {
            include: {
                members: true
            },
            ...rest,
            where: {
                ... (where || {}),
                AND: [
                    {
                        members: {
                            some: { id: { equals: session!.user.id! } }
                        }
                    },

                ]
            }
        }
    );
};
export type InviteMemberInput = {
    /**
     * 
     * @maxLength 160
     */
    message?: string,
    //tenantId: string,
    userId: string,
    /**
     * 
     * @format email
     */
    email: string
}
export const inviteMember = async (input: InviteMemberInput, ctx: TenantContext) => {
    const { tx, tenantId } = ctx;
    //Todo add message field
    const { userId, email } = input;
    return tx!.tenantInvite.create({
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
    // tenantId: string
}
export const acceptInvite = async (input: TenantEmailWhereInput, ctx: TenantContext) => {
    const { tx, tenantId } = ctx;
    //TODO link user to tenant
    return tx!.tenantInvite.update({
        include: {
            tenant: true,
            invitor: true
        },
        where: {
            tenantId_email: { ...input, tenantId }
        },
        data: {
            status: ProcessStatus.APPROVED
        }
    })
};
export const rejectInvite = async (input: TenantEmailWhereInput, ctx: TenantContext) => {
    const { tx, tenantId } = ctx;
    return tx!.tenantInvite.update({
        include: {
            tenant: true,
            invitor: true
        },
        where: {
            tenantId_email: { ...input, tenantId }
        },
        data: {
            status: ProcessStatus.DENIED
        }
    })
};

export type TenantMemberWhereInput = {
    // tenantId: string,
    userId: string
}

export const removeMember = async (input: TenantMemberWhereInput, ctx: TenantContext) => {
    const { tx, tenantId } = ctx;
    const { userId } = input;
    return tx!.tenant.update({
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

export const leaveTenant = async (input: TenantMemberWhereInput, ctx: TenantContext) => {
    const { tenantId } = ctx;
    const { userId } = input;
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
export type DomainSearchInput = string;
export const checkDomain = async (domain: DomainSearchInput) => {
    return prismaAdmin!.tenant.findFirst({
        select: {
            customDomain: true
        },
        where: {
            customDomain: {
                equals: domain
            }
        }
    })
}
export const checkSubdomain = async (subdomain: DomainSearchInput) => {
    return prismaAdmin!.tenant.findFirst({
        select: {
            subdomain: true
        },
        where: {
            subdomain: {
                equals: subdomain
            }
        }
    })
}
// TODO add billing and analytics for tenant
export const subscribeToPlan = unimplimented;
export const cancelSubscriptionPlan = unimplimented;





