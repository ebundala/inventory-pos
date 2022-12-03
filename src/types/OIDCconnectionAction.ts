import { Tenant } from "@prisma/client";


export type OIDCconnectionAction = {
    tenant: Tenant;
    action: "update" | "create" | "delete";
    oidcDiscoveryUrl: string;
    oidcClientId: string;
    oidcClientSecret: string;
    product: string;
};
