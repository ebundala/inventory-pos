import { DrawerData } from "@/types/DrawerData";
import { EndDrawerData } from "@/types/EndDrawerData";
import { ModalData } from "@/types/ModalData";
import { ProgressIndicatorData } from "@/types/ProgressIndicatorData";
import { ToastMessage } from "@/types/ToastMessage";
import { WithShow } from "@/types/WithShow";
import { TenantProp } from "@/types/TenantProp";

export interface AppState {
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
