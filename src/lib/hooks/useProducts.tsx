import { useStore } from "@/lib/context";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { ProductFindManySchema } from "prisma/generated/schemas/findManyProduct.schema";
import { useCallback,useMemo } from "react";
import { z } from "zod";


export function useProducts(args?:z.infer<typeof ProductFindManySchema> ) {

    const [products, setProducts] = useStore((s) => s.products);
    const {tenant} = useTenant();
    const trpcWithHost = useTrpcTenant();
    const options = useMemo(() => {
        const { where, ...rest } = args??{};
        return { where: { tenantId: tenant?.tenantId, ...where }, ...rest }
    }, [args, tenant]);

    const result = trpcWithHost.product.search.useQuery(options, {
        onSuccess: (data) => {
            setProducts({ products: data });
        }
    });
    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (result.isSuccess) {
            setProducts({ products: rResult.data ?? null });
        }
    }, [result.refetch]);
    
    return {products, result, refetch};
}
