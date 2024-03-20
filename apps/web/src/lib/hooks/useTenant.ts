import { useStore } from "@/lib/context";
import { useCallback } from "react"
import { useSubDomain } from "./useSubDomain";
import { useTrpcTenant } from "./useTrpcTenant";

export function useTenant() {
  const [tenant, setTenant] = useStore((s) => s.tenant);
  
  const subdomain = useSubDomain();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.tenant.findFirst.useQuery({ where: { subdomain: subdomain } },{
    onSuccess(data) {
      setTenant({ tenant: data ?? null });
    },
  });
const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
  const rResult = await result.refetch(opts);
  if (rResult.isSuccess) {
    setTenant({ tenant: rResult.data ?? null })
  }
  return rResult;
}, [result.refetch])
  return {tenant,result,refetch};
}




