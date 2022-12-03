import { useCallback } from "react";
import { WithShow } from "@/types/WithShow";
import { DrawerData } from "@/types/DrawerData";
import { useStore } from "@/lib/context";
export function useDrawer() {
    const [data, updateDrawer] = useStore((store) => store.drawerData);
    const close = useCallback(() => {
        if (data)
            updateDrawer({ drawerData: { ...data, show: false } });
    }, [updateDrawer, data]);
    const open = useCallback(() => {
        if (data)
            updateDrawer({ drawerData: { ...data, show: false } });
    }, [updateDrawer, data]);
    const toggle = useCallback((current: boolean) => {
        if (data)
            updateDrawer({ drawerData: { ...data, show: !current } });
    }, [updateDrawer, data]);
    const update = useCallback((config: DrawerData & WithShow) => {
        updateDrawer({ drawerData: config });
    }, [updateDrawer]);
    const reset = useCallback(() => {
        updateDrawer({ drawerData: null });
    }, [updateDrawer]);
    return { data, open, close, toggle, update, reset };
}
