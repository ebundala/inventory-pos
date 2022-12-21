import { useStore } from "@/lib/context";
import { useCallback } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useSuppliers() {
  const [suppliers, setSuppliers] = useStore((s) => s.suppliers);
  const [tenant] = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.people.supplier.search.useQuery(
    { where: { tenantId: tenant?.tenantId } },
    {
      onSuccess(data) {
        setSuppliers({ suppliers: data ?? null });
      },
    });
  const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
    const rResult = await result.refetch(opts);
    if (rResult.isSuccess) {
      setSuppliers({ suppliers: rResult.data ?? null })
    }
    return rResult;
  }, [result.refetch])

  return [suppliers, result.isLoading, result.isSuccess,refetch] as [typeof suppliers, boolean, boolean,typeof refetch];
}
