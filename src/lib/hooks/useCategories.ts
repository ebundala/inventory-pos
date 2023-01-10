import { useStore } from "@/lib/context";
import { useCallback } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useCategories() {
  const [categories, setCategories] = useStore((s) => s.categories);
  const {tenant} = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.product.category.search.useQuery(
    { where: { tenantId: tenant?.tenantId } },
    {
      onSuccess(data) {
        setCategories({ categories: data ?? null });
      },
    });
  const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
    const rResult = await result.refetch(opts);
    if (rResult.isSuccess) {
      setCategories({ categories: rResult.data ?? null })
    }
    return rResult;
  }, [result.refetch])

  return [categories, result.isLoading, result.isSuccess,refetch] as [typeof categories, boolean, boolean,typeof refetch];
}
