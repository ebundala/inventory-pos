import { useStore } from "@/lib/context";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { SaleReturnFindManySchema } from "prisma/generated/schemas/findManySaleReturn.schema";
import { useCallback, useMemo } from "react";
import { z } from "zod";


export function useSaleReturns(args?: z.infer<typeof SaleReturnFindManySchema>) {

    const [saleReturns, setValue] = useStore((s) => s.saleReturns);
    const [tenant] = useTenant();
    const trpcWithHost = useTrpcTenant();
    const options = useMemo(() => {
        const { where, ...rest } = args ?? {};
        return { where: { tenantId: tenant?.tenantId, ...where }, ...rest };
    }, [args, tenant]);

    const result = trpcWithHost.sale_return.search.useQuery(options, {
        onSuccess: (data) => {
            setValue({ saleReturns: data });
        }
    });
    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (result.isSuccess) {
            setValue({ saleReturns: rResult.data ?? null });
        }
    }, [result.refetch]);

    return [saleReturns, result.isLoading, result.isSuccess, refetch] as [typeof result.data, boolean, boolean, typeof refetch];
}
