import { TRPCError } from "@trpc/server";
import { TenantContext } from "@/core/trpc";
import { enforceHelper } from "@/core/util/enforcerUtil";


export type PermissionActionType = "create" | "view" | "update" | "delete" | "no-action";

const PermisionActions = ["create", "view", "update", "delete", "no-action"] as const;
const settingPermissionActions = ['view', 'update', "no-action"] as const;

export type PosSettingPermissionActionType = 'view' | 'update' | "no-action"
export type SystemPermissionActionType = PosSettingPermissionActionType;
const UserInvitePermissionActions = ["invite", "dismiss", "no-action"] as const;
export type UserInvitePermission = "invite" | "dismiss"
export type BarcodePermission = "print"
const rolePermissionsActions = ["create", "view", "update", "delete", "assign", "no-action"] as const
export type RolePermissionsActions = "create" | "view" | "update" | "delete" | "assign" | "no-action"

const businessPermissionsActions = ["manage", "no-action"] as const
export type BusinessPermissionsActions = "manage" | "no-action"

export type PermissionActionTypes = PermissionActionType | PosSettingPermissionActionType | UserInvitePermission
    | BarcodePermission | RolePermissionsActions | BusinessPermissionsActions

export type PermissionInput = {
    resource: string
    action: PermissionActionTypes
}

export type TPermission = PermissionInput;
export type ResourceTypes = "product" | "category" | "unit" | "brand" | "adjustment" |
    "quotation" | "purchase" | "sale" | "transfer" | "sale-return" | "role" | "business" |
    "purchase-return" | "customer" | "supplier" | "currency" | "warehouse" | "user" | "pos-setting" | "setting" |
     "report" | "barcode" |
     "sales-summary"| "purchases-summary"| "sale-returns-summary"| "purchase-returns-summary"| "sales-and-purchase-summary"|
        "top-customers-summary"| "top-selling-products-summary"| "stock-alerts-summary"| "payment-sent-and-received-summary"| "recent-sales-summary"
export const permisions = [
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
    ...["role"].flatMap((p) => {
        return rolePermissionsActions.map((t) => ([p, t]))
    }),
    ...["business"].flatMap((p) => {
        return businessPermissionsActions.map((t) => ([p, t]))
    }),
    ...["sales", "purchases", "sale-returns", "purchase-returns", "sales-and-purchase",
        "top-customers", "top-selling-products", "stock-alerts", "payment-sent-and-received", "recent-sales"
    ].map((p) => ([`${p}-summary`, "view", `${p}-summary`, "no-action"])),
    ["barcode", "print"],
    ["barcode", "no-action"],
    ["report", "view"],
    ["report", "print"],
    ["report", "no-action"],
    ...["setting", "pos-setting"].flatMap((s) => {
        return settingPermissionActions.map((p) => ([s, p]))
    })
]

export const permisionsOutput = permisions.map<TPermission>((p, i, arr) => {
    const [resource, action] = p;
    return { resource, action } as TPermission;
})
















export async function getPolicies({ enforcer }: TenantContext) {
    return permisionsOutput
}

export async function getRoles({ enforcer, tenantId, session }: TenantContext) {

    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "role",
        action: "view"
    })
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
export async function getRole(role: string, { enforcer, tenantId, session }: TenantContext): Promise<TRoleWithPermision> {

    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "role",
        action: "view"
    })
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


export async function createRole({ role, permissions }: TRoleWithPermision, { enforcer, tenantId, session }: TenantContext) {

    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "role",
        action: "create"
    })
    if (role == ownerRole.name) {
        throw new TRPCError({ message: `Role ${role} is system role cannot be modified`, code: "FORBIDDEN" })

    }
    const existingPolicies = await enforcer!.getFilteredPolicy(0, role, tenantId, "", "")
    if (existingPolicies.length > 0) {
        throw new TRPCError({ message: "Role already exist", code: "BAD_REQUEST" });
    }
    const policies = permissions.map<string[]>((p, i) => ([role, tenantId, p.resource, p.action]))
    const success = await enforcer!.addPolicies(policies);
    await enforcer!.savePolicy();
    return success;
}


export async function updateRole({ role, oldRoleName, permissions }: TRoleWithPermision, ctx: TenantContext) {
    const { enforcer, tenantId, session, } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "role",
        action: "update"
    })
    if (role == ownerRole.name) {
        throw new TRPCError({ message: `Role ${role} is system role cannot be modified`, code: "FORBIDDEN" })

    }
    const oldRoleNameClean = (oldRoleName ?? "")?.length > 0 ? oldRoleName : null;
    const existingPolicies = await enforcer!.getFilteredPolicy(0, oldRoleNameClean ?? role, tenantId, "", "")
    if (existingPolicies.length === 0) {
        throw new TRPCError({ message: "Role doesn't exist", code: "BAD_REQUEST" });
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
    await enforcer!.savePolicy();

    return await getRole(role, ctx);
}

export type AssignRolesInput = {
    roles: string[]
    userId: string
}
export type AssignRoleInput = {
    role: string
    userId: string
}
export async function assignRoles(input: AssignRolesInput, ctx: TenantContext) {
    const { enforcer, tenantId, session } =ctx
    const id = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId: id,
        resource: "role",
        action: "assign"
    })

    const { roles, userId } = input;
    const oldRoles = await enforcer!.getRolesForUser(userId, tenantId);
    if (input.roles.indexOf(ownerRole.name) > 0) {
        if (oldRoles.indexOf(ownerRole.name) === -1)
            throw new TRPCError({ message: `You cannot assign owner role as a non owner user`, code: "FORBIDDEN" })

    }

   // const removeOldRoles = (await removeRoles({ userId, roles: oldRoles }, ctx))
    const removeOldRoles = await Promise.allSettled(oldRoles.map((role) => enforcer!.deleteRoleForUser(userId, role, tenantId)));

    const success = await Promise.allSettled(roles.map((role) => enforcer!.addRoleForUser(userId, role, tenantId)));
    await enforcer!.savePolicy();
    return success;
}

export async function removeRoles({ userId, roles }: AssignRolesInput, { enforcer, tenantId, session }: TenantContext) {
    const id = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId: id,
        resource: "role",
        action: "assign"
    })
    const oldRoles = await enforcer!.getRolesForUser(userId, tenantId);
    if (roles.indexOf(ownerRole.name) > 0) {
        if (oldRoles.indexOf(ownerRole.name) === -1)
            throw new TRPCError({ message: `You cannot remove Owner role as non Owner user`, code: "FORBIDDEN" })

    }
    const success = await Promise.allSettled(roles.map((role) => enforcer!.deleteRoleForUser(userId, role, tenantId)));
    await enforcer!.savePolicy();
    return success;
}

export async function deleteRole(role: string, { enforcer, tenantId, session }: TenantContext) {
    const userId = session!.user.id!;
    await enforceHelper({
        enforcer,
        tenantId,
        userId,
        resource: "role",
        action: "delete"
    })
    if (role === ownerRole.name) {
        
            throw new TRPCError({ message: `You cannot delete Owner role this is a system defined role`, code: "FORBIDDEN" })

    }
    const success = await enforcer!.removeFilteredPolicy(0, role, tenantId, "", "")
    const success1 = await enforcer!.removeFilteredGroupingPolicy(1, role, tenantId)
    await enforcer!.savePolicy();
    return success && success1;
}

export async function getUserPermissions(ctx: TenantContext) {
    const { enforcer, tenantId, session } = ctx;
    return enforcer!.getPermissionsForUser(session!.user!.id!)
}



export type SystemRoles = {
    name: string,
    permissions: [ResourceTypes, PermissionActionTypes][]
}
const permClean = permisions.filter(([r, a]) => a !== "no-action").map(([resource, action]) => {
    return [resource, action] as unknown as [ResourceTypes, PermissionActionTypes]
})

export const ownerRole: SystemRoles = {
    name: "Owner",
    permissions: permClean
}

export const managerRole: SystemRoles = {
    name: "Manager",
    permissions: permClean.filter(([r, a]) => {
        switch (r) {
            case "role":
                if(a==="view")return true
                else return false
            case "setting":
                if(a==="view")return true
                else return false
            case "pos-setting":
                if(a==="view")return true
                else return false
            default:
                return true;
        }
    })

}

export const userRole: SystemRoles = {
    name: "User",
    permissions: permClean.filter(([r, a]) => {
        switch (r) {
            case "role":
            case "user":
            case "setting":
            case "pos-setting":
                if(a==="view")return true
                else return false
            case "supplier":
            case "brand":
            case "unit":
            case "adjustment":
            case "transfer":
            case "warehouse":
            case "category":
            case "currency":
            case "purchase":
            case "product":
                if (a === "view")
                    return true
                else {
                    return false
                }
            case "purchase-return":
            case "sale-return":
            case "customer":
                if (a !== "delete") {
                    return true
                }
                else { return false }
            default:
                return true;
        }
    })
}

export const viewOnlyRole: SystemRoles = {
    name: "ViewOnly",
    permissions: userRole.permissions.filter(([r, a]) => a !== "view")
}


export function getPoliciesForSystemRole(role:SystemRoles,domain:string){
   return role.permissions.map(([resource,action])=>[role.name, domain, resource, action])
}