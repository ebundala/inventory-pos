import { prisma, prismaAdmin, unimplimented } from "@/core";
import { Prisma, ProcessStatus, RecordStatus } from "@prisma/client";
import cuid from "cuid";
import { TenantContext } from "@/core/trpc";
import { handleOIDCconnectionAction } from "../util/handleOIDCconnectionAction";
import {
  googleOidcDiscoveryUrl,
  googleOidcProductName,

} from "@/core/util/oidcConfig";
import { getTenantUrl } from "../util/getTenantUrl";
import mailer from "@/core/mail/mailer";
import { enforceHelper } from "../util/enforcerUtil";
import { TRPCError } from "@trpc/server";
import { getPoliciesForSystemRole, managerRole, ownerRole, userRole, viewOnlyRole } from "@/core/authorization";
const secrets = {
  client_secret: process.env.GOOGLE_CLIENT_SECRET!,
  client_id: process.env.GOOGLE_CLIENT_ID!
}

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
  userId: string;
  /**
   * @minLength 2
   * @maxLength 50
   * @pattern ^[A-Za-z0-9]*$
   */
  subdomain: string;
};
export const createTenant = async (
  input: TenantCreateInput,
  ctx: TenantContext
) => {
  const { userId, ...data } = input;
  const { tx,enforcer } = ctx;
  const id = cuid();

  await tx!.$queryRawUnsafe(`SET "app.CurrentTenant"="${id}"`);
  const tenant = await tx!.tenant.create({
    include: {
      members: true,
    },
    data: {
      tenantId: id,
      ...data,

      Unit: {
        create: {
          name: "Pieces",
          shortName: "Pcs",
          operator: "x",
          operatorValue: 1,
        },
      },

      Brand: {
        create: {
          name: "Default brand",
        },
      },
      Supplier: {
        create: {
          name: "Default supplier",
          code: 1,
          email: `${getTenantUrl(data.subdomain, "info@")}`,
        },
      },
      Category: {
        create: {
          name: "Default category",
          code: "1",
        },
      },

      PosSetting: {
        create: {
          showAddress: false,
          showBarcode: true,
          showCustomer: true,
          showDiscount: false,
          showEmail: false,
          showNote: true,
          showPhone: false,
          noteCustomer: "Thank you for shopping with us - Welcome again",
        },
      },
      Setting: {
        create: {
          defaultLanguage: "En",
          companyAddress: "",
          companyName: data.name,
          companyPhone: "",
          footer: "",
          developedBy: "",
          email: `${getTenantUrl(data.subdomain, "info@")}`,
          logo: data.logo,
          customer: {
            create: {
              tenantId: id,
              name: "Walk-in-customer",
              code: 1,
              email: `${getTenantUrl(data.subdomain, "info@")}`,
            },
          },
          currency: {
            create: {
              tenantId: id,
              name: "Tanzanian Shilling",
              code: "TZS",
              symbol: "Tsh",
            },
          },
          warehouse: {
            create: {
              tenantId: id,
              name: "Default warehouse",
              user_warehouse: {
                create: {
                  userId: userId,
                  tenantId: id,
                },
              },
            },
          },
        },
      },
      members: {
        connect: {
          id: userId,
        },
      },
    },
  });

  //Handle google OIDC
  await handleOIDCconnectionAction({
    tenant,
    action: "create",
    oidcClientId: secrets.client_id,
    oidcClientSecret: secrets.client_secret,
    product: googleOidcProductName,
    oidcDiscoveryUrl: googleOidcDiscoveryUrl,
  });
  //Create system roles
  
const policies = [
  ...getPoliciesForSystemRole(ownerRole,tenant.tenantId),
  ...getPoliciesForSystemRole(managerRole,tenant.tenantId),
  ...getPoliciesForSystemRole(userRole,tenant.tenantId),
  ...getPoliciesForSystemRole(viewOnlyRole,tenant.tenantId)
]
const success = await enforcer.addPolicies(policies);
const succes1=await enforcer.addRoleForUser(userId, ownerRole.name, tenant.tenantId)
 const success2=   await enforcer!.savePolicy();
 if(!(success&&succes1&&success2)){
  throw new TRPCError({message:"Failed to setup user roles",code:"INTERNAL_SERVER_ERROR"})
 }
  return tenant;
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
  subdomain?: string;
};
export const updateTenant = async (
  input: TenantUpdateInput,
  ctx: TenantContext
) => {
  const { ...data } = input;
  const { tx ,enforcer,tenantId,session} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "business",
    action: "manage"
  })
  //TODO handle images uploads
  const tenant = await tx!.tenant.update({
    include: {
      members: true,
    },
    where: {
      tenantId: tenantId,
    },
    data,
  });
  //Handle google OIDC
  await handleOIDCconnectionAction({
    tenant,
    action: "update",
    oidcClientId: secrets.client_id,
    oidcClientSecret: secrets.client_secret,
    product: googleOidcProductName,
    oidcDiscoveryUrl: googleOidcDiscoveryUrl,
  });
  return tenant;
};

export type TenantId = string;
export const getUniqueTenant = async (id: TenantId, ctx: TenantContext) => {
  const { tx } = ctx;
  return tx!.tenant.findUnique({
    include: {
      members: true,
    },
    where: {
      tenantId: id,
    },
  });
};

export const deleteTenant = async (id: TenantId, ctx: TenantContext) => {
  const { tx ,enforcer,tenantId,session} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "business",
    action: "manage"
  })
  const tenant = await tx!.tenant.update({
    include: {
      members: true,
    },
    where: {
      tenantId: id,
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
  //Handle google OIDC
  await handleOIDCconnectionAction({
    tenant,
    action: "delete",
    oidcClientId: secrets.client_id,
    oidcClientSecret: secrets.client_secret,
    product: googleOidcProductName,
    oidcDiscoveryUrl: googleOidcDiscoveryUrl,
  });
  return tenant;
};
export type TenantIds = Array<string>;
export const deleteManyTenant = async (ids: TenantIds, ctx: TenantContext) => {
  const { tx ,enforcer,tenantId,session} = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "business",
    action: "manage"
  })
  return tx!.tenant.updateMany({
    where: {
      tenantId: {
        in: ids,
      },
    },
    data: {
      recordStatus: RecordStatus.DELETED,
    },
  });
};

export const findManyTenant = async (
  input: Omit<Prisma.TenantFindManyArgs, "select" | "include">,
  ctx: TenantContext
) => {
  const { session } = ctx;
  const { where, ...rest } = input;
  return prismaAdmin!.tenant.findMany({
    include: {
      members: true,
    },
    ...rest,
    where: {
      ...(where || {}),
      recordStatus: RecordStatus.ACTIVE,
      AND: [
        {
          members: {
            some: { id: { equals: session!.user.id! } },
          },
        },
      ],
    },
  });
};

export const findFirstTenant = async (
  input: Omit<Prisma.TenantFindManyArgs, "select" | "include">,
  ctx: TenantContext
) => {
  const { session, enforcer } = ctx;
  const { where, ...rest } = input;
  const tenant = await prismaAdmin!.tenant.findFirst({
    include: {
      members: true,
    },
    ...rest,
    where: {
      ...(where || {}),
      recordStatus: RecordStatus.ACTIVE,
      AND: [
        {
          members: {
            some: { id: { equals: session!.user.id! } },
          },
        },
      ],
    },
  });
  if (tenant !== null) {
    const roles = await Promise.allSettled(tenant.members.map((u) => enforcer!.getRolesForUser(u.id, tenant.tenantId)));
    const members = tenant.members.map((u, i) => ({ ...u, roles: roles[i].status === "fulfilled" ? (roles[i] as any).value as string[] : [] }))
    return { ...tenant, members };
  }
  return tenant;
};
export type InviteMemberInput = {
  /**
   *
   * @maxLength 160
   */
  message?: string;
  /**
   *
   * @format email
   */
  email: string;
};
export const inviteMember = async (
  input: InviteMemberInput,
  ctx: TenantContext
) => {
  const { tx, tenantId, session, enforcer } = ctx;

  const invitorId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId: invitorId,
    resource: "user",
    action: "invite"
  })
  const { email, message } = input;
  const result = await tx!.tenantInvite.create({
    include: {
      tenant: true,
      invitor: true,
    },
    data: {
      tenantId: tenantId,
      invitorId: invitorId,
      email: email,
    },
  });
  mailer.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Invitation to join a business",
    text: `Hello!
    ${session?.user.name} have invited you to join their business
    click the link below to accept/reject the invitation.
    ${getTenantUrl("app")}/login
    ${message ? "Message" : ""}
    "${message}"
    `,
    html: `<h3>Hello!</h3>
  <b>"${session?.user.name}"</b> Have invited you to join their business <br>
  click the link below to signup/signin and accept/reject the invitation.
  ${getTenantUrl("app")}/login
  <h6>${message ? "Message" : ""}</h6>
  <blockquote>${message}</blockquote>
  `}, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })

  return result;
};
export type TenantEmailWhereInput = {
  /**
   *
   * @format email
   */
  email: string;
  tenantId: string
};
export const acceptInvite = async (
  input: TenantEmailWhereInput,
  ctx: TenantContext
) => {

  const { tx, tenantId,session } = ctx;
  const {email} = session!.user!
  if(email !==input.email){
    throw new TRPCError({message:"Invalid user",code:"BAD_REQUEST"})
  }
  const invite = await prismaAdmin!.tenantInvite.update({
    include: {
      tenant: true,
      invitor: true,
    },
    where: {
      tenantId_email: { ...input,email:email! },
    },
    data: {
      status: ProcessStatus.APPROVED,
    },
  });


  if (invite.status === ProcessStatus.APPROVED) {
    await prismaAdmin.tenant.update({
      where: {
        tenantId: invite.tenant.tenantId
      },

      data: {
        members: {
          connect: {
            email: invite.email
          }
        }
      }
    })
  }
  return invite;
};
export const rejectInvite = async (
  input: TenantEmailWhereInput,
  ctx: TenantContext
) => {
  const { tx, tenantId,session } = ctx;
  const {email} = session!.user!
  if(email !==input.email){
    throw new TRPCError({message:"Invalid user",code:"BAD_REQUEST"})
  }
  const invite = await prismaAdmin!.tenantInvite.update({
    include: {
      tenant: true,
      invitor: true,
    },
    where: {
      tenantId_email: { ...input },
    },
    data: {
      status: ProcessStatus.DENIED,
    },
  });

  if (invite.status === ProcessStatus.DENIED) {
    await prismaAdmin.tenant.update({
      where: {
        tenantId: invite.tenant.tenantId
      },

      data: {
        members: {
          disconnect: {
            email: email!
          }
        }
      }
    })
  }
  return invite;

};

export type TenantMemberWhereInput = {
  // tenantId: string,
  userId: string;
};

export const removeMember = async (
  input: TenantMemberWhereInput,
  ctx: TenantContext
) => {
  const { tx, tenantId, session, enforcer } = ctx;

  const id = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId: id,
    resource: "user",
    action: "dismiss"
  })
  
  const { userId } = input;
  return tx!.tenant.update({
    include: {
      members: true,
    },
    where: {
      tenantId: tenantId,
    },
    data: {
      members: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
};
export const findMyInvites = async (ctx: TenantContext
) => {
  const { session } = ctx;
  const email = session?.user.email ?? undefined;
  return prismaAdmin!.tenantInvite.findMany({
    include: {
      invitor: true,
      tenant: true
    },
    where: {
      email: { equals: email },
      status: { equals: ProcessStatus.PENDING }
    }
  })
};
export const leaveTenant = async (
  input: TenantMemberWhereInput,
  ctx: TenantContext
) => {
  const { tenantId,session } = ctx;
  const { userId } = input;
  const id = session!.user.id!;
  if(id !==userId){
    throw new TRPCError({message:"Invalid user",code:"BAD_REQUEST"})
  }
  return prisma!.user.update({
    include: {
      tenants: true,
    },
    where: {
      id: id,
    },
    data: {
      tenants: {
        disconnect: {
          tenantId: tenantId,
        },
      },
    },
  });
};
export type DomainSearchInput = string;
export const checkDomain = async (domain: DomainSearchInput) => {
  return prismaAdmin!.tenant.findFirst({
    select: {
      customDomain: true,
    },
    where: {
      customDomain: {
        equals: domain,
      },
    },
  });
};
export const checkSubdomain = async (subdomain: DomainSearchInput) => {
  return prismaAdmin!.tenant.findFirst({
    select: {
      subdomain: true,
    },
    where: {
      subdomain: {
        equals: subdomain,
        mode: Prisma.QueryMode.insensitive
      },
    },
  });
};
// TODO add billing and analytics for tenant
export const subscribeToPlan = unimplimented;
export const cancelSubscriptionPlan = unimplimented;
