import { useStore } from "@/lib/context";
import { useCallback } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useCurrencies() {
  const [currencies, setCurrencies] = useStore((s) => s.currencies);
  const {tenant} = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.setting.currency.search.useQuery({ where: { tenantId: tenant?.tenantId } }, {
    onSuccess(data) {
      setCurrencies({ currencies: data ?? null });
    },
  });
  const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
    const rResult = await result.refetch(opts);
    if (rResult.isSuccess) {
      setCurrencies({ currencies: rResult.data ?? null })
    }
    return rResult;
  }, [result.refetch])
  return {currencies, result, refetch};
}
