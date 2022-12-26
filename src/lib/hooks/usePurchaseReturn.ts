import { useStore } from "@/lib/context";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useCallback, useEffect } from "react";


export function usePurchaseReturn(id: number) {

    const [editingPurchaseReturn, setValue] = useStore((s) => s.editingPurchaseReturn);
    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.purchase_return.get.useQuery(id, {
        onSuccess: (data) => {
            setValue({ editingPurchaseReturn: data });
        }
    });

    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (rResult.isSuccess) {
            setValue({ editingPurchaseReturn: rResult.data ?? null });
        }
    }, [result.refetch]);

    useEffect(() => {
        return () => {
            setValue({ editingPurchaseReturn: null });
        };
    }, []);

    return [editingPurchaseReturn, result.isLoading, result.isSuccess, refetch] as [typeof result.data, boolean, boolean, typeof refetch];
}
