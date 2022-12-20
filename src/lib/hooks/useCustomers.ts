import { useStore } from "@/lib/context";
import { useCallback } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useCustomers() {
  const [customers, setCustomers] = useStore((s) => s.customers);
  const [tenant] = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.people.search.useQuery(
    { where: { tenantId: tenant?.tenantId } },
    {
      onSuccess(data) {
        setCustomers({ customers: data ?? null });
      },
    });
  const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
    const rResult = await result.refetch(opts);
    if (rResult.isSuccess) {
      setCustomers({ customers: rResult.data ?? null })
    }
    return rResult;
  }, [result.refetch])

  return [customers, result.isLoading, result.isSuccess,refetch] as [typeof customers, boolean, boolean,typeof refetch];
}
