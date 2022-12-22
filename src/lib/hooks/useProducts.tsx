import { useStore } from "@/lib/context";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useCallback } from "react";

export function useProducts() {

    const [products, setProducts] = useStore((s) => s.products);
    const [tenant] = useTenant();
    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.product.search.useQuery({ where: { tenantId: tenant?.tenantId } }, {
        onSuccess: (data) => {
            setProducts({ products: data });
        }
    });
    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (result.isSuccess) {
            setProducts({ products: result.data ?? null });
        }
    }, [result.refetch]);
    
    return [products, result.isLoading, result.isSuccess, refetch] as [typeof result.data, boolean, boolean, typeof refetch];
}
