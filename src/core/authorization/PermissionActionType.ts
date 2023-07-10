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
    "sales-and-purchase" | "report" |
    "stock-alerts" | "payment-sent-and-received" | "recent-sales" | "barcode" | "top-customers-summary" |
    "sales-summary" | "purchases-summary" | "sale-returns-summary" | "purchase-returns-summary" | "sales-and-purchase-summary" |
    "top-customers-summary" | "top-selling-products-summary" | "stock-alerts-summary" | "payment-sent-and-received-summary" | "recent-sales-summary"

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