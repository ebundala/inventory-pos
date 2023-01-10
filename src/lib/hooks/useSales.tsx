import { useStore } from "@/lib/context";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { SaleFindManySchema } from "prisma/generated/schemas/findManySale.schema";
import { useCallback, useMemo } from "react";
import { z } from "zod";





export function useSales(args?: z.infer<typeof SaleFindManySchema>) {

    const [sales, setValue] = useStore((s) => s.sales);
    const {tenant} = useTenant();
    const trpcWithHost = useTrpcTenant();
    const options = useMemo(() => {
        const { where, ...rest } = args ?? {};
        return { where: { tenantId: tenant?.tenantId, ...where }, ...rest };
    }, [args, tenant]);

    const result = trpcWithHost.sale.search.useQuery(options, {
        onSuccess: (data) => {
            setValue({ sales: data });
        }
    });
    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (result.isSuccess) {
            setValue({ sales: rResult.data ?? null });
        }
    }, [result.refetch]);

    return {sales, result, refetch};
}
