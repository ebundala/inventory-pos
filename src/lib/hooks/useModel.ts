import { useCallback } from "react";
import { useStore } from "@/lib/context";
import { ModalData } from "@/types/ModalData";


export function useModel() {
    const [data, setModelData] = useStore((s) => s.modalData);

    const clear = useCallback(() => {
        setModelData({ modalData: { ...data, content: null, show: false, } });
    }, [data, setModelData]);

    const show = useCallback((config: ModalData) => {
        setModelData({ modalData: { ...config, show: true } });
    }, [setModelData]);

    // useEffect(() => {
    //     return () => clear()
    // }, [])
    const result: [typeof show, typeof clear, typeof data] = [show, clear, data];
    return result;
}
