import { useCallback } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useStore } from "@/lib/context";

export function useDefaultCustomer(userId: number) {
    const [customer, setValue] = useStore((s) => s.defaultCustomer);

    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.people.get.useQuery(
        userId, {
        onSuccess(data) {
            setValue({ defaultCustomer: data ?? null });
        },
    });
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setValue({ defaultCustomer: rResult.data ?? null });
        }
        return rResult;
    }, [result.refetch]);

    return [customer, result.isLoading, result.isSuccess, refetch] as [typeof customer, boolean, boolean, typeof refetch];

}
