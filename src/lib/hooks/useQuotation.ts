import { useStore } from "@/lib/context";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useCallback, useEffect } from "react";


export function useQuotation(id: number) {

    const [quotation, setValue] = useStore((s) => s.editingQuotation);
    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.quotation.get.useQuery(id, {
        onSuccess: (data) => {
            setValue({ editingQuotation: data });
        }
    });

    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (rResult.isSuccess) {
            setValue({ editingQuotation: rResult.data ?? null });
        }
    }, [result.refetch]);

    useEffect(() => {
        return () => {
            setValue({ editingQuotation: null });
        };
    }, []);

    return {quotation, result, refetch};
}
