import { useStore } from "@/lib/context";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useCallback, useEffect } from "react";


export function useAdjustment(id: number) {

    const [editingAdjustment, setValue] = useStore((s) => s.editingAdjustment);
    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.adjustment.get.useQuery(id, {
        onSuccess: (data) => {
            setValue({ editingAdjustment: data });
        }
    });

    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (rResult.isSuccess) {
            setValue({ editingAdjustment: rResult.data ?? null });
        }
    }, [result.refetch]);

    useEffect(() => {
        return () => {
            setValue({ editingAdjustment: null });
        };
    }, []);

    return [editingAdjustment, result.isLoading, result.isSuccess, refetch] as [typeof result.data, boolean, boolean, typeof refetch];
}
