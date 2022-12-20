import { useStore } from "@/lib/context";
import { useEffect } from "react";
import { useHost } from "@/lib/hooks/useHost";
import { useTrpc } from "@/lib/hooks/useTrpc";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";

export function useSetting() {
  const [setting, setSetting] = useStore((s) => s.tenantSetting);
  const [tenant, loading, success] = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.setting.findFirst.useQuery({ where: { tenantId: tenant?.tenantId } });
  useEffect(() => {
    if(result.isSuccess){
    setSetting({ tenantSetting: result.data ?? null });
    }
  }, [result.isSuccess, setSetting, result.data]);

  return [setting, result.isLoading, result.isSuccess] as [typeof setting, boolean, boolean];
}
