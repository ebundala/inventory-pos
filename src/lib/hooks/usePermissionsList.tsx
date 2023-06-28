import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useStore } from "@/lib/context";
import { useCallback } from "react";


export function usePermissionsList() {
    const [permissions, setPermissions] = useStore((s) => s.permissions);

    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.authorization.getPolicies.useQuery(undefined,
        {
            onSuccess(data) {
                setPermissions({ permissions: data ?? null });
            },
        }
    );
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setPermissions({ permissions: rResult.data ?? null });
        }
        return rResult;
    }, [result.refetch]);


    return { permissions, result, refetch, isLoading: result.isLoading };
}
