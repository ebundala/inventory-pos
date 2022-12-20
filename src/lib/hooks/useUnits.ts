import { useStore } from "@/lib/context";
import { useCallback } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useUnits() {
  const [units, setUnits] = useStore((s) => s.units);
  const [tenant] = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.product.unit.search.useQuery(
    { where: { tenantId: tenant?.tenantId } },
    {
      onSuccess(data) {
        setUnits({ units: data ?? null });
      },
    });
  const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
    const rResult = await result.refetch(opts);
    if (rResult.isSuccess) {
      setUnits({ units: rResult.data ?? null })
    }
    return rResult;
  }, [result.refetch])
    ;

  return [units, result.isLoading, result.isSuccess] as [typeof units, boolean, boolean];
}
