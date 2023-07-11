import { useStore } from "@/lib/context";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { TransferFindManySchema } from "prisma/generated/schemas/findManyTransfer.schema";
import { useCallback, useMemo } from "react";
import { z } from "zod";


export function useTransfers(args?: z.infer<typeof TransferFindManySchema>) {

    const [transfers, setTransfers] = useStore((s) => s.transfers);
    const { tenant } = useTenant();
    const trpcWithHost = useTrpcTenant();
    const options = useMemo(() => {
        const { where, ...rest } = args ?? {};
        return { where: { tenantId: tenant?.tenantId, ...where }, ...rest }
    }, [args, tenant]);

    const result = trpcWithHost.transfer.search.useQuery(options, {
        onSuccess: (data) => {
            setTransfers({ transfers: data });
        }
    });
    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (result.isSuccess) {
            setTransfers({ transfers: rResult.data });
        }
    }, [result.refetch]);

    return { transfers, result, refetch };
}
