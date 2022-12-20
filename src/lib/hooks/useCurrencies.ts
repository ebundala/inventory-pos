import { useStore } from "@/lib/context";
import { useEffect } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useCurrencies() {
  const [currencies, setCurrencies] = useStore((s) => s.currencies);
  const [tenant] = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.setting.currency.search.useQuery({ where: { tenantId: tenant?.tenantId } });
  useEffect(() => {
   if(result.isSuccess){
    setCurrencies({ currencies: result.data ?? null });
   }
  }, [/* result.isSuccess,result.isLoading,result.isFetching, */result.isSuccess, setCurrencies, result.data]);

  return [currencies, result.isLoading, result.isSuccess] as [typeof currencies, boolean, boolean];
}
