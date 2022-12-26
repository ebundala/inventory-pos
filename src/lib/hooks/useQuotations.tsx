import { useStore } from "@/lib/context";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { QuotationFindManySchema } from "prisma/generated/schemas/findManyQuotation.schema";
import { useCallback, useMemo } from "react";
import { z } from "zod";



export function useQuotations(args?: z.infer<typeof QuotationFindManySchema>) {
    const [quotations, setValue] = useStore((s) => s.quotations);
    const [tenant] = useTenant();
    const trpcWithHost = useTrpcTenant();
    const options = useMemo(() => {
        const { where, ...rest } = args ?? {};
        return { where: { tenantId: tenant?.tenantId, ...where }, ...rest };
    }, [args, tenant]);

    const result = trpcWithHost.sale.search.useQuery(options, {
        onSuccess: (data) => {
            setValue({ quotations: data });
        }
    });
    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (result.isSuccess) {
            setValue({ quotations: rResult.data ?? null });
        }
    }, [result.refetch]);

    return [quotations, result.isLoading, result.isSuccess, refetch] as [typeof result.data, boolean, boolean, typeof refetch];
}
