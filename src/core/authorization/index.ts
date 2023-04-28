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
    const roles = await enforcer.getFilteredGroupingPolicy(3, tenantId);
    const rolesNames = roles.flatMap((r) => r[1]);
    const uniqueRoles = [...new Set(rolesNames)]
    const permissionsResults = await Promise.allSettled(uniqueRoles.map((r) => enforcer.getFilteredPolicy(0,"p",r,tenantId,"","")));
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
                const [_, __, ___, resource, action] = p
                return { resource, action } as TPermission
            });
            role.permissions = perm;
        }
        return role;
    });
    return roleWithPerm
}
export type RoleInput = string;
export async function getRole(role:string,{ enforcer, tenantId }: TenantContext): Promise<TRoleWithPermision>{
  const policies =  await enforcer.getFilteredPolicy(0,"p",role,tenantId,"","");
 const perms = policies.map<TPermission>((p, i, arr) => {
    const [_, __, ___, resource, action] = p
    return { resource, action } as TPermission
});
return {role,permissions: perms}
}

export type TRoleWithPermision = {
    role: string;
    permissions: TPermission[];
}


export async function createRole({ role, permissions }: TRoleWithPermision, { enforcer, tenantId }: TenantContext) {
     const policies = permissions.map<string[]>((p,i) => ([role,tenantId,p.resource,p.action]))
    const success = await enforcer.addPolicies(policies);
    return success;
}


export async function updateRole({ role, permissions }: TRoleWithPermision, ctx: TenantContext) {
    const { enforcer, tenantId } = ctx;
    const oldRole = await getRole(role,ctx);
    const oldRoleMap = oldRole.permissions.reduce((p,c,arr) => p.set(`${c.resource}/${c.action}`,c),new Map<string,TPermission>())
   const newRoleMap = permissions.reduce((p,c,arr) => p.set(`${c.resource}/${c.action}`,c),new Map<string,TPermission>())
    const deletedPolicies = oldRole.permissions.filter((p) => !newRoleMap.has(`${p.resource}/${p.action}`));
    const newPolicies = permissions.filter((p) => !oldRoleMap.has(`${p.resource}/${p.action}`));

   const success = await Promise.allSettled(deletedPolicies.map(({resource,action})=>enforcer.removeFilteredPolicy(0,"p",role,tenantId,resource,action)));
   const success1 = await enforcer.addPolicies(newPolicies.map(({resource,action})=>([role,tenantId,resource,action])))
   return await getRole(role,ctx);
}

export type AssignRoleInput = {
    role: string
    userId: string
}

export async function assignRole(input: AssignRoleInput, { enforcer, tenantId }: TenantContext) {
    const { role, userId } = input;
    const success = await enforcer.addRoleForUser(userId, role, tenantId);
    return success;
}

export async function removeRole({userId,role}: AssignRoleInput, { enforcer, tenantId }: TenantContext) {
   const success = await enforcer.deleteRoleForUser(userId,role,tenantId);
   return success;
}

export async function deleteRole(role: string, { enforcer, tenantId }: TenantContext) {
    const success = await enforcer.removeFilteredPolicy(1,role,tenantId,"","")
    const success1 = await enforcer.removeFilteredGroupingPolicy(2,role,tenantId)
    return success && success1;
 }

 export async function getUserPermissions(ctx:TenantContext){
  const {enforcer,tenantId,session} = ctx;
  return enforcer.getPermissionsForUser(session!.user!.id!)
 }
const PermisionActions = ["create", "view", "update", "delete", "list", "delete-many"] as const;
type PermissionActionType = "create"| "view" | "update" | "delete" | "list" |"delete-many";

export type PosSettingPermissionActionType = 'view' | 'update'
export type SystemPermissionActionType = PosSettingPermissionActionType;
const UserInvitePermissionActions = ["invite", "dismiss"] as const;
 export type UserInvitePermission = "invite" | "dismiss"

export type PermissionInput = {    
    resource: string
    action: PermissionActionType | PosSettingPermissionActionType | UserInvitePermission
}

export type TPermission = PermissionInput;

const permisions = [
    ...[
        "product", "category", "unit", "brand", "adjustment",
        "quotation", "purchase", "sale", "transfer", "sale-return",
        "purchase-return", "customer", "supplier", "currency", "warehouse"
    ].map((p) => {
        return PermisionActions.flatMap((t) => ([p, t]))
    }),
    ...["user"].map((p) => {
        return UserInvitePermissionActions.flatMap((t) => ([p, t]))
    }),
    ...["sales", "purchases", "sale-returns", "purchase-returns", "sales-and-purchase",
        "top-selling-products", "stock-alerts", "payment-sent-and-received", "recent-sales"
    ].map((p) => ([`${p}-summary`, "view"])),
    ["barcode", "print"]
]

const permisionsOutput = permisions.map<TPermission>((p,i,arr) => {
    const [resource, action] = p;
    return { resource, action } as TPermission;
})