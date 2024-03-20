import createFastContext from "@/core/util/createFastContext";
import { AppState } from "@/types/AppState";
import { menus } from "@/lib/config/menus";
import themes from "@/lib/themes/themes";
export const { Provider, useStore } =
    createFastContext<AppState>({
        brands: [],
        categories: [],
        units: [],
        customers: [],
        currencies: [],
        warehouses: [],
        tenantSetting: null,
        posSetting: null,
        modalData: null,
        tenant: null,
        themes: themes,
        host: null,
        drawerFocusedMenuKey: null,
        progressIndicator: null,
        endDrawerData: null,
        drawerData: {
            menus,
            show: false
        },
        toastMessages: new Map(),
        editingPurchase: null,
        purchases: [],
        editingSale: null,
        sales: [],
        editingSaleReturn: null,
        saleReturns: [],
        editingPurchaseReturn: null,
        purchaseReturns: [],
        editingTransfer: null,
        transfers: [],
        editingQuotation: null,
        quotations: [],
        editingAdjustment: null,
        adjustments: [],
        editingProduct: null,
        products: [],
        defaultCustomer: null,
        defaultCurrency: null,
        defaultWarehouse: null,
        suppliers: [],
        editingRole: null,
        roles: [],
        permissions: [],
        suppliersReports: [],
        customersReports: [],
        userPermissions: [],
        invites: []
    })
