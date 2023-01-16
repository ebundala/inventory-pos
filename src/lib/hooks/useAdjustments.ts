import { useStore } from "@/lib/context";
import { useCallback, useMemo } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";
import { z } from "zod";
import { AdjustmentFindManySchema } from "prisma/generated/schemas/findManyAdjustment.schema";





export function useAdjustments(args?: z.infer<typeof AdjustmentFindManySchema>) {
    const [adjustments, setAdjustments] = useStore((s) => s.adjustments);
    const {tenant} = useTenant();
    const trpcWithHost = useTrpcTenant();

    const options = useMemo(() => {
        const { where, ...rest } =args??{};
        return { where: { tenantId: tenant?.tenantId, ...where }, ...rest }
    }, [args, tenant]);

    const result = trpcWithHost.adjustment.search.useQuery(
        options,
        {
            onSuccess(data) {
                setAdjustments({ adjustments: data ?? null });
            },
        });
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setAdjustments({ adjustments: rResult.data ?? null })
        }
        return rResult;
    }, [result.refetch])

    return [adjustments, result.isLoading, result.isSuccess, refetch] as [typeof adjustments, boolean, boolean, typeof refetch];
}
