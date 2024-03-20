import { useStore } from "@/lib/context";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useCallback, useEffect } from "react";


export function useSale(id: number) {

    const [sale, setValue] = useStore((s) => s.editingSale);
    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.sale.get.useQuery(id, {
        onSuccess: (data) => {
            setValue({ editingSale: data });
        }
    });

    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (rResult.isSuccess) {
            setValue({ editingSale: rResult.data ?? null });
        }
    }, [result.refetch]);

    useEffect(() => {
        return () => {
            setValue({ editingSale: null });
        };
    }, []);

    return {sale, result, refetch};
}
