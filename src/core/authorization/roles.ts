import { permisions, PermissionActionTypes, ResourceTypes } from "./PermissionActionType"

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
            //case "user":
            case "setting":
            case "pos-setting":
                return false;
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
                return false;
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