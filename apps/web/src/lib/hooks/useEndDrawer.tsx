import { useCallback } from "react";
import { useStore } from "@/lib/context";
import { WithShow } from "@/types/WithShow";
import { EndDrawerData } from "@/types/EndDrawerData";

export function useEndDrawer() {
    const [data, updateDrawer] = useStore((store) => store.endDrawerData);
    const close = useCallback(() => {
        if (data)
            updateDrawer({ endDrawerData: { ...data!, show: false } });
    }, [updateDrawer, data]);
    const open = useCallback(() => {
        if (data)
            updateDrawer({ endDrawerData: { ...data!, show: false } });
    }, [updateDrawer, data]);
    const toggle = useCallback((current: boolean) => {
        if (data)
            updateDrawer({ endDrawerData: { ...data!, show: !current } });
    }, [updateDrawer, data]);
    const update = useCallback((config: EndDrawerData & WithShow) => {
        updateDrawer({ endDrawerData: config });
    }, [updateDrawer]);
    const reset = useCallback(() => {
        updateDrawer({ endDrawerData: null });
    }, [updateDrawer]);
    return { data, open, close, toggle, update, reset };
}
