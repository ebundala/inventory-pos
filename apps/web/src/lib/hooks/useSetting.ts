import { useStore } from "@/lib/context";
import { useCallback } from "react";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";

export function useSetting() {
  const [setting, setSetting] = useStore((s) => s.tenantSetting);
  const {tenant} = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.setting.findFirst.useQuery(
    { where: { tenantId: tenant?.tenantId } },{
      onSuccess(data) {
        setSetting({ tenantSetting: data ?? null });
      },
    });
  const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
    const rResult = await result.refetch(opts);
    if (rResult.isSuccess) {
      setSetting({ tenantSetting: rResult.data ?? null })
    }
    return rResult;
  }, [result.refetch])

  return {setting, result,refetch};
}
