import { useMemo } from "react";
import { useHost } from "@/lib/hooks/useHost";




export function useSubDomain() {
  const host = useHost();
  const subDomain = useMemo(() => {
    if (host && host.length) {
      const url = new URL(`https://${host}`);
      return url.hostname.split('.').slice(0, -2).join('.') ?? null;
    }
  }, [host]);

  return subDomain;
}
