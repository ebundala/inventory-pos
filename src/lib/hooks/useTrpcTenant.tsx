import { useTrpc } from "@/lib/hooks/useTrpc";
import { useHost } from "@/lib/hooks/useHost";


export function useTrpcTenant() {
  const host = useHost();
  return useTrpc(host);
}
