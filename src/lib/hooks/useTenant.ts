import { useStore } from "@/lib/context";
import { useEffect, useMemo, useRef } from "react"
import { useHost } from "@/lib/hooks/useHost";
import { useTrpc } from "@/lib/hooks/useTrpc";

export function useTenant() {
  const [tenant, setTenant] = useStore((s) => s.tenant);
  const host = useHost();
  const subdomain = useSubDomain();
  const trpcWithHost = useTrpc(host);
  const result = trpcWithHost.tenant.findFirst.useQuery({ where: { subdomain: subdomain } });
  useEffect(() => {
     setTenant({ tenant: result.data ?? null })
  }, [result.isSuccess, setTenant, result.data])

  return [tenant,result.isFetching,result.isSuccess];
}


export function useSubDomain() {
  const host = useHost();
  const subDomain = useMemo(() => {
    if (host && host.length) {
      const url = new URL(`https://${host}`);
      return url.hostname.split('.').slice(0, -2).join('.') ?? null;
    }
  }, [host])

  return subDomain;
}