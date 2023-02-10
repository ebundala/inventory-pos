import createFastContext from "@/core/util/createFastContext";
import { AppState } from "@/types/AppState";
import { menus } from "@/lib/config/menus";
import themes from "@/lib/themes/themes";
export const { Provider, useStore } =
    createFastContext<AppState>({
        brands: null,
        categories: null,
        units: null,
        customers: null,
        currencies: null,
        warehouses: null,
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
        purchases: null,
        editingSale: null,
        sales: null,
        editingSaleReturn: null,
        saleReturns: null,
        editingPurchaseReturn: null,
        purchaseReturns: null,
        editingTransfer: null,
        transfers: null,
        editingQuotation: null,
        quotations: null,
        editingAdjustment: null,
        adjustments: null,
        editingProduct: null,
        products: null,
        defaultCustomer: null,
        defaultCurrency: null,
        defaultWarehouse: null,
        suppliers: null
    })
