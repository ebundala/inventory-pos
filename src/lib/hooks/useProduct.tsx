import { useStore } from "@/lib/context";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useCallback, useEffect } from "react";

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
        if (result.isSuccess) {
            setEditingProduct({ editingProduct: result.data ?? null });
        }
    }, [result.refetch]);
    useEffect(()=>{
        if(!id){
            console.log("Invalid id aborting query");
           result.remove();
        }
    },[id]);
    return [result.data, result.isLoading, result.isSuccess, refetch] as [typeof result.data, boolean, boolean, typeof refetch];
}
