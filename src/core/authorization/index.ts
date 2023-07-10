import { TRPCError } from "@trpc/server";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";
import { permisionsOutput, PermissionActionType, TPermission, } from "./PermissionActionType";
import { managerRole, ownerRole } from "./roles";
/*
p, admin, tenant1, data1, read
p, admin, tenant2, data2, read

g, alice, admin, tenant1
g, alice, user, tenant2
*/
















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
export async function assignRoles(input: AssignRolesInput, { enforcer, tenantId, session }: TenantContext) {
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

    const removeOldRoles = (await removeRoles({ userId, roles: oldRoles }, { enforcer, tenantId } as TenantContext))

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


