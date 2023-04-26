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
const  secrets = {
  client_secret:process.env.GOOGLE_CLIENT_SECRET!,
  client_id:process.env.GOOGLE_CLIENT_ID!
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
  const { tx } = ctx;
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
  const { tx, tenantId } = ctx;
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
  const { tx } = ctx;
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
  const { tx } = ctx;
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
      recordStatus:RecordStatus.ACTIVE,
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
  const { session } = ctx;
  const { where, ...rest } = input;
  return prismaAdmin!.tenant.findFirst({
    include: {
      members: true,
    },
    ...rest,
    where: {
      ...(where || {}),
      recordStatus:RecordStatus.ACTIVE,
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
  const { tx, tenantId,session } = ctx;
  const invitorId = session!.user.id!;
  
  const { email,message } = input;
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
    to:email,
    subject:"invitation to join a business",
  html:`<h3>Hello!</h3>
  <h5>${session?.user.username}</h5> have invited you to join their business
  click the link below to accept/reject the invitation.
  ${getTenantUrl(result.tenant.subdomain)}/invite/${result.email}
  <h6>${message?"Message":""}</h6>
  <blockquote>${message}</blockquote>
  `})

  return result;
};
export type TenantEmailWhereInput = {
  /**
   *
   * @format email
   */
  email: string;
  // tenantId: string
};
export const acceptInvite = async (
  input: TenantEmailWhereInput,
  ctx: TenantContext
) => {
  const { tx, tenantId } = ctx;
  //TODO link user to tenant
  return tx!.tenantInvite.update({
    include: {
      tenant: true,
      invitor: true,
    },
    where: {
      tenantId_email: { ...input, tenantId },
    },
    data: {
      status: ProcessStatus.APPROVED,
    },
  });
};
export const rejectInvite = async (
  input: TenantEmailWhereInput,
  ctx: TenantContext
) => {
  const { tx, tenantId } = ctx;
  return tx!.tenantInvite.update({
    include: {
      tenant: true,
      invitor: true,
    },
    where: {
      tenantId_email: { ...input, tenantId },
    },
    data: {
      status: ProcessStatus.DENIED,
    },
  });
};

export type TenantMemberWhereInput = {
  // tenantId: string,
  userId: string;
};

export const removeMember = async (
  input: TenantMemberWhereInput,
  ctx: TenantContext
) => {
  const { tx, tenantId } = ctx;
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

export const leaveTenant = async (
  input: TenantMemberWhereInput,
  ctx: TenantContext
) => {
  const { tenantId } = ctx;
  const { userId } = input;
  return prisma!.user.update({
    include: {
      tenants: true,
    },
    where: {
      id: userId,
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
        mode:Prisma.QueryMode.insensitive
      },
    },
  });
};
// TODO add billing and analytics for tenant
export const subscribeToPlan = unimplimented;
export const cancelSubscriptionPlan = unimplimented;
