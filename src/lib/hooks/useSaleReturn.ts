import { useStore } from "@/lib/context";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useCallback, useEffect } from "react";


export function useSaleReturn(id: number) {

    const [editingSaleReturn, setValue] = useStore((s) => s.editingSaleReturn);
    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.sale_return.get.useQuery(id, {
        onSuccess: (data) => {
            setValue({ editingSaleReturn: data });
        }
    });

    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (rResult.isSuccess) {
            setValue({ editingSaleReturn: rResult.data ?? null });
        }
    }, [result.refetch]);

    useEffect(() => {
        return () => {
            setValue({ editingSaleReturn: null });
        };
    }, []);

    return [editingSaleReturn, result.isLoading, result.isSuccess, refetch] as [typeof result.data, boolean, boolean, typeof refetch];
}
