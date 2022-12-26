import { useStore } from "@/lib/context";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useCallback, useEffect, } from "react";

export function useProduct(id: number) {

    const [editingProduct, setEditingProduct] = useStore((s) => s.editingProduct);
    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.product.get.useQuery(id, {
        onSuccess: (data) => {
            setEditingProduct({ editingProduct: data });
        }
    });

    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (rResult.isSuccess) {
            setEditingProduct({ editingProduct: rResult.data ?? null });
        }
    }, [result.refetch]);

    useEffect(() => {
        return () => {
            console.log("creaning up editing product", editingProduct);
            setEditingProduct({ editingProduct: null });
        }
    }, [])

    return [editingProduct, result.isLoading, result.isSuccess, refetch] as [typeof result.data, boolean, boolean, typeof refetch];
}
