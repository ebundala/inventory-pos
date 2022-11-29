import { useTrpc } from "@/lib/hooks/useTrpc";
import { useHost } from "./useHost";


export function useTrpcTenant() {
  const host = useHost();
  return useTrpc(host);
}
