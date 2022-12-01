import { useCallback } from "react";
import { useStore } from "./forms";
import { ProgressIndicatorData } from "./ProgressIndicatorData";


export function useProgressIndicator() {
    const [data, setIndicatorData] = useStore((s) => s.progressIndicator);

    const clear = useCallback(() => {
        setIndicatorData({ progressIndicator: { ...data, children: null, show: false, } });
    }, [data, setIndicatorData]);

    const show = useCallback((config: ProgressIndicatorData) => {
        setIndicatorData({ progressIndicator: { ...config, show: true } });
    }, [setIndicatorData]);

    // useEffect(() => {
    //     return () => clear()
    // }, [])
    const result: [typeof show, typeof clear, typeof data] = [show, clear, data];
    return result;
}
