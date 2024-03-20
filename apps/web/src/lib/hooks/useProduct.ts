import { useStore } from "@/lib/context";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useCallback, useEffect, } from "react";

export function useProduct(id: number) {

    const [product, setEditingProduct] = useStore((s) => s.editingProduct);
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
            console.log("creaning up editing product", product);
            setEditingProduct({ editingProduct: null });
        }
    }, [])

    return {product, result, refetch};
}
