import { useStore } from "@/lib/context";
import { useEffect } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useWarehouses() {
  const [warehouses, setWarehouses] = useStore((s) => s.warehouses);
  const [tenant] = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.setting.warehouse.search.useQuery({ where: { tenantId: tenant?.tenantId } });
  useEffect(() => {
    if(result.isSuccess){
    setWarehouses({ warehouses: result.data ?? null });
    }
  }, [result.isSuccess, setWarehouses, result.data]);

  return [warehouses, result.isLoading, result.isSuccess] as [typeof warehouses, boolean, boolean];
}


