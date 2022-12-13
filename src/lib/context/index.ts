import createFastContext from "@/core/util/createFastContext";
import { AppState } from "@/types/AppState";
import { menus } from "@/lib/config/menus";
import themes  from "@/lib/themes/themes";
export const { Provider, useStore } = createFastContext<AppState>({
    modalData:null,
    tenant:null,
    themes:themes,
    host:null,
    drawerFocusedMenuKey:null,
    progressIndicator:null,
    endDrawerData:null,
    drawerData:{
        menus,
        show:false
    },
    toastMessages: new Set(),
})
