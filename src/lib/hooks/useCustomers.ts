import { useStore } from "@/lib/context";
import { useEffect } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useCustomers() {
  const [customers, setCustomers] = useStore((s) => s.customers);
  const [tenant] = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.people.search.useQuery({ where: { tenantId: tenant?.tenantId } });
  useEffect(() => {
    setCustomers({ customers: result.data ?? null });
  }, [result.isSuccess, setCustomers, result.data]);

  return [customers, result.isFetching, result.isSuccess] as [typeof customers, boolean, boolean];
}
