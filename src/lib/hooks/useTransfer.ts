import { useStore } from "@/lib/context";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useCallback, useEffect } from "react";


export function useTransfer(id: number) {

    const [editingTransfer, setValue] = useStore((s) => s.editingTransfer);
    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.transfer.get.useQuery(id, {
        onSuccess: (data) => {
            setValue({ editingTransfer: data });
        }
    });

    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (rResult.isSuccess) {
            setValue({ editingTransfer: rResult.data ?? null });
        }
    }, [result.refetch]);

    useEffect(() => {
        return () => {
            setValue({ editingTransfer: null });
        };
    }, []);

    return [editingTransfer, result.isLoading, result.isSuccess, refetch] as [typeof result.data, boolean, boolean, typeof refetch];
}
