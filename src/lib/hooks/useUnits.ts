import { useStore } from "@/lib/context";
import { useEffect } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useUnits() {
  const [units, setUnits] = useStore((s) => s.units);
  const [tenant] = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.product.unit.search.useQuery({ where: { tenantId: tenant?.tenantId } });
  useEffect(() => {
    if(result.isSuccess){
    setUnits({ units: result.data ?? null });
    }
  }, [result.isSuccess, setUnits, result.data]);

  return [units, result.isLoading, result.isSuccess] as [typeof units, boolean, boolean];
}
