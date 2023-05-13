import { inferAsyncReturnType } from "@trpc/server";
import { TenantContext } from "../trpc";
/*
p, admin, tenant1, data1, read
p, admin, tenant2, data2, read

g, alice, admin, tenant1
g, alice, user, tenant2
*/

export async function getPolicies({ enforcer }: TenantContext) {
    return permisionsOutput
}

export async function getRoles({ enforcer, tenantId }: TenantContext) {
    const roles = await enforcer!.getFilteredPolicy(1, tenantId);
    const rolesNames = roles.flatMap((r) => r[0]);
    const uniqueRoles = [...new Set(rolesNames)]
    const permissionsResults = await Promise.allSettled(uniqueRoles.map((r) => enforcer!.getFilteredPolicy(0, r, tenantId, "", "")));
    const roleWithPerm = uniqueRoles.map((r, i) => {
        const pr = permissionsResults.at(i)
        const role: {
            role: string,
            permissions: TPermission[]
        } = {
            role: r,
            permissions: []
        };
        if (pr?.status === 'fulfilled') {
            const perm = pr.value.map<TPermission>((p, i, arr) => {
                const [_, __, resource, action] = p
                return { resource, action } as TPermission
            });
            role.permissions = perm;
        }
        return role;
    });
    return roleWithPerm
}
export type RoleInput = string;
export async function getRole(role: string, { enforcer, tenantId }: TenantContext): Promise<TRoleWithPermision> {
    const policies = await enforcer!.getFilteredPolicy(0, role, tenantId, "", "");
    const perms = policies.map<TPermission>((p, i, arr) => {
        const [_, __, resource, action] = p
        return { resource, action } as TPermission
    });
    return { role, permissions: perms }
}

export type TRoleWithPermision = {
    role: string;
    oldRoleName?: string;
    permissions: TPermission[];
}


export async function createRole({ role, permissions }: TRoleWithPermision, { enforcer, tenantId }: TenantContext) {
    const existingPolicies = await enforcer!.getFilteredPolicy(0, role, tenantId, "", "")
    if (existingPolicies.length > 0) {
        throw new Error("Role arleady exist");
    }
    const policies = permissions.map<string[]>((p, i) => ([role, tenantId, p.resource, p.action]))
    const success = await enforcer!.addPolicies(policies);
    return success;
}


export async function updateRole({ role, oldRoleName, permissions }: TRoleWithPermision, ctx: TenantContext) {
    const { enforcer, tenantId } = ctx;
    const oldRoleNameClean = (oldRoleName ?? "")?.length > 0 ? oldRoleName : null;
    const existingPolicies = await enforcer!.getFilteredPolicy(0, oldRoleNameClean ?? role, tenantId, "", "")
    if (existingPolicies.length === 0) {
        throw new Error("Role doesn't exist");
    }
    const oldRole = await getRole(oldRoleNameClean ?? role, ctx);
    const oldRoleMap = oldRole.permissions.reduce((p, c, arr) => p.set(`${c.resource}/${c.action}`, c), new Map<string, TPermission>())

    const inputRoleMap = permissions.reduce((p, c, arr) => p.set(`${c.resource}/${c.action}`, c), new Map<string, TPermission>())

    const deletedPolicies = oldRole.permissions.filter((p) => inputRoleMap.has(`${p.resource}/${p.action}`) === false);

    const newPolicies = permissions.filter((p) => oldRoleMap.has(`${p.resource}/${p.action}`) === false);
    if (oldRoleNameClean === role || oldRoleNameClean === null) {
        await Promise.allSettled(deletedPolicies.map(({ resource, action }) => enforcer!.removeFilteredPolicy(0, role, tenantId, resource, action)));
        await enforcer!.addPolicies(newPolicies.map(({ resource, action }) => ([role, tenantId, resource, action])))
    }
    else {
        const users = await enforcer!.getUsersForRole(oldRoleNameClean!, tenantId);
        const roleGrouping = (await enforcer!.getFilteredGroupingPolicy(1, oldRoleNameClean!, tenantId))
            .map((g) => {
                return g.map((v) => {
                    if (v === oldRoleNameClean) {
                        return role;
                    }
                    return v
                });
            });
        await deleteRole(oldRoleNameClean!, ctx);
        await enforcer!.addPolicies(permissions.map(({ resource, action }) => ([role, tenantId, resource, action])))
        await enforcer?.addGroupingPolicies(roleGrouping);
        await Promise.allSettled(users?.map((u) => enforcer!.addRoleForUser(u, role, tenantId)))
    }

    return await getRole(role, ctx);
}

export type AssignRoleInput = {
    role: string
    userId: string
}

export async function assignRole(input: AssignRoleInput, { enforcer, tenantId }: TenantContext) {
    const { role, userId } = input;
    const success = await enforcer!.addRoleForUser(userId, role, tenantId);
    return success;
}

export async function removeRole({ userId, role }: AssignRoleInput, { enforcer, tenantId }: TenantContext) {
    const success = await enforcer!.deleteRoleForUser(userId, role, tenantId);
    return success;
}

export async function deleteRole(role: string, { enforcer, tenantId }: TenantContext) {
    const success = await enforcer!.removeFilteredPolicy(0, role, tenantId, "", "")
    const success1 = await enforcer!.removeFilteredGroupingPolicy(1, role, tenantId)
    return success && success1;
}

export async function getUserPermissions(ctx: TenantContext) {
    const { enforcer, tenantId, session } = ctx;
    return enforcer!.getPermissionsForUser(session!.user!.id!)
}
const PermisionActions = ["create", "view", "update", "delete", "no-action"] as const;
type PermissionActionType = "create" | "view" | "update" | "delete" | "no-action";

const settingPermissionActions = ['view', 'update', "no-action"] as const;

export type PosSettingPermissionActionType = 'view' | 'update' | "no-action"
export type SystemPermissionActionType = PosSettingPermissionActionType;
const UserInvitePermissionActions = ["invite", "dismiss", "no-action"] as const;
export type UserInvitePermission = "invite" | "dismiss"
export type BarcodePermission = "print"

export type PermissionInput = {
    resource: string
    action: PermissionActionType | PosSettingPermissionActionType | UserInvitePermission | BarcodePermission
}

export type TPermission = PermissionInput;

const permisions = [
    ...[
        "product", "category", "unit", "brand", "adjustment",
        "quotation", "purchase", "sale", "transfer", "sale-return",
        "purchase-return", "customer", "supplier", "currency", "warehouse"
    ].flatMap((p) => {
        return PermisionActions.map((t) => ([p, t]))
    }),
    ...["user"].flatMap((p) => {
        return UserInvitePermissionActions.map((t) => ([p, t]))
    }),
    ...["sales", "purchases", "sale-returns", "purchase-returns", "sales-and-purchase",
        "top-selling-products", "stock-alerts", "payment-sent-and-received", "recent-sales"
    ].map((p) => ([`${p}-summary`, "view", `${p}-summary`, "no-action"])),
    ["barcode", "print"],
    ["barcode", "no-action"],
    ...["setting", "pos-setting"].flatMap((s) => {
        return settingPermissionActions.map((p) => ([s, p]))
    })
]

const permisionsOutput = permisions.map<TPermission>((p, i, arr) => {
    const [resource, action] = p;
    return { resource, action } as TPermission;
})