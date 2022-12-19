import { useStore } from "@/lib/context";
import { useEffect, useRef } from "react"
import { useHost } from "@/lib/hooks/useHost";
import { useTrpc } from "@/lib/hooks/useTrpc";
import { useSubDomain } from "./useSubDomain";

export function useTenant() {
  const [tenant, setTenant] = useStore((s) => s.tenant);
  const host = useHost();
  const subdomain = useSubDomain();
  const trpcWithHost = useTrpc(host);
  const result = trpcWithHost.tenant.findFirst.useQuery({ where: { subdomain: subdomain } });
  useEffect(() => {
     setTenant({ tenant: result.data ?? null })
  }, [result.isSuccess, setTenant, result.data])

  return [tenant,result.isFetching,result.isSuccess] as [typeof tenant,boolean,boolean];
}




