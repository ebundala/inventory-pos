import { prisma } from "@/core";
import { Prisma, Tenant } from "@prisma/client";
import { googleOidcDiscoveryUrl, secrets } from "@/core/util/oidcConfig";
import { handleOIDCconnectionAction } from "@/core/util/handleOIDCconnectionAction";

function registerOidcActionHandler() {
    prisma!.$use(async (opts: Prisma.MiddlewareParams, next) => {
        const { action, model } = opts;
        if (model !== "Tenant" || !["update", "create", "delete"].includes(action)) {
            return next(opts);
        }

        if (action === "update" || action === "create" || action === "delete") {
            const tenant: Tenant = await next(opts);
            //Handle google OIDC 
            await handleOIDCconnectionAction({
                tenant,
                action,
                oidcClientId: secrets.client_id,
                oidcClientSecret: secrets.client_secret,
                product,
                oidcDiscoveryUrl: googleOidcDiscoveryUrl
            });
            return tenant;
        }
        return next(opts);

    });

}
