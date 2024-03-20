import { useStore } from "@/lib/context";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useCallback, useEffect } from "react";


export function usePurchase(id: number) {

    const [purchase, setValue] = useStore((s) => s.editingPurchase);
    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.purchase.get.useQuery(id, {
        onSuccess: (data) => {
            setValue({ editingPurchase: data });
        }
    });

    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (rResult.isSuccess) {
            setValue({ editingPurchase: rResult.data ?? null });
        }
    }, [result.refetch]);

    useEffect(() => {
        return () => {
            setValue({ editingPurchase: null });
        };
    }, []);

    return {purchase, result, refetch};
}
