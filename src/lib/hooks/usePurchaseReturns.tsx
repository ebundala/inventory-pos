import { useStore } from "@/lib/context";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { PurchaseReturnFindManySchema } from "prisma/generated/schemas/findManyPurchaseReturn.schema";
import { useCallback, useMemo } from "react";
import { z } from "zod";



export function usePurchaseReturns(args?: z.infer<typeof PurchaseReturnFindManySchema>) {

    const [purchaseReturns, setValue] = useStore((s) => s.purchaseReturns);
    const [tenant] = useTenant();
    const trpcWithHost = useTrpcTenant();
    const options = useMemo(() => {
        const { where, ...rest } = args ?? {};
        return { where: { tenantId: tenant?.tenantId, ...where }, ...rest };
    }, [args, tenant]);

    const result = trpcWithHost.purchase_return.search.useQuery(options, {
        onSuccess: (data) => {
            setValue({ purchaseReturns: data });
        }
    });
    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (result.isSuccess) {
            setValue({ purchaseReturns: rResult.data ?? null });
        }
    }, [result.refetch]);

    return [purchaseReturns, result.isLoading, result.isSuccess, refetch] as [typeof result.data, boolean, boolean, typeof refetch];
}
