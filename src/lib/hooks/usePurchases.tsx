import { useStore } from "@/lib/context";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { PurchaseFindManySchema } from "prisma/generated/schemas/findManyPurchase.schema";
import { useCallback, useMemo } from "react";
import { z } from "zod";




export function usePurchases(args?: z.infer<typeof PurchaseFindManySchema>) {

    const [purchases, setValue] = useStore((s) => s.purchases);
    const {tenant} = useTenant();
    const trpcWithHost = useTrpcTenant();
    const options = useMemo(() => {
        const { where, ...rest } = args ?? {};
        return { where: { tenantId: tenant?.tenantId, ...where }, ...rest };
    }, [args, tenant]);

    const result = trpcWithHost.purchase.search.useQuery(options, {
        onSuccess: (data) => {
            setValue({ purchases: data });
        }
    });
    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (result.isSuccess) {
            setValue({ purchases: rResult.data ?? null });
        }
    }, [result.refetch]);

    return {purchases, result, refetch};
}
