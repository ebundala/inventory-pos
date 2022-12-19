import { DrawerData } from "@/types/DrawerData";
import { EndDrawerData } from "@/types/EndDrawerData";
import { ModalData } from "@/types/ModalData";
import { ProgressIndicatorData } from "@/types/ProgressIndicatorData";
import { ToastMessage } from "@/types/ToastMessage";
import { WithShow } from "@/types/WithShow";
import { TenantProp } from "@/types/TenantProp";
import { Brand, Category, Currency, Customer, PosSetting, Setting, Unit, Warehouse } from "@prisma/client";

export interface AppState {
    currencies: Currency[] | null;
    units: Unit[] | null;
    brands: Brand[] | null;
    categories: Category[] | null
    customers: Customer[] | null;
    warehouses: Warehouse[] | null;
    posSetting: PosSetting | null;
    tenantSetting: Setting | null;
    themes: string[];
    host: string | null;
    tenant: TenantProp;
    drawerFocusedMenuKey: string | null;
    progressIndicator: ProgressIndicatorData & WithShow | null;
    toastMessages: Set<ToastMessage>;
    modalData: ModalData & WithShow | null;
    endDrawerData: EndDrawerData & WithShow | null;
    drawerData: DrawerData & WithShow | null;
}
