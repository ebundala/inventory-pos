import { useStore } from "@/lib/context";
import { useEffect } from "react";
import { useHost } from "@/lib/hooks/useHost";
import { useTrpc } from "@/lib/hooks/useTrpc";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";


export function usePosSetting() {
  const [posSetting, setPosSetting] = useStore((s) => s.posSetting);
  const [tenant, loading, success] = useTenant();

  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.setting.pos.findFirst.useQuery({ where: { tenantId: tenant?.tenantId } });
  useEffect(() => {
    setPosSetting({ posSetting: result.data ?? null });
  }, [result.isSuccess, setPosSetting, result.data, loading, success, tenant?.tenantId]);

  return [posSetting, result.isFetching, result.isSuccess] as [typeof posSetting, boolean, boolean];
}
