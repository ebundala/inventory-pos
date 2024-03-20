import { useStore } from "@/lib/context";
import { useCallback } from "react";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";


export function usePosSetting() {
  const [posSetting, setPosSetting] = useStore((s) => s.posSetting);
  const {tenant} = useTenant();

  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.setting.pos.findFirst.useQuery(
    { where: { tenantId: tenant?.tenantId } },
    {
      onSuccess(data) {
        setPosSetting({ posSetting: data ?? null });
      },
    });
  const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
    const rResult = await result.refetch(opts);
    if (rResult.isSuccess) {
      setPosSetting({ posSetting: rResult.data ?? null })
    }
    return rResult;
  }, [result.refetch])
  return {posSetting, result,refetch};
}
