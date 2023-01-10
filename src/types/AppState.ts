import { DrawerData } from "@/types/DrawerData";
import { EndDrawerData } from "@/types/EndDrawerData";
import { ModalData } from "@/types/ModalData";
import { ProgressIndicatorData } from "@/types/ProgressIndicatorData";
import { ToastMessage } from "@/types/ToastMessage";
import { WithShow } from "@/types/WithShow";
import { TenantProp } from "@/types/TenantProp";
import { Adjustment, Brand, Category, Currency, Customer, PosSetting, Product, Purchase, PurchaseReturn, Quotation, Sale, SaleReturn, Setting, Supplier, Transfer, Unit, Warehouse } from "@prisma/client";

export interface AppState {
   //
    editingPurchase: Purchase | null
    purchases: Purchase[]|null
    //
    editingSale: Sale | null,
    sales: Sale [] | null,
   //
    editingSaleReturn: SaleReturn | null,
    saleReturns: SaleReturn [] | null,
    //
    editingPurchaseReturn: PurchaseReturn | null,
    purchaseReturns: PurchaseReturn [] | null,
    //
    editingTransfer: Transfer | null,
    transfers: Transfer[] | null,
    //
    editingQuotation: Quotation | null,
    quotations: Quotation[] | null,
    //
    editingAdjustment: Adjustment | null,
    adjustments: Adjustment[] | null;
    //
    editingProduct: Product | null,
    products:Product[]|null,

    //data single
    defaultCustomer: Customer | null;
    defaultCurrency: Currency | null;
    defaultWarehouse: Warehouse | null,
    tenant: TenantProp;

    //data lists
    suppliers: Supplier[] | null;
    currencies: Currency[] | null;
    units: Unit[] | null;
    brands: Brand[] | null;
    categories: Category[] | null
    customers: Customer[] | null;
    warehouses: Warehouse[] | null;
    //Settings
    posSetting: PosSetting | null;
    tenantSetting: Setting&{
        warehouse?:Warehouse | null,customer?:Customer|null,currency?:Currency|null
    } | null;
    host: string | null;
    themes: string[];
    
    //UI data
    drawerFocusedMenuKey: string | null;
    progressIndicator: ProgressIndicatorData & WithShow | null;
    toastMessages: Set<ToastMessage>;
    modalData: ModalData & WithShow | null;
    endDrawerData: EndDrawerData & WithShow | null;
    drawerData: DrawerData & WithShow | null;
}
