import initJackson from '@/core/auth/jackson';
import { OIDCSSOConnection } from "@boxyhq/saml-jackson";
import { googleOidcDiscoveryUrl } from "@/core/util/oidcConfig";
import { getTenantUrl } from "@/core/util/getTenantUrl";
import { OIDCconnectionAction } from "@/types/OIDCconnectionAction";
const  secrets = {
    client_secret:process.env.GOOGLE_CLIENT_SECRET!,
    client_id:process.env.GOOGLE_CLIENT_ID!
  }
  
export async function handleOIDCconnectionAction(
    { tenant, action, product,
    }: OIDCconnectionAction) {
    const { connectionAPIController } = await initJackson();
    const oidcData: OIDCSSOConnection = {
        defaultRedirectUrl: getTenantUrl(tenant.subdomain!),
        redirectUrl: [getTenantUrl(tenant.subdomain!)],
        tenant: tenant.tenantId,
        product: product,
        name: tenant.name ?? undefined,
        description: tenant.description ?? undefined,
        oidcDiscoveryUrl: googleOidcDiscoveryUrl,
        oidcClientId: secrets.client_id,
        oidcClientSecret: secrets.client_secret
    };
    const oidcCon = await connectionAPIController.getConnections({
        tenant: tenant.tenantId,
        product: product
    });
    let clientIds: {
        clientID: string;
        clientSecret: string;
    } | null;
    if (oidcCon.length && oidcCon.at(0)?.clientID && oidcCon.at(0)?.clientSecret) {
        clientIds = {
            clientID: oidcCon.at(0)!.clientID,
            clientSecret: oidcCon.at(0)!.clientSecret
        };
    }
    else {
        clientIds = null;
    }
    if (action === "create") {
        await connectionAPIController.createOIDCConnection(oidcData);
    } else if (action === "update" && clientIds) {
        await connectionAPIController.updateOIDCConnection({ ...oidcData, ...clientIds });
    }
    else if (action === "delete" && clientIds !== null) {
        await connectionAPIController.deleteConnections({
            ...clientIds!
        });

    }
}
