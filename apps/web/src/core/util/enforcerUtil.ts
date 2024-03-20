import { TRPCError } from "@trpc/server"
import { Enforcer } from "casbin"
import { PermissionActionTypes, ResourceTypes } from "../authorization"

type EnforcerRequest<T = ResourceTypes | ResourceTypes[], R = PermissionActionTypes | PermissionActionTypes[]> = {
    resource: T,
    tenantId: string,
    userId: string,
    action: R,
    enforcer: Enforcer
}
export async function enforceHelper(request: EnforcerRequest<ResourceTypes, PermissionActionTypes>) {
    const {
        resource,
        tenantId: domain,
        userId: user,
        action,
        enforcer
    } = request
    const response = await enforcer.enforce(user, domain, resource, action);
    if (!response) {
        throw new TRPCError({ message: "You dont have permissions to complete this action.", code: "UNAUTHORIZED", })
    }
}

export async function batchEnforceHelper(request: EnforcerRequest<ResourceTypes[], PermissionActionTypes[]>) {
    const {
        resource,
        tenantId: domain,
        userId: user,
        action,
        enforcer
    } = request

    const perm = resource.map((r, i) => {
        const a = action[i];
        return [user, domain, r, a]
    })
    const response = await enforcer.batchEnforce(perm);
    if (!response.reduce((p, c) => p && c, true)) {
        throw new TRPCError({ message: "You dont have permission(s) to complete this action.", code: "UNAUTHORIZED", })
    }
}