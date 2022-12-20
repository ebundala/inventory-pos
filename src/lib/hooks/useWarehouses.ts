import { useStore } from "@/lib/context";
import { useCallback } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useWarehouses() {
  const [warehouses, setWarehouses] = useStore((s) => s.warehouses);
  const [tenant] = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.setting.warehouse.search.useQuery(
    { where: { tenantId: tenant?.tenantId } },{
      onSuccess(data) {
        setWarehouses({ warehouses: data ?? null });
      },
    });
  const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
    const rResult = await result.refetch(opts);
    if (rResult.isSuccess) {
      setWarehouses({ warehouses: rResult.data ?? null })
    }
    return rResult;
  }, [result.refetch])
  return [warehouses, result.isLoading, result.isSuccess,refetch] as [typeof warehouses, boolean, boolean,typeof refetch];
}


