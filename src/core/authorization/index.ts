import { TenantContext } from "../trpc";

export async function getPolicies({enforcer}:TenantContext){
 return enforcer.getPolicy()
}

export async function getRoles({enforcer,tenantId}:TenantContext){
    const roles = await enforcer.getFilteredGroupingPolicy(2,tenantId);
   //const policiesPerRole = enforcer.getFilteredGroupingPolicy(2,);
   return roles;
}

export type AddRoleInput = {
    role:string
    policySubject:string
}
export async function addRole({role,policySubject}:AddRoleInput,{enforcer,tenantId}:TenantContext){
    const success = await enforcer.addGroupingPolicy(role,policySubject,tenantId);
   return success;
}
export type AssignRoleInput= {
    role: string
    userId:string
}
export async function assignRole(input:AssignRoleInput,{enforcer,tenantId}:TenantContext){
    const{ role, userId }=input;
    const success = await enforcer.addRoleForUser(userId,role,tenantId);
   return success;
}

export type AssignPermisionInput= {
    role: string
    userId:string
}
export async function assignPermisionsToRole(input:AssignPermisionInput,{enforcer,tenantId}:TenantContext){
    const{ role, userId }=input;
    const success = await enforcer.addRoleForUser(role,tenantId);
   return success;
}