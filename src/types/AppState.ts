import { DrawerData } from "@/types/DrawerData";
import { EndDrawerData } from "@/types/EndDrawerData";
import { ModalData } from "@/types/ModalData";
import { ProgressIndicatorData } from "@/types/ProgressIndicatorData";
import { ToastMessage } from "@/types/ToastMessage";
import { WithShow } from "@/types/WithShow";
import { RouterOutput } from "@/lib/routers";



export interface AppState {
    invites: RouterOutput['tenant']['findMyInvites'];
    userPermissions:RouterOutput['authorization']['getUserPermissions'];
    editingRole: RouterOutput['authorization']['getRole'] | null;
    roles: RouterOutput['authorization']['getRoles'];
    permissions: RouterOutput['authorization']['getPolicies'];
    suppliersReports: RouterOutput['report']['supplierReports'],
    customersReports: RouterOutput['report']['customerReports'],

   //
    editingPurchase: RouterOutput['purchase']['get'],
    purchases: RouterOutput['purchase']['search'],
    //
    editingSale: RouterOutput['sale']['get']
    sales: RouterOutput['sale']['search']
   //
    editingSaleReturn: RouterOutput['sale_return']['get']
    saleReturns: RouterOutput['sale_return']['search']
    //
    editingPurchaseReturn: RouterOutput['purchase_return']['get']
    purchaseReturns:  RouterOutput['purchase_return']['search']
    //
    editingTransfer:  RouterOutput['transfer']['get']
    transfers:  RouterOutput['transfer']['search']
    //
    editingQuotation: RouterOutput['quotation']['get'],
    quotations:  RouterOutput['quotation']['search']
    //
    editingAdjustment:  RouterOutput['adjustment']['get']
    adjustments:  RouterOutput['adjustment']['search']
    //
    editingProduct: RouterOutput['product']['get'],
    products: RouterOutput['product']['search'],



    //data single
    defaultCustomer:  RouterOutput['people']['get']
    defaultCurrency:  RouterOutput['setting']['currency']['get']
    defaultWarehouse:  RouterOutput['setting']['warehouse']['get'],
    tenant:  RouterOutput['tenant']['get'];

    //data lists
    suppliers:  RouterOutput['people']['supplier']['search'];
    currencies:  RouterOutput['setting']['currency']['search'];
    units: RouterOutput['product']['unit']['search'];
    brands: RouterOutput['product']['brand']['search'];
    categories: RouterOutput['product']['category']['search'];
    customers: RouterOutput['people']['search'];
    warehouses: RouterOutput['setting']['warehouse']['search'];
    //Settings
    posSetting: RouterOutput['setting']['pos']['get'];
    tenantSetting: RouterOutput['setting']['get'];
    host: string | null;
    themes: string[];
    
    //UI data
    drawerFocusedMenuKey: string | null;
    progressIndicator: ProgressIndicatorData & WithShow | null;
    toastMessages: Map<string,ToastMessage>;
    modalData: ModalData & WithShow | null;
    endDrawerData: EndDrawerData & WithShow | null;
    drawerData: DrawerData & WithShow | null;
}
