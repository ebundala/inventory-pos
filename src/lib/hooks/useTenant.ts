import { useStore } from "@/lib/context";
import { useEffect, useRef } from "react"
import { useHost } from "@/lib/hooks/useHost";
import { useTrpc } from "@/lib/hooks/useTrpc";
import { useSubDomain } from "./useSubDomain";
import { useTrpcTenant } from "./useTrpcTenant";

export function useTenant() {
  const [tenant, setTenant] = useStore((s) => s.tenant);
  
  const subdomain = useSubDomain();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.tenant.findFirst.useQuery({ where: { subdomain: subdomain } });
  useEffect(() => {
    if(result.isSuccess){
     setTenant({ tenant: result.data ?? null })
    }
  }, [result.isSuccess, setTenant, result.data])

  return [tenant,result.isLoading,result.isSuccess] as [typeof tenant,boolean,boolean];
}




