import { useStore } from "@/lib/context";
import { useCallback } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useBrands() {
  const [brands, setBrands] = useStore((s) => s.brands);
  const {tenant} = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.product.brand.search.useQuery(
    { where: { tenantId: tenant?.tenantId } },
    {
      onSuccess(data) {
        setBrands({ brands: data ?? null });
      },
    });
  const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
    const rResult = await result.refetch(opts);
    if (rResult.isSuccess) {
      setBrands({ brands: rResult.data ?? null })
    }
    return rResult;
  }, [result.refetch])

  return {brands, result, refetch};
}
